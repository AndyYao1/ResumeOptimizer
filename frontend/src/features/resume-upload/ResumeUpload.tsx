export function ResumeUpload({file,setFile}: {file: File | null; setFile: (f: File | null) => void;}) {
    return (
        <div>
            <label className="text-sm font-semibold text-slate-800">Upload a new resume</label>
            <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                    }
                }}
                className="mt-2 block w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50/30"
            />
            {file && <p className="mt-2 text-sm text-slate-500">Ready to use: {file.name}</p>}
        </div>
    );
}
