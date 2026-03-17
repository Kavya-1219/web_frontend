import { useState } from "react";
import { useNavigate } from "react-router";
import { TrendingDown, TrendingUp, Dumbbell, Heart, Check, ArrowLeft } from "lucide-react";

const goals = [
  { id: "lose-weight", label: "Lose weight", icon: TrendingDown, color: "bg-blue-50 border-blue-200 text-blue-600", isWeight: true },
  { id: "maintain-weight", label: "Maintain weight", icon: Heart, color: "bg-green-50 border-green-200 text-green-600", isWeight: false },
  { id: "gain-weight", label: "Gain weight", icon: TrendingUp, color: "bg-orange-50 border-orange-200 text-orange-600", isWeight: true },
  { id: "gain-muscle", label: "Gain muscle", icon: Dumbbell, color: "bg-purple-50 border-purple-200 text-purple-600", isWeight: false },
];

export function HealthGoalScreen() {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      // Store selected goals in localStorage
      localStorage.setItem('userGoals', JSON.stringify(selectedGoals));
      
      // Check if any goal is weight-based
      const hasWeightGoal = selectedGoals.some(goalId => 
        goals.find(g => g.id === goalId)?.isWeight
      );
      
      // Dynamic navigation based on goal type
      if (hasWeightGoal) {
        navigate("/goal-weight");
      } else {
        navigate("/health-conditions");
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
            <h1 className="text-4xl text-white font-black text-center mb-2 tracking-tight">Choose Your Goals</h1>
            <p className="text-green-50 text-center text-lg font-medium opacity-90">Select one or more goals to personalize your plan</p>
          </div>

          {/* Progress Indicator - App Style */}
          <div className="mt-10 flex items-center justify-center space-x-2 w-full px-4">
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Goal Cards */}
      <div className="flex-1 px-6 -mt-10 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-6 border border-white/20">
            <div className="grid grid-cols-1 gap-4">
              {goals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-full p-6 rounded-3xl border-2 transition-all transform active:scale-[0.99] ${
                      isSelected
                        ? "border-green-500 bg-green-50/50 shadow-xl shadow-green-100"
                        : "border-gray-100 bg-gray-50/30 hover:border-green-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${goal.color}`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <span className="text-xl font-black text-gray-800 tracking-tight">{goal.label}</span>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? "bg-green-500 shadow-lg shadow-green-200" : "bg-gray-100"
                      }`}>
                        {isSelected && <Check className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Continue Button */}
            <div className="pt-6">
              <button
                onClick={handleContinue}
                disabled={selectedGoals.length === 0}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                  selectedGoals.length > 0
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
