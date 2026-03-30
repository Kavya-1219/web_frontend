import { useState, useEffect } from "react";
import { Moon, Sun, Plus, TrendingUp, Target, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import api, { endpoints } from "../helpers/api";

interface SleepLog {
  date: string;
  bedtime: string;
  wake_time: string;
  duration: string;
  duration_minutes: number;
  quality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
}

export function SleepTrackingScreen() {
  const navigate = useNavigate();
  const [todaySleep, setTodaySleep] = useState<number | null>(null);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sleepData, setSleepData] = useState({
    hours: "8",
    quality: "Good" as 'Poor' | 'Fair' | 'Good' | 'Excellent',
    bedtime: "22:00",
    wakeTime: "06:00"
  });

  const targetSleep = 8; // hours

  useEffect(() => {
    fetchSleepData();

    const handleRefresh = () => fetchSleepData();
    window.addEventListener('refreshDashboard', handleRefresh);
    return () => window.removeEventListener('refreshDashboard', handleRefresh);
  }, []);

  const fetchSleepData = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.sleepLogs);
      const { weekly_average_hours, logs } = response.data;
      
      setWeeklyAverage(weekly_average_hours);
      
      const today = new Date().toISOString().split('T')[0];
      const todayLog = logs.find((log: any) => log.date === today);
      if (todayLog) {
        setTodaySleep(Math.round(todayLog.duration_minutes / 60 * 10) / 10);
      } else {
        setTodaySleep(null);
      }
    } catch (error) {
      console.error("Error fetching sleep data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSleepLog = async () => {
    try {
      const hoursNum = parseFloat(sleepData.hours);
      const mins = Math.round(hoursNum * 60);
      const durationStr = `${Math.floor(hoursNum)}h ${Math.round((hoursNum % 1) * 60)}m`;
      
      const payload = {
        date: new Date().toISOString().split('T')[0],
        bedtime: sleepData.bedtime,
        wake_time: sleepData.wakeTime,
        duration: durationStr,
        duration_minutes: mins,
        quality: sleepData.quality
      };

      await api.post(endpoints.sleepLogs, payload);
      await fetchSleepData();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error saving sleep log:", error);
      alert("Failed to save sleep log. Please try again.");
    }
  };

  const getSleepQualityColor = (quality: string) => {
    const q = quality.toLowerCase();
    const colors = {
      poor: 'text-red-600 bg-red-50',
      fair: 'text-yellow-600 bg-yellow-50',
      good: 'text-green-600 bg-green-50',
      excellent: 'text-purple-600 bg-purple-50'
    };
    return colors[q as keyof typeof colors] || colors.good;
  };

  const getMotivationMessage = () => {
    if (!todaySleep) return "😴 Track your sleep to improve your health!";
    if (todaySleep >= 8) return "😊 Excellent! You got great sleep!";
    if (todaySleep >= 7) return "👍 Good job! You're well-rested!";
    if (todaySleep >= 6) return "⚠️ Try to get more sleep tonight!";
    return "😴 You need more sleep! Aim for 7-9 hours.";
  };

  const progress = todaySleep ? Math.min((todaySleep / targetSleep) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900/20 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 pt-8 pb-20 px-6 rounded-b-[2rem]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-3">
            <ArrowLeft className="w-8 h-8 text-white cursor-pointer" onClick={() => navigate('/app')} />
            <Moon className="w-8 h-8 text-white" />
            <h1 className="text-2xl text-white font-semibold">Sleep Tracking</h1>
          </div>
          <p className="text-indigo-50">Quality sleep for a healthier you</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 space-y-6">
        {/* Today's Sleep */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <Moon className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Last Night's Sleep</p>
            {todaySleep ? (
              <>
                <p className="text-5xl font-bold text-gray-800 dark:text-white mb-2">{todaySleep}</p>
                <p className="text-gray-500 dark:text-gray-400">hours</p>
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">{Math.round(progress)}% of target</p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-400 dark:text-gray-600 mb-2">--</p>
                <p className="text-gray-500 dark:text-gray-400">No data for today</p>
              </>
            )}
          </div>

          {/* Motivation */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 mb-6">
            <p className="text-center text-indigo-800 dark:text-indigo-300 font-medium">
              {getMotivationMessage()}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 text-center">
              <Target className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{targetSleep}h</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Daily Goal</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{weeklyAverage}h</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">7-Day Avg</p>
            </div>
          </div>

          {/* Add Sleep Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center space-x-2"
          >
            <Plus className="w-6 h-6" />
            <span className="font-medium">Log Sleep</span>
          </button>
        </div>

        {/* Sleep Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <Sun className="w-6 h-6 text-yellow-500" />
            <span>Benefits of Quality Sleep</span>
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <span className="text-indigo-500 mt-0.5">💤</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Hormone Regulation</strong> - Balances hunger hormones (ghrelin & leptin)
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-indigo-500 mt-0.5">💤</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Mental Clarity</strong> - Improves focus, memory, and decision-making
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-indigo-500 mt-0.5">💤</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Muscle Recovery</strong> - Essential for tissue repair and workout gains
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-indigo-500 mt-0.5">💤</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Mood & Stress</strong> - Reduces cortisol and improves emotional balance
              </p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-indigo-500 mt-0.5">💤</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Metabolic Health</strong> - Supports insulin sensitivity and fat metabolism
              </p>
            </li>
          </ul>
          <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3">
            <p className="text-xs text-indigo-700 dark:text-indigo-300 italic">
              💡 Note: Sleep doesn't burn "bonus" calories—BMR already includes sleep metabolism. Quality sleep supports weight management by regulating hunger hormones and reducing cravings.
            </p>
          </div>
        </div>

        {/* Sleep Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">💡 Better Sleep Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>• Maintain consistent sleep schedule</li>
            <li>• Avoid caffeine 6 hours before bed</li>
            <li>• Keep bedroom cool and dark</li>
            <li>• Limit screen time before sleep</li>
            <li>• Exercise regularly, but not before bed</li>
          </ul>
        </div>
      </div>

      {/* Add Sleep Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Log Sleep</h2>
            
            <div className="space-y-5">
              {/* Hours */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Hours of Sleep</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleepData.hours}
                  onChange={(e) => setSleepData({...sleepData, hours: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Bedtime & Wake Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Bedtime
                  </label>
                  <input
                    type="time"
                    value={sleepData.bedtime}
                    onChange={(e) => setSleepData({...sleepData, bedtime: e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Sun className="w-4 h-4 inline mr-1" />
                    Wake Time
                  </label>
                  <input
                    type="time"
                    value={sleepData.wakeTime}
                    onChange={(e) => setSleepData({...sleepData, wakeTime: e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-3">Sleep Quality</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Poor', 'Fair', 'Good', 'Excellent'] as const).map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setSleepData({...sleepData, quality})}
                      className={`py-3 px-4 rounded-xl border-2 capitalize transition ${
                        sleepData.quality === quality
                          ? `${getSleepQualityColor(quality)} border-current`
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={addSleepLog}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition"
              >
                Save Sleep Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}