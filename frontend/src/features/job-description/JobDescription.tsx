export function JobDescription({value,setValue}: {value: string; setValue: (v: string) => void;}) {
    return (
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium mb-2">Job Description</label>
  
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 p-3 border rounded-lg"
          placeholder="Paste job description..."
        />
      </div>
    );
  }