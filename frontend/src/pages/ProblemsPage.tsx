import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { Link } from "react-router";
import NavBar from "../components/NavBar";
import { PROBLEMS } from "../data/problems";
import { getDifficultyBadgeClass } from "../lib/utils";
import { type Difficulty, DIFFICULTY } from "../types";

const ProblemsPage = () => {
  const problems = Object.values(PROBLEMS);

  const easyProblemCount = problems.filter(
    (problem) => problem.difficulty === DIFFICULTY.EASY
  ).length;
  const mediumProblemCount = problems.filter(
    (problem) => problem.difficulty === DIFFICULTY.MEDIUM
  ).length;
  const hardProblemCount = problems.filter(
    (problem) => problem.difficulty === DIFFICULTY.HARD
  ).length;

  return (
    <div className="min-h-screen bg-base-200">
      {/* NAVBAR */}
      <NavBar />

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Practice Problems</h1>
          <p className="text-base-content/70">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <ul className="space-y-4" aria-label="Problem List" role="list">
          {problems.map((problem) => (
            <li key={problem.id} role="listitem">
              <Link
                to={`/problem/${problem.id}`}
                className="group card shadow-md shadow-base-100 bg-base-100 transition-transform hover:scale-[1.01]"
              >
                <div className="card-body">
                  <div className="flex items-center">
                    {/* LEFT SIDE */}
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex gap-4">
                        <div className="flex justify-center items-center size-12 bg-primary/10 rounded-lg">
                          <Code2Icon className="size-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold">
                              {problem.title}
                            </h2>
                            <span
                              className={`badge ${getDifficultyBadgeClass(
                                problem.difficulty as Difficulty
                              )}`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-base-content/60">
                            {problem.category}
                          </p>
                        </div>
                      </div>
                      <p className="text-base-content/80">
                        {problem.description.text}
                      </p>
                    </div>
                    {/* RIGHT SIDE */}
                    <div className="flex gap-2 items-center text-primary/80 group-hover:text-primary">
                      <span className="text-base font-normal">Solve</span>
                      <ChevronRightIcon className="size-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* STATS FOOTER */}
        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Total Problems</div>
                <div className="stat-value text-primary">{problems.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">{DIFFICULTY.EASY}</div>
                <div className="stat-value text-success">
                  {easyProblemCount}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">{DIFFICULTY.MEDIUM}</div>
                <div className="stat-value text-warning">
                  {mediumProblemCount}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">{DIFFICULTY.HARD}</div>
                <div className="stat-value text-error">{hardProblemCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
