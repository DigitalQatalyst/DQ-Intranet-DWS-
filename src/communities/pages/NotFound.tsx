import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import NotFoundContent from "../../components/NotFoundContent";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-10 sm:px-6">
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center">
        <NotFoundContent />
      </div>
    </div>
  );
};

export default NotFound;
