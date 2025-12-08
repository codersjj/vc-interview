import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import clsx from "clsx";
import Logo from "./Logo";

const NavBar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
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
        <Logo />
        <div className="flex gap-2 items-center">
          {/* PROBLEMS PAGE LINK */}
          <Link to="/problems">
            <div
              className={`flex gap-2 items-center px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 ${
                isActive("/problems")
                  ? "bg-primary/95 text-primary-content/95 hover:bg-primary hover:text-primary-content"
                  : "hover:bg-base-200 text-base-content/90 hover:text-base-content"
              }`}
            >
              <div className="flex gap-x-2.5 items-center">
                <BookOpenIcon className="size-4" />
                <span className="hidden sm:inline text-base font-medium">
                  Problems
                </span>
              </div>
            </div>
          </Link>
          {/* DASHBOARD PAGE LINK */}
          <Link to="/dashboard">
            <div
              className={`flex gap-2 items-center px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 ${
                isActive("/dashboard")
                  ? "bg-primary/95 text-primary-content/95 hover:bg-primary hover:text-primary-content"
                  : "hover:bg-base-200 text-base-content/90 hover:text-base-content"
              }`}
            >
              <div className="flex gap-x-2.5 items-center">
                <LayoutDashboardIcon className="size-4" />
                <span className="hidden sm:inline text-base font-medium">
                  Dashboard
                </span>
              </div>
            </div>
          </Link>
          {/* USER BUTTON */}
          <div className="ml-4 size-8 flex justify-center items-center">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
