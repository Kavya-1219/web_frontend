import { useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, Drumstick, Sprout, Check } from "lucide-react";

const dietTypes = [
  { id: "veg", label: "Vegetarian", icon: Leaf, color: "text-green-600" },
  { id: "non-veg", label: "Non-Vegetarian", icon: Drumstick, color: "text-orange-600" },
  { id: "vegan", label: "Vegan", icon: Sprout, color: "text-emerald-600" },
];

const allergies = [
  "Nuts",
  "Dairy/Milk",
  "Gluten",
  "Eggs",
  "Soy",
  "Shellfish",
];

export function DietaryPreferencesScreen() {
  const navigate = useNavigate();
  const [dietType, setDietType] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [mealsPerDay, setMealsPerDay] = useState("3");

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleContinue = () => {
    if (dietType) {
      // Save all dietary preferences
      localStorage.setItem('dietaryPreferences', JSON.stringify({
        dietType,
        allergies: selectedAllergies,
        mealsPerDay
      }));
      
      // Mark onboarding as complete
      localStorage.setItem('onboardingComplete', 'true');
      
      navigate("/app");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-12 pb-20 px-6 rounded-b-[2rem]">
        <h1 className="text-3xl text-white text-center mb-2">
          Dietary Preferences
        </h1>
        <p className="text-green-50 text-center">
          Tell us about your eating habits
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 -mt-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
          {/* Diet Type */}
          <div>
            <h2 className="text-lg text-gray-800 mb-4">Diet Type</h2>
            <div className="grid grid-cols-3 gap-3">
              {dietTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = dietType === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setDietType(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? "text-green-600" : type.color}`} />
                    <p className="text-xs text-center text-gray-700">{type.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <h2 className="text-lg text-gray-800 mb-4">Allergies & Intolerances</h2>
            <div className="flex flex-wrap gap-3">
              {allergies.map((allergy) => {
                const isSelected = selectedAllergies.includes(allergy);
                
                return (
                  <button
                    key={allergy}
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-4 py-2 rounded-full border-2 transition-all flex items-center space-x-2 ${
                      isSelected
                        ? "border-green-500 bg-green-50 text-green-700"
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

          {/* Meals Per Day */}
          <div>
            <h2 className="text-lg text-gray-800 mb-4">Meals Per Day</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMealsPerDay(String(Math.max(1, Number(mealsPerDay) - 1)))}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xl"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <div className="text-4xl text-green-600">{mealsPerDay}</div>
                <div className="text-sm text-gray-500 mt-1">meals</div>
              </div>
              <button
                onClick={() => setMealsPerDay(String(Math.min(6, Number(mealsPerDay) + 1)))}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xl"
              >
                +
              </button>
            </div>
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
          Get Started
        </button>
      </div>
    </div>
  );
}