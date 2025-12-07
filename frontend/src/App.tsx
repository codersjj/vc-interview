import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const { isSignedIn, isLoaded } = useUser();

  const ProblemsPageWrapper = () => {
    const { isSignedIn, isLoaded } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        navigate("/", { replace: true });
      }
    }, [isLoaded, isSignedIn, navigate]);

    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    return isSignedIn ? <ProblemsPage /> : null;
  };

  // this will get rid of flickering effect
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isSignedIn ? <Navigate to="/dashboard" /> : <HomePage />}
        />
        <Route
          path="/dashboard"
          element={isSignedIn ? <DashboardPage /> : <Navigate to="/" />}
        />
        <Route
          path="/problems"
          // element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />}
          // It's recommended to avoid using this component in favor of useNavigate.
          // see: https://reactrouter.com/api/components/Navigate#navigate
          element={<ProblemsPageWrapper />}
        />
      </Routes>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
