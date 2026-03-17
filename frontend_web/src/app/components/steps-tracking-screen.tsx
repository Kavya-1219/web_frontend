import { useState, useEffect } from "react";
import { Footprints, Plus, Target, TrendingUp, Calendar, ArrowLeft, Award, Flame, Trash2, List, Minus, X } from "lucide-react";
import { useNavigate } from "react-router";
import api, { endpoints } from "../helpers/api";

interface StepsLog {
  steps: number;
  timestamp: string;
  id: string;
  source: 'manual' | 'auto';
}

export function StepsTrackingScreen() {
  const [todaySteps, setTodaySteps] = useState(0);
  const [targetSteps, setTargetSteps] = useState(10000);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [manualSteps, setManualSteps] = useState("");
  const [removeSteps, setRemoveSteps] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [todayLogs, setTodayLogs] = useState<StepsLog[]>([]);
  const [autoTracking, setAutoTracking] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStepsData();
    loadAutoTrackingSetting();
    startAutoTracking();
  }, []);

  const fetchStepsData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/steps/");
      if (response.data) {
        setTodaySteps(response.data.todays_steps || 0);
        setTargetSteps(response.data.daily_step_goal || 10000);
      }
    } catch (error) {
      console.error("Steps fetch failed:", error);
      loadTargetSteps();
      loadTodaySteps();
    } finally {
      setIsLoading(false);
    }
    calculateWeeklyAverage();
  };

  useEffect(() => {
    if (autoTracking) {
      const interval = setInterval(() => {
        addAutoSteps();
      }, 300000);
      return () => clearInterval(interval);
    }
  }, [autoTracking]);

  const loadAutoTrackingSetting = () => {
    const email = localStorage.getItem('currentUserEmail');
    const saved = localStorage.getItem(`autoTracking_${email}`);
    if (saved === 'true') setAutoTracking(true);
  };

  const toggleAutoTracking = () => {
    const email = localStorage.getItem('currentUserEmail');
    const newValue = !autoTracking;
    setAutoTracking(newValue);
    localStorage.setItem(`autoTracking_${email}`, String(newValue));
    
    if (newValue) {
      localStorage.setItem(`lastAutoTrack_${email}`, String(Date.now()));
      addAutoSteps();
    }
  };

  const addAutoSteps = async () => {
    const randomSteps = Math.floor(Math.random() * 150) + 50;
    try {
      const response = await api.post("/steps/", { step_count: randomSteps });
      if (response.data) {
        setTodaySteps(response.data.todays_steps);
      }
    } catch (error) {
      console.error("Auto tracking backend sync failed:", error);
      const email = localStorage.getItem('currentUserEmail');
      const logs = JSON.parse(localStorage.getItem(`stepsLogs_${email}`) || '[]');
      logs.push({
        steps: randomSteps,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        source: 'auto'
      });
      localStorage.setItem(`stepsLogs_${email}`, JSON.stringify(logs));
      loadTodaySteps();
    }
    calculateWeeklyAverage();
    window.dispatchEvent(new Event('storage'));
  };

  const startAutoTracking = () => {
    const email = localStorage.getItem('currentUserEmail');
    const saved = localStorage.getItem(`autoTracking_${email}`);
    if (saved === 'true') {
      const lastCheck = localStorage.getItem(`lastAutoTrack_${email}`);
      const now = Date.now();
      
      if (lastCheck) {
        const timeDiff = now - parseInt(lastCheck);
        const intervals = Math.floor(timeDiff / 300000);
        
        if (intervals > 0 && intervals < 100) {
          const logs = JSON.parse(localStorage.getItem(`stepsLogs_${email}`) || '[]');
          
          for (let i = 0; i < intervals; i++) {
            const randomSteps = Math.floor(Math.random() * 150) + 50;
            logs.push({
              steps: randomSteps,
              timestamp: new Date(parseInt(lastCheck) + (i * 300000)).toISOString(),
              id: `${Date.now()}_${i}`,
              source: 'auto'
            });
            // We don't sync all catch-up steps to backend for now to avoid multiple requests
          }
          
          localStorage.setItem(`stepsLogs_${email}`, JSON.stringify(logs));
          loadTodaySteps();
          calculateWeeklyAverage();
        }
      }
      
      localStorage.setItem(`lastAutoTrack_${email}`, String(now));
    }
  };

  const loadTargetSteps = () => {
    const email = localStorage.getItem('currentUserEmail');
    const saved = localStorage.getItem(`stepsTarget_${email}`);
    if (saved) setTargetSteps(parseInt(saved));
  };

  const loadTodaySteps = () => {
    const today = new Date().toDateString();
    const email = localStorage.getItem('currentUserEmail');
    const logs: StepsLog[] = JSON.parse(localStorage.getItem(`stepsLogs_${email}`) || '[]');
    
    const todayLogs = logs.filter((log) => 
      new Date(log.timestamp).toDateString() === today
    );
    
    const total = todayLogs.reduce((sum, log) => sum + log.steps, 0);
    setTodaySteps(total);
    setTodayLogs(todayLogs);
  };

  const calculateWeeklyAverage = () => {
    const email = localStorage.getItem('currentUserEmail');
    const logs: StepsLog[] = JSON.parse(localStorage.getItem(`stepsLogs_${email}`) || '[]');
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weekLogs = logs.filter((log) => 
      new Date(log.timestamp) >= sevenDaysAgo
    );
    
    const dailyTotals: { [key: string]: number } = {};
    weekLogs.forEach((log) => {
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
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
      source: 'manual'
    });
    
    localStorage.setItem(`stepsLogs_${email}`, JSON.stringify(logs));
    loadTodaySteps();
    calculateWeeklyAverage();
    window.dispatchEvent(new Event('storage'));
  };

  const removeStepsLog = (logId: string) => {
    const email = localStorage.getItem('currentUserEmail');
    const logs: StepsLog[] = JSON.parse(localStorage.getItem(`stepsLogs_${email}`) || '[]');
    
    const filteredLogs = logs.filter(log => log.id !== logId);
    localStorage.setItem(`stepsLogs_${email}`, JSON.stringify(filteredLogs));
    loadTodaySteps();
    calculateWeeklyAverage();
    window.dispatchEvent(new Event('storage'));
  };

  const handleManualAdd = () => {
    const steps = parseInt(manualSteps);
    if (steps > 0 && steps <= 50000) {
      addSteps(steps);
      setManualSteps("");
      setShowAddModal(false);
      setMessageText(`✅ ${steps.toLocaleString()} steps added successfully!`);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const updateTarget = (newTarget: number) => {
    const email = localStorage.getItem('currentUserEmail');
    localStorage.setItem(`stepsTarget_${email}`, String(newTarget));
    setTargetSteps(newTarget);
  };

  // Get user weight for accurate calorie calculation
  const bodyDetails = JSON.parse(localStorage.getItem('bodyDetails') || '{}');
  const userWeight = parseFloat(bodyDetails.weight) || 70; // default 70kg if not available

  const progress = Math.min((todaySteps / targetSteps) * 100, 100);
  // Use weight-based calculation: (steps / 1000) × (weight_kg × 0.4)
  const caloriesBurned = Math.round((todaySteps / 1000) * (userWeight * 0.4));
  const distanceKm = (todaySteps * 0.000762).toFixed(2);

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
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-700 dark:to-emerald-700 pt-8 pb-20 px-6 rounded-b-[2rem]">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <ArrowLeft className="w-8 h-8 text-white cursor-pointer" onClick={() => navigate('/app')} />
              <Footprints className="w-8 h-8 text-white" />
              <h1 className="text-2xl text-white font-semibold">Steps Tracking</h1>
            </div>
            <button
              onClick={() => setShowLogsModal(true)}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition"
            >
              <List className="w-6 h-6 text-white" />
            </button>
          </div>
          <p className="text-green-50">Every step brings you closer!</p>
        </div>
      </div>

      <div className="px-6 -mt-12 space-y-6">
        {/* Auto-Tracking Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl ${autoTracking ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
                <Footprints className={`w-6 h-6 ${autoTracking ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">Auto-Tracking</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {autoTracking ? 'Tracking active' : 'Enable to track automatically'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleAutoTracking}
              className={`relative w-14 h-8 rounded-full transition ${
                autoTracking ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  autoTracking ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle cx="96" cy="96" r="88" stroke="#D1FAE5" strokeWidth="16" fill="none" />
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

          <div className={`${achievement.bg} dark:bg-opacity-20 border-2 border-current rounded-2xl p-4 mb-6`}>
            <div className="flex items-center justify-center space-x-2">
              <Award className={`w-6 h-6 ${achievement.color}`} />
              <p className={`font-semibold ${achievement.color}`}>{achievement.title}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-4 mb-6">
            <p className="text-center text-green-800 dark:text-green-300 font-medium">
              {getMotivationMessage()}
            </p>
          </div>

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

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center space-x-2 mb-3"
          >
            <Plus className="w-6 h-6" />
            <span className="font-medium">Add Steps</span>
          </button>
          
          <button
            onClick={() => setShowRemoveModal(true)}
            className="w-full py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center space-x-2"
          >
            <Minus className="w-6 h-6" />
            <span className="font-medium">Remove Steps</span>
          </button>
        </div>

        {/* Tips Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <span>💡</span>
            <span>Tips to Increase Steps</span>
          </h3>
          <ul className="space-y-3">
            {[
              "Take the stairs instead of elevators",
              "Park farther away from entrances",
              "Take short walking breaks every hour",
              "Walk while talking on the phone"
            ].map((tip, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <span className="text-green-500 mt-0.5">👟</span>
                <p className="text-sm text-gray-600 dark:text-gray-300">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Add Steps Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white dark:bg-gray-800 rounded-t-3xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Add Steps Manually</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Be genuine 😊 Manual entry is only for times you walked without your phone.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Adding fake steps is like faking yourself — not others.
            </p>
            
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Number of steps</label>
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
                className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleManualAdd}
                disabled={!manualSteps || parseInt(manualSteps) <= 0}
                className={`flex-1 py-4 rounded-xl transition font-medium ${
                  manualSteps && parseInt(manualSteps) > 0
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Today's Steps Logs</h2>
            
            {todayLogs.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No steps recorded today</p>
            ) : (
              <div className="space-y-3 mb-6">
                {todayLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Footprints className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{log.steps.toLocaleString()} steps</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString()} • {log.source === 'auto' ? 'Auto' : 'Manual'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeStepsLog(log.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowLogsModal(false)}
              className="w-full py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Remove Steps Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white dark:bg-gray-800 rounded-t-3xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Remove Steps</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Use this only if you accidentally added extra steps.
            </p>
            
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Steps to remove</label>
            <input
              type="number"
              value={removeSteps}
              onChange={(e) => setRemoveSteps(e.target.value)}
              placeholder="Enter number of steps"
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-red-500 focus:outline-none text-lg mb-6"
              autoFocus
            />

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRemoveModal(false);
                  setRemoveSteps("");
                }}
                className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const steps = parseInt(removeSteps);
                  if (steps > 0 && steps <= todaySteps) {
                    const email = localStorage.getItem('currentUserEmail');
                    const logs = JSON.parse(localStorage.getItem(`stepsLogs_${email}`) || '[]');
                    
                    // Add a negative entry to remove steps
                    logs.push({
                      steps: -steps,
                      timestamp: new Date().toISOString(),
                      id: Date.now().toString(),
                      source: 'manual'
                    });
                    
                    localStorage.setItem(`stepsLogs_${email}`, JSON.stringify(logs));
                    loadTodaySteps();
                    calculateWeeklyAverage();
                    window.dispatchEvent(new Event('storage'));
                    setRemoveSteps("");
                    setShowRemoveModal(false);
                    setMessageText(`✅ ${steps.toLocaleString()} steps removed successfully!`);
                    setShowMessage(true);
                    setTimeout(() => setShowMessage(false), 3000);
                  }
                }}
                disabled={!removeSteps || parseInt(removeSteps) <= 0 || parseInt(removeSteps) > todaySteps}
                className={`flex-1 py-4 rounded-xl transition ${
                  removeSteps && parseInt(removeSteps) > 0 && parseInt(removeSteps) <= todaySteps
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Snackbar */}
      {showMessage && (
        <div className="fixed bottom-4 left-4 right-4 bg-green-500 text-white px-4 py-3 rounded shadow-md flex items-center justify-between z-50">
          <p className="text-sm">{messageText}</p>
          <button
            onClick={() => setShowMessage(false)}
            className="text-white hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}