import { useEffect, useState } from "react";
import { ResumeUpload } from "../features/resume-upload/ResumeUpload";
import { JobDescription } from "../features/job-description/JobDescription";
import { ResumePreview } from "../features/resume-preview/ResumePreview";
import { useGenerateResume } from "../features/generation/useGenerateResume";
import { useJobPolling } from "../hooks/useJobPolling";
import { fetchResumes } from "../api/resume";
import { ResumeSelector } from "../features/resume-upload/ResumeSelector";

export default function GeneratePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const [resumes, setResumes] = useState<any[]>([]);
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
    <div className="h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 p-8 border-r flex flex-col gap-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold">Resume Tailor</h1>

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
          className="py-3 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-8 h-full">
        <ResumePreview status={status} downloadUrl={downloadUrl} />
      </div>
    </div>
  );
}