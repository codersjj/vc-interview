import type { Problem } from "../data/problems";
import { getDifficultyBadgeClass } from "../lib/utils";

interface ProblemDescriptionProps {
  allProblems: Problem[];
  problemId: string;
  problem: Problem;
  onProblemChange: (newProblemId: string) => void;
}

const ProblemDescription = ({
  allProblems,
  problemId,
  problem,
  onProblemChange,
}: ProblemDescriptionProps) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onProblemChange(e.target.value);
  };

  return (
    <div className="h-full overflow-y-auto bg-base-200">
      {/* header section */}
      <div className="p-6 bg-base-100 border-b border-base-300">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl text-base-content font-bold">
            {problem.title}
          </h1>
          <span
            className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}
          >
            {problem.difficulty}
          </span>
        </div>
        <p className="text-base-content/60">{problem.category}</p>
        {/* problem selector */}
        <div className="mt-4">
          <select
            className="select select-sm w-full"
            value={problemId}
            onChange={handleSelectChange}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* problem description */}
        <div className="p-4 bg-base-100 rounded-xl border border-base-300 shadow-sm shadow-base-300">
          <h2 className="mb-4 text-xl text-base-content font-bold">
            Description
          </h2>
          <div className="space-y-3 text-base leading-relaxed">
            <p className="text-base-content/90">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-base-content/90">
                {note}
              </p>
            ))}
          </div>
        </div>
        {/* examples section */}
        <div className="p-4 bg-base-100 rounded-xl border border-base-300 shadow-sm shadow-base-300">
          <h2 className="mb-4 text-xl text-base-content font-bold">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="badge badge-sm">{idx + 1}</span>
                  <span className="text-base-content font-semibold">
                    Example {idx + 1}
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-3 bg-base-300 rounded-xl shadow-sm">
                  <div>
                    <p className="flex gap-2 font-mono">
                      <span className="min-w-[70px] text-primary/80 font-bold">
                        Input:
                      </span>
                      <span className="flex-1">{example.input}</span>
                    </p>
                    <p className="flex gap-2 font-mono">
                      <span className="min-w-[70px] text-primary/80 font-bold">
                        Output:
                      </span>
                      <span className="flex-1">{example.output}</span>
                    </p>
                  </div>
                  {example.explanation && (
                    <p className="text-xs text-base-content/60 font-medium font-sans">
                      <span className="font-semibold">Explanation: </span>
                      {example.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* constrains */}
        <div className="p-4 bg-base-100 rounded-xl border border-base-300 shadow-sm shadow-base-300">
          <h2 className="mb-4 text-xl text-base-content font-bold">
            Constrains
          </h2>
          <ul className="space-y-2">
            {problem.constraints.map((constrain, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-primary">·</span>
                <span className="text-sm text-base-content/80">
                  {constrain}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
