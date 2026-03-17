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
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-white font-black text-center mb-2 tracking-tight">Lifestyle & Activity</h1>
            <p className="text-green-50 text-center text-lg font-medium opacity-90">How active are you in daily life?</p>
          </div>

          {/* Progress Indicator - App Style */}
          <div className="mt-10 flex items-center justify-center space-x-3 w-full px-4">
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Activity Levels */}
      <div className="flex-1 px-6 -mt-10 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-8 border border-white/20">
            <h2 className="text-2xl text-gray-800 font-black tracking-tight text-center">
              Select your typical activity level
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {activityLevels.map((level) => {
                const isSelected = activityLevel === level.id;
                
                return (
                  <button
                    key={level.id}
                    onClick={() => setActivityLevel(level.id)}
                    className={`w-full text-left p-6 rounded-3xl border-2 transition-all transform active:scale-[0.99] ${
                      isSelected
                        ? "border-green-500 bg-green-50/50 shadow-xl shadow-green-100"
                        : "border-gray-100 bg-gray-50/30 hover:border-green-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm">
                          {level.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-gray-800 tracking-tight mb-1">{level.label}</h3>
                          <p className="text-gray-500 font-medium leading-relaxed">{level.description}</p>
                          <div className="mt-3 inline-flex items-center px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                            Examples: {level.examples}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200 shrink-0">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-start space-x-4">
              <span className="text-2xl">💡</span>
              <p className="text-sm text-blue-800 font-medium leading-relaxed">
                Your activity level helps us calculate your daily calorie burn (TDEE) and adjust your nutrition plan for optimal performance and health.
              </p>
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <button
                onClick={handleContinue}
                disabled={!activityLevel}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                  activityLevel
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-200 hover:shadow-2xl"
                    : "bg-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue to Goals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
