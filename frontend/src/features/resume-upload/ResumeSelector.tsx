export type SavedResume = {
    id: string;
    original_filename: string | null;
  };

export function ResumeSelector({resumes, selectedResumeId, setSelectedResumeId, setIsUploadingNew}: {
    resumes: SavedResume[];
    selectedResumeId: string | null;
    setSelectedResumeId: (id: string | null) => void;
    setIsUploadingNew: (v: boolean) => void;
  }) {
    return (
      <div>
        <label className="text-sm font-semibold text-slate-800">Choose a resume</label>
  
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
          className="mt-2 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
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
