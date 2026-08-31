import { useEffect, useState } from "react";
import { fetchJobStatus } from "../api/status";

export function useJobPolling(jobId: string | null) {
  const [status, setStatus] = useState<string>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      const data = await fetchJobStatus(jobId);
      setStatus(data.status);

      if (data.status === "completed") {
        setDownloadUrl(data.download_url);
        clearInterval(interval);
      }

      if (data.status === "failed") {
        clearInterval(interval);
      }
    };

    const interval = setInterval(() => void poll(), 2000);
    void poll();

    return () => clearInterval(interval);
  }, [jobId]);

  return { status, downloadUrl };
}
