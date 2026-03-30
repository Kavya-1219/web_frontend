import { useState, useEffect } from "react";
import { Calendar, TrendingUp, Flame, Target, CheckCircle, XCircle, Clock, Zap } from "lucide-react";
import api, { endpoints } from "../helpers/api";
import { MedicalDisclaimer } from "./ui/medical-disclaimer";

interface DailyProgress {
  date: string;
  dayNumber: number;
  caloriesTarget: number;
  caloriesConsumed: number;
  caloriesBurned: number;
  waterIntake: number;
  steps: number;
  sleep: number | null;
  isCompleted: boolean;
  isToday: boolean;
}

export function TimelineProgressScreen() {
  const [timelineData, setTimelineData] = useState<DailyProgress[]>([]);
  const [totalCaloriesTarget, setTotalCaloriesTarget] = useState(0);
  const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [estimatedTimeline, setEstimatedTimeline] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimelineProgress();
  }, []);

  const loadTimelineProgress = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.timeline);
      const data = response.data;
      
      setTimelineData(data.timelineData);
      setTotalCaloriesTarget(data.totalCaloriesTarget);
      setTotalCaloriesConsumed(data.totalCaloriesConsumed);
      setDaysRemaining(data.daysRemaining);
      setEstimatedTimeline(data.estimatedTimeline);
      setCurrentDay(data.currentDay);
    } catch (error) {
      console.error("Error fetching timeline progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (totalCaloriesTarget === 0) return 0;
    return Math.min((totalCaloriesConsumed / totalCaloriesTarget) * 100, 100);
  };

  const getOnTrackStatus = () => {
    const expectedProgress = (currentDay / estimatedTimeline) * totalCaloriesTarget;
    const actualProgress = totalCaloriesConsumed;
    
    if (expectedProgress === 0) return { status: "Starting", color: "text-blue-600", icon: "✨", bgColor: "bg-blue-50" };
    
    const difference = actualProgress - expectedProgress;
    const percentDiff = (difference / expectedProgress) * 100;
    
    if (Math.abs(percentDiff) < 5) {
      return { status: "On Track", color: "text-green-600", icon: "✓", bgColor: "bg-green-50" };
    } else if (difference > 0) {
      return { status: "Ahead", color: "text-blue-600", icon: "⬆", bgColor: "bg-blue-50" };
    } else {
      return { status: "Behind", color: "text-orange-600", icon: "⬇", bgColor: "bg-orange-50" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const trackStatus = getOnTrackStatus();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 pt-8 pb-24 px-6 rounded-b-[2rem]">
        <h1 className="text-2xl text-white mb-2 font-semibold">Timeline Progress</h1>
        <p className="text-purple-50 dark:text-purple-200">Track your journey day by day</p>
      </div>

      {/* Progress Overview Card */}
      <div className="px-6 -mt-16 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Overall Progress</h2>
            <Clock className="w-6 h-6 text-purple-500" />
          </div>
          
          {/* Timeline Status */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 border-2 border-blue-200 dark:border-blue-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Day</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentDay}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-3 border-2 border-purple-200 dark:border-purple-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Days Left</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{daysRemaining}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-3 border-2 border-green-200 dark:border-green-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Days</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{estimatedTimeline}</p>
            </div>
          </div>

          {/* Calorie Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Calories Progress</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {totalCaloriesConsumed.toLocaleString()} / {totalCaloriesTarget.toLocaleString()} kcal
              </span>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
              {getProgressPercentage().toFixed(1)}% Complete
            </p>
          </div>

          {/* Track Status */}
          <div className={`${trackStatus.bgColor} dark:bg-opacity-20 border-2 border-current rounded-xl p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{trackStatus.icon}</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">You are</p>
                  <p className={`text-lg font-bold ${trackStatus.color}`}>{trackStatus.status}</p>
                </div>
              </div>
              <Zap className={`w-8 h-8 ${trackStatus.color}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Progress List */}
      <div className="px-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Daily Breakdown</h2>
        
        <div className="space-y-3">
          {timelineData.slice(0, currentDay + 7).map((day) => (
            <div
              key={day.dayNumber}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-2 transition-all ${
                day.isToday
                  ? 'border-purple-500 shadow-lg'
                  : day.isCompleted
                  ? 'border-green-200 dark:border-green-800'
                  : day.dayNumber < currentDay
                  ? 'border-orange-200 dark:border-orange-800'
                  : 'border-gray-200 dark:border-gray-700 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    day.isToday
                      ? 'bg-purple-500 text-white'
                      : day.isCompleted
                      ? 'bg-green-500 text-white'
                      : day.dayNumber < currentDay
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {day.isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : day.dayNumber < currentDay ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-bold text-sm">{day.dayNumber}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Day {day.dayNumber}
                      {day.isToday && <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">Today</span>}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                {day.dayNumber <= currentDay && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800 dark:text-white">{day.caloriesConsumed}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">/ {day.caloriesTarget} kcal</p>
                  </div>
                )}
              </div>

              {/* Activity Stats */}
              {day.dayNumber <= currentDay && (
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Water</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{day.waterIntake} ml</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Steps</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">{day.steps.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sleep</p>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {day.sleep ? `${day.sleep}h` : '-'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {timelineData.length > currentDay + 7 && (
          <button className="w-full mt-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Show All Days
          </button>
        )}
      </div>

      {/* Medical Disclaimer */}
      <div className="px-6 mt-6">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
