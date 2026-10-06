type Props = {
  questions: string[];
  setQuestions: (questions: string[]) => void;
};

export function ApplicationQuestions({ questions, setQuestions }: Props) {
  function updateQuestion(index: number, value: string) {
    setQuestions(questions.map((question, questionIndex) => (
      questionIndex === index ? value : question
    )));
  }

  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Application questions</h2>
          <p className="mt-1 text-sm text-slate-500">Add any questions you want answered for this application.</p>
        </div>
      </div>

      <div className="grid gap-3">
        {questions.map((question, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold tracking-wide text-slate-600 uppercase" htmlFor={`application-question-${index}`}>
                Question {index + 1}
              </label>
              <button
                type="button"
                onClick={() => setQuestions(questions.filter((_, questionIndex) => questionIndex !== index))}
                className="text-xs font-semibold text-slate-500 transition-colors hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <textarea
              id={`application-question-${index}`}
              value={question}
              onChange={(event) => updateQuestion(index, event.target.value)}
              className="min-h-24 w-full resize-y rounded-md border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g. Why are you interested in this role?"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setQuestions([...questions, ""])}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
      >
        <span className="grid size-5 place-items-center rounded-full border border-current text-base leading-none">+</span>
        Add another question
      </button>
    </section>
  );
}
