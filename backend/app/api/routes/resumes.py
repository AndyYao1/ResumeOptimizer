from fastapi import APIRouter
from backend.app.db.session import SessionLocal
from backend.app.db.models import Resume

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
    

    

