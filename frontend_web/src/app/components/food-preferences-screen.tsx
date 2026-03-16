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
          <Utensils className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl text-white text-center mb-2">
          Food Preferences
        </h1>
        <p className="text-green-50 text-center">
          Tell us about your eating habits
        </p>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white/30 rounded-full"></div>
          <div className="w-8 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 -mt-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
          {/* Diet Type */}
          <div>
            <h2 className="text-lg text-gray-800 mb-4 font-semibold">Diet Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {dietTypes.map((type) => {
                const isSelected = dietType === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setDietType(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-4xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium text-gray-800">{type.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                    {isSelected && (
                      <div className="mt-2 flex justify-center">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <h2 className="text-lg text-gray-800 mb-3 font-semibold">Food Allergies</h2>
            <p className="text-sm text-gray-600 mb-3">Select any food items you're allergic to</p>
            <div className="flex flex-wrap gap-2">
              {commonAllergies.map((allergy) => {
                const isSelected = allergies.includes(allergy);
                
                return (
                  <button
                    key={allergy}
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-4 py-2 rounded-full border-2 transition-all flex items-center space-x-2 ${
                      isSelected
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                    <span className="text-sm">{allergy}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dislikes (Optional) */}
          <div>
            <h2 className="text-lg text-gray-800 mb-3 font-semibold">
              Food Dislikes <span className="text-sm text-gray-500 font-normal">(Optional)</span>
            </h2>
            <textarea
              value={dislikes}
              onChange={(e) => setDislikes(e.target.value)}
              placeholder="E.g., Bitter gourd, Mushrooms, Broccoli..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-800 leading-relaxed">
              💡 We'll exclude these foods from your meal plans and suggest safe alternatives.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
        <button
          onClick={handleContinue}
          disabled={!dietType}
          className={`w-full py-4 rounded-xl shadow-lg transition ${
            dietType
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
