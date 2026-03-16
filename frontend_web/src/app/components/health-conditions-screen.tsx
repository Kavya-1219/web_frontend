import { useState } from "react";
import { useNavigate } from "react-router";
import { Heart, Check, ArrowLeft, Info } from "lucide-react";

const healthConditions = [
  { id: "none", label: "None", emoji: "✅" },
  { id: "diabetes", label: "Diabetes (Type 1/2)", emoji: "🩺" },
  { id: "pcos", label: "PCOS", emoji: "💊" },
  { id: "thyroid", label: "Thyroid Issues", emoji: "🦋" },
  { id: "high-bp", label: "High Blood Pressure", emoji: "❤️" },
  { id: "high-cholesterol", label: "High Cholesterol", emoji: "🫀" },
  { id: "digestive", label: "Digestive Issues", emoji: "🍃" },
  { id: "anemia", label: "Anemia", emoji: "🩸" },
  { id: "food-allergies", label: "Food Allergies", emoji: "⚠️" },
];

export function HealthConditionsScreen() {
  const navigate = useNavigate();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (conditionId: string) => {
    setSelectedConditions(prev => {
      // If "None" is selected, clear all others
      if (conditionId === "none") {
        return ["none"];
      }
      
      // If selecting another condition, remove "None"
      const filtered = prev.filter(id => id !== "none");
      
      if (filtered.includes(conditionId)) {
        return filtered.filter(id => id !== conditionId);
      } else {
        return [...filtered, conditionId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedConditions.length > 0) {
      localStorage.setItem('healthConditions', JSON.stringify(selectedConditions));
      
      // Check if user selected "Manage stress" goal
      const userGoals = JSON.parse(localStorage.getItem('userGoals') || '[]');
      const hasStressGoal = userGoals.includes('manage-stress');
      
      if (hasStressGoal) {
        navigate("/stress-management");
      } else {
        navigate("/final-preferences");
      }
    }
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
        <div className="flex items-center justify-center mb-3">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl text-white text-center mb-2">
          Health Conditions
        </h1>
        <p className="text-green-50 text-center">
          Help us personalize your nutrition plan
        </p>
      </div>

      {/* Info Banner */}
      <div className="px-6 -mt-8 mb-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 shadow-md">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Your privacy matters.</strong> Your meals and nutrition recommendations will be customized based on your health conditions to ensure safe and effective dietary guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Conditions List */}
      <div className="flex-1 px-6 pb-32 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
          {healthConditions.map((condition) => {
            const isSelected = selectedConditions.includes(condition.id);
            
            return (
              <button
                key={condition.id}
                onClick={() => toggleCondition(condition.id)}
                className={`w-full p-5 rounded-xl border-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{condition.emoji}</span>
                    <span className="text-base text-gray-800 font-medium">
                      {condition.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Personalization Examples */}
        {selectedConditions.length > 0 && !selectedConditions.includes("none") && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              How we'll personalize for you:
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              {selectedConditions.includes("diabetes") && (
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Low sugar, low glycemic index foods, controlled carbs</span>
                </div>
              )}
              {selectedConditions.includes("pcos") && (
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Hormone-balancing meals, reduced refined carbs</span>
                </div>
              )}
              {selectedConditions.includes("high-bp") && (
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Low sodium meals, potassium-rich foods</span>
                </div>
              )}
              {selectedConditions.includes("thyroid") && (
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Selenium and iodine-rich foods, metabolism support</span>
                </div>
              )}
              {selectedConditions.includes("digestive") && (
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Gut-friendly probiotics, easy-to-digest foods, fiber balance</span>
                </div>
              )}
              {selectedConditions.includes("anemia") && (
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Iron-rich foods, Vitamin C pairing for absorption</span>
                </div>
              )}
              {selectedConditions.includes("high-cholesterol") && (
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Heart-healthy fats, fiber-rich whole grains, omega-3</span>
                </div>
              )}
              {selectedConditions.includes("food-allergies") && (
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Allergen-free meal suggestions and safe alternatives</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
        <button
          onClick={handleContinue}
          disabled={selectedConditions.length === 0}
          className={`w-full py-4 rounded-xl shadow-lg transition ${
            selectedConditions.length > 0
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