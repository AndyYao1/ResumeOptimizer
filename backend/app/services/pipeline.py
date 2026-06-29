import fitz
import os
import json
import uuid
import asyncio

from backend.app.db.session import SessionLocal
from backend.app.db.models import Resume
from backend.app.services.resume_cache import compute_file_hash
from backend.app.prompts.prompts import parsePrompt,generatePrompt,reorderSkillsPrompt

from openai import AsyncOpenAI
from sentence_transformers import SentenceTransformer
from reportlab.lib import enums, colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from dotenv import load_dotenv

load_dotenv()
client = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))
model = SentenceTransformer("all-MiniLM-L6-v2")

def extract_text(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()

    return text.strip()

def parse_resume(file_path: str, text: str, original_filename: str) -> tuple[dict,str]:
    db = SessionLocal()

    try:
        file_hash = compute_file_hash(file_path)
        existing = db.query(Resume).filter_by(file_hash=file_hash).first()
        if existing:
            return (existing.structured_data,existing.id)
        
        prompt = parsePrompt(text)
        response = client.chat.completions.create(
            model="gpt-5-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        structured = json.loads(response.choices[0].message.content)

        db_resume = Resume(
            id=str(uuid.uuid4()),
            file_hash=file_hash,
            structured_data=structured,
            original_filename=original_filename
        )
        db.add(db_resume)
        db.commit()
        return (structured,db_resume.id)

    finally:
        db.close()

# def compute_match(resume: dict, job_description: str) -> float:
#     resume_text = resume["text"]
#     embeddings = model.encode([resume_text, job_description])
#     sim = np.dot(embeddings[0], embeddings[1]) / (
#         np.linalg.norm(embeddings[0]) * np.linalg.norm(embeddings[1])
#     )

#     return float(sim)

async def rewrite_sections(resume: dict, job_description: str) -> dict:
    # coroutines for experience, projects, and skills
    exp_tasks = [rewrite_bullets(exp["bullets"], job_description) for exp in resume["experience"]]
    proj_tasks = [rewrite_bullets(proj["bullets"], job_description) for proj in resume["projects"]]
    skills_task = reorder_skills(resume["skills"], job_description)

    # Run everything concurrently
    results = await asyncio.gather(*exp_tasks, *proj_tasks, skills_task)
    
    # Unpack results
    n_exp = len(resume["experience"])
    n_proj = len(resume["projects"])

    for exp, bullets in zip(resume["experience"], results[:n_exp]):
        exp["bullets"] = bullets

    for proj, bullets in zip(resume["projects"], results[n_exp:n_exp + n_proj]):
        proj["bullets"] = bullets

    resume["skills"] = results[-1]

    return resume

def generate_pdf(resume: dict, output_path: str):
    doc = SimpleDocTemplate(output_path)
    styles = getSampleStyleSheet()

    styles["Heading2"].fontSize = 12
    styles["Heading2"].spaceBefore = 2
    styles["Heading2"].spaceAfter = 0

    styles["Normal"].fontSize = 10
    
    styles["Title"].spaceBefore = 0
    styles["Title"].spaceAfter = 2

    personal_style = ParagraphStyle(name='PersonalHeaderStyle',alignment=enums.TA_CENTER)

    line = HRFlowable(
        width="100%",
        thickness=1,         
        color=colors.HexColor("#333333"), 
        spaceBefore=0,         
        spaceAfter=2,         
        hAlign='CENTER',
    )

    elements = []

    # ===== HEADER =====
    elements.append(Paragraph(f"<b>{resume['name']}</b>", styles["Title"]))
    elements.append(
        Paragraph(
            f"{resume['email']} | {resume['phone']} | {resume['location']}",
            personal_style,
        )
    )
    elements.append(Spacer(1, 1))

    # ===== SKILLS =====
    if resume["skills"]:
        elements.append(Paragraph("<b>Skills</b>", styles["Heading2"]))
        elements.append(line)

        for category, items in resume["skills"].items():
            elements.append(
                Paragraph(
                    f"<b>{category}:</b> {', '.join(items)}",
                    styles["Normal"]
                )
            )

        elements.append(Spacer(1, 1))

    # ===== EXPERIENCE =====
    elements.append(Paragraph("<b>Experience</b>", styles["Heading2"]))
    elements.append(line)
    for exp in resume["experience"]:
        table = Table(
            [[f"{exp['role']} - {exp['company']}", exp['dates']]],
            colWidths=[doc.width*.75, doc.width*.25],
        )

        table.setStyle(
            TableStyle([
                # alignment
                ("ALIGN", (0, 0), (0, -1), "LEFT"),
                ("ALIGN", (1, 0), (1, -1), "RIGHT"),

                # typography
                ("FONTNAME", (0, 0), (0, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (1, 1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),

                # spacing
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 0),

                # remove borders
                ("BOX", (0, 0), (-1, -1), 0, colors.white),
                ("GRID", (0, 0), (-1, -1), 0, colors.white),
            ])
        )

        elements.append(table)

        for bullet in exp["bullets"]:
            elements.append(Paragraph(f" •  {bullet}", styles["Normal"]))

        elements.append(Spacer(1, 3))

    # ===== PROJECTS =====
    if resume["projects"]:
        elements.append(Paragraph("<b>Projects</b>", styles["Heading2"]))
        elements.append(line)
        for proj in resume["projects"]:
            elements.append(
                Paragraph(f"<b>{proj['name']}</b>", styles["Normal"])
            )

            for bullet in proj["bullets"]:
                elements.append(Paragraph(f"• {bullet}", styles["Normal"]))

            elements.append(Spacer(1, 3))

    # ===== EDUCATION =====
    elements.append(Paragraph("<b>Education</b>", styles["Heading2"]))
    elements.append(line)
    for edu in resume["education"]:
        table = Table(
            [[edu['school'],edu['dates']], [edu['degree'],edu['gpa']]],
            colWidths=[doc.width*.75, doc.width*.25],
        )

        table.setStyle(
            TableStyle([
                # alignment
                ("ALIGN", (0, 0), (0, -1), "LEFT"),
                ("ALIGN", (1, 0), (1, -1), "RIGHT"),

                # typography
                ("FONTNAME", (0, 0), (0, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (1, 1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),

                # spacing
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 0),

                # remove borders
                ("BOX", (0, 0), (-1, -1), 0, colors.white),
                ("GRID", (0, 0), (-1, -1), 0, colors.white),
            ])
        )

        elements.append(table)

    doc.build(elements)

async def rewrite_bullets(bullets, job_description):
    prompt = generatePrompt(bullets, job_description)

    res = await client.chat.completions.create(
        model="gpt-5-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )

    return json.loads(res.choices[0].message.content)["bullets"]

async def reorder_skills(skills, job_description):
    prompt = reorderSkillsPrompt(skills, job_description)

    res = await client.chat.completions.create(
        model="gpt-5-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )

    return json.loads(res.choices[0].message.content)