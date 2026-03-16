import { useState } from "react";
import { useNavigate } from "react-router";
import { Activity, ArrowLeft, Check } from "lucide-react";

const activityLevels = [
  {
    id: "sedentary",
    label: "Sedentary",
    icon: "🪑",
    description: "Little or no exercise, desk job",
    multiplier: 1.2,
    examples: "Office work, studying, minimal movement"
  },
  {
    id: "light",
    label: "Lightly Active",
    icon: "🚶",
    description: "Light exercise 1-3 days/week",
    multiplier: 1.375,
    examples: "Walking, light housework, casual cycling"
  },
  {
    id: "moderate",
    label: "Moderately Active",
    icon: "🏃",
    description: "Moderate exercise 3-5 days/week",
    multiplier: 1.55,
    examples: "Regular gym, sports, active job"
  },
  {
    id: "very",
    label: "Very Active",
    icon: "💪",
    description: "Hard exercise 6-7 days/week",
    multiplier: 1.725,
    examples: "Intense training, athletic activities"
  }
];

export function LifestyleScreen() {
  const navigate = useNavigate();
  const [activityLevel, setActivityLevel] = useState("");

  const handleContinue = () => {
    if (activityLevel) {
      const selectedActivity = activityLevels.find(a => a.id === activityLevel);
      localStorage.setItem('lifestyle', JSON.stringify({
        activityLevel,
        multiplier: selectedActivity?.multiplier || 1.2
      }));
      navigate("/health-goal");
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
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl text-white text-center mb-2">
          Lifestyle & Activity
        </h1>
        <p className="text-green-50 text-center">
          How active are you in daily life?
        </p>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Activity Levels */}
      <div className="flex-1 px-6 -mt-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-base text-gray-700 mb-2 font-medium">
            Select your typical activity level
          </h2>
          
          {activityLevels.map((level) => {
            const isSelected = activityLevel === level.id;
            
            return (
              <button
                key={level.id}
                onClick={() => setActivityLevel(level.id)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{level.icon}</span>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">{level.label}</h3>
                      <p className="text-sm text-gray-600">{level.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="ml-12 mt-2">
                  <p className="text-xs text-gray-500 italic">
                    Examples: {level.examples}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
            <p className="text-xs text-blue-800 leading-relaxed">
              💡 Your activity level helps us calculate your daily calorie burn (TDEE) and adjust your nutrition plan accordingly.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
        <button
          onClick={handleContinue}
          disabled={!activityLevel}
          className={`w-full py-4 rounded-xl shadow-lg transition ${
            activityLevel
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue to Goals
        </button>
      </div>
    </div>
  );
}
