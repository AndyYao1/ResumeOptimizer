import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.app.api.routes import analyze, status, resumes, download
from backend.app.core.config import OUTPUT_DIR, UPLOAD_DIR
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.include_router(analyze.router)
app.include_router(status.router)
app.include_router(resumes.router)
app.include_router(download.router)

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")