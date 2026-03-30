import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Calendar, Apple, Flame, Utensils, History as HistoryIcon, LayoutGrid } from "lucide-react";
import api, { endpoints } from "../helpers/api";
import { CommonHeader } from "./common-header";

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

interface DayLog {
  date: string;
  label: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  foods: LoggedFood[];
}

export function HistoryScreen() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<DayLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();

    const handleRefresh = () => loadHistory();
    window.addEventListener('refreshDashboard', handleRefresh);
    return () => window.removeEventListener('refreshDashboard', handleRefresh);
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${endpoints.foodHistory}?days=30`);
      if (response.data && response.data.results) {
        processLogs(response.data.results.map((log: any) => {
          // Robust mapping for different backend versions
          const quantity = log.quantity || 1;
          const calPerUnit = log.calories_per_unit || (log.calories / quantity) || log.calories || 0;
          const protPerUnit = log.protein_per_unit || (log.protein / quantity) || log.protein || 0;
          const carbPerUnit = log.carbs_per_unit || (log.carbs / quantity) || log.carbs || 0;
          const fatPerUnit = log.fats_per_unit || (log.fats / quantity) || log.fats || 0;

          return {
            name: log.name || log.food_name || "Unknown Food",
            calories: calPerUnit,
            protein: protPerUnit,
            carbs: carbPerUnit,
            fats: fatPerUnit,
            quantity: quantity,
            unit: log.unit || "serving",
            timestamp: new Date(log.timestamp_millis || log.timestamp || Date.now()).toISOString()
          };
        }));
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const processLogs = (logs: LoggedFood[]) => {
    if (logs.length === 0) {
      setHistoryData([]);
      return;
    }

    const groupedByDate: { [key: string]: LoggedFood[] } = {};
    logs.forEach((log) => {
      // Use local date string for grouping
      const dateKey = new Date(log.timestamp).toLocaleDateString();
      if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
      groupedByDate[dateKey].push(log);
    });

    const dayLogs: DayLog[] = Object.entries(groupedByDate).map(([date, foods]) => {
      const totalCalories = foods.reduce((sum, food) => sum + (food.calories * food.quantity), 0);
      const totalProtein = foods.reduce((sum, food) => sum + (food.protein * food.quantity), 0);
      const totalCarbs = foods.reduce((sum, food) => sum + (food.carbs * food.quantity), 0);
      const totalFats = foods.reduce((sum, food) => sum + (food.fats * food.quantity), 0);

      return {
        date,
        label: formatDate(date),
        totalCalories: Math.round(totalCalories),
        totalProtein: Math.round(totalProtein),
        totalCarbs: Math.round(totalCarbs),
        totalFats: Math.round(totalFats),
        foods
      };
    });

    dayLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setHistoryData(dayLogs);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-steps-gradient"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <CommonHeader 
        title="History" 
        subtitle="Your nutrition journey"
        gradientClass="bg-steps-gradient"
        icon={<HistoryIcon className="w-10 h-10 text-white/90" />}
      />

      <div className="max-w-4xl mx-auto px-6 -mt-[140px] relative z-20">
        {/* Glassmorphic Summary Card */}
        <div className="mb-10 group">
          <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex justify-between items-center relative overflow-hidden transition-all hover:bg-white/15">
            <div className="relative z-10 text-center flex-1">
              <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Days Logged</p>
              <p className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">{historyData.length}</p>
            </div>
            
            {/* Divider */}
            <div className="h-16 w-px bg-white/20 mx-4 relative z-10" />

            <div className="relative z-10 text-center flex-1">
              <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total Meals</p>
              <p className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">
                {historyData.reduce((sum, day) => sum + day.foods.length, 0)}
              </p>
            </div>
            
            {/* Decorative inner glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {historyData.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
            <LayoutGrid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">No history found.</h3>
            <p className="text-gray-500 mt-2 italic">Start logging your meals to see them here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {historyData.map((day, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all hover:scale-[1.01]">
                {/* Day Header */}
                <div className="p-8 pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-success-green" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{day.label}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                       <Flame className="w-6 h-6 text-warning-orange" />
                       <span className="text-2xl font-black text-gray-900 dark:text-white">{day.totalCalories}</span>
                       <span className="text-sm font-bold text-gray-400 uppercase">kcal</span>
                    </div>
                  </div>
                  
                  <div className="h-px bg-gray-100 dark:bg-gray-700 mb-6" />

                  {/* Macro Chips Row (Android Style) */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <MacroChip title="Protein" value={`${day.totalProtein}g`} colorClass="bg-protein-blue/5 text-protein-blue border-protein-blue/10" />
                    <MacroChip title="Carbs" value={`${day.totalCarbs}g`} colorClass="bg-carbs-orange/5 text-carbs-orange border-carbs-orange/10" />
                    <MacroChip title="Fats" value={`${day.totalFats}g`} colorClass="bg-fats-yellow/5 text-fats-yellow border-fats-yellow/10" />
                  </div>

                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">LOGGED FOODS ({day.foods.length})</h4>
                  
                  {/* Food List */}
                  <div className="space-y-4">
                    {day.foods.map((food, fIdx) => (
                      <div key={fIdx} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:bg-green-50 transition-colors">
                            <Apple className="w-6 h-6 text-success-green" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 dark:text-white leading-tight">{food.name}</p>
                            <p className="text-[11px] font-bold text-gray-400 uppercase">{food.quantity} {food.unit}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-900 dark:text-white">
                            {Math.round(food.calories * food.quantity)}
                            <span className="text-[10px] ml-1 text-gray-400 uppercase">kcal</span>
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase font-mono">
                            {new Date(food.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-4 bg-gray-50 dark:bg-gray-900/50" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MacroChip({ title, value, colorClass }: { title: string; value: string; colorClass: string }) {
  return (
    <div className={`${colorClass} rounded-2xl p-4 flex flex-col items-center justify-center transition-all border hover:shadow-md active:scale-95`}>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{title}</p>
      <p className="text-base font-black leading-none">{value}</p>
    </div>
  );
}