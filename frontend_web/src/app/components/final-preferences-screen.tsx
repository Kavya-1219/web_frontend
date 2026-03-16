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
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-12 pb-20 px-6 rounded-b-[2rem]">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/10 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center justify-center mb-3">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl text-white text-center mb-2">
          Almost Done!
        </h1>
        <p className="text-green-50 text-center">
          One last preference to personalize your plan
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 -mt-8 pb-32 flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center justify-center">
            {/* Meals Per Day */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl text-gray-800 mb-4 font-bold">Meals Per Day</h2>
              <p className="text-gray-600">
                How many times do you prefer to eat daily?
              </p>
            </div>

            <div className="flex items-center justify-center space-x-10 mb-10">
              <button
                onClick={() => setMealsPerDay(Math.max(2, mealsPerDay - 1))}
                className="w-16 h-16 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-3xl font-bold transition-all active:scale-90"
              >
                −
              </button>
              <div className="text-center">
                <div className="text-7xl font-black text-green-600 tracking-tighter">{mealsPerDay}</div>
                <div className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">meals</div>
              </div>
              <button
                onClick={() => setMealsPerDay(Math.min(6, mealsPerDay + 1))}
                className="w-16 h-16 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-3xl font-bold transition-all active:scale-90"
              >
                +
              </button>
            </div>

            {/* Meal Pattern Info */}
            <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wider">Your Predicted Pattern</h3>
              <div className="grid grid-cols-2 gap-3 text-sm font-medium text-blue-800">
                {mealsPerDay === 2 && (
                  <>
                    <div className="bg-white/50 p-2 rounded-lg">🌅 Breakfast</div>
                    <div className="bg-white/50 p-2 rounded-lg">🌙 Dinner</div>
                  </>
                )}
                {mealsPerDay === 3 && (
                  <>
                    <div className="bg-white/50 p-2 rounded-lg">🌅 Breakfast</div>
                    <div className="bg-white/50 p-2 rounded-lg">☀️ Lunch</div>
                    <div className="bg-white/50 p-2 rounded-lg">🌙 Dinner</div>
                  </>
                )}
                {mealsPerDay === 4 && (
                  <>
                    <div className="bg-white/50 p-2 rounded-lg">🌅 Breakfast</div>
                    <div className="bg-white/50 p-2 rounded-lg">🍎 Snack</div>
                    <div className="bg-white/50 p-2 rounded-lg">☀️ Lunch</div>
                    <div className="bg-white/50 p-2 rounded-lg">🌙 Dinner</div>
                  </>
                )}
                {/* ... so on, keeping it concise or expanding if needed mapping to the grid */}
                {mealsPerDay >= 5 && (
                  <>
                    <div className="bg-white/50 p-2 rounded-lg">🌅 Breakfast</div>
                    <div className="bg-white/50 p-2 rounded-lg">🍎 Snack 1</div>
                    <div className="bg-white/50 p-2 rounded-lg">☀️ Lunch</div>
                    <div className="bg-white/50 p-2 rounded-lg">🥤 Snack 2</div>
                    <div className="bg-white/50 p-2 rounded-lg">🌙 Dinner</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            {/* Info Card */}
            <div className="bg-green-50 border border-green-100 rounded-3xl p-8">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-3">Why {mealsPerDay} meals?</h3>
              <p className="text-green-800 opacity-80 leading-relaxed font-medium">
                Our AI suggests that {mealsPerDay} meals per day aligns perfectly with your metabolic profile and lifestyle goals. This pattern helps maintain stable blood sugar and prevents energy dips.
              </p>
            </div>

            {/* Summary Card */}
            <div className="flex-1 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl shadow-xl p-10 text-white flex flex-col justify-center relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Your Plan is Ready!</h3>
                <p className="text-purple-100 text-lg leading-relaxed opacity-90">
                  We've processed your data to create a high-performance nutrition strategy. Your journey to a healthier you begins now.
                </p>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                <Sparkles className="w-40 h-40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-center z-50">
        <button
          onClick={handleContinue}
          className="w-full max-w-md py-5 rounded-[2rem] shadow-2xl shadow-green-200 transition-all bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xl hover:scale-105 active:scale-95"
        >
          Start Your Journey
        </button>
      </div>
    </div>
  );
}
