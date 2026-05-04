import os
from uuid import uuid4
from fastapi import APIRouter, UploadFile, Form
from backend.app.db.session import SessionLocal
from backend.app.db.models import Job
from worker.tasks import process_resume_task
from backend.app.core.config import UPLOAD_DIR

router = APIRouter()

@router.post("/analyze")
async def analyze(resume: UploadFile, job_description: str = Form(...)):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    job_id = str(uuid4())
    file_path = f"{UPLOAD_DIR}/{job_id}.pdf"

    with open(file_path, "wb") as f:
        f.write(await resume.read())

    db = SessionLocal()

    job = Job(id=job_id, status="processing")
    db.add(job)
    db.commit()
    db.close()

    process_resume_task.delay(job_id, file_path, job_description)

    return {"job_id": job_id}