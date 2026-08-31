from fastapi import APIRouter, HTTPException
from backend.app.db.session import SessionLocal
from backend.app.db.models import Job, Resume

router = APIRouter()

@router.get("/resumes")
async def list_resumes():
    db = SessionLocal()
    try:
        resumes = db.query(Resume).all()

        if not resumes:
            return {"status": "not_found"}

        return {"resumes": [
            {
                "id": r.id,
                "original_filename": r.original_filename,
                "created_at": r.created_at,
            }
            for r in resumes
        ]}
    finally:
        db.close()


@router.delete("/resumes/{resume_id}", status_code=204)
async def delete_resume(resume_id: str):
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        # Jobs reference a saved resume, so remove those records before the resume.
        db.query(Job).filter(Job.resume_id == resume_id).delete()
        db.delete(resume)
        db.commit()
    finally:
        db.close()
