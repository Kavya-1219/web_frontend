import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import logo from "figma:asset/92b2cb3a86bea6d7f9af7d0e725e0f2b7664fe56.png";

export function SignUpScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const validateEmail = (email: string) => {
    if (!email.endsWith("@gmail.com")) {
      return "Email must end with @gmail.com";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      return "Password must include at least 1 special character";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        confirmPassword: ""
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrors({
        email: "",
        password: "",
        confirmPassword: "Passwords don't match!"
      });
      return;
    }
    
    // Save user credentials
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    users.push({
      email: formData.email,
      password: formData.password,
      registeredAt: new Date().toISOString()
    });
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    localStorage.setItem('currentUserEmail', formData.email);
    
    // Show success modal
    setShowSuccessModal(true);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-12 pb-20 px-6 rounded-b-[2rem]">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/10 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex flex-col items-center justify-center mb-4">
          <img 
            src={logo} 
            alt="NutriSoul Logo" 
            className="w-20 h-20 object-contain mb-3 drop-shadow-lg"
          />
          <h2 className="text-xl text-white font-bold">NutriSoul</h2>
        </div>
        <h1 className="text-3xl text-white text-center mb-2">
          Create Account
        </h1>
        <p className="text-green-50 text-center">
          Start your wellness journey today
        </p>
      </div>

      {/* Form Card */}
      <div className="flex-1 px-6 -mt-8 pb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="yourname@gmail.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                    errors.email ? "border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                  required
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Create password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition ${
                    errors.password ? "border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              <p className="text-xs text-gray-500 mt-1">At least 8 characters with 1 special character (!@#$%^&*)</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  placeholder="Re-enter password"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                  required
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs text-blue-800 leading-relaxed">
                By signing up, you agree to our Terms of Service and Privacy Policy. Your health data is secure and private.
              </p>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Create Account
            </button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-3 text-center">
              <span className="text-green-600">Welcome to NutriSoul</span> 🎉
            </h2>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Your account has been created successfully. Let's begin your health journey.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/personal-details");
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}