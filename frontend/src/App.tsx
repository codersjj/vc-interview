import { Navigate, Route, Routes, useNavigate } from "react-router";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

function App() {
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

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/problems"
        // element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />}
        // It's recommended to avoid using this component in favor of useNavigate.
        // see: https://reactrouter.com/api/components/Navigate#navigate
        element={<ProblemsPageWrapper />}
      />
    </Routes>
  );
}

export default App;
