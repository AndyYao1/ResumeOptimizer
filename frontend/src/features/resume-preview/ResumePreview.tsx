export function ResumePreview({status,downloadUrl}: {status: string; downloadUrl: string | null}) {
    return (
      <div className="flex-1 border rounded-lg flex items-center justify-center">
        {status === "idle" && <p>Nothing generated yet</p>}
  
        {status === "processing" && <p>Generating...</p>}
  
        {status === "completed" && downloadUrl && (
          <iframe src={downloadUrl} className="w-full h-full" />
        )}
      </div>
    );
  }