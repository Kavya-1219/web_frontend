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
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-12 pb-20 px-6 rounded-b-[2rem]">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/10 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-3xl text-white text-center mb-2">
          Choose Your Goals
        </h1>
        <p className="text-green-50 text-center">
          Select one or more goals to personalize your plan
        </p>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Goal Cards */}
      <div className="flex-1 px-6 -mt-8 pb-24 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoals.includes(goal.id);
            
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`w-full p-6 rounded-2xl border-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${goal.color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-lg text-gray-800 dark:text-white">{goal.label}</span>
                  </div>
                  {isSelected && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleContinue}
          disabled={selectedGoals.length === 0}
          className={`w-full py-4 rounded-xl shadow-lg transition ${
            selectedGoals.length > 0
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
