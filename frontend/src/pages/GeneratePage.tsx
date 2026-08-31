import { useEffect, useState } from "react";
import { ResumeUpload } from "../features/resume-upload/ResumeUpload";
import { JobDescription } from "../features/job-description/JobDescription";
import { ResumePreview } from "../features/resume-preview/ResumePreview";
import { useGenerateResume } from "../features/generation/useGenerateResume";
import { useJobPolling } from "../hooks/useJobPolling";
import { fetchResumes } from "../api/resume";
import { ResumeSelector } from "../features/resume-upload/ResumeSelector";
import type { SavedResume } from "../features/resume-upload/ResumeSelector";

export default function GeneratePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [isUploadingNew, setIsUploadingNew] = useState(false);

  const { generate, generateExisting, jobId, loading } = useGenerateResume();
  const { status, downloadUrl } = useJobPolling(jobId);

  useEffect(() => {
    async function load() {
      const data = await fetchResumes();
      setResumes(data["resumes"]);
    }
    load();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Panel */}
      <div className="flex w-1/2 flex-col gap-6 overflow-y-auto border-r border-slate-200 bg-white p-8">
        <div>
          <p className="mb-1.5 text-xs font-bold tracking-[.08em] text-indigo-600 uppercase">Resume studio</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Tailor your resume</h1>
          <p className="mt-2 text-sm text-slate-500">Match your experience to the role that matters most.</p>
        </div>

        <JobDescription value={jobDescription} setValue={setJobDescription}/>

        <ResumeSelector
          resumes={resumes}
          selectedResumeId={selectedResumeId}
          setSelectedResumeId={setSelectedResumeId}
          setIsUploadingNew={setIsUploadingNew}
        />
        
        {isUploadingNew && (
          <ResumeUpload file={file} setFile={setFile} />
        )}

        <button
          disabled={loading}
          onClick={() => { 
            if (isUploadingNew && file && jobDescription) {
              generate(file, jobDescription);
            } else if (selectedResumeId && jobDescription) {
              generateExisting(selectedResumeId, jobDescription);
            }
          }}
          className="mt-auto rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {loading ? "Generating..." : "Generate tailored resume"}
        </button>
      </div>

      {/* Right Panel */}
      <div className="h-full w-1/2 p-8">
        <ResumePreview status={status} downloadUrl={downloadUrl} />
      </div>
    </div>
  );
}
