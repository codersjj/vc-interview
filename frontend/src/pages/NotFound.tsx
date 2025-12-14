import NavBar from "../components/NavBar";

const NotFound = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        <h1 className="text-3xl font-semibold text-error">
          404 - Page Not Found
        </h1>
        <p className="text-base-content">
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
