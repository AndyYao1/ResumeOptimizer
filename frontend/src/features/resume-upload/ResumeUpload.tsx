export function ResumeUpload({file,setFile}: {file: File | null; setFile: (f: File | null) => void;}) {
    return (
        <div>
            <label className="text-sm font-medium">Upload Resume</label>
            <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                    }
                }}
                className="m-2"
            />
            {file && <p className="text-sm text-gray-500">{file.name}</p>}
        </div>
    );
}