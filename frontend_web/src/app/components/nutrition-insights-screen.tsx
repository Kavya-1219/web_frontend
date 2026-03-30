import { useState, useEffect } from "react";
import { TrendingUp, Award, Target, Calendar, Zap, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import api, { endpoints } from "../helpers/api";

interface WeeklyStats {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFats: number;
  daysLogged: number;
  totalDays: number;
}

interface CalorieStatus {
  label: string;
  tone: string;
  emoji: string;
}

function InsightNutritionChip({ label, value, percent, color }: { label: string, value: number, percent: number, color: string }) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40",
    orange: "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40",
    amber: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40"
  };

  return (
    <div className={`p-5 rounded-[2.5rem] border ${colors[color]} flex flex-col items-center justify-center shadow-sm transform transition-all hover:scale-105`}>
      <span className="text-2xl font-black mb-1">{value}g</span>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{label}</span>
      <div className="w-full bg-white/50 dark:bg-black/20 h-1 rounded-full overflow-hidden">
        <div 
          className="h-full bg-current opacity-80" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <span className="text-[10px] font-bold mt-2 opacity-80">{percent}%</span>
    </div>
  );
}

export function NutritionInsightsScreen() {
  const navigate = useNavigate();
  
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    avgCalories: 0,
    avgProtein: 0,
    avgCarbs: 0,
    avgFats: 0,
    daysLogged: 0,
    totalDays: 7
  });
  const [hasData, setHasData] = useState(false);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [consistency, setConsistency] = useState(0);
  const [loading, setLoading] = useState(true);
  const [macroBalance, setMacroBalance] = useState({ protein: 0, carbs: 0, fats: 0 });
  const [calorieStatus, setCalorieStatus] = useState<CalorieStatus>({
    label: "Unknown",
    tone: "NEUTRAL",
    emoji: "ℹ️"
  });

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.nutritionInsights);
      const data = response.data;

      if (data && (data.hasData || data.has_data)) {
        setHasData(true);
        setWeeklyStats({
          avgCalories: data.averageCalories || data.average_calories || 0,
          avgProtein: data.averageProtein || data.average_protein || 0,
          avgCarbs: data.averageCarbs || data.average_carbs || 0,
          avgFats: data.averageFats || data.average_fats || 0,
          daysLogged: data.daysLogged || data.days_logged || 0,
          totalDays: data.totalDays || data.total_days || 7
        });
        setTargetCalories(data.targetCalories || data.target_calories || 2000);
        setConsistency(data.consistencyPercent || data.consistency_percent || 0);
        setMacroBalance({
          protein: data.proteinPercentage || data.protein_percentage || 0,
          carbs: data.carbsPercentage || data.carbs_percentage || 0,
          fats: data.fatsPercentage || data.fats_percentage || 0
        });
        setCalorieStatus(data.calorieStatus || data.calorie_status || { label: "Perfect", tone: "GOOD", emoji: "✅" });
      } else {
        setHasData(false);
      }
    } catch (error) {
      console.error("Error fetching nutrition insights:", error);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  const getCalorieStatusDisplay = () => {
    switch (calorieStatus.tone) {
      case "GOOD":
        return { color: "text-green-600", bgColor: "bg-green-50" };
      case "OK":
        return { color: "text-blue-600", bgColor: "bg-blue-50" };
      case "WARN":
        return { color: "text-orange-600", bgColor: "bg-orange-50" };
      case "INFO":
        return { color: "text-yellow-600", bgColor: "bg-yellow-50" };
      default:
        return { color: "text-gray-600", bgColor: "bg-gray-50" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 pt-8 pb-20 px-6 rounded-b-[2rem]">
          <h1 className="text-2xl text-white mb-2 font-semibold">Nutrition Insights</h1>
          <p className="text-indigo-50 dark:text-indigo-200">Track your nutrition trends</p>
        </div>

        {/* Empty State */}
        <div className="px-6 -mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Data Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start logging your meals to see personalized nutrition insights and track your progress over time.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>Tip:</strong> Log meals for at least 3-4 days to get meaningful insights!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusDisplay = getCalorieStatusDisplay();

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-950 pb-24">
      {/* Premium Header */}
      <div className="bg-insights-gradient pt-12 pb-16 px-6 rounded-b-[2.5rem] relative overflow-hidden h-[260px]">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-white text-base font-medium opacity-90 tracking-wide uppercase">Your Analytics</p>
            <h1 className="text-3xl text-white font-black tracking-tight mt-1">Nutrition Insights</h1>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center shadow-inner hover:scale-105 transition-all duration-300">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Weekly Consistency - Weighted Offset */}
      <div className="px-6 -mt-10 mb-8 relative z-20">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 border border-gray-100 dark:border-gray-800 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                Weekly Consistency
              </h2>
              <p className="text-xs text-gray-400 font-bold mt-1 tracking-widest uppercase">Performance Score</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/40 rounded-2xl flex items-center justify-center shadow-sm">
              <Award className="w-7 h-7 text-amber-500" />
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke="#F3F4F6"
                  strokeWidth="16"
                  fill="none"
                  className="dark:stroke-gray-800"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke="url(#consistencyGradient)"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 84}`}
                  strokeDashoffset={`${2 * Math.PI * 84 * (1 - consistency / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="consistencyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{consistency}%</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Score</p>
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-4 flex items-center justify-between border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Logged {weeklyStats.daysLogged} / {weeklyStats.totalDays} days
              </p>
            </div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Active Streak</span>
          </div>
        </div>
      </div>

      {/* Average Daily Intake */}
      <div className="px-6 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 border border-gray-50 dark:border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">Average Intake</h2>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-indigo-500" />
            </div>
          </div>
          
          {/* Calories Progress Card */}
          <div className={`rounded-[2rem] p-6 mb-8 border-2 ${statusDisplay.color.replace('text-', 'border-').replace('600', '100')} dark:border-gray-800 ${statusDisplay.bgColor} dark:bg-gray-800/20`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Average</p>
              <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-full shadow-sm">
                 <span className="text-lg">{calorieStatus.emoji}</span>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${statusDisplay.color}`}>{calorieStatus.label}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{weeklyStats.avgCalories}</span>
              <span className="text-xl font-bold text-gray-400">/ {targetCalories} kcal</span>
            </div>
            <div className="relative h-4 bg-gray-200/50 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                  calorieStatus.tone === 'GOOD' ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-orange-400 to-red-500'
                }`}
                style={{ width: `${Math.min((weeklyStats.avgCalories / targetCalories) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* High Fidelity Macros */}
          <div className="grid grid-cols-3 gap-4">
            <InsightNutritionChip label="Protein" value={weeklyStats.avgProtein} percent={macroBalance.protein} color="blue" />
            <InsightNutritionChip label="Carbs" value={weeklyStats.avgCarbs} percent={macroBalance.carbs} color="orange" />
            <InsightNutritionChip label="Fats" value={weeklyStats.avgFats} percent={macroBalance.fats} color="amber" />
          </div>
        </div>
      </div>

      {/* Macro Distribution */}
      <div className="px-6 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 border border-gray-50 dark:border-gray-800">
          <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight mb-8">Distribution</h2>
          
          <div className="space-y-8">
            <MacroProgress label="Protein" value={macroBalance.protein} target="15-30%" color="from-blue-400 to-blue-600" />
            <MacroProgress label="Carbohydrates" value={macroBalance.carbs} target="45-65%" color="from-orange-400 to-orange-600" />
            <MacroProgress label="Fats" value={macroBalance.fats} target="20-35%" color="from-amber-400 to-amber-600" />
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-900/20 border-2 border-emerald-100 dark:border-emerald-900/40 rounded-[2.5rem] p-8 relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200 dark:shadow-none">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-300 mb-3 uppercase tracking-tight">Personalized Insights</h3>
              <ul className="space-y-3">
                {consistency >= 80 && (
                  <li className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    Exceptional consistency this week!
                  </li>
                )}
                {macroBalance.protein < 15 && (
                  <li className="flex items-center gap-2 text-sm font-bold text-orange-700 dark:text-orange-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    Increase protein for better recovery
                  </li>
                )}
                <li className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-400">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   Calorie intake is {calorieStatus.label.toLowerCase()}
                </li>
              </ul>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Timeline Progress Link */}
      <div className="px-6 mb-6">
        <button
          onClick={() => navigate('/app/history')}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-700 text-white rounded-[2.5rem] p-8 hover:shadow-2xl transition-all active:scale-95 group shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-xl mb-1 uppercase tracking-tight">View Full History</h3>
                <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Complete nutrition logs</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

function MacroProgress({ label, value, target, color }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-widest">{label}</span>
          <span className="text-[10px] font-bold text-gray-400 mt-1">Goal: {target}</span>
        </div>
        <span className="text-xl font-black text-gray-900 dark:text-white">{value}%</span>
      </div>
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}