import axios from "axios";

const API_BASE_URL = "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  // Don't add token for login/register
  if (config.url === endpoints.login || config.url === endpoints.register) {
    return config;
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.token) {
    config.headers.Authorization = `Token ${user.token}`;
  }
  return config;
});

/**
 * Standardized way to trigger a dashboard/data refresh across all components
 */
export const dispatchRefresh = () => {
  window.dispatchEvent(new Event('refreshDashboard'));
  // Also dispatch storage event for components listening to localStorage changes
  window.dispatchEvent(new Event('storage'));
};

export default api;

export const endpoints = {
  // Auth
  login: "/login/",
  register: "/register/",
  forgotPassword: "/forgot-password/",
  verifyOtp: "/verify-otp/",
  resetPassword: "/reset-password/",

  // Onboarding
  personalDetails: "/personal-details/",
  bodyDetails: "/body-details/",
  foodPreferences: "/food-preferences/",
  lifestyle: "/lifestyle-activity/",
  goals: "/goals/",
  goalWeight: "/goal-weight/",
  healthConditions: "/health-conditions/",
  healthDetails: "/health-details/",
  mealsPerDay: "/meals-per-day/",

  // Core
  home: "/home/",
  profile: "/profile/",
  changePassword: "/profile/password/",
  profilePicture: "/profile/picture/",

  // Food & Nutrition
  recipes: "/recipes/",
  logFood: "/log-food/",
  foodSearch: "/foods/search/",
  foodScan: "/food-scan/",
  todayMacros: "/today-macros/",
  foodHistory: "/food-history/",
  historySummary: "/history-summary/",
  nutritionInsights: "/nutrition-insights/",

  // Meal Plan
  mealPlan: "/meal-plan/today/",
  toggleMealConsumed: "/meal-plan/mark-eaten/",
  mealAlternatives: "/meal-plan/alternatives/",
  swapMeal: "/meal-plan/swap/",
  aiTips: "/ai-tips/",

  // Tracking
  waterTracking: "/water-tracking/",
  waterWeekly: "/water-tracking/weekly/",
  stepsToday: "/steps/today/",
  stepsWeekly: "/steps/weekly/",
  stepsManualLog: "/steps/manual-log/",

  // Sleep
  sleepSchedule: "/sleep-schedule/",
  sleepLogs: "/sleep-logs/",
  timeline: "/timeline/",
  
  // Stress & Mind Care
  moodLogs: "/mood-logs/",
  practiceCompletions: "/practice-completions/",
  
  // AI Support
  chat: "/chat/",
};

