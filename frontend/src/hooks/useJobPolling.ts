import { useEffect, useState } from "react";
import { fetchJobStatus } from "../api/status";

export function useJobPolling(jobId: string | null) {
  const [status, setStatus] = useState<string>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    setStatus("processing");

    const interval = setInterval(async () => {
      const data = await fetchJobStatus(jobId);

      if (data.status === "completed") {
        setStatus("completed");
        setDownloadUrl(data.download_url);
        clearInterval(interval);
      }

      if (data.status === "failed") {
        setStatus("failed");
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  return { status, downloadUrl };
}