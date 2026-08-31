type Props = {
  status: string;
  downloadUrl: string | null;
};

export function ResumePreview({status, downloadUrl}: Props) {
  const resumeUrl = downloadUrl ? `http://localhost:8000${downloadUrl}` : undefined;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Download */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-xs font-bold tracking-[.08em] text-indigo-600 uppercase">Preview</p>
          <h2 className="mt-1 font-semibold text-slate-900">Generated resume</h2>
        </div>

        {status === "completed" && downloadUrl && (
          <a
            href={resumeUrl}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Download PDF
          </a>
        )}
      </div>

      {/* Preview */}
      <div className="flex-1 bg-slate-50">
        {status === "idle" && (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <svg className="size-6 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h11l5 5v11H4zM15 4v5h5M8 14h8M8 17h6" /></svg>
              </div>
              <p className="font-medium text-slate-700">Your tailored resume will appear here</p>
              <p className="mt-1 text-sm text-slate-500">Add a job description and choose a resume to get started.</p>
            </div>
          </div>
        )}

        {status === "processing" && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
              <p className="font-medium text-slate-700">Tailoring your resume…</p>
              <p className="mt-1 text-sm text-slate-500">This usually takes a moment.</p>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div>
              <p className="font-medium text-red-700">We couldn’t generate your resume</p>
              <p className="mt-1 text-sm text-slate-500">Please try again in a moment.</p>
            </div>
          </div>
        )}

        {status === "completed" && downloadUrl && (
          <iframe
            src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
}
