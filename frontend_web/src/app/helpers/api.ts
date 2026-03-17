import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.token) {
    config.headers.Authorization = `Token ${user.token}`;
  }
  return config;
});

export default api;

export const endpoints = {
  login: "/login/",
  register: "/register/",
  recipes: "/recipes/",
  home: "/home/",
  profile: "/profile/",
  waterTracking: "/water-tracking/",
  logFood: "/log-food/",
  foodSearch: "/foods/search/",
  foodScan: "/food-scan/",
  mealPlan: "/meal-plan/today/",
};
