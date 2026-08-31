export function JobDescription({value,setValue}: {value: string; setValue: (v: string) => void;}) {
    return (
      <div className="flex flex-1 flex-col">
        <label className="mb-2 text-sm font-semibold text-slate-800">Job description</label>
  
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-48 flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          placeholder="Paste the job description here…"
        />
      </div>
    );
  }
