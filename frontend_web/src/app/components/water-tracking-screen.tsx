import { useState, useEffect } from "react";
import { Droplets, Plus, Minus, Target, TrendingUp, Info } from "lucide-react";
import { useNavigate } from "react-router";
import api, { endpoints } from "../helpers/api";
import { CommonHeader } from "./common-header";

export function WaterTrackingScreen() {
  const [todayWater, setTodayWater] = useState(0);
  const [targetWater, setTargetWater] = useState(2000);
  const [glassSize, setGlassSize] = useState(250);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWaterData();

    const handleRefresh = () => fetchWaterData();
    window.addEventListener('refreshDashboard', handleRefresh);
    return () => window.removeEventListener('refreshDashboard', handleRefresh);
  }, []);

  const fetchWaterData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(endpoints.waterTracking);
      if (response.data) {
        setTodayWater(response.data.todays_water_intake || 0);
        setTargetWater(response.data.daily_water_goal || 2000);
      }
      const weeklyResponse = await api.get(endpoints.waterWeekly);
      if (weeklyResponse.data) {
        setWeeklyAverage(weeklyResponse.data.weekly_average || 0);
      }
    } catch (error) {
      console.error("Water fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWater = async (amount: number) => {
    try {
      const response = await api.post(endpoints.waterTracking, { increment: amount });
      if (response.data) {
        setTodayWater(response.data.todays_water_intake);
        const { dispatchRefresh } = await import("../helpers/api");
        dispatchRefresh();
      }
    } catch (error) {
      console.error("Backend add water failed:", error);
    }
  };

  const progress = Math.min((todayWater / targetWater) * 100, 100);
  const targetGlasses = Math.ceil(targetWater / glassSize);

  const getHydrationMessage = () => {
    if (progress >= 100) return "🎉 You're fully hydrated!";
    if (progress >= 75) return "💧 Excellent progress! Almost there.";
    if (progress >= 50) return "👍 Halfway there! Keep drinking.";
    if (progress >= 25) return "💪 Great start! Keep up the momentum.";
    return "🥤 Time for your next glass of water!";
  };

  if (isLoading && todayWater === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green-vibrant"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <CommonHeader 
        title="Water Tracking" 
        subtitle="Stay hydrated, stay healthy!"
        gradientClass="bg-water-gradient"
        icon={<Droplets className="w-10 h-10 text-white/90" />}
      />

      <div className="max-w-4xl mx-auto px-6">
        <div className="relative -mt-32 z-20 space-y-8">
          {/* Main Progress Card (Android Style) */}
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl p-10 flex flex-col items-center border border-gray-100 dark:border-gray-700">
            {/* Water Progress Indicator (Large Circle) */}
            <div className="relative w-64 h-64 mb-8">
              <svg className="transform -rotate-90 w-64 h-64">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#E0F2FE"
                  strokeWidth="20"
                  fill="none"
                  className="dark:stroke-gray-700"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="url(#water-gradient-svg)"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 110}`}
                  strokeDashoffset={`${2 * Math.PI * 110 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="water-gradient-svg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#0072FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">{todayWater}</p>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">ml</p>
                <p className="text-blue-500 font-black text-xl mt-2">{Math.round(progress)}%</p>
              </div>
            </div>

            <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-8">{getHydrationMessage()}</p>

            {/* Glass Size Selector */}
            <div className="w-full space-y-4 mb-8">
               <div className="flex items-center justify-between px-2">
                 <h3 className="font-black text-gray-400 uppercase tracking-widest text-xs">Glass Size Selection</h3>
                 <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 px-3 py-1 rounded-lg text-xs font-black">{glassSize}ml</span>
               </div>
               <div className="grid grid-cols-3 gap-4">
                 {[250, 500, 750].map((size) => (
                   <button
                     key={size}
                     onClick={() => setGlassSize(size)}
                     className={`py-4 rounded-[1.5rem] font-bold transition-all transform active:scale-95 border-2 ${
                       glassSize === size
                         ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                         : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 hover:border-blue-200'
                     }`}
                   >
                     {size}ml
                   </button>
                 ))}
               </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex gap-4">
              <button
                onClick={() => updateWater(-glassSize)}
                disabled={todayWater === 0}
                className="flex-1 py-5 rounded-[2rem] bg-gray-50 dark:bg-gray-900 text-gray-400 font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center gap-2 group"
              >
                <Minus className="w-6 h-6 group-hover:scale-125 transition-transform" />
                Remove
              </button>
              <button
                onClick={() => updateWater(glassSize)}
                className="flex-[2] py-5 rounded-[2rem] bg-gradient-to-r from-blue-500 to-blue-700 text-white font-black uppercase tracking-widest shadow-xl hover:shadow-blue-500/30 transition-shadow flex items-center justify-center gap-2 group"
              >
                <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
                Add {glassSize}ml
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                   <Target className="w-6 h-6 text-success-green" />
                 </div>
                 <span className="text-gray-400 font-black uppercase tracking-widest text-xs">Daily Goal</span>
               </div>
               <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{targetWater}ml</p>
               <p className="text-gray-400 text-sm font-bold mt-2">{targetGlasses} glasses today</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                   <TrendingUp className="w-6 h-6 text-blue-500" />
                 </div>
                 <span className="text-gray-400 font-black uppercase tracking-widest text-xs">7-Day Avg</span>
               </div>
               <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{weeklyAverage}ml</p>
               <p className="text-gray-400 text-sm font-bold mt-2">{Math.round((weeklyAverage/targetWater)*100)}% consistency</p>
            </div>
          </div>

          {/* Hydration Info Box (Android Style) */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Hydration Benefits</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: "⚡", text: "Boosts energy levels and focus" },
                { icon: "✨", text: "Promotes healthier, glowing skin" },
                { icon: "🔥", text: "Supports fat burning metabolism" },
                { icon: "🧠", text: "Enhances cognitive brain function" }
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <span className="text-2xl">{benefit.icon}</span>
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-300 leading-tight">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}