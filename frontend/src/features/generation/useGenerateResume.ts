import { useState } from "react";
import { submitResume } from "../../api/resume";

export function useGenerateResume() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate(file: File, jobDescription: string) {
    setLoading(true);
    const data = await submitResume(file, jobDescription);
    setJobId(data.job_id);
    setLoading(false);
  }

  return { generate, jobId, loading };
}