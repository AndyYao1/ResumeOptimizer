export async function submitResume(file: File, jobDescription: string) {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);
  
    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData,
    });
  
    return res.json(); 
  }

  export async function fetchResumes() {
    const res = await fetch("http://localhost:8000/resumes");
    return res.json();
  }

  export async function generateFromExisting(resumeId: string, jobDescription: string) {
    const formData = new FormData();
    formData.append("resume_id", resumeId);
    formData.append("job_description", jobDescription);

    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData,
    });
  
    return res.json();
  }