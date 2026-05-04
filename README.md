# ResumeOptimizer

Run Backend:
uvicorn backend.app.main:app --reload
celery -A worker.tasks worker --loglevel=info