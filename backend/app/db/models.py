from sqlalchemy import Column, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True)
    status = Column(String)  # processing, completed, failed
    result_url = Column(String, nullable=True)
    error = Column(String, nullable=True)