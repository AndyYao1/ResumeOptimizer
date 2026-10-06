type Props = {
  questions: string[];
  answers: string[];
  setAnswers: (answers: string[]) => void;
};

export function ApplicationAnswers({ questions, answers, setAnswers }: Props) {
  if (questions.length === 0) return null;

  function updateAnswer(index: number, value: string) {
    setAnswers(answers.map((answer, answerIndex) => (
      answerIndex === index ? value : answer
    )));
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-bold tracking-[.08em] text-indigo-600 uppercase">Application answers</p>
        <h2 className="mt-1 font-semibold text-slate-900">Draft responses</h2>
        <p className="mt-1 text-sm text-slate-500">Review and edit each response before using it in your application.</p>
      </div>

      <div className="grid gap-5">
        {questions.map((question, index) => (
          <div key={index}>
            <p className="text-sm font-semibold leading-6 text-slate-800">{question}</p>
            <label className="sr-only" htmlFor={`application-answer-${index}`}>Response for: {question}</label>
            <textarea
              id={`application-answer-${index}`}
              value={answers[index] ?? ""}
              onChange={(event) => updateAnswer(index, event.target.value)}
              className="mt-2 min-h-32 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              placeholder="Your tailored response will appear here. You can also write or refine it yourself."
            />
          </div>
        ))}
      </div>
    </section>
  );
}
