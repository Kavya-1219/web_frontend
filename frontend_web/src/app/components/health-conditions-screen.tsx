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
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-white font-black text-center mb-2 tracking-tight">Health Profile</h1>
            <p className="text-green-50 text-center text-lg font-medium opacity-90">Help us personalize your nutrition plan</p>
          </div>

          {/* Progress Indicator - App Style */}
          <div className="mt-10 flex items-center justify-center space-x-2 w-full px-4">
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Conditions List */}
      <div className="flex-1 px-6 -mt-10 pb-32">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/20">
            {/* Info Banner */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-blue-800 font-medium leading-relaxed">
                <strong>Your privacy matters.</strong> Your meals and nutrition recommendations will be customized based on your health conditions to ensure safe and effective dietary guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {healthConditions.map((condition) => {
                const isSelected = selectedConditions.includes(condition.id);
                
                return (
                  <button
                    key={condition.id}
                    onClick={() => toggleCondition(condition.id)}
                    className={`p-6 rounded-3xl border-2 transition-all transform active:scale-[0.99] text-left flex items-center justify-between ${
                      isSelected
                        ? "border-green-500 bg-green-50/50 shadow-xl shadow-green-100"
                        : "border-gray-100 bg-gray-50/30 hover:border-green-200"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{condition.emoji}</span>
                      <span className="text-lg font-black text-gray-800 tracking-tight">{condition.label}</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? "bg-green-500 shadow-lg shadow-green-200" : "bg-gray-100"
                    }`}>
                      {isSelected && <Check className="w-5 h-5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Personalization Examples */}
            {selectedConditions.length > 0 && !selectedConditions.includes("none") && (
              <div className="mt-10 p-8 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 animate-in fade-in zoom-in-95 duration-500">
                <h3 className="text-xs font-black text-gray-400 mb-6 uppercase tracking-[0.2em] text-center">
                  How we'll personalize for you
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {selectedConditions.includes("diabetes") && (
                    <div className="flex items-start space-x-3 text-sm font-bold text-gray-700">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">✓</span>
                      <span>Low sugar, low GI foods, controlled glycemic loads</span>
                    </div>
                  )}
                  {selectedConditions.includes("pcos") && (
                    <div className="flex items-start space-x-3 text-sm font-bold text-gray-700">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">✓</span>
                      <span>Hormone-balancing meals, insulin sensitivity support</span>
                    </div>
                  )}
                  {selectedConditions.includes("high-bp") && (
                    <div className="flex items-start space-x-3 text-sm font-bold text-gray-700">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">✓</span>
                      <span>Dash-diet inspired meals, low sodium priority</span>
                    </div>
                  )}
                  {selectedConditions.includes("thyroid") && (
                    <div className="flex items-start space-x-3 text-sm font-bold text-gray-700">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">✓</span>
                      <span>Selenium support, iodine balance, metabolic boost</span>
                    </div>
                  )}
                  {selectedConditions.includes("digestive") && (
                    <div className="flex items-start space-x-3 text-sm font-bold text-gray-700">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">✓</span>
                      <span>Probiotic-rich, fiber-optimized, easy digestion</span>
                    </div>
                  )}
                  {selectedConditions.includes("anemia") && (
                    <div className="flex items-start space-x-3 text-sm font-bold text-gray-700">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">✓</span>
                      <span>Iron-rich foods with vitamin C optimization</span>
                    </div>
                  )}
                  {selectedConditions.includes("high-cholesterol") && (
                    <div className="flex items-start space-x-3 text-sm font-bold text-gray-700">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">✓</span>
                      <span>Cardio-protective fats, plant sterols, high fiber</span>
                    </div>
                  )}
                  {selectedConditions.includes("food-allergies") && (
                    <div className="flex items-start space-x-3 text-sm font-bold text-gray-700">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">✓</span>
                      <span>Strict allergen exclusion and safe alternatives</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Continue Button */}
            <div className="pt-10">
              <button
                onClick={handleContinue}
                disabled={selectedConditions.length === 0}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                  selectedConditions.length > 0
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-200 hover:shadow-2xl"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}