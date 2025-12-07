import { Link } from "react-router";
import clsx from "clsx";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { SignedOut, SignInButton } from "@clerk/clerk-react";

const HomePage = () => {
  return (
    <div
      className={clsx(
        // Layout
        // "w-full h-[calc(100vh+10rem)]",
        // Backgrounds
        "bg-linear-to-br from-base-100 via-base-200 to-base-300"
      )}
    >
      {/* NAVBAR */}
      <nav
        className={clsx(
          // Layout
          "sticky top-0 z-50",
          // Backgrounds
          "bg-base-100/80",
          // Borders
          "border-b border-primary/20",
          // Effects
          "shadow-lg",
          // Filters
          "backdrop-blur-md"
        )}
      >
        <div
          className={clsx(
            // Flexbox & Grid
            "flex justify-between items-center",
            // Spacing
            "p-4 mx-auto",
            // Sizing
            "max-w-7xl"
          )}
        >
          {/* LOGO */}
          <Link
            to={"/"}
            className={clsx(
              // Flexbox & Grid
              "flex gap-3 items-center",
              // Sizing
              // "w-20 h-20",
              // Backgrounds
              // "bg-red-500",
              // Transitions & Animation
              "transition-transform duration-200",
              // Transforms
              "hover:scale-105"
            )}
          >
            {/* see: https://lucide.dev/guide/advanced/aliased-names */}
            <div
              className={clsx(
                // Flexbox & Grid
                "flex justify-center items-center",
                // Sizing
                "size-10",
                // Backgrounds
                "bg-linear-to-br from-primary via-secondary to-accent",
                // Borders
                "rounded-xl",
                // Effects
                "shadow-lg shadow-primary/30"
              )}
            >
              <SparklesIcon className="size-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1
                className={clsx(
                  // Typography
                  "font-mono text-xl font-black tracking-wider text-transparent",
                  // Backgrounds
                  "bg-clip-text bg-linear-to-r from-primary via-secondary to-accent"
                )}
              >
                VC Interview
              </h1>
              <p
                className={clsx(
                  // Spacing
                  "-mt-1",
                  // Typography
                  "text-xs text-base-content/60 font-medium"
                )}
              >
                Code Together
              </p>
            </div>
          </Link>
          {/* AUTH BTN */}
          <SignedOut>
            <SignInButton mode="modal">
              <button
                className={clsx(
                  "group",
                  // Flexbox & Grid
                  "flex gap-2 items-center",
                  // Spacing
                  "px-6 py-3",
                  // Typography
                  "font-semibold text-white text-sm",
                  // Backgrounds
                  "bg-linear-to-r from-primary via-secondary to-accent",
                  // Borders
                  "rounded-xl",
                  // Effects
                  "shadow-lg shadow-primary/30 hover:shadow-xl",
                  // Transitions & Animation
                  "transition-all duration-200",
                  // Transforms
                  "hover:scale-105"
                )}
              >
                <span>Get Started</span>
                <ArrowRightIcon className="size-4 transition-transform duration-250 group-hover:translate-x-0.5" />
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div
        className={clsx(
          // Spacing
          "px-4 py-20 mx-auto",
          // Sizing
          "max-w-7xl"
        )}
      >
        <div
          className={clsx(
            // Flexbox & Grid
            "grid lg:grid-cols-2 gap-12"
          )}
        >
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div className="badge badge-primary bg-primary/90 badge-lg">
              <ZapIcon className="size-4" />
              Real-time Collaboration
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent">
                Code Together,
              </span>
              <br />
              <span className="text-base-content">Learn Together</span>
            </h1>
            <p className="max-w-xl text-base-content/70 text-xl leading-relaxed">
              The ultimate platform for collaborative coding interviews and pair
              programming. Connect face-to-face, code in real-time, and ace your
              technical interviews.
            </p>
            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3">
              <div className="badge badge-outline badge-lg">
                <CheckIcon className="size-4 text-success" />
                Live Video Chat
              </div>
              <div className="badge badge-outline badge-lg">
                <CheckIcon className="size-4 text-success" />
                Code Editor
              </div>
              <div className="badge badge-outline badge-lg">
                <CheckIcon className="size-4 text-success" />
                Multi-Language
              </div>
            </div>
            {/* CTA BUTTONS */}
            <div className="flex flex-wrap gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-lg">
                    Start Coding Now
                    <ArrowRightIcon className="size-5" />
                  </button>
                </SignInButton>
              </SignedOut>
              <button className="btn btn-outline btn-lg hover:border-white/60">
                <VideoIcon className="size-5" />
                Watch Demo
              </button>
            </div>
            {/* STATS */}
            <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg shadow-base-200">
              <div className="stat">
                <div className="stat-value text-primary">10K+</div>
                <div className="stat-title">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-value text-secondary">50K+</div>
                <div className="stat-title">Sessions</div>
              </div>
              <div className="stat">
                <div className="stat-value text-accent">99.9%</div>
                <div className="stat-title">Uptime</div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <img
            src="/hero.png"
            alt="CodeCollab Platform"
            className={clsx(
              "w-full",
              "rounded-3xl border-4 border-base-100",
              "shadow-2xl",
              "transition-transform duration-500 hover:scale-105"
            )}
          />
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="px-4 py-20 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-primary font-mono text-[2.5rem]">Succeed</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-base-content/70">
            Powerful features designed to make your coding interviews seamless
            and productive.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center">
              <div className="flex justify-center items-center mb-4 size-16 bg-primary/10 rounded-2xl">
                <VideoIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">HD Video Call</h3>
              <p className="text-center text-base-content/70">
                Crystal clear video and audio for seamless communication during
                interviews
              </p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center">
              <div className="flex justify-center items-center mb-4 size-16 bg-primary/10 rounded-2xl">
                <Code2Icon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Live Code Editor</h3>
              <p className="text-center text-base-content/70">
                Collaborate in real-time with syntax highlighting and multiple
                language support
              </p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center">
              <div className="flex justify-center items-center mb-4 size-16 bg-primary/10 rounded-2xl">
                <UsersIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Easy Collaboration</h3>
              <p className="text-center text-base-content/70">
                Share your screen, discuss solutions, and learn from each other
                in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
