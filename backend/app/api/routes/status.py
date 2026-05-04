from fastapi import APIRouter
from backend.app.db.session import SessionLocal
from backend.app.db.models import Job

router = APIRouter()

@router.get("/status/{job_id}")
def get_status(job_id: str):
    db = SessionLocal()

    job = db.query(Job).get(job_id)

    if not job:
        return {"status": "not_found"}

    return {
        "status": job.status,
        "download_url": job.result_url,
        "error": job.error,
    }