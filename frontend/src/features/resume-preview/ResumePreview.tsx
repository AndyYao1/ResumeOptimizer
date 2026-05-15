type Props = {
  status: string;
  downloadUrl: string | null;
};

export function ResumePreview({status,downloadUrl}: Props) {
  const fileName = downloadUrl?.split("/").pop();

  return (
    <div className="h-full border rounded-lg flex flex-col overflow-hidden">
      {/* Download */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Generated Resume</h2>

        {status === "completed" && downloadUrl && (
          <a
            href={`http://localhost:8000/download/${fileName}`}
            className="px-4 py-2 rounded bg-black text-white text-sm"
          >
            Download PDF
          </a>
        )}
      </div>

      {/* Preview */}
      <div className="flex-1 shadow-sm bg-white">
        {status === "idle" && (
          <div className="h-full flex items-center justify-center">
            <p>Nothing generated yet</p>
          </div>
        )}

        {status === "processing" && (
          <div className="h-full flex items-center justify-center">
            <p>Generating...</p>
          </div>
        )}

        {status === "completed" && downloadUrl && (
          <iframe
            src={`http://localhost:8000${downloadUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
}