import { Link } from "react-router";
import clsx from "clsx";
import { SparklesIcon } from "lucide-react";

const Logo = () => {
  return (
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
  );
};

export default Logo;
