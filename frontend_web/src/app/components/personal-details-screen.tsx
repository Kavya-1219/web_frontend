import { useState } from "react";
import { useNavigate } from "react-router";
import { User, ArrowLeft } from "lucide-react";

export function PersonalDetailsScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age) {
      localStorage.setItem("personalDetails", JSON.stringify(formData));
      navigate("/body-details");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 pt-12 pb-24 px-6 rounded-b-[3rem] shadow-xl">
        <div className="max-w-4xl mx-auto w-full">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-white font-black text-center mb-2 tracking-tight">Personal Details</h1>
            <p className="text-green-50 text-center text-lg font-medium opacity-90">Tell us about yourself</p>
          </div>

          {/* Progress Indicator - App Style */}
          <div className="mt-10 flex items-center justify-center space-x-3 w-full px-4">
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 px-6 -mt-10 pb-32">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-8 border border-white/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 ml-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:bg-white focus:outline-none transition-all text-gray-800 font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 ml-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter your age"
                  min="10"
                  max="120"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:bg-white focus:outline-none transition-all text-gray-800 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-800 ml-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {["Male", "Female", "Other"].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`py-5 px-4 border-2 rounded-2xl font-bold transition-all transform active:scale-95 ${
                      formData.gender === gender
                        ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200"
                        : "bg-white border-gray-100 text-gray-600 hover:border-green-200 hover:bg-green-50/30"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Motivational Message */}
            <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/10 border-2 border-blue-100 rounded-[2rem] p-6 mt-8 flex items-start space-x-5">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 text-2xl">
                💪
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-lg mb-1">You're Starting Your Journey!</h3>
                <p className="text-blue-800/80 font-medium leading-relaxed">
                  Every great achievement starts with the decision to try. We're here to support you every step of the way!
                </p>
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!formData.name || !formData.age}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                  formData.name && formData.age
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-200 hover:shadow-2xl"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue to Body Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
