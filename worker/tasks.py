from backend.app.core.celery_app import celery
from backend.app.db.session import SessionLocal
from backend.app.db.models import Job
from backend.app.services.pipeline import process_resume

@celery.task
def process_resume_task(job_id, file_path, job_description):
    db = SessionLocal()

    try:
        output_path = process_resume(job_id, file_path, job_description)

        job = db.query(Job).get(job_id)
        job.status = "completed"
        job.result_url = f"http://localhost:8000/files/{job_id}.pdf"

        db.commit()

    except Exception as e:
        job = db.query(Job).get(job_id)
        job.status = "failed"
        job.error = str(e)

        db.commit()

    finally:
        db.close()

@celery.task
def extract_task(job_id, file_path):
    text = extract_text(file_path)
    return {"job_id": job_id, "text": text}

@celery.task
def parse_task(data):
    structured = parse_resume(data["text"])
    data["resume"] = structured
    return data

@celery.task
def match_task(data, job_description):
    score = compute_match(data["resume"], job_description)
    data["score"] = score
    return data

@celery.task
def generate_task(data):
    path = generate_pdf(data)
    return {"download_url": path}