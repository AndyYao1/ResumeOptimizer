import { useState } from "react";
import { generateFromExisting,submitResume } from "../../api/resume";

export function useGenerateResume() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate(file: File, jobDescription: string) {
    setLoading(true);
    const data = await submitResume(file, jobDescription);
    setJobId(data.job_id);
    setLoading(false);
  }

  async function generateExisting(resumeId: string, jobDescription: string) {
    setLoading(true);
    const data = await generateFromExisting(resumeId, jobDescription);
    setJobId(data.job_id);
    setLoading(false);
  }

  return { generate, generateExisting, jobId, loading };
}