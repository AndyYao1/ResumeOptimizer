# ResumeOptimizer

Run Backend:
source .venv/bin/activate
uvicorn backend.app.main:app --reload

source .venv/bin/activate
celery -A worker.tasks worker --loglevel=info