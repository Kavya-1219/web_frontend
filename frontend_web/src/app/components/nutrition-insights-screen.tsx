import { useState, useEffect } from "react";
import { TrendingUp, Award, Target, Calendar, Zap, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

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

interface WeeklyStats {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFats: number;
  daysLogged: number;
  totalDays: number;
}

export function NutritionInsightsScreen() {
  // All hooks must be at the top level - before any conditional returns
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

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = () => {
    const email = localStorage.getItem('currentUserEmail');
    const logs = JSON.parse(localStorage.getItem(`foodLogs_${email}`) || '[]');

    if (logs.length === 0) {
      setHasData(false);
      return;
    }

    setHasData(true);

    // Get last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Filter logs from last 7 days
    const weekLogs = logs.filter((log: LoggedFood) => 
      new Date(log.timestamp) >= sevenDaysAgo
    );

    // Group by date
    const groupedByDate: { [key: string]: LoggedFood[] } = {};
    weekLogs.forEach((log: LoggedFood) => {
      const date = new Date(log.timestamp).toDateString();
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(log);
    });

    const daysLogged = Object.keys(groupedByDate).length;

    // Calculate daily totals
    const dailyTotals = Object.values(groupedByDate).map(dayLogs => {
      return dayLogs.reduce((totals, log) => ({
        calories: totals.calories + (log.calories * log.quantity),
        protein: totals.protein + (log.protein * log.quantity),
        carbs: totals.carbs + (log.carbs * log.quantity),
        fats: totals.fats + (log.fats * log.quantity)
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    });

    // Calculate averages
    if (dailyTotals.length > 0) {
      const avgCalories = dailyTotals.reduce((sum, day) => sum + day.calories, 0) / dailyTotals.length;
      const avgProtein = dailyTotals.reduce((sum, day) => sum + day.protein, 0) / dailyTotals.length;
      const avgCarbs = dailyTotals.reduce((sum, day) => sum + day.carbs, 0) / dailyTotals.length;
      const avgFats = dailyTotals.reduce((sum, day) => sum + day.fats, 0) / dailyTotals.length;

      setWeeklyStats({
        avgCalories: Math.round(avgCalories),
        avgProtein: Math.round(avgProtein),
        avgCarbs: Math.round(avgCarbs),
        avgFats: Math.round(avgFats),
        daysLogged,
        totalDays: 7
      });

      setConsistency(Math.round((daysLogged / 7) * 100));
    }

    // Get target calories
    const bodyDetails = JSON.parse(localStorage.getItem('bodyDetails') || '{}');
    const lifestyle = JSON.parse(localStorage.getItem('lifestyle') || '{}');
    const personalDetails = JSON.parse(localStorage.getItem('personalDetails') || '{}');
    
    const weight = parseFloat(bodyDetails.weight) || 70;
    const height = parseFloat(bodyDetails.height) || 170;
    const age = parseFloat(personalDetails.age) || 25;
    const gender = personalDetails.gender || 'Male';
    
    let bmr;
    if (gender === 'Male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    const multiplier = lifestyle.multiplier || 1.375;
    const tdee = Math.round(bmr * multiplier);
    
    const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
    let target = tdee;
    
    if (goals.includes('lose-weight')) {
      target = tdee - 500;
    } else if (goals.includes('gain-weight') || goals.includes('gain-muscle')) {
      target = tdee + 300;
    }
    
    setTargetCalories(target);
  };

  const getCalorieStatus = () => {
    const diff = weeklyStats.avgCalories - targetCalories;
    const percentDiff = Math.abs((diff / targetCalories) * 100);
    
    if (percentDiff < 5) {
      return { status: "Excellent", color: "text-green-600", bgColor: "bg-green-50", icon: "🎯" };
    } else if (percentDiff < 10) {
      return { status: "Good", color: "text-blue-600", bgColor: "bg-blue-50", icon: "👍" };
    } else if (diff > 0) {
      return { status: "Over Target", color: "text-orange-600", bgColor: "bg-orange-50", icon: "⚠️" };
    } else {
      return { status: "Under Target", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: "📉" };
    }
  };

  const getMacroBalance = () => {
    const totalMacros = weeklyStats.avgProtein + weeklyStats.avgCarbs + weeklyStats.avgFats;
    if (totalMacros === 0) return { protein: 0, carbs: 0, fats: 0 };
    
    return {
      protein: Math.round((weeklyStats.avgProtein * 4 / (weeklyStats.avgCalories || 1)) * 100),
      carbs: Math.round((weeklyStats.avgCarbs * 4 / (weeklyStats.avgCalories || 1)) * 100),
      fats: Math.round((weeklyStats.avgFats * 9 / (weeklyStats.avgCalories || 1)) * 100)
    };
  };

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

  const calorieStatus = getCalorieStatus();
  const macroBalance = getMacroBalance();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 pt-8 pb-20 px-6 rounded-b-[2rem]">
        <h1 className="text-2xl text-white mb-2 font-semibold">Nutrition Insights</h1>
        <p className="text-indigo-50 dark:text-indigo-200">Your 7-day performance</p>
      </div>

      {/* Weekly Consistency */}
      <div className="px-6 -mt-12 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Weekly Consistency</h2>
            <Award className="w-6 h-6 text-yellow-500" />
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#10B981"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - consistency / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{consistency}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Logged</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {weeklyStats.daysLogged} out of {weeklyStats.totalDays} days logged this week
          </p>
        </div>
      </div>

      {/* Average Daily Intake */}
      <div className="px-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Average Daily Intake</h2>
            <Calendar className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
          </div>
          
          {/* Calories */}
          <div className={`${calorieStatus.bgColor} dark:bg-opacity-20 border-2 border-current rounded-xl p-4 mb-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Calories</span>
              <span className={`text-sm font-semibold ${calorieStatus.color} dark:opacity-90`}>
                {calorieStatus.icon} {calorieStatus.status}
              </span>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-800 dark:text-white">{weeklyStats.avgCalories}</span>
              <span className="text-lg text-gray-500 dark:text-gray-400 mb-1">/ {targetCalories} kcal</span>
            </div>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${calorieStatus.status === 'Excellent' || calorieStatus.status === 'Good' ? 'bg-green-500' : 'bg-orange-500'}`}
                style={{ width: `${Math.min((weeklyStats.avgCalories / targetCalories) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Protein</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{weeklyStats.avgProtein}g</p>
              <p className="text-xs text-blue-700 dark:text-blue-500 mt-1">{macroBalance.protein}%</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Carbs</p>
              <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{weeklyStats.avgCarbs}g</p>
              <p className="text-xs text-orange-700 dark:text-orange-500 mt-1">{macroBalance.carbs}%</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fats</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{weeklyStats.avgFats}g</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">{macroBalance.fats}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Distribution */}
      <div className="px-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Macro Distribution</h2>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Protein</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{macroBalance.protein}%</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                  style={{ width: `${macroBalance.protein}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended: 15-30% {macroBalance.protein >= 15 && macroBalance.protein <= 30 ? '✓' : ''}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Carbohydrates</span>
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">{macroBalance.carbs}%</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                  style={{ width: `${macroBalance.carbs}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended: 45-65% {macroBalance.carbs >= 45 && macroBalance.carbs <= 65 ? '✓' : ''}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Fats</span>
                <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{macroBalance.fats}%</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                  style={{ width: `${macroBalance.fats}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended: 20-35% {macroBalance.fats >= 20 && macroBalance.fats <= 35 ? '✓' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-5">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">Insights</h3>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
                {consistency >= 80 && <li>✓ Great job staying consistent with logging!</li>}
                {consistency < 50 && <li>• Try to log meals more consistently for better insights</li>}
                {calorieStatus.status === 'Excellent' && <li>✓ Your calorie intake is perfectly on target</li>}
                {macroBalance.protein >= 15 && macroBalance.protein <= 30 && <li>✓ Protein intake is in the healthy range</li>}
                {macroBalance.protein < 15 && <li>• Consider increasing protein intake</li>}
                {macroBalance.fats > 35 && <li>• Fat intake is a bit high - try lean proteins</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Progress Link */}
      <div className="px-6 mb-6">
        <button
          onClick={() => navigate('/app/history')}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl p-6 hover:shadow-xl transition-all active:scale-95"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg mb-1">View Full History</h3>
                <p className="text-sm text-purple-100">See your complete nutrition logs</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}