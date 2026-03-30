import { useState } from "react";
import { useNavigate } from "react-router";
import { Clock, ArrowLeft, Sparkles, Loader2, Star, Utensils, Coffee, Pizza, Plus, Minus, Lightbulb } from "lucide-react";
import api, { endpoints } from "../helpers/api";

export function FinalPreferencesScreen() {
  const navigate = useNavigate();
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('mealsPerDay', mealsPerDay.toString());
      localStorage.setItem('onboardingComplete', 'true');

      await api.post(endpoints.mealsPerDay, {
        mealsPerDay: mealsPerDay,
      });

      navigate("/app");
    } catch (error) {
      console.error("Failed to save meals per day:", error);
      navigate("/app");
    } finally {
      setIsLoading(false);
    }
  };

  const mealOptions = [
    { name: "Breakfast", icon: <Utensils className="w-5 h-5" /> },
    { name: "Morning Snack", icon: <Coffee className="w-5 h-5" /> },
    { name: "Lunch", icon: <Pizza className="w-5 h-5" /> },
    { name: "Evening Snack", icon: <Coffee className="w-5 h-5" /> },
    { name: "Dinner", icon: <Utensils className="w-5 h-5" /> },
    { name: "Late Snack", icon: <Pizza className="w-5 h-5" /> },
  ];

  const getMealPattern = () => {
    switch(mealsPerDay) {
      case 2: return [mealOptions[0], mealOptions[4]];
      case 3: return [mealOptions[0], mealOptions[2], mealOptions[4]];
      case 4: return [mealOptions[0], mealOptions[2], mealOptions[3], mealOptions[4]];
      case 5: return [mealOptions[0], mealOptions[1], mealOptions[2], mealOptions[3], mealOptions[4]];
      case 6: return mealOptions;
      default: return [mealOptions[0], mealOptions[2], mealOptions[4]];
    }
  };

  const infoTexts: Record<number, string> = {
    2: "Eating 2 meals might suit a specific eating window or intermittent fasting.",
    3: "Eating 3 meals helps maintain steady energy and metabolism throughout the day.",
    4: "Adding a snack can help manage hunger and prevent overeating at main meals.",
    5: "Frequent small meals can help maintain blood sugar levels and consistent energy.",
    6: "Six small meals daily can sustain metabolism and keep your energy levels peak."
  };

  return (
    <div className="min-h-screen bg-success-green flex flex-col overflow-y-auto">
      {/* Header (Android Style Close) */}
      <div className="pt-12 pb-12 px-6 flex flex-col items-center">
        <div className="w-full flex justify-start mb-4">
           <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full text-white">
             <ArrowLeft className="w-6 h-6" />
           </button>
        </div>
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-inner">
          <Star className="w-8 h-8 text-white fill-current" />
        </div>
        <h1 className="text-4xl text-white font-black text-center mb-2 tracking-tight">Almost Done!</h1>
        <p className="text-green-50 text-center text-lg font-medium opacity-90 leading-tight">One last preference to<br/>personalize your plan</p>
      </div>

      <div className="px-6 flex flex-col items-center space-y-6 pb-12">
        {/* Main Selection Card */}
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-10 flex flex-col items-center border border-white/20">
          <h2 className="text-xl font-black text-gray-800 dark:text-white mb-1">Meals Per Day</h2>
          <p className="text-gray-400 font-bold text-sm mb-10">How many times do you prefer to eat daily?</p>

          {/* Counter */}
          <div className="flex items-center gap-10 mb-10">
            <button 
              onClick={() => setMealsPerDay(Math.max(2, mealsPerDay - 1))}
              className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors"
            >
              <Minus className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-7xl font-black text-gray-900 dark:text-white leading-none">{mealsPerDay}</span>
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">meals</span>
            </div>
            <button 
              onClick={() => setMealsPerDay(Math.min(6, mealsPerDay + 1))}
              className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Pattern Card */}
          <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-[1.5rem] p-6 mb-6 border border-gray-100 dark:border-gray-700">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Your Meal Pattern</h3>
             <div className="space-y-3">
                {getMealPattern().map((meal, i) => (
                  <div key={i} className="flex items-center gap-4">
                     <div className="text-success-green">{meal.icon}</div>
                     <span className="font-bold text-gray-700 dark:text-gray-300">{meal.name}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Tip Card (Android Style) */}
          <div className="w-full bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-2xl p-4 flex items-start gap-4">
             <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Lightbulb className="w-5 h-5 text-success-green" />
             </div>
             <p className="text-sm font-bold text-green-700 dark:text-green-300 leading-tight pt-1">
                {infoTexts[mealsPerDay]}
             </p>
          </div>
        </div>

        {/* Final Plan Card (Purple) */}
        <div className="w-full max-w-lg bg-[#7E57C2] rounded-[2.5rem] shadow-2xl p-10 text-white flex flex-col items-center">
           <Star className="w-12 h-12 mb-4 text-white fill-current animate-pulse" />
           <h3 className="text-2xl font-black mb-3">Your Plan is Ready!</h3>
           <p className="text-center font-medium text-purple-100 mb-8 leading-relaxed">
             We've created a personalized nutrition plan based on your goals, health conditions, and lifestyle. Let's get started!
           </p>
           
           <button
             onClick={handleContinue}
             disabled={isLoading}
             className="w-full py-5 rounded-2xl bg-success-green text-white font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
           >
             {isLoading ? (
               <Loader2 className="w-6 h-6 animate-spin" />
             ) : (
               "Start Your Journey"
             )}
           </button>
        </div>
      </div>
    </div>
  );
}
