import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Plus, 
  Camera, 
  Brain, 
  History, 
  Flame, 
  Droplet, 
  Target, 
  TrendingDown, 
  TrendingUp, 
  Footprints, 
  Info,
  ChevronRight,
  Utensils
} from "lucide-react";
import { getUserProfile } from "@/app/helpers/meal-plan-helper";
import api, { endpoints } from "../helpers/api";

interface LoggedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: number;
  unit: string;
  timestamp: string;
}

export function HomeDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [todayCalories, setTodayCalories] = useState(0);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [weeklyProgress, setWeeklyProgress] = useState({
    currentWeight: 0,
    targetWeight: 0,
    startWeight: 0,
    weeksPassed: 0
  });
  const [greeting, setGreeting] = useState("Good Morning");
  const [todayWater, setTodayWater] = useState(0);
  const [todaySteps, setTodaySteps] = useState(0);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [dailyTip, setDailyTip] = useState("");
  const [userGoal, setUserGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initDashboard = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchHomeData(),
        fetchMacrosData(),
        fetchWaterData(),
        fetchStepsData()
      ]);
      setIsLoading(false);
    };

    initDashboard();
    setGreetingBasedOnTime();

    const handleFocus = () => {
      fetchHomeData();
      fetchMacrosData();
      fetchWaterData();
      fetchStepsData();
    };

    const handleRefreshEvent = () => {
      fetchHomeData();
      fetchMacrosData();
      fetchWaterData();
      fetchStepsData();
    };

    const handleStorageChange = () => {
      handleRefreshEvent();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('refreshDashboard', handleRefreshEvent);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('refreshDashboard', handleRefreshEvent);
    };
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await api.get(endpoints.home);
      if (response.data) {
        const profile = response.data;
        setUserName(profile.display_name || profile.full_name || profile.name || profile.username || 'User');
        setTargetCalories(profile.target_calories || profile.targetCalories || profile.calorieGoal || 2000);
        setUserGoal(profile.goal || "");
        
        // Sync these with the backend's precise field names
        setTodayCalories(Math.round(profile.todays_calories || profile.todaysCalories || profile.current_calories || 0));
        setTodaySteps(profile.todays_steps || profile.todaysSteps || profile.total_steps || 0);
        setTodayWater(profile.todays_water_intake || profile.todaysWaterIntake || profile.total_water || 0);
        
        if (profile.profile_picture || profile.profilePictureUrl) {
          setProfilePicture(profile.profile_picture || profile.profilePictureUrl);
        }
        
        const startDate = profile.start_date || profile.timelineStartDate || profile.created_at;
        const weeksPassed = startDate
          ? Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 7)) 
          : 0;

        setWeeklyProgress({
          currentWeight: profile.current_weight || profile.weight || 0,
          targetWeight: profile.target_weight || profile.targetWeight || 0,
          startWeight: profile.start_weight || profile.startWeight || profile.weight || 0,
          weeksPassed: Math.max(0, weeksPassed)
        });
        
        if (profile.daily_tip || profile.dailyTip) {
          setDailyTip(profile.daily_tip || profile.dailyTip);
        }
        
        if (profile.calories_burned !== undefined || profile.burned_calories !== undefined) {
          setBurnedCalories(profile.calories_burned || profile.burned_calories || 0);
        }
      }
    } catch (error) {
      console.error("Home data fetch failed:", error);
    }
  };

  const fetchMacrosData = async () => {
    try {
      const response = await api.get(endpoints.todayMacros);
      if (response.data) {
        setTodayCalories(Math.round(response.data.calories || response.data.total_calories || 0));
      }
    } catch (error) {
       console.error("Macros fetch failed:", error);
    }
  };

  const fetchWaterData = async () => {
    try {
      const response = await api.get(endpoints.waterTracking);
      if (response.data) {
        setTodayWater(response.data.todays_water_intake || response.data.total_water || response.data.glasses * 250 || 0);
      }
    } catch (error) {
       console.error("Water fetch failed:", error);
    }
  };

  const fetchStepsData = async () => {
    try {
      const response = await api.get(endpoints.stepsToday);
      if (response.data) {
        setTodaySteps(response.data.todaysSteps || response.data.todays_steps || response.data.total_steps || 0);
      }
    } catch (error) {
       console.error("Steps fetch failed:", error);
    }
  };

  const setGreetingBasedOnTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  };

  const consumedPercent = Math.min((todayCalories / targetCalories) * 100, 100);
  const remaining = targetCalories - todayCalories;
  
  const isLoseWeight = userGoal?.toLowerCase().includes('lose');
  const hasWeightGoal = (isLoseWeight || userGoal?.toLowerCase().includes('gain')) && weeklyProgress.targetWeight > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 pt-12 pb-24 px-6 rounded-b-[40px] relative overflow-hidden shadow-2xl">
        <div className="flex items-start justify-between relative z-10 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <p className="text-green-50 text-sm font-bold uppercase tracking-[0.2em]">{greeting}</p>
            <h1 className="text-3xl text-white font-black tracking-tight mt-1">
              {userName || "NutriSoul User"}
            </h1>
          </div>
          <button 
            onClick={() => navigate("/app/profile")}
            className="w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300"
          >
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-white">👤</span>
            )}
          </button>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -left-10 bottom-0 w-40 h-40 bg-black/5 rounded-full blur-2xl"></div>
      </div>

      <div className="px-6 space-y-8 -mt-12 relative z-20 max-w-5xl mx-auto">
        {/* Calorie Goal Card */}
        <div className="bg-white dark:bg-gray-900 rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 border border-white/20 dark:border-gray-800 transform transition-all hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight">
                Daily Goal
              </h2>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target</p>
               <p className="text-xl font-black text-gray-900 dark:text-white">{targetCalories} <span className="text-xs opacity-50">kcal</span></p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                 <circle
                   cx="96"
                   cy="96"
                   r="88"
                   stroke="currentColor"
                   strokeWidth="12"
                   fill="transparent"
                   className="text-gray-100 dark:text-gray-800"
                 />
                 <circle
                   cx="96"
                   cy="96"
                   r="88"
                   stroke="currentColor"
                   strokeWidth="12"
                   strokeDasharray={2 * Math.PI * 88}
                   strokeDashoffset={2 * Math.PI * 88 * (1 - consumedPercent / 100)}
                   strokeLinecap="round"
                   fill="transparent"
                   className={`${todayCalories > targetCalories ? 'text-red-500' : 'text-green-500'} transition-all duration-1000 ease-out`}
                 />
               </svg>
               <div className="absolute flex flex-col items-center">
                 <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{todayCalories}</span>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logged</span>
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Droplet className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Left</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">{remaining > 0 ? remaining : 0} kcal</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Burned</p>
                <p className="text-sm font-black text-green-600 text-right">{burnedCalories} kcal</p>
              </div>
              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Weight Progress Premium Card */}
        {hasWeightGoal && (
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[30px] shadow-xl p-8 relative overflow-hidden text-white">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black uppercase tracking-tight">Weight Journey</h2>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                  {isLoseWeight ? <TrendingDown className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">Current</p>
                  <p className="text-3xl font-black">{weeklyProgress.currentWeight} <span className="text-xs opacity-70">kg</span></p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">Target</p>
                  <p className="text-3xl font-black">{weeklyProgress.targetWeight} <span className="text-xs opacity-70">kg</span></p>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-black/10 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-white/90">
                  {Math.abs(weeklyProgress.currentWeight - weeklyProgress.targetWeight).toFixed(1)} kg to go
                </p>
                <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-1 rounded-md">Week {weeklyProgress.weeksPassed + 1}</span>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        )}

        {/* Activity Summary */}
        <div>
          <h2 className="text-base font-black text-gray-800 dark:text-white uppercase tracking-widest mb-4 px-1">Statistics</h2>
          <div className="grid grid-cols-2 gap-6">
            <ActivityCard 
              icon={<Droplet className="w-6 h-6" />}
              label="ml water"
              value={todayWater}
              color="blue"
              onClick={() => navigate("/app/water-tracking")}
            />
            <ActivityCard 
              icon={<Footprints className="w-6 h-6" />}
              label="steps"
              value={todaySteps}
              color="emerald"
              onClick={() => navigate("/app/steps-tracking")}
            />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <section className="max-w-4xl mx-auto w-full">
          <h2 className="text-base font-bold text-gray-800 dark:text-white mb-3 px-1">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <ActionCard 
              icon={<Plus className="w-6 h-6" />} 
              label="Log Food" 
              desc="Track your meal" 
              color="text-green-600 bg-green-50" 
              onClick={() => navigate("/app/log-food")}
            />
            <ActionCard 
              icon={<Utensils className="w-6 h-6" />} 
              label="Meal Plan" 
              desc="View daily plan" 
              color="text-blue-600 bg-blue-50" 
              onClick={() => navigate("/app/meals")}
            />
            <ActionCard 
              icon={<Brain className="w-6 h-6" />} 
              label="AI Tips" 
              desc="Get smart help" 
              color="text-purple-600 bg-purple-50" 
              onClick={() => navigate("/app/recommendations")}
            />
            <ActionCard 
              icon={<History className="w-6 h-6" />} 
              label="History" 
              desc="View past logs" 
              color="text-orange-600 bg-orange-50" 
              onClick={() => navigate("/app/history")}
            />
          </div>
        </section>

        {/* Daily Tip Card */}
        <div className="max-w-4xl mx-auto w-full pb-8">
          <div className="bg-gradient-to-br from-[#F5F3FF] to-[#F3E8FF] dark:from-[#312E81]/30 dark:to-[#4C1D95]/30 rounded-[22px] p-5 shadow-sm animate-fade-in mb-8 border border-purple-100/50 dark:border-purple-900/30">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-purple-500 rounded-xl shadow-md flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1">Daily Tip</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium">
                  {dailyTip || (todayCalories < targetCalories / 2 
                    ? "Fueling your body consistently is key. Make sure to space out your meals for steady energy."
                    : todayCalories > targetCalories * 1.2
                    ? "Balance is everything. Consider a light walk or some herbal tea to help digestion."
                    : "You're doing amazing! Consistency is the secret ingredient to your wellness journey.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ icon, label, value, unit, color, onClick }: any) {
  const gradients: any = {
    blue: "bg-water-gradient shadow-[0_10px_20px_rgba(0,198,255,0.2)]",
    emerald: "bg-steps-gradient shadow-[0_10px_20px_rgba(0,176,155,0.2)]"
  };

  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-[22px] text-left group transition-all duration-300 hover:shadow-lg active:scale-95 relative overflow-hidden h-[130px] w-full ${gradients[color]}`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="bg-white/60 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <div className={color === 'blue' ? 'text-blue-600' : 'text-emerald-600'}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-2xl font-black text-gray-900">{value.toLocaleString()}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
        </div>
      </div>
    </button>
  );
}

function ActionCard({ icon, label, desc, color, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-900 rounded-[20px] p-5 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-95 transition-all text-center group flex flex-col items-center"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${color} bg-opacity-10 dark:bg-opacity-20`}>
        {icon}
      </div>
      <h3 className="font-bold text-sm text-gray-800 dark:text-white tracking-tight">{label}</h3>
    </button>
  );
}