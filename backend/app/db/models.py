from datetime import datetime
from sqlalchemy import JSON, Column, DateTime, ForeignKey, String, create_engine
from backend.app.core.config import DATABASE_URL
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True)
    resume_id = Column(String, ForeignKey("resumes.id"))
    status = Column(String)
    result_url = Column(String)
    error = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now())

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True)
    file_hash = Column(String, unique=True, index=True)
    structured_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.now())
    original_filename = Column(String)

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)