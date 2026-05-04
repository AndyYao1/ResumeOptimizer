import time
import os
from backend.app.core.config import OUTPUT_DIR

def process_resume(job_id: str, file_path: str, job_description: str):
    # TODO: replace this with real pipeline later
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    time.sleep(5)  # simulate work

    output_path = f"./outputs/{job_id}.pdf"

    # fake output file
    with open(output_path, "w") as f:
        f.write("Generated Resume")

    return output_path