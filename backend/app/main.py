import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.app.api.routes import analyze, status
from backend.app.core.config import OUTPUT_DIR, UPLOAD_DIR

app = FastAPI()

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.include_router(analyze.router)
app.include_router(status.router)

app.mount("/files", StaticFiles(directory=OUTPUT_DIR), name="files")