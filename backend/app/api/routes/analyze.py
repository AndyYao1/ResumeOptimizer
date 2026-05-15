import os
from uuid import uuid4
from fastapi import APIRouter, UploadFile, Form, File, HTTPException
from backend.app.db.session import SessionLocal
from backend.app.db.models import Job,Resume
from worker.tasks import extract_task,parse_task,rewrite_task,generate_task,finalize_task,handle_failure
from backend.app.core.config import UPLOAD_DIR
from celery import chain
from typing import Optional

router = APIRouter()

@router.post("/analyze")
async def analyze(resume: Optional[UploadFile] = File(None), resume_id: Optional[str] = Form(None), job_description: str = Form(...)):
    db = SessionLocal()
    try:
        if not resume and not resume_id:
            raise HTTPException(
                status_code=400,
                detail="Must provide either resume file or resume_id",
            )

        job_id = str(uuid4())
        
        # User uploaded
        if resume:
            file_path = f"{UPLOAD_DIR}/{job_id}.pdf"

            with open(file_path, "wb") as f:
                f.write(await resume.read())

            job = Job(id=job_id, status="processing")
            db.add(job)
            db.commit()

            pipeline = chain(
                extract_task.s({
                    "job_id": job_id,
                    "file_path": file_path,
                    "job_description": job_description,
                    "original_filename": resume.filename
                }),
                parse_task.s(),
                rewrite_task.s(),
                generate_task.s(),
                finalize_task.s(),
            )

            pipeline.apply_async(link_error=handle_failure.s(job_id))
            pipeline.delay()
        
        # Existing resume
        else:
            resume_obj = db.query(Resume).get(resume_id)

            if not resume_obj:
                raise HTTPException(status_code=404, detail="Resume not found")

            job = Job(
                id=job_id,
                resume_id=resume_id,
                status="processing",
            )

            db.add(job)
            db.commit()

            pipeline = chain(
                # skip extract + parse
                rewrite_task.s({
                    "job_id": job_id,
                    "job_description": job_description,
                    "original_filename": resume_obj.original_filename,
                    "resume": resume_obj.structured_data,
                    "resume_id": resume_obj.id
                }),
                generate_task.s(),
                finalize_task.s(),
            )

            pipeline.apply_async(link_error=handle_failure.s(job_id))
            pipeline.delay()

        return {"job_id": job_id}
    finally:
        db.close()

    

