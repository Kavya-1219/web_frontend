import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft, Apple } from "lucide-react";

export function ForgotPasswordScreen() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // STEP 1 – Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

    const user = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      setError("Email not registered.");
      return;
    }

    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();

    // store OTP temporarily
    localStorage.setItem("resetOtp", otpValue);
    localStorage.setItem("resetEmail", email);

    setGeneratedOtp(otpValue);

    // 👉 simulate mail sending
    alert("OTP sent to your mail (demo): " + otpValue);

    setStep(2);
  };

  // STEP 2 – Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const savedOtp = localStorage.getItem("resetOtp");

    if (otp !== savedOtp) {
      setError("Invalid OTP");
      return;
    }

    setStep(3);
  };

  // STEP 3 – Change password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const resetEmail = localStorage.getItem("resetEmail");

    const updatedUsers = users.map((u: any) => {
      if (u.email.toLowerCase() === resetEmail?.toLowerCase()) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    localStorage.removeItem("resetOtp");
    localStorage.removeItem("resetEmail");

    setSuccess("Password updated successfully");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-12 pb-24 px-6 rounded-b-[2rem]">
        <button
          onClick={() => navigate("/login")}
          className="mb-6 text-white flex items-center space-x-2 hover:opacity-80 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </button>
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Lock className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl text-white text-center mb-2">
          Reset Password
        </h1>
        <p className="text-green-50 text-center">
          {step === 1 && "Enter your email to receive OTP"}
          {step === 2 && "Enter the OTP sent to your email"}
          {step === 3 && "Create a new password"}
        </p>
      </div>

      {/* Form Card */}
      <div className="flex-1 px-6 -mt-12 pb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start space-x-3 mb-6">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium">{success}</p>
                <p className="text-xs text-green-600 mt-1">Redirecting to login...</p>
              </div>
            </div>
          )}

          {/* STEP 1 – Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  Email Address
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
                <p className="text-xs text-gray-500 mt-2">
                  We'll send a verification code to this email
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Send OTP
              </button>
            </form>
          )}

          {/* STEP 2 – Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                    setError("");
                  }}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Check your email for the OTP code
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Verify OTP
              </button>
            </form>
          )}

          {/* STEP 3 – Change Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter new password"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Must be 8+ characters with 1 special character
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Confirm new password"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!!success}
                className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl shadow-lg transition ${
                  success
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                Change Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}