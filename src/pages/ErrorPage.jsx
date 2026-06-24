import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="space-y-6 max-w-md">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="p-5 bg-red-100 text-red-500 rounded-full animate-bounce">
            <AlertTriangle size={50} />
          </div>
        </div>

        {/* Error Text */}
        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-pink-500">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Back to Home Button */}
        <div className="pt-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-[1.03] transition duration-200 cursor-pointer"
          >
            <Home size={18} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;