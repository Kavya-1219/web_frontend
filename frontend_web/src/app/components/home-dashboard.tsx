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

    const handleStorageChange = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setProfilePicture(user.profile_picture || null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await api.get(endpoints.home);
      if (response.data) {
        const profile = response.data;
        setUserName(profile.full_name || 'User');
        setTargetCalories(profile.daily_calorie_goal || 2000);
        setWeeklyProgress({
          currentWeight: profile.weight || 0,
          targetWeight: profile.target_weight || 0,
          startWeight: profile.weight || 0, // Simplified
          weeksPassed: 0 // Would need timeline calculation
        });
      }
    } catch (error) {
      console.error("Home data fetch failed:", error);
      // Fallback
      const personalDetails = JSON.parse(localStorage.getItem('personalDetails') || '{}');
      setUserName(personalDetails.name || 'User');
    }
  };

  const fetchMacrosData = async () => {
    try {
      const response = await api.get("/today-macros/");
      if (response.data) {
        setTodayCalories(Math.round(response.data.calories || 0));
      }
    } catch (error) {
       console.error("Macros fetch failed:", error);
    }
  };

  const fetchWaterData = async () => {
    try {
      const response = await api.get(endpoints.waterTracking);
      if (response.data) {
        setTodayWater(response.data.todays_water_intake || 0);
      }
    } catch (error) {
       console.error("Water fetch failed:", error);
    }
  };

  const fetchStepsData = async () => {
    try {
      const response = await api.get("/steps/today/");
      if (response.data) {
        setTodaySteps(response.data.total_steps || 0);
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

  const loadUserData = () => {
    const personalDetails = JSON.parse(localStorage.getItem('personalDetails') || '{}');
    setUserName(personalDetails.name || 'User');

    const email = localStorage.getItem('currentUserEmail');
    if (email) {
      const savedProfilePicture = localStorage.getItem(`profilePicture_${email}`);
      setProfilePicture(savedProfilePicture);
    }

    const profile = getUserProfile();
    setTargetCalories(profile.targetCalories || 2000);

    const today = new Date().toDateString();
    const logs = JSON.parse(localStorage.getItem(`foodLogs_${email}`) || '[]');
    const todayLogs = logs.filter((log: LoggedFood) => 
      new Date(log.timestamp).toDateString() === today
    );
    const totalCals = todayLogs.reduce((sum: number, log: LoggedFood) => 
      sum + (log.calories * log.quantity), 0
    );
    setTodayCalories(Math.round(totalCals));

    const bodyDetails = JSON.parse(localStorage.getItem('bodyDetails') || '{}');
    const targetWeight = parseFloat(localStorage.getItem('targetWeight') || '0');
    const timeline = JSON.parse(localStorage.getItem('timeline') || '{}');
    
    if (targetWeight && timeline.targetDate) {
      const startDate = new Date(timeline.targetDate);
      startDate.setDate(startDate.getDate() - (timeline.weeks * 7));
      const now = new Date();
      const weeksPassed = Math.floor((now.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      setWeeklyProgress({
        currentWeight: parseFloat(bodyDetails.weight) || 0,
        targetWeight: targetWeight,
        startWeight: parseFloat(bodyDetails.weight) || 0,
        weeksPassed: Math.max(0, weeksPassed)
      });
    }
  };

  const loadTrackingData = () => {
    const today = new Date().toDateString();
    const email = localStorage.getItem('currentUserEmail');
    
    const waterLogs = JSON.parse(localStorage.getItem(`waterLogs_${email}`) || '[]');
    const todayWaterLogs = waterLogs.filter((log: { timestamp: string, amount: number }) => 
      new Date(log.timestamp).toDateString() === today
    );
    setTodayWater(todayWaterLogs.reduce((sum: number, log: { amount: number }) => sum + log.amount, 0));
    
    const stepsLogs = JSON.parse(localStorage.getItem(`stepsLogs_${email}`) || '[]');
    const todayStepsLogs = stepsLogs.filter((log: { timestamp: string, steps: number }) => 
      new Date(log.timestamp).toDateString() === today
    );
    setTodaySteps(todayStepsLogs.reduce((sum: number, log: { steps: number }) => sum + log.steps, 0));
  };

  const consumedPercent = (todayCalories / targetCalories) * 100;
  const remaining = targetCalories - todayCalories;
  
  const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
  const isLoseWeight = goals.includes('lose-weight');
  const hasWeightGoal = isLoseWeight || goals.includes('gain-weight');

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-950 pb-24">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] pt-8 pb-6 px-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-white text-base font-medium opacity-90 tracking-wide uppercase">{greeting}</p>
            <h1 className="text-3xl text-white font-bold tracking-tight mt-1">{userName}</h1>
          </div>
          <button 
            onClick={() => navigate("/app/profile")}
            className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center shadow-inner overflow-hidden hover:scale-105 transition-all duration-300"
          >
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </button>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="px-6 mt-6 space-y-8">
        {/* Calorie Goal Card */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-8 border border-gray-100 dark:border-gray-800 transform transition-all duration-500 hover:shadow-emerald-100 dark:hover:shadow-none animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              Daily Calorie Goal
            </h2>
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/40 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">{todayCalories}</span>
              <span className="text-2xl font-bold text-gray-400">/ {targetCalories}</span>
            </div>
            <p className="text-gray-500 font-medium mt-2">total calories today</p>
          </div>
          
          <div className="relative h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-6">
            <div
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                todayCalories > targetCalories 
                  ? 'bg-gradient-to-r from-orange-500 to-red-600' 
                  : 'bg-gradient-to-r from-[#4ADE80] to-[#16A34A]'
              }`}
              style={{ width: `${Math.min(consumedPercent, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold ${
              remaining >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
            }`}>
              <Info className="w-4 h-4" />
              <span>{remaining >= 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over`}</span>
            </div>
            <p className="text-sm font-bold text-emerald-600">Burned: 342 kcal</p>
          </div>
        </div>

        {/* Weight Progress Premium Card */}
        {hasWeightGoal && weeklyProgress.targetWeight > 0 && (
          <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-[2rem] shadow-xl p-8 text-white relative overflow-hidden group animate-fade-in">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold tracking-tight">Weight Journey</h2>
                <div className="bg-white/20 p-2 rounded-lg">
                  {isLoseWeight ? <TrendingDown className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Current</p>
                  <p className="text-3xl font-black">{weeklyProgress.currentWeight} <span className="text-lg">kg</span></p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Target</p>
                  <p className="text-3xl font-black">{weeklyProgress.targetWeight} <span className="text-lg">kg</span></p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm font-bold pt-2">
                <span className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md">
                  {Math.abs(weeklyProgress.currentWeight - weeklyProgress.targetWeight).toFixed(1)} kg to go
                </span>
                <span className="opacity-80">Week {weeklyProgress.weeksPassed + 1} Progress</span>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          </div>
        )}

        {/* Activity Section */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Daily Activity</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ActivityCard 
              icon={<Droplet className="w-6 h-6 text-blue-500" />}
              label="Water intake"
              value={todayWater}
              unit="ml"
              color="blue"
              onClick={() => navigate("/app/water-tracking")}
            />
            <ActivityCard 
              icon={<Footprints className="w-6 h-6 text-emerald-500" />}
              label="Steps today"
              value={todaySteps}
              unit=""
              color="emerald"
              onClick={() => navigate("/app/steps-tracking")}
            />
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 px-2">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ActionCard 
              icon={<Plus className="w-7 h-7" />} 
              label="Log Food" 
              desc="Track your meal" 
              color="bg-emerald-50 text-emerald-600" 
              onClick={() => navigate("/app/log-food")}
            />
            <ActionCard 
              icon={<Utensils className="w-7 h-7" />} 
              label="Meal Plan" 
              desc="View daily plan" 
              color="bg-blue-50 text-blue-600" 
              onClick={() => navigate("/app/meals")}
            />
            <ActionCard 
              icon={<Brain className="w-7 h-7" />} 
              label="AI Tips" 
              desc="Get smart help" 
              color="bg-purple-50 text-purple-600" 
              onClick={() => navigate("/app/recommendations")}
            />
            <ActionCard 
              icon={<History className="w-7 h-7" />} 
              label="History" 
              desc="View past logs" 
              color="bg-orange-50 text-orange-600" 
              onClick={() => navigate("/app/history")}
            />
          </div>
        </section>

        {/* Daily Tip Glass Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-[2rem] p-8 border-l-8 border-indigo-500 shadow-sm animate-fade-in mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center">
              <Target className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Daily Tip</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic text-lg font-medium">
            "{todayCalories < targetCalories / 2 
              ? "Fueling your body consistently is key. Make sure to space out your meals for steady energy."
              : todayCalories > targetCalories * 1.2
              ? "Balance is everything. Consider a light walk or some herbal tea to help digestion."
              : "You're doing amazing! Consistency is the secret ingredient to your wellness journey."}"
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ icon, label, value, unit, color, onClick }: any) {
  const bgColors: any = {
    blue: "bg-blue-50/50 border-blue-100",
    emerald: "bg-emerald-50/50 border-emerald-100"
  };

  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-[2rem] border ${bgColors[color]} text-left group transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-black text-gray-800 dark:text-white">{value.toLocaleString()} <span className="text-lg font-bold opacity-40">{unit}</span></p>
      </div>
    </button>
  );
}

function ActionCard({ icon, label, desc, color, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-50 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${color} group-hover:bg-opacity-80`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-800 dark:text-white tracking-tight">{label}</h3>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-gray-400 font-medium">{desc}</p>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
    </button>
  );
}