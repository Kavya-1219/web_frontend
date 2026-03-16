import { useState, useEffect } from "react";
import { Footprints, Plus, Target, TrendingUp, Calendar, ArrowLeft, Award, Flame } from "lucide-react";
import { useNavigate } from "react-router";

interface StepsLog {
  steps: number;
  timestamp: string;
}

export function StepsTrackingScreen() {
  const [todaySteps, setTodaySteps] = useState(0);
  const [targetSteps, setTargetSteps] = useState(10000);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [manualSteps, setManualSteps] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadTodaySteps();
    calculateWeeklyAverage();
    loadTargetSteps();
  }, []);

  const loadTargetSteps = () => {
    const email = localStorage.getItem('currentUserEmail');
    const saved = localStorage.getItem(`stepsTarget_${email}`);
    if (saved) setTargetSteps(parseInt(saved));
  };

  const loadTodaySteps = () => {
    const today = new Date().toDateString();
    const email = localStorage.getItem('currentUserEmail');
    const logs = JSON.parse(localStorage.getItem(`stepsLogs_${email}`) || '[]');
    
    const todayLogs = logs.filter((log: StepsLog) => 
      new Date(log.timestamp).toDateString() === today
    );
    
    const total = todayLogs.reduce((sum: number, log: StepsLog) => sum + log.steps, 0);
    setTodaySteps(total);
  };

  const calculateWeeklyAverage = () => {
    const email = localStorage.getItem('currentUserEmail');
    const logs = JSON.parse(localStorage.getItem(`stepsLogs_${email}`) || '[]');
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weekLogs = logs.filter((log: StepsLog) => 
      new Date(log.timestamp) >= sevenDaysAgo
    );
    
    // Group by date
    const dailyTotals: { [key: string]: number } = {};
    weekLogs.forEach((log: StepsLog) => {
      const date = new Date(log.timestamp).toDateString();
      dailyTotals[date] = (dailyTotals[date] || 0) + log.steps;
    });
    
    const days = Object.keys(dailyTotals).length;
    const total = Object.values(dailyTotals).reduce((sum, steps) => sum + steps, 0);
    setWeeklyAverage(days > 0 ? Math.round(total / days) : 0);
  };

  const addSteps = (steps: number) => {
    const email = localStorage.getItem('currentUserEmail');
    const logs = JSON.parse(localStorage.getItem(`stepsLogs_${email}`) || '[]');
    
    logs.push({
      steps,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(`stepsLogs_${email}`, JSON.stringify(logs));
    setTodaySteps(prev => prev + steps);
    calculateWeeklyAverage();
  };

  const handleManualAdd = () => {
    const steps = parseInt(manualSteps);
    if (steps > 0 && steps <= 50000) {
      addSteps(steps);
      setManualSteps("");
      setShowAddModal(false);
    }
  };

  const updateTarget = (newTarget: number) => {
    const email = localStorage.getItem('currentUserEmail');
    localStorage.setItem(`stepsTarget_${email}`, String(newTarget));
    setTargetSteps(newTarget);
  };

  const progress = Math.min((todaySteps / targetSteps) * 100, 100);
  const caloriesBurned = Math.round(todaySteps * 0.04); // ~0.04 calories per step
  const distanceKm = (todaySteps * 0.000762).toFixed(2); // ~0.762 meters per step

  const getMotivationMessage = () => {
    const percentage = (todaySteps / targetSteps) * 100;
    if (percentage >= 100) return "🏆 Amazing! You've crushed your goal!";
    if (percentage >= 75) return "🔥 So close! Just a bit more!";
    if (percentage >= 50) return "💪 Halfway there! Keep moving!";
    if (percentage >= 25) return "👟 Great start! Every step counts!";
    return "🌟 Let's get moving today!";
  };

  const getAchievementLevel = () => {
    if (todaySteps >= 15000) return { title: "Super Active", color: "text-purple-600", bg: "bg-purple-50" };
    if (todaySteps >= 10000) return { title: "Very Active", color: "text-green-600", bg: "bg-green-50" };
    if (todaySteps >= 7500) return { title: "Active", color: "text-blue-600", bg: "bg-blue-50" };
    if (todaySteps >= 5000) return { title: "Moderate", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { title: "Getting Started", color: "text-gray-600", bg: "bg-gray-50" };
  };

  const achievement = getAchievementLevel();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900/20 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-700 dark:to-emerald-700 pt-8 pb-20 px-6 rounded-b-[2rem]">
        <div className="flex items-center space-x-3 mb-3">
          <ArrowLeft className="w-8 h-8 text-white cursor-pointer" onClick={() => navigate('/app')} />
          <Footprints className="w-8 h-8 text-white" />
          <h1 className="text-2xl text-white font-semibold">Steps Tracking</h1>
        </div>
        <p className="text-green-50">Every step brings you closer!</p>
      </div>

      {/* Main Card */}
      <div className="px-6 -mt-12 space-y-6">
        {/* Progress Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#D1FAE5"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#stepsGradient)"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="stepsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Footprints className="w-12 h-12 text-green-500 mb-2" />
                <p className="text-4xl font-bold text-gray-800 dark:text-white">{todaySteps.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">steps</p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">{Math.round(progress)}%</p>
              </div>
            </div>
          </div>

          {/* Achievement Badge */}
          <div className={`${achievement.bg} dark:bg-opacity-20 border-2 border-current rounded-2xl p-4 mb-6`}>
            <div className="flex items-center justify-center space-x-2">
              <Award className={`w-6 h-6 ${achievement.color}`} />
              <p className={`font-semibold ${achievement.color}`}>{achievement.title}</p>
            </div>
          </div>

          {/* Motivation Message */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-4 mb-6">
            <p className="text-center text-green-800 dark:text-green-300 font-medium">
              {getMotivationMessage()}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
              <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800 dark:text-white">{caloriesBurned}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">kcal</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
              <Target className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800 dark:text-white">{distanceKm}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">km</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center">
              <TrendingUp className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800 dark:text-white">{weeklyAverage.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">7-day avg</p>
            </div>
          </div>

          {/* Target Selector */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">Daily Goal</p>
            <div className="grid grid-cols-3 gap-3">
              {[5000, 8000, 10000, 12000, 15000].map((target) => (
                <button
                  key={target}
                  onClick={() => updateTarget(target)}
                  className={`py-3 rounded-xl border-2 transition ${
                    targetSteps === target
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-300'
                  }`}
                >
                  <p className="font-semibold">{(target / 1000).toFixed(0)}k</p>
                </button>
              ))}
            </div>
          </div>

          {/* Add Steps Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center space-x-2"
          >
            <Plus className="w-6 h-6" />
            <span className="font-medium">Add Steps</span>
          </button>
        </div>

        {/* Tips Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <span>💡</span>
            <span>Tips to Increase Steps</span>
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <span className="text-green-500 mt-0.5">👟</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Take the stairs instead of elevators
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-green-500 mt-0.5">👟</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Park farther away from entrances
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-green-500 mt-0.5">👟</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Take short walking breaks every hour
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-green-500 mt-0.5">👟</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Walk while talking on the phone
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Add Steps Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white dark:bg-gray-800 rounded-t-3xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Add Steps</h2>
            
            <input
              type="number"
              value={manualSteps}
              onChange={(e) => setManualSteps(e.target.value)}
              placeholder="Enter number of steps"
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-green-500 focus:outline-none text-lg mb-4"
              autoFocus
            />

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1000, 2500, 5000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setManualSteps(String(preset))}
                  className="py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  +{preset}
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setManualSteps("");
                }}
                className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleManualAdd}
                disabled={!manualSteps || parseInt(manualSteps) <= 0}
                className={`flex-1 py-4 rounded-xl transition ${
                  manualSteps && parseInt(manualSteps) > 0
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add Steps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}