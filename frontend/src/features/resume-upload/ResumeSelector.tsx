export function ResumeSelector({resumes, selectedResumeId, setSelectedResumeId, setIsUploadingNew}: {
    resumes: any[];
    selectedResumeId: string | null;
    setSelectedResumeId: (id: string | null) => void;
    setIsUploadingNew: (v: boolean) => void;
  }) {
    return (
      <div>
        <label className="text-sm font-medium">Select Resume</label>
  
        <select
          value={selectedResumeId ?? ""}
          onChange={(e) => {
            const value = e.target.value;
  
            if (value === "new") {
              setIsUploadingNew(true);
              setSelectedResumeId(null);
            } else {
              setIsUploadingNew(false);
              setSelectedResumeId(value);
            }
          }}
          className="mt-2 w-full border rounded-lg p-2"
        >
          <option value="">-- Choose a resume --</option>
  
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.original_filename || r.id}
            </option>
          ))}
  
          <option value="new">+ Upload New Resume</option>
        </select>
      </div>
    );
  }