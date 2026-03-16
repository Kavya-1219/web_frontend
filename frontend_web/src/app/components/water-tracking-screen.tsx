import { useState, useEffect } from "react";
import { Droplets, Plus, Minus, Target, TrendingUp, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface WaterLog {
  amount: number;
  timestamp: string;
}

export function WaterTrackingScreen() {
  const [todayWater, setTodayWater] = useState(0);
  const [targetWater, setTargetWater] = useState(2000);
  const [glassSize, setGlassSize] = useState(250);
  const [weeklyAverage, setWeeklyAverage] = useState(0);

  useEffect(() => {
    calculateTarget();
    loadTodayWater();
    calculateWeeklyAverage();
  }, []);

  const calculateTarget = () => {
    const bodyDetails = JSON.parse(localStorage.getItem('bodyDetails') || '{}');
    const weight = parseFloat(bodyDetails.weight) || 70;
    const target = Math.round(weight * 35); // 35ml per kg
    setTargetWater(target);
  };

  const loadTodayWater = () => {
    const today = new Date().toDateString();
    const email = localStorage.getItem('currentUserEmail');
    const logs = JSON.parse(localStorage.getItem(`waterLogs_${email}`) || '[]');
    
    const todayLogs = logs.filter((log: WaterLog) => 
      new Date(log.timestamp).toDateString() === today
    );
    
    const total = todayLogs.reduce((sum: number, log: WaterLog) => sum + log.amount, 0);
    setTodayWater(total);
  };

  const calculateWeeklyAverage = () => {
    const email = localStorage.getItem('currentUserEmail');
    const logs = JSON.parse(localStorage.getItem(`waterLogs_${email}`) || '[]');
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weekLogs = logs.filter((log: WaterLog) => 
      new Date(log.timestamp) >= sevenDaysAgo
    );
    
    // Group by date
    const dailyTotals: { [key: string]: number } = {};
    weekLogs.forEach((log: WaterLog) => {
      const date = new Date(log.timestamp).toDateString();
      dailyTotals[date] = (dailyTotals[date] || 0) + log.amount;
    });
    
    const days = Object.keys(dailyTotals).length;
    const total = Object.values(dailyTotals).reduce((sum, amount) => sum + amount, 0);
    setWeeklyAverage(days > 0 ? Math.round(total / days) : 0);
  };

  const addWater = (amount: number) => {
    const email = localStorage.getItem('currentUserEmail');
    const logs = JSON.parse(localStorage.getItem(`waterLogs_${email}`) || '[]');
    
    logs.push({
      amount,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(`waterLogs_${email}`, JSON.stringify(logs));
    setTodayWater(prev => prev + amount);
    calculateWeeklyAverage();
  };

  const removeWater = () => {
    if (todayWater >= glassSize) {
      const email = localStorage.getItem('currentUserEmail');
      const logs = JSON.parse(localStorage.getItem(`waterLogs_${email}`) || '[]');
      const today = new Date().toDateString();
      
      // Find and remove the most recent log from today
      for (let i = logs.length - 1; i >= 0; i--) {
        if (new Date(logs[i].timestamp).toDateString() === today) {
          logs.splice(i, 1);
          break;
        }
      }
      
      localStorage.setItem(`waterLogs_${email}`, JSON.stringify(logs));
      setTodayWater(prev => Math.max(0, prev - glassSize));
      calculateWeeklyAverage();
    }
  };

  const progress = Math.min((todayWater / targetWater) * 100, 100);
  const glassesCount = Math.floor(todayWater / glassSize);
  const targetGlasses = Math.ceil(targetWater / glassSize);

  const getMotivationMessage = () => {
    const percentage = (todayWater / targetWater) * 100;
    if (percentage >= 100) return "🎉 Excellent! You've met your hydration goal!";
    if (percentage >= 75) return "💧 Almost there! Keep it up!";
    if (percentage >= 50) return "👍 Good progress! You're halfway there!";
    if (percentage >= 25) return "💪 Keep going! Every glass counts!";
    return "🌟 Start your hydration journey today!";
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-blue-900/20 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-700 dark:to-cyan-700 pt-8 pb-20 px-6 rounded-b-[2rem]">
        <div className="flex items-center space-x-3 mb-3">
          <ArrowLeft className="w-8 h-8 text-white cursor-pointer" onClick={() => navigate('/app')} />
          <Droplets className="w-8 h-8 text-white" />
          <h1 className="text-2xl text-white font-semibold">Water Tracking</h1>
        </div>
        <p className="text-blue-50">Stay hydrated, stay healthy!</p>
      </div>

      {/* Main Card */}
      <div className="px-6 -mt-12 space-y-6">
        {/* Progress Circle */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#E0F2FE"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="w-12 h-12 text-blue-500 mb-2" />
                <p className="text-4xl font-bold text-gray-800 dark:text-white">{todayWater}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">ml / {targetWater}ml</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">{Math.round(progress)}%</p>
              </div>
            </div>
          </div>

          {/* Glasses Count */}
          <div className="text-center mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Today's Progress</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {glassesCount} / {targetGlasses} glasses
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">({glassSize}ml per glass)</p>
          </div>

          {/* Motivation Message */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6">
            <p className="text-center text-blue-800 dark:text-blue-300 font-medium">
              {getMotivationMessage()}
            </p>
          </div>

          {/* Glass Size Selector */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">Glass Size</p>
            <div className="grid grid-cols-3 gap-3">
              {[200, 250, 300, 350, 400, 500].map((size) => (
                <button
                  key={size}
                  onClick={() => setGlassSize(size)}
                  className={`py-3 rounded-xl border-2 transition ${
                    glassSize === size
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                  }`}
                >
                  {size}ml
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={removeWater}
              disabled={todayWater === 0}
              className={`flex-1 py-4 rounded-xl transition flex items-center justify-center space-x-2 ${
                todayWater > 0
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Minus className="w-6 h-6" />
              <span className="font-medium">Remove</span>
            </button>
            
            <button
              onClick={() => addWater(glassSize)}
              className="flex-[2] py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center space-x-2"
            >
              <Plus className="w-6 h-6" />
              <span className="font-medium">Add {glassSize}ml</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-green-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Daily Goal</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{targetWater}ml</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{targetGlasses} glasses</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">7-Day Avg</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{weeklyAverage}ml</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {Math.round((weeklyAverage / targetWater) * 100)}% of goal
            </p>
          </div>
        </div>

        {/* Benefits Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h3 className="font-semibold text-gray-800 dark:text-white">Benefits of Hydration</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <span className="text-blue-500 mt-0.5">💧</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Boosts metabolism</strong> - Helps burn more calories
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-blue-500 mt-0.5">💧</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Reduces appetite</strong> - Helps with weight management
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-blue-500 mt-0.5">💧</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Improves skin</strong> - Keeps skin hydrated and glowing
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-blue-500 mt-0.5">💧</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Better digestion</strong> - Aids nutrient absorption
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}