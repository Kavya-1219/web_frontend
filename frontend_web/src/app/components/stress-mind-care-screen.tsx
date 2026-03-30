import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Moon, Salad, Coffee, Wind, Clock, Bell, Sun, TrendingUp, Target, Brain } from "lucide-react";
import { useNavigate } from "react-router";
import api, { endpoints, dispatchRefresh } from "../helpers/api";

interface SleepLog {
  bedtime: string;
  wakeTime: string;
  duration: string;
  durationMinutes: number;
  quality: string;
  date: string;
  motivationMessage: string;
}

export function StressMindCareScreen() {
  const navigate = useNavigate();
  const [activeBreathing, setActiveBreathing] = useState(false);
  const [showSleepSchedule, setShowSleepSchedule] = useState(false);
  const [showWindDown, setShowWindDown] = useState(false);
  const [sleepSchedule, setSleepSchedule] = useState({
    bedtime: "22:00",
    wakeTime: "06:00"
  });
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [userAge, setUserAge] = useState(25);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [lastNotificationTime, setLastNotificationTime] = useState<string>("");
  const [snoozeUntil, setSnoozeUntil] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for 12-hour format picker
  const [bedtimeUI, setBedtimeUI] = useState({ hour: "10", minute: "00", period: "PM" });
  const [wakeTimeUI, setWakeTimeUI] = useState({ hour: "6", minute: "00", period: "AM" });

  // Helper function to convert 24-hour to 12-hour format
  const convertTo12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Helper function to convert 12-hour to 24-hour format
  const convertTo24Hour = (hour: string, minute: string, period: string) => {
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  };
  
  // Update UI state when modal opens
  const openSleepScheduleModal = () => {
    const [bedHours, bedMinutes] = sleepSchedule.bedtime.split(':');
    const bedHour = parseInt(bedHours);
    setBedtimeUI({
      hour: (bedHour % 12 || 12).toString(),
      minute: bedMinutes,
      period: bedHour >= 12 ? 'PM' : 'AM'
    });
    
    const [wakeHours, wakeMinutes] = sleepSchedule.wakeTime.split(':');
    const wakeHour = parseInt(wakeHours);
    setWakeTimeUI({
      hour: (wakeHour % 12 || 12).toString(),
      minute: wakeMinutes,
      period: wakeHour >= 12 ? 'PM' : 'AM'
    });
    
    setShowSleepSchedule(true);
  };

  useEffect(() => {
    loadSleepData();
    loadUserAge();
    
    const reminderInterval = setInterval(() => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email || user.username || 'guest';
      const savedReminder = localStorage.getItem(`sleepReminder_${email}`);
      const savedSchedule = localStorage.getItem(`sleepSchedule_${email}`);
      
      if (savedReminder === 'true' && savedSchedule) {
        const schedule = JSON.parse(savedSchedule);
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const currentTimeKey = `${currentTime}_${now.toDateString()}`;
        
        if (currentTime === schedule.bedtime && lastNotificationTime !== currentTimeKey) {
          const snoozeData = localStorage.getItem(`sleepSnooze_${email}`);
          if (snoozeData) {
            const snoozeTime = parseInt(snoozeData);
            if (Date.now() < snoozeTime) return;
            localStorage.removeItem(`sleepSnooze_${email}`);
          }
          
          setLastNotificationTime(currentTimeKey);
          setShowWindDown(true);
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Time for Bed 🌙', {
              body: 'Sleeping on time helps digestion and reduces cravings.',
              icon: '/favicon.ico'
            });
          }
        }
      }
    }, 10000);

    return () => clearInterval(reminderInterval);
  }, [lastNotificationTime]);

  const loadUserAge = async () => {
    try {
      const response = await api.get(endpoints.home);
      if (response.data) {
        setUserAge(response.data.age || 25);
      }
    } catch (error) {
       console.error("Age fetch failed:", error);
       const user = JSON.parse(localStorage.getItem("user") || "{}");
       const email = user.email || user.username || 'guest';
       const personalDetails = JSON.parse(localStorage.getItem(`personalDetails_${email}`) || '{}');
       setUserAge(personalDetails.age || 25);
    }
  };

  const loadSleepData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(endpoints.sleepLogs);
      if (response.data && response.data.results) {
        setSleepLogs(response.data.results.map((log: any) => ({
          bedtime: log.bedtime,
          wakeTime: log.wake_time,
          duration: log.duration_display || "0h 0m",
          durationMinutes: log.duration_minutes || 0,
          quality: log.quality,
          date: new Date(log.date).toDateString(),
          motivationMessage: log.motivation_message || ""
        })));
        
        const totalMinutes = response.data.results.reduce((acc: number, log: any) => acc + (log.duration_minutes || 0), 0);
        setWeeklyAverage(response.data.results.length > 0 ? totalMinutes / 60 / response.data.results.length : 0);
      }
    } catch (error) {
      console.error("Sleep data fetch failed:", error);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email || user.username || 'guest';
      const savedLogs = localStorage.getItem(`sleepLogs_${email}`);
      if (savedLogs) {
        const logs = JSON.parse(savedLogs);
        setSleepLogs(logs);
        const totalMinutes = logs.reduce((acc: number, log: SleepLog) => acc + log.durationMinutes, 0);
        setWeeklyAverage(logs.length > 0 ? totalMinutes / 60 / logs.length : 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWeeklyAverage = (logs: SleepLog[]) => {
    if (logs.length === 0) {
      setWeeklyAverage(0);
      return;
    }
    
    const last7Days = logs.slice(0, 7);
    const totalMinutes = last7Days.reduce((sum, log) => sum + log.durationMinutes, 0);
    const avgMinutes = totalMinutes / last7Days.length;
    const avgHours = avgMinutes / 60;
    setWeeklyAverage(Math.round(avgHours * 10) / 10);
  };

  const saveSleepSchedule = async () => {
    const newSchedule = {
      bedtime: convertTo24Hour(bedtimeUI.hour, bedtimeUI.minute, bedtimeUI.period),
      wakeTime: convertTo24Hour(wakeTimeUI.hour, wakeTimeUI.minute, wakeTimeUI.period)
    };
    
    try {
      await api.post(endpoints.sleepSchedule, {
        bedtime: newSchedule.bedtime,
        wake_time: newSchedule.wakeTime
      });
      setSleepSchedule(newSchedule);
      setShowSleepSchedule(false);
      loadSleepData(); // Refresh logs as backend might auto-create one
    } catch (error) {
      console.error("Sleep schedule save failed:", error);
      // Fallback
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email || user.username || 'guest';
      setSleepSchedule(newSchedule);
      localStorage.setItem(`sleepSchedule_${email}`, JSON.stringify(newSchedule));
      setShowSleepSchedule(false);
    }
  };

  const toggleReminder = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const email = user.email || user.username || 'guest';
    const newValue = !reminderEnabled;
    setReminderEnabled(newValue);
    localStorage.setItem(`sleepReminder_${email}`, String(newValue));
    
    if (newValue) {
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };

  const calculateSleepDuration = (bedtime: string, wakeTime: string) => {
    const bedtimeParts = bedtime.split(':');
    const wakeTimeParts = wakeTime.split(':');
    
    let bedtimeMinutes = parseInt(bedtimeParts[0]) * 60 + parseInt(bedtimeParts[1]);
    let wakeTimeMinutes = parseInt(wakeTimeParts[0]) * 60 + parseInt(wakeTimeParts[1]);
    
    if (wakeTimeMinutes < bedtimeMinutes) {
      wakeTimeMinutes += 24 * 60; // Add 24 hours if wake time is next day
    }
    
    const durationMinutes = wakeTimeMinutes - bedtimeMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return {
      duration: `${hours}h ${minutes}m`,
      durationMinutes: durationMinutes
    };
  };

  const getSleepQualityByAge = (durationMinutes: number, age: number) => {
    const hours = durationMinutes / 60;
    
    let normalMin = 7;
    let normalMax = 9;
    
    // Determine normal sleep range by age
    if (age >= 65) {
      normalMin = 7;
      normalMax = 8;
    } else if (age >= 18) {
      normalMin = 7;
      normalMax = 9;
    } else if (age >= 14) {
      normalMin = 8;
      normalMax = 10;
    } else if (age >= 6) {
      normalMin = 9;
      normalMax = 11;
    } else if (age >= 3) {
      normalMin = 10;
      normalMax = 13;
    }
    
    // Check for oversleeping (2+ hours more than normal max)
    if (hours >= (normalMax + 2)) {
      return { 
        label: "Over", 
        emoji: "😴",
        color: "text-red-600 dark:text-red-400", 
        bgColor: "bg-red-50 dark:bg-red-900/20",
        message: "Too much sleep can affect energy levels and metabolism. Try to stick closer to your ideal sleep range."
      };
    }
    
    // Determine quality
    if (hours >= normalMin && hours <= normalMax) {
      return { 
        label: "Good", 
        emoji: "😊",
        color: "text-green-600 dark:text-green-400", 
        bgColor: "bg-green-50 dark:bg-green-900/20",
        message: "Great sleep! This helps control hunger hormones today."
      };
    } else if (hours > normalMax && hours < (normalMax + 2)) {
      return { 
        label: "Fair", 
        emoji: "😐",
        color: "text-yellow-600 dark:text-yellow-400", 
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        message: "Slightly more sleep than needed. Try to wake up closer to your schedule for better energy."
      };
    } else if (hours >= (normalMin - 1.5) && hours < normalMin) {
      return { 
        label: "Fair", 
        emoji: "😐",
        color: "text-yellow-600 dark:text-yellow-400", 
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        message: "Decent rest. Try sleeping a bit earlier tonight for better digestion."
      };
    } else {
      return { 
        label: "Poor", 
        emoji: "😴",
        color: "text-orange-600 dark:text-orange-400", 
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        message: "Not enough sleep. This can increase cravings tomorrow - try to rest earlier tonight."
      };
    }
  };

  const getMotivationMessage = (quality: string) => {
    const messages = {
      Good: [
        "Good sleep helps control hunger hormones today.",
        "Better sleep supports insulin balance and mindful eating.",
        "Quality rest improves food choices and reduces cravings.",
        "Well-rested means better appetite regulation today."
      ],
      Fair: [
        "Try sleeping earlier tonight for better digestion tomorrow.",
        "More sleep helps reduce stress eating.",
        "Improved sleep timing will balance your appetite better."
      ],
      Poor: [
        "Poor sleep increases cravings - prioritize rest tonight.",
        "Better sleep tomorrow will help control your appetite.",
        "Lack of sleep affects metabolism - aim for 7-9 hours tonight."
      ],
      Oversleep: [
        "Too much sleep can affect energy levels and metabolism.",
        "Try waking up closer to your schedule for better energy.",
        "Oversleeping may disrupt your hunger hormones - stick to your schedule."
      ]
    };
    
    const qualityMessages = messages[quality as keyof typeof messages] || messages.Fair;
    return qualityMessages[Math.floor(Math.random() * qualityMessages.length)];
  };

  const logSleep = async () => {
    const { durationMinutes } = calculateSleepDuration(sleepSchedule.bedtime, sleepSchedule.wakeTime);
    const qualityInfo = getSleepQualityByAge(durationMinutes, userAge);
    
    try {
      await api.post(endpoints.sleepLogs, {
        bedtime: sleepSchedule.bedtime,
        wake_time: sleepSchedule.wakeTime,
        quality: qualityInfo.label
      });
      loadSleepData();
      dispatchRefresh();
    } catch (error) {
      console.error("Sleep log failed:", error);
      // Local fallback logic removed to prioritize backend sync
    }
  };

  const getTodaySleep = () => {
    const today = new Date().toDateString();
    return sleepLogs.find(log => log.date === today);
  };

  const stressFoods = [
    {
      id: "magnesium",
      title: "Magnesium-Rich Foods",
      icon: Salad,
      foods: "Almonds, spinach, pumpkin seeds, dark chocolate",
      benefit: "Helps calm nervous system naturally",
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      id: "complex-carbs",
      title: "Complex Carbohydrates",
      icon: Salad,
      foods: "Millets, oats, brown rice, quinoa",
      benefit: "Stabilizes mood and energy levels",
      color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      id: "herbal-teas",
      title: "Herbal Teas & Hydration",
      icon: Coffee,
      foods: "Chamomile tea, tulsi tea, warm water with lemon",
      benefit: "Promotes relaxation and reduces tension",
      color: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
  ];

  const sleepTips = [
    {
      id: "dinner-timing",
      title: "Light Dinner Timing",
      icon: Moon,
      tip: "Eat dinner 2-3 hours before bedtime for better digestion",
      color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      id: "sleep-foods",
      title: "Sleep-Supporting Foods",
      icon: Salad,
      tip: "Include foods rich in tryptophan like milk, bananas, dates",
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "avoid-caffeine",
      title: "Avoid Late Stimulants",
      icon: Coffee,
      tip: "Skip caffeine after 2 PM and avoid heavy meals at night",
      color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  const startBreathing = () => {
    setActiveBreathing(true);
  };

  const stopBreathing = () => {
    setActiveBreathing(false);
  };

  const todaySleep = getTodaySleep();
  const todayQuality = todaySleep ? getSleepQualityByAge(todaySleep.durationMinutes, userAge) : null;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-teal-700 dark:from-green-800 dark:to-teal-900 pt-8 pb-6 px-6 rounded-b-[2rem] relative overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-95 text-white flex items-center space-x-2 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Back</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-xl">
            <h1 className="text-3xl text-white font-bold tracking-tight mb-1">Mind Care Support</h1>
            <p className="text-green-50 text-base font-medium opacity-90 leading-relaxed">
              Nutrition-focused guidance for a calm mind, better sleep, and metabolic harmony.
            </p>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner mb-2">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Health Intelligence</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-black/5 rounded-full blur-2xl"></div>
      </div>

      <div className="px-6 mt-4 space-y-8">
        {/* Why Stress & Sleep Matter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Why Mind Care Matters for Nutrition
              </h2>
            </div>
          </div>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Stress affects digestion and appetite regulation</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Poor sleep increases cravings and tendency to overeat</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Hormonal balance (PCOS, diabetes) is influenced by stress and sleep quality</p>
            </div>
          </div>
        </div>

        {/* Sleep Schedule & Tracking Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sleep Tracking</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Quality sleep for a healthier you
          </p>

          {/* Today's Sleep Display */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-3">
            <div className="text-center mb-6">
              <Moon className="w-16 h-16 text-indigo-500 dark:text-indigo-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Last Night's Sleep</p>
              {todaySleep ? (
                <>
                  <p className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
                    {todaySleep.duration.split(' ')[0]}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">{todaySleep.duration.split(' ')[1]}</p>
                  
                  {/* Quality Indicator */}
                  {todayQuality && (
                    <div className={`${todayQuality.bgColor} border-2 ${todayQuality.color} rounded-2xl p-4 mt-4`}>
                      <p className={`text-lg font-semibold ${todayQuality.color} mb-2`}>
                        {todayQuality.emoji} {todayQuality.label} Sleep
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {todaySleep.motivationMessage}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-400 dark:text-gray-600 mb-2">--</p>
                  <p className="text-gray-500 dark:text-gray-400">No data for today</p>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{convertTo12Hour(sleepSchedule.bedtime)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Bedtime</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                <TrendingUp className="w-6 h-6 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{weeklyAverage}h</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">7-Day Avg</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={openSleepScheduleModal}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white rounded-xl hover:shadow-lg transition font-medium"
              >
                Edit Sleep Schedule
              </button>
              <button
                onClick={logSleep}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl hover:shadow-lg transition font-medium"
              >
                Log Today's Sleep
              </button>
            </div>
          </div>

          {/* Sleep Reminder Toggle */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-3xl p-5 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Bedtime Reminder</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified at bedtime</p>
                </div>
              </div>
              <button
                onClick={toggleReminder}
                className={`w-14 h-8 rounded-full p-1 transition ${
                  reminderEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  reminderEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Recent Sleep Logs */}
          {sleepLogs.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-3xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Recent Sleep History
              </h3>
              <div className="space-y-2">
                {sleepLogs.slice(0, 5).map((log, index) => {
                  const quality = getSleepQualityByAge(log.durationMinutes, userAge);
                  return (
                    <div key={index} className={`${quality.bgColor} rounded-xl p-3`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{log.date}</span>
                        <span className={`text-sm font-semibold ${quality.color}`}>
                          {quality.emoji} {quality.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>🌙 {convertTo12Hour(log.bedtime)} - ☀️ {convertTo12Hour(log.wakeTime)}</span>
                        <span className="font-medium">{log.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Foods That Help Reduce Stress */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
              <Salad className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Foods That Help Reduce Stress</h2>
          </div>
          <div className="space-y-3">
            {stressFoods.map((food) => {
              const Icon = food.icon;
              
              return (
                <div
                  key={food.id}
                  className={`${food.color} border-2 rounded-3xl p-5`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className={`w-6 h-6 ${food.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {food.title}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {food.foods}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                        {food.benefit}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nutrition Tips for Better Sleep */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nutrition Tips for Better Sleep</h2>
          </div>
          <div className="space-y-3">
            {sleepTips.map((tip) => {
              const Icon = tip.icon;
              
              return (
                <div
                  key={tip.id}
                  className={`${tip.color} border-2 rounded-3xl p-5`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className={`w-6 h-6 ${tip.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {tip.title}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {tip.tip}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Calm Tools */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
              <Wind className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Calm Tools</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Simple breathing technique to manage stress and support mindful eating
          </p>

          {/* 5-Minute Calm Breathing */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-3xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Wind className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  5-Minute Calm Breathing
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Simple breathing pattern to calm mind before meals
                </p>
              </div>
            </div>

            {!activeBreathing ? (
              <button
                onClick={startBreathing}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-2xl transition"
              >
                Start Breathing Exercise
              </button>
            ) : (
              <div className="space-y-4">
                <BreathingCircle />
                <button
                  onClick={stopBreathing}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-2xl transition"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Justification Card */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border-2 border-green-200 dark:border-green-700 rounded-3xl p-5">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-green-600 dark:text-green-400">Why this matters:</span>{" "}
            Sleep timing and quality affect hunger hormones, digestion, and food choices. Managing stress and sleep through nutrition and simple calm tools supports your overall health goals.
          </p>
        </div>
      </div>

      {/* Sleep Schedule Edit Modal */}
      {showSleepSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Sleep Schedule</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bedtime
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={bedtimeUI.hour}
                    onChange={(e) => setBedtimeUI({ ...bedtimeUI, hour: e.target.value })}
                    className="w-16 px-4 py-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    value={bedtimeUI.minute}
                    onChange={(e) => setBedtimeUI({ ...bedtimeUI, minute: e.target.value })}
                    className="w-16 px-4 py-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={bedtimeUI.period}
                    onChange={(e) => setBedtimeUI({ ...bedtimeUI, period: e.target.value })}
                    className="w-16 px-4 py-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Wake-up Time
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={wakeTimeUI.hour}
                    onChange={(e) => setWakeTimeUI({ ...wakeTimeUI, hour: e.target.value })}
                    className="w-16 px-4 py-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    value={wakeTimeUI.minute}
                    onChange={(e) => setWakeTimeUI({ ...wakeTimeUI, minute: e.target.value })}
                    className="w-16 px-4 py-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={wakeTimeUI.period}
                    onChange={(e) => setWakeTimeUI({ ...wakeTimeUI, period: e.target.value })}
                    className="w-16 px-4 py-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💡 Consistent sleep timing helps regulate hunger hormones and digestion.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSleepSchedule(false)}
                className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveSleepSchedule}
                className="flex-1 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-2xl transition"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wind-Down Motivation Modal */}
      {showWindDown && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Moon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                It's bedtime 🌙
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sleeping on time helps digestion and reduces cravings tomorrow.
              </p>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-indigo-800 dark:text-indigo-300">
                  💡 Quality sleep helps control hunger hormones and supports mindful eating.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowWindDown(false);
                  setActiveBreathing(true);
                  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                }}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-4 px-4 rounded-2xl transition"
              >
                Start Wind-Down
              </button>
              <button
                onClick={() => {
                  setShowWindDown(false);
                  const email = localStorage.getItem('currentUserEmail');
                  const snoozeUntilTime = Date.now() + (10 * 60 * 1000); // 10 minutes from now
                  localStorage.setItem(`sleepSnooze_${email}`, String(snoozeUntilTime));
                }}
                className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-4 px-4 rounded-2xl transition"
              >
                Remind Me in 10 Minutes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Breathing Circle Animation
function BreathingCircle() {
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => {
        const newPhase = prev === "inhale" ? "exhale" : "inhale";
        setScale(newPhase === "inhale" ? 1.3 : 1);
        return newPhase;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg transition-transform duration-[4000ms] ease-in-out"
        style={{ transform: `scale(${scale})` }}
      />
      <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300 capitalize">
        {phase}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Breathe slowly and naturally
      </p>
    </div>
  );
}