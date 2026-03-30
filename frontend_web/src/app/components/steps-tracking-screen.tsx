import { useState, useEffect } from "react";
import { Footprints, Plus, Minus, Target, TrendingUp, Flame, Map, Settings, Info, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import api, { endpoints } from "../helpers/api";
import { CommonHeader } from "./common-header";

export function StepsTrackingScreen() {
  const [todaySteps, setTodaySteps] = useState(0);
  const [targetSteps, setTargetSteps] = useState(10000);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [autoTracking, setAutoTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userWeight, setUserWeight] = useState(70);
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualStepsInput, setManualStepsInput] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchStepsData();

    const handleRefresh = () => fetchStepsData();
    window.addEventListener('refreshDashboard', handleRefresh);
    return () => window.removeEventListener('refreshDashboard', handleRefresh);
  }, []);

  const fetchStepsData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(endpoints.stepsToday);
      if (response.data) {
        setTodaySteps(response.data.todaysSteps || response.data.todays_steps || response.data.total_steps || 0);
        setTargetSteps(response.data.daily_step_goal || 10000);
      }
      
      const weeklyResponse = await api.get(endpoints.stepsWeekly);
      if (weeklyResponse.data) {
        setWeeklyAverage(weeklyResponse.data.avg_7_day || 0);
      }

      const profileResponse = await api.get(endpoints.profile);
      if (profileResponse.data) {
        setUserWeight(profileResponse.data.weight || profileResponse.data.currentWeight || 70);
      }
    } catch (error) {
      console.error("Steps fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncSteps = async (delta: number) => {
    try {
      const response = await api.post(endpoints.stepsManualLog, { 
        delta_steps: delta,
        steps: delta // Some backend versions might expect 'steps'
      });
      if (response.data) {
        const updatedSteps = response.data.todaysSteps || 
                           response.data.todays_steps || 
                           response.data.total_steps || 
                           response.data.steps || 0;
        setTodaySteps(updatedSteps);
        const { dispatchRefresh } = await import("../helpers/api");
        dispatchRefresh();
      }
    } catch (error) {
      console.error("Steps sync failed:", error);
    }
  };

  const handleAddSteps = () => {
    const val = parseInt(manualStepsInput);
    if (!isNaN(val) && val > 0) {
      syncSteps(val);
      setManualStepsInput("");
      setShowAddModal(false);
    }
  };

  const progress = Math.min((todaySteps / targetSteps) * 100, 100);
  const caloriesBurned = Math.round((todaySteps / 1000) * (userWeight * 0.4));
  const distanceKm = (todaySteps * 0.000762).toFixed(2);

  const getAchievement = () => {
    if (todaySteps >= 15000) return "Super Active";
    if (todaySteps >= 10000) return "Very Active";
    if (todaySteps >= 7500) return "Active";
    return "Getting Started";
  };

  if (isLoading && todaySteps === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-steps-gradient"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <CommonHeader 
        title="Steps Tracking" 
        subtitle="Every step brings you closer!"
        gradientClass="bg-steps-gradient"
        icon={<Footprints className="w-10 h-10 text-white/90" />}
      />

      <div className="max-w-4xl mx-auto px-6">
        <div className="relative -mt-32 z-20 space-y-8">
          
          {/* Auto Tracking Card */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${autoTracking ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-400'}`}>
                   <Settings className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-black text-gray-900 dark:text-white">Auto Tracking</h3>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {autoTracking ? 'Tracking is ON' : 'Enable for auto logs'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setAutoTracking(!autoTracking)}
                className={`relative w-14 h-8 rounded-full transition-colors ${autoTracking ? 'bg-success-green' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${autoTracking ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>

          {/* Progress Card (Android Style) */}
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl p-10 flex flex-col items-center border border-gray-100 dark:border-gray-700">
            <div className="relative w-64 h-64 mb-8">
              <svg className="transform -rotate-90 w-64 h-64">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#F3E8FF"
                  strokeWidth="20"
                  fill="none"
                  className="dark:stroke-gray-700"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="url(#steps-gradient-svg)"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 110}`}
                  strokeDashoffset={`${2 * Math.PI * 110 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="steps-gradient-svg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00C853" />
                    <stop offset="100%" stopColor="#B2FF59" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{todaySteps.toLocaleString()}</p>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">steps</p>
                <p className="text-success-green font-black text-lg mt-1">{Math.round(progress)}%</p>
              </div>
            </div>

            <div className="w-full bg-green-50 dark:bg-green-900/20 border-2 border-green-100 dark:border-green-800 rounded-3xl p-5 flex items-center justify-center gap-3">
              <span className="text-2xl">🏅</span>
              <p className="text-success-green font-black uppercase tracking-widest text-lg">{getAchievement()}</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
             <StatBox icon={<Flame className="w-6 h-6 text-warning-orange" />} value={caloriesBurned} label="kcal" />
             <StatBox icon={<Map className="w-6 h-6 text-blue-500" />} value={distanceKm} label="km" />
             <StatBox icon={<TrendingUp className="w-6 h-6 text-success-green" />} value={weeklyAverage} label="7-day avg" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
               onClick={() => syncSteps(-1000)}
               disabled={todaySteps < 1000}
               className="flex-1 py-5 rounded-[2rem] bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-400 font-black uppercase tracking-widest hover:border-red-200 hover:text-red-500 transition-all flex items-center justify-center gap-2"
            >
              <Minus className="w-5 h-5" />
              Remove
            </button>
            <button
               onClick={() => setShowAddModal(true)}
               className="flex-[2] py-5 rounded-[2rem] bg-gradient-to-r from-success-green to-emerald-500 text-white font-black uppercase tracking-widest shadow-xl hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
              Add Steps
            </button>
          </div>

          {/* Tips Card */}
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700">
             <div className="flex items-center gap-3 mb-6">
                <Info className="w-6 h-6 text-success-green" />
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Tips to Increase Steps</h3>
             </div>
             <div className="space-y-4">
                {[
                  "Take the stairs instead of elevators",
                  "Park farther away from entrances",
                  "Take short walking breaks every hour",
                  "Walk while talking on the phone"
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl group hover:bg-green-50 transition-colors">
                     <CheckCircle2 className="w-5 h-5 text-gray-300 group-hover:text-success-green transition-colors" />
                     <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{tip}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Add Steps Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Manual Log</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-8">Be genuine, every step counts!</p>
            
            <input 
              type="number"
              value={manualStepsInput}
              onChange={(e) => setManualStepsInput(e.target.value)}
              placeholder="Enter steps count"
              className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-6 text-3xl font-black text-center focus:border-success-green outline-none transition-colors mb-8"
              autoFocus
            />

            <div className="flex gap-4">
               <button 
                 onClick={() => setShowAddModal(false)}
                 className="flex-1 py-5 rounded-[1.5rem] font-black uppercase text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleAddSteps}
                 className="flex-[2] py-5 rounded-[1.5rem] font-black uppercase text-white bg-success-green shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-all"
               >
                 Log Steps
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center transform transition-transform hover:scale-105">
      <div className="mb-3">{icon}</div>
      <p className="text-xl font-black text-gray-900 dark:text-white leading-none">{value}</p>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}