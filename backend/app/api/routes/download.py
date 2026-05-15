from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.get("/download/{filename}")
def download_resume(filename: str):
    path = os.path.join("outputs", filename)

    return FileResponse(
        path=path,
        media_type="application/pdf",
        filename=filename
    )