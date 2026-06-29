import asyncio
import os
from backend.app.core.celery_app import celery
from backend.app.core.config import OUTPUT_DIR
from backend.app.db.models import Job
from backend.app.db.session import SessionLocal
from backend.app.services.pipeline import extract_text,parse_resume,rewrite_sections,generate_pdf

from celery import shared_task

@celery.task
def extract_task(data):
    text = extract_text(data["file_path"])
    data["text"] = text
    return data

@celery.task
def parse_task(data):
    parsed,resume_id = parse_resume(data["file_path"], data["text"], data["original_filename"])
    data["resume"] = parsed
    data["resume_id"] = resume_id
    return data

# @celery.task
# def match_task(data):
#     score = compute_match(data["resume"],data["job_description"])
#     data["score"] = score
#     return data

@shared_task(bind=True, max_retries=3)
def rewrite_task(self,data):
    try:
        rewritten = asyncio.run(rewrite_sections(data["resume"], data["job_description"]))
        data["resume"] = rewritten
    except Exception as e:
        raise self.retry(exc=e, countdown=2**self.request.retries)
    return data

@celery.task
def generate_task(data):
    output_path = f"./outputs/{data["original_filename"]}"
    generate_pdf(data["resume"], output_path)
    data["output_path"] = output_path
    return data

@celery.task
def finalize_task(data):
    db = SessionLocal()

    try:
        job = db.query(Job).get(data["job_id"])
        job.status = "completed"
        job.result_url = f"/outputs/{data["original_filename"]}"
        job.resume_id = data["resume_id"]

        db.commit()
    finally:
        db.close()

    return data

@celery.task
def handle_failure(request, exc, traceback, job_id):
    db = SessionLocal()

    try:
        job = db.query(Job).get(job_id)
        job.status = "failed"
        job.error = str(exc)
        db.commit()
    finally:
        db.close()