import { useState } from "react";
import { useNavigate } from "react-router";
import { Utensils, ArrowLeft, Check } from "lucide-react";

const dietTypes = [
  { id: "veg", label: "Vegetarian", icon: "🥗", description: "Plant-based diet" },
  { id: "non-veg", label: "Non-Vegetarian", icon: "🍗", description: "Includes meat & fish" },
  { id: "eggetarian", label: "Eggetarian", icon: "🥚", description: "Veg + Eggs" },
  { id: "vegan", label: "Vegan", icon: "🌱", description: "No animal products" }
];

const commonAllergies = [
  "Nuts",
  "Dairy/Milk",
  "Gluten",
  "Eggs",
  "Soy",
  "Shellfish",
  "Fish",
  "Peanuts"
];

export function FoodPreferencesScreen() {
  const navigate = useNavigate();
  const [dietType, setDietType] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState("");

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleContinue = () => {
    if (dietType) {
      localStorage.setItem('foodPreferences', JSON.stringify({
        dietType,
        allergies,
        dislikes
      }));
      navigate("/lifestyle");
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
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-white font-black text-center mb-2 tracking-tight">Food Preferences</h1>
            <p className="text-green-50 text-center text-lg font-medium opacity-90">Tell us about your eating habits</p>
          </div>

          {/* Progress Indicator - App Style */}
          <div className="mt-10 flex items-center justify-center space-x-3 w-full px-4">
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 px-6 -mt-10 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-12 border border-white/20">
            {/* Diet Type */}
            <div className="space-y-6">
              <h2 className="text-2xl text-gray-800 font-black tracking-tight flex items-center space-x-3">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm">1</span>
                <span>Diet Type</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dietTypes.map((type) => {
                  const isSelected = dietType === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => setDietType(type.id)}
                      className={`p-6 rounded-3xl border-2 text-left transition-all transform active:scale-[0.98] ${
                        isSelected
                          ? "border-green-500 bg-green-50/50 shadow-xl shadow-green-100"
                          : "border-gray-100 bg-gray-50/30 hover:border-green-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{type.icon}</div>
                        {isSelected && (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-xl font-black text-gray-800 tracking-tight">{type.label}</div>
                      <div className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">{type.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-6">
              <h2 className="text-2xl text-gray-800 font-black tracking-tight flex items-center space-x-3">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-sm">2</span>
                <span>Food Allergies</span>
              </h2>
              <p className="text-gray-500 font-medium">Select any food items you're allergic to</p>
              <div className="flex flex-wrap gap-3">
                {commonAllergies.map((allergy) => {
                  const isSelected = allergies.includes(allergy);
                  
                  return (
                    <button
                      key={allergy}
                      onClick={() => toggleAllergy(allergy)}
                      className={`px-6 py-3 rounded-2xl border-2 transition-all font-bold flex items-center space-x-3 transform active:scale-95 ${
                        isSelected
                          ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200"
                          : "border-gray-100 bg-gray-50/50 text-gray-600 hover:border-orange-200 hover:bg-orange-50/30"
                      }`}
                    >
                      {isSelected && <Check className="w-5 h-5" />}
                      <span>{allergy}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dislikes */}
            <div className="space-y-6">
              <h2 className="text-2xl text-gray-800 font-black tracking-tight flex items-center space-x-3">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">3</span>
                <span>Food Dislikes <span className="text-lg text-gray-400 font-medium ml-2">(Optional)</span></span>
              </h2>
              <textarea
                value={dislikes}
                onChange={(e) => setDislikes(e.target.value)}
                placeholder="E.g., Bitter gourd, Mushrooms, Broccoli..."
                rows={4}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:border-green-500 focus:bg-white focus:outline-none transition-all text-gray-800 font-medium resize-none shadow-inner"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-start space-x-4">
              <span className="text-2xl">💡</span>
              <p className="text-sm text-blue-800 font-medium leading-relaxed">
                We'll intelligently exclude these foods from your generated meal plans and suggest nutritionally equivalent alternatives.
              </p>
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <button
                onClick={handleContinue}
                disabled={!dietType}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                  dietType
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-200 hover:shadow-2xl"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue to Lifestyle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
