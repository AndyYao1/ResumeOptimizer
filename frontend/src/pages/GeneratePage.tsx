import { useState } from "react";
import { ResumeUpload } from "../features/resume-upload/ResumeUpload";
import { JobDescription } from "../features/job-description/JobDescription";
import { ResumePreview } from "../features/resume-preview/ResumePreview";
import { useGenerateResume } from "../features/generation/useGenerateResume";
import { useJobPolling } from "../hooks/useJobPolling";

export default function GeneratePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const { generate, jobId, loading } = useGenerateResume();
  const { status, downloadUrl } = useJobPolling(jobId);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 p-8 border-r flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Resume Tailor</h1>

        <JobDescription value={jobDescription} setValue={setJobDescription}/>

        <ResumeUpload file={file} setFile={setFile} />

        <button
          disabled={loading}
          onClick={() => { file && jobDescription ? generate(file, jobDescription) : null }}
          className="py-3 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-8">
        <ResumePreview status={status} downloadUrl={downloadUrl} />
      </div>
    </div>
  );
}