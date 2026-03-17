import { useState } from "react";
import { useNavigate } from "react-router";
import { Clock, ArrowLeft, Sparkles } from "lucide-react";

export function FinalPreferencesScreen() {
  const navigate = useNavigate();
  const [mealsPerDay, setMealsPerDay] = useState(3);

  const handleContinue = () => {
    localStorage.setItem('mealsPerDay', mealsPerDay.toString());
    localStorage.setItem('onboardingComplete', 'true');
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 pt-12 pb-24 px-6 rounded-b-[3rem] shadow-xl">
        <div className="max-w-6xl mx-auto w-full">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-white font-black text-center mb-2 tracking-tight">Almost Done!</h1>
            <p className="text-green-50 text-center text-lg font-medium opacity-90">One last preference to personalize your plan</p>
          </div>

          {/* Progress Indicator - Complete */}
          <div className="mt-10 flex items-center justify-center space-x-2 w-full px-4 max-w-4xl mx-auto">
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 -mt-10 pb-16 flex flex-col items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-16 flex flex-col items-center justify-center border border-white/20">
            {/* Meals Per Day */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Clock className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl text-gray-800 font-black tracking-tight mb-4">Meals Per Day</h2>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">
                How many times do you prefer to eat daily?
              </p>
            </div>

            <div className="flex items-center justify-center space-x-12 mb-12">
              <button
                onClick={() => setMealsPerDay(Math.max(2, mealsPerDay - 1))}
                className="w-20 h-20 rounded-3xl bg-gray-50 border-2 border-gray-100 hover:border-green-200 hover:bg-white text-gray-700 flex items-center justify-center text-4xl font-black transition-all active:scale-90 shadow-sm"
              >
                −
              </button>
              <div className="text-center">
                <div className="text-[10rem] font-black text-green-500 leading-none tracking-tighter select-none">{mealsPerDay}</div>
                <div className="text-xs font-black text-gray-400 mt-2 uppercase tracking-[0.3em]">meals / day</div>
              </div>
              <button
                onClick={() => setMealsPerDay(Math.min(6, mealsPerDay + 1))}
                className="w-20 h-20 rounded-3xl bg-gray-50 border-2 border-gray-100 hover:border-green-200 hover:bg-white text-gray-700 flex items-center justify-center text-4xl font-black transition-all active:scale-90 shadow-sm"
              >
                +
              </button>
            </div>

            {/* Meal Pattern Info */}
            <div className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-100">
              <h3 className="text-xs font-black text-blue-100 mb-6 uppercase tracking-[0.2em] text-center">Your Predicted Routine</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mealsPerDay === 2 && (
                  <>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">🌅 Breakfast</div>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">🌙 Dinner</div>
                  </>
                )}
                {mealsPerDay === 3 && (
                  <>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">🌅 Breakfast</div>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">☀️ Lunch</div>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">🌙 Dinner</div>
                  </>
                )}
                {mealsPerDay === 4 && (
                  <>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">🌅 Breakfast</div>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">🍎 Snack</div>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">☀️ Lunch</div>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">🌙 Dinner</div>
                  </>
                )}
                {mealsPerDay >= 5 && (
                  <>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">🌅 Breakfast</div>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">🍎 Snack 1</div>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">☀️ Lunch</div>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">🥤 Snack 2</div>
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl font-black text-center text-sm">🌙 Dinner</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-8 h-full">
            {/* Info Card */}
            <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-gray-100 flex-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="w-32 h-32 text-green-600" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight mb-4">Why {mealsPerDay} meals?</h3>
                <p className="text-gray-500 text-lg leading-relaxed font-medium">
                  Our system suggests that {mealsPerDay} meals per day aligns with your specific goals. This pattern optimizes nutrient partitioning and keeps your hunger hormones in balance throughout the day.
                </p>
              </div>
            </div>

            {/* CTA Box - Modern style */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-[2.5rem] shadow-2xl p-12 text-white flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black mb-6 tracking-tight leading-tight">Your Custom Plan is Ready!</h3>
                <p className="text-green-100 text-lg leading-relaxed font-medium opacity-90 mb-10">
                  We've analyzed your data to build a high-performance nutrition strategy tailored to your lifestyle.
                </p>
                
                <button
                  onClick={handleContinue}
                  className="w-full py-6 rounded-3xl bg-white text-green-700 font-black text-xl shadow-xl shadow-black/20 hover:bg-green-50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Your Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
