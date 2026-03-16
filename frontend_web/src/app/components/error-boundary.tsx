import { useRouteError, useNavigate } from "react-router";
import { AlertTriangle, Home } from "lucide-react";

export function ErrorBoundary() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-6">
          {error?.statusText || error?.message || "An unexpected error occurred"}
        </p>
        
        <button
          onClick={() => navigate("/app")}
          className="w-full bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Go to Home
        </button>
      </div>
    </div>
  );
}
