import type { UseMutationResult } from "@tanstack/react-query";
import type { Problem } from "../data/problems";
import { getDifficultyBadgeClass, toCapitalize } from "../lib/utils";
import type { Difficulty, Session } from "../types";
import type { EndSessionResponse } from "../types/session";
import { Loader2Icon, LogOutIcon } from "lucide-react";

interface ProblemDescriptionProps {
  problem: Problem | null | undefined;
  session?: Session;
  isShowProblemSelector?: boolean;
  allProblems?: Problem[];
  problemId?: string;
  isLoading?: boolean;
  isHost?: boolean;
  endSessionMutation?: UseMutationResult<
    EndSessionResponse,
    Error,
    string,
    unknown
  >;
  onProblemChange?: (newProblemId: string) => void;
  handleEndSession?: () => void;
}

const ProblemDescription = ({
  session,
  isShowProblemSelector = true,
  allProblems = [],
  problemId,
  problem,
  isLoading = false,
  isHost,
  endSessionMutation,
  onProblemChange,
  handleEndSession,
}: ProblemDescriptionProps) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onProblemChange) onProblemChange(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto bg-base-200">
        <div className="p-6 bg-base-100 border-b border-base-300">
          <div className="flex justify-between items-start mb-2">
            <div className="h-8 w-48 bg-base-300 rounded animate-pulse" />
            <div className="h-6 w-20 bg-base-300 rounded animate-pulse" />
          </div>
          <div className="h-4 w-24 bg-base-300 rounded animate-pulse mt-2" />
          <div className="mt-2">
            <div className="h-4 w-64 bg-base-300 rounded animate-pulse" />
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="p-4 bg-base-100 rounded-xl border border-base-300 shadow-sm shadow-base-300">
            <div className="h-6 w-32 bg-base-300 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-base-300 rounded animate-pulse" />
              <div className="h-4 w-full bg-base-300 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-base-300 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-full flex items-center justify-center text-base-content/60">
        Problem not found
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-base-200">
      {/* header section */}
      <div className="p-6 bg-base-100 border-b border-base-300">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl text-base-content font-bold">
              {problem.title}
            </h1>
            <p className="text-base-content/60">{problem.category}</p>
            {session && (
              <div className="mt-2 text-base-content/60">
                <span>
                  Host: {session.host.name || "Unknown"} ·{" "}
                  {session.participant ? 2 : 1}/2 participants
                </span>
              </div>
            )}
          </div>

          {!session && (
            <span
              className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}
            >
              {problem.difficulty}
            </span>
          )}

          {session && (
            <div className="flex items-center gap-3">
              <span
                className={`badge badge-lg ${getDifficultyBadgeClass(
                  toCapitalize(session.difficulty) as Difficulty
                )}`}
              >
                {toCapitalize(session.difficulty) || "Easy"}
              </span>
              {isHost && session.status === "active" && (
                <button
                  onClick={handleEndSession}
                  disabled={endSessionMutation?.isPending}
                  className="btn btn-error btn-sm gap-2"
                >
                  {endSessionMutation?.isPending ? (
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOutIcon className="w-4 h-4" />
                  )}
                  End Session
                </button>
              )}
              {session?.status === "completed" && (
                <span className="badge badge-ghost badge-lg">Completed</span>
              )}
            </div>
          )}
        </div>
        {/* problem selector */}
        {isShowProblemSelector && (
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
        )}
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
        {problem.examples && problem.examples.length > 0 && (
          <div className="p-4 bg-base-100 rounded-xl border border-base-300 shadow-sm shadow-base-300">
            <h2 className="mb-4 text-xl text-base-content font-bold">
              Examples
            </h2>
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
        )}

        {/* constrains */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="p-4 bg-base-100 rounded-xl border border-base-300 shadow-sm shadow-base-300">
            <h2 className="mb-4 text-xl text-base-content font-bold">
              Constraints
            </h2>
            <ul className="space-y-2">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-primary">·</span>
                  <span className="text-sm text-base-content/80">
                    {constraint}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDescription;
