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
    <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-12 pb-20 px-6 rounded-b-[2rem]">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/10 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center justify-center mb-3">
          <User className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl text-white text-center mb-2">Personal Details</h1>
        <p className="text-green-50 text-center">Tell us about yourself</p>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 -mt-8 mb-6">
        <div className="bg-white rounded-full h-2 shadow-lg">
          <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full w-[14%]"></div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 space-y-6 flex-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder="Enter your age"
            min="10"
            max="120"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["Male", "Female", "Other"].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => setFormData({ ...formData, gender })}
                className={`py-3 px-4 border-2 rounded-xl transition ${
                  formData.gender === gender
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-200 text-gray-700 hover:border-green-300"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 mt-8">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💪</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">You're Starting Your Journey!</h3>
              <p className="text-sm text-blue-800">
                Every great achievement starts with the decision to try. We're here to support you every step of the way!
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Continue Button */}
      <div className="px-6 mt-auto">
        <button
          onClick={handleSubmit}
          disabled={!formData.name || !formData.age}
          className={`w-full py-4 rounded-xl font-medium transition ${
            formData.name && formData.age
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
