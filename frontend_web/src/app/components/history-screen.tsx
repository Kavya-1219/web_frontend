import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Calendar, TrendingUp, TrendingDown, Apple, Flame, ArrowLeft } from "lucide-react";

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
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  foods: LoggedFood[];
}

export function HistoryScreen() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<DayLog[]>([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const email = localStorage.getItem('currentUserEmail');
    const logs = JSON.parse(localStorage.getItem(`foodLogs_${email}`) || '[]');

    if (logs.length === 0) {
      setHasData(false);
      return;
    }

    setHasData(true);

    // Group logs by date
    const groupedByDate: { [key: string]: LoggedFood[] } = {};
    
    logs.forEach((log: LoggedFood) => {
      const date = new Date(log.timestamp).toDateString();
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(log);
    });

    // Create day logs
    const dayLogs: DayLog[] = Object.entries(groupedByDate).map(([date, foods]) => {
      const totalCalories = foods.reduce((sum, food) => sum + (food.calories * food.quantity), 0);
      const totalProtein = foods.reduce((sum, food) => sum + (food.protein * food.quantity), 0);
      const totalCarbs = foods.reduce((sum, food) => sum + (food.carbs * food.quantity), 0);
      const totalFats = foods.reduce((sum, food) => sum + (food.fats * food.quantity), 0);

      return {
        date,
        totalCalories: Math.round(totalCalories),
        totalProtein: Math.round(totalProtein),
        totalCarbs: Math.round(totalCarbs),
        totalFats: Math.round(totalFats),
        foods
      };
    });

    // Sort by date (newest first)
    dayLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setHistoryData(dayLogs);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (!hasData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-700">
          <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Calendar className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">No History Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            Your nutrition journey is waiting to be written. Log your first meal to see it here!
          </p>
          <button 
            onClick={() => navigate("/app")}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all transform hover:scale-105"
          >
            Start Logging
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 pt-16 pb-40 px-6 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate(-1)}
              className="p-5 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-[1.5rem] text-white transition-all transform hover:scale-110 active:scale-90 border border-white/10 shadow-xl"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Nutrition History</h1>
              <p className="text-green-50 text-lg font-medium opacity-90">Deep dive into your past entries</p>
            </div>
          </div>
          
          <div className="flex space-x-6">
             <div className="bg-white/15 backdrop-blur-md px-8 py-5 rounded-[2rem] border border-white/10 flex flex-col items-center min-w-[120px]">
                <span className="text-white/70 text-xs font-black uppercase tracking-widest mb-2">Total Days</span>
                <span className="text-4xl font-black text-white leading-none tracking-tighter">{historyData.length}</span>
             </div>
             <div className="bg-white/15 backdrop-blur-md px-8 py-5 rounded-[2rem] border border-white/10 flex flex-col items-center min-w-[120px]">
                <span className="text-white/70 text-xs font-black uppercase tracking-widest mb-2">Total Meals</span>
                <span className="text-4xl font-black text-white leading-none tracking-tighter">
                  {historyData.reduce((sum, day) => sum + day.foods.length, 0)}
                </span>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-white rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-green-400 rounded-full blur-[100px]"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20">
        <div className="space-y-12">
          {historyData.map((dayLog, index) => (
            <div key={index} className="group flex flex-col lg:flex-row gap-10">
               {/* Date Section */}
               <div className="lg:w-48 flex-shrink-0 lg:pt-8">
                  <div className="flex lg:flex-col items-baseline lg:items-end justify-between lg:justify-start gap-2">
                    <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                      {formatDate(dayLog.date).split(' ')[0]}
                    </span>
                    <span className="text-sm font-black text-green-600 dark:text-green-400 uppercase tracking-[0.2em]">
                      {formatDate(dayLog.date).split(' ').slice(1).join(' ') || 'Log'}
                    </span>
                  </div>
                  <div className="hidden lg:block w-px h-full bg-gradient-to-b from-gray-200 via-gray-200 to-transparent dark:from-gray-700 dark:via-gray-700 ml-auto mr-6 mt-8 group-last:hidden"></div>
               </div>

               {/* Content Card */}
               <div className="flex-1 bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl transition-all duration-500 hover:translate-y-[-4px] border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                  <div className="p-10">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-10 pb-10 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-8">
                        <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-3xl flex flex-col items-center justify-center border border-orange-100 dark:border-orange-800/30 shadow-inner">
                          <Flame className="w-8 h-8 text-orange-500 mb-1" />
                          <span className="text-[10px] font-black text-orange-400 uppercase tracking-tighter">KCAL</span>
                        </div>
                        <div>
                          <p className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-2">{dayLog.totalCalories}</p>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Total Energy Intake</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-8 xl:min-w-[400px]">
                         <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-50 dark:border-blue-900/20 text-center">
                            <p className="text-xl font-black text-blue-600 dark:text-blue-400 mb-1">{dayLog.totalProtein}g</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Protein</p>
                         </div>
                         <div className="bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-50 dark:border-orange-900/20 text-center">
                            <p className="text-xl font-black text-orange-600 dark:text-orange-400 mb-1">{dayLog.totalCarbs}g</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Carbs</p>
                         </div>
                         <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-50 dark:border-amber-900/20 text-center">
                            <p className="text-xl font-black text-amber-600 dark:text-amber-400 mb-1">{dayLog.totalFats}g</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fats</p>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] font-mono">Meal Journal Analysis</h4>
                        <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-black rounded-full border border-green-100 dark:border-green-800">
                          {dayLog.foods.length} items logged
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dayLog.foods.map((food, foodIndex) => (
                          <div key={foodIndex} className="bg-gray-50/50 dark:bg-gray-900/20 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 flex items-center justify-between hover:scale-[1.02] transition-all group/item">
                            <div className="flex items-center space-x-5">
                               <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg border border-gray-50 dark:border-gray-700 group-hover/item:border-green-200 transition-colors">
                                  <Apple className="w-6 h-6 text-green-500" />
                               </div>
                               <div>
                                  <p className="text-base font-black text-gray-800 dark:text-white leading-tight mb-1">{food.name}</p>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{food.quantity} {food.unit}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-lg font-black text-gray-900 dark:text-white mb-1">
                                 {Math.round(food.calories * food.quantity)}
                                 <span className="text-[10px] text-gray-400 ml-1 uppercase">kcal</span>
                               </p>
                               <div className="flex items-center justify-end space-x-1">
                                 <div className="w-1 h-1 rounded-full bg-green-500"></div>
                                 <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase font-mono">
                                   {new Date(food.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                 </p>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}