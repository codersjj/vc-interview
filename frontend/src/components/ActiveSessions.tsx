import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  LoaderIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import { getDifficultyBadgeClass, toCapitalize } from "../lib/utils";
import type { Difficulty, Session } from "../types";
import { Link } from "react-router";

interface ActiveSessionsProps {
  sessions: Session[];
  isLoading: boolean;
  isUserInSession: (session: Session) => boolean;
}

const ActiveSessions = ({
  sessions,
  isLoading,
  isUserInSession,
}: ActiveSessionsProps) => {
  return (
    <div className="lg:col-span-2 card bg-base-100 border-2 border-primary/20 transition-colors hover:border-primary/40">
      <div className="card-body">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-6">
          {/* TITLE AND ICON */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-primary via-secondary to-accent">
              <ZapIcon className="size-5" />
            </div>
            <h2 className="card-title text-2xl">Live Sessions</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-success"></div>
            <span className="text-sm text-success font-medium">
              {sessions.length} active
            </span>
          </div>
        </div>

        {/* SESSION LIST */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20 h-full">
            <LoaderIcon className="size-10 animate-spin text-primary" />
          </div>
        ) : sessions.length > 0 ? (
          <ul className="space-y-3 max-h-[400px] overflow-y-auto">
            {sessions.map((session) => (
              <li
                key={session._id}
                className="card bg-base-200 border-2 border-base-300 transition-colors duration-300 hover:border-primary/50"
              >
                <div className="flex justify-between items-center gap-2 p-5">
                  {/* LEFT SIDE */}
                  <div className="flex gap-2">
                    <div className="relative flex justify-center items-center size-14 rounded-xl bg-linear-to-br from-primary via-secondary to-accent">
                      <Code2Icon className="size-7 text-white" />
                      <div className="absolute -top-1 -right-1 size-4 rounded-full bg-success border-2 border-base-200"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold truncate">
                          {session.problem}
                        </h3>
                        <span
                          className={`badge badge-sm ${getDifficultyBadgeClass(
                            toCapitalize(session.difficulty) as Difficulty
                          )}`}
                        >
                          {toCapitalize(session.difficulty)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm opacity-80">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="size-4" />
                          <span className="font-medium">
                            {session.host?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="size-4" />
                          <span className="text-xs">
                            {session.participant ? "2/2" : "1/2"}
                          </span>
                        </div>
                        {session.participant ? (
                          isUserInSession(session) ? (
                            <span className="badge badge-info badge-sm">
                              JOINED
                            </span>
                          ) : (
                            <span className="badge badge-error badge-sm">
                              FULL
                            </span>
                          )
                        ) : (
                          <span className="badge badge-success badge-sm">
                            OPEN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  {session.participant && !isUserInSession(session) ? (
                    <button className="btn btn-disabled btn-sm">Full</button>
                  ) : (
                    <Link
                      to={`/session/${session._id}`}
                      className="btn btn-primary btn-sm gap-2"
                    >
                      {isUserInSession(session) ? "Rejoin" : "Join"}
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
              <SparklesIcon className="w-10 h-10 text-primary/50" />
            </div>
            <p className="text-lg font-semibold opacity-70 mb-1">
              No active sessions
            </p>
            <p className="text-sm opacity-50">Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveSessions;
