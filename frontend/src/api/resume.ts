export async function submitResume(file: File, jobDescription: string) {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);
  
    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData,
    });
  
    return res.json(); // { job_id }
  }