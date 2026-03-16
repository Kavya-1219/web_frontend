import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import logo from "figma:asset/92b2cb3a86bea6d7f9af7d0e725e0f2b7664fe56.png";

export function LoginScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Get registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Find matching user (case-insensitive email)
    const user = users.find((u: any) => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!user) {
      setError("Sorry, we didn't find your details. Please register again.");
      return;
    }
    
    // Set current user
    localStorage.setItem('currentUserEmail', email);
    
    // Always go to app if user exists
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-12 pb-24 px-6 rounded-b-[2rem]">
        <div className="flex flex-col items-center justify-center mb-6">
          <img 
            src={logo} 
            alt="NutriSoul Logo" 
            className="w-24 h-24 object-contain mb-4 drop-shadow-lg"
          />
          <h2 className="text-2xl text-white font-bold">NutriSoul</h2>
        </div>
        <h1 className="text-3xl text-white text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-green-50 text-center">
          Login to continue your healthy journey
        </p>
      </div>

      {/* Form Card */}
      <div className="flex-1 px-6 -mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="text-sm text-red-600 hover:text-red-700 underline mt-1"
                  >
                    Create a new account
                  </button>
                </div>
              </div>
            )}
            
            {/* Email Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right -mt-2">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Login
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Create New Account
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}