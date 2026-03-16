import { createBrowserRouter, Navigate } from "react-router";
import { SplashScreen } from "@/app/components/splash-screen";
import { WelcomeScreen } from "@/app/components/welcome-screen";
import { LoginScreen } from "@/app/components/login-screen";
import { SignUpScreen } from "@/app/components/signup-screen";
import { ForgotPasswordScreen } from "@/app/components/forgot-password-screen";
import { PersonalDetailsScreen } from "@/app/components/personal-details-screen";
import { BodyDetailsScreen } from "@/app/components/body-details-screen";
import { FoodPreferencesScreen } from "@/app/components/food-preferences-screen";
import { LifestyleScreen } from "@/app/components/lifestyle-screen";
import { HealthGoalScreen } from "@/app/components/health-goal-screen";
import { GoalWeightScreen } from "@/app/components/goal-weight-screen";
import { HealthConditionsDetailedScreen } from "@/app/components/health-conditions-detailed-screen";
import { FinalPreferencesScreen } from "@/app/components/final-preferences-screen";
import { StressMindCareScreen } from "@/app/components/stress-mind-care-screen";
import { GuidedPracticeScreen } from "@/app/components/guided-practice-screen";
import { HomeDashboard } from "@/app/components/home-dashboard";
import { MealPlanScreen } from "@/app/components/meal-plan-screen";
import { FoodLoggingScreen } from "@/app/components/food-logging-screen";
import { NutritionInsightsScreen } from "@/app/components/nutrition-insights-screen";
import { AIRecommendationsScreen } from "@/app/components/ai-recommendations-screen";
import { HistoryScreen } from "@/app/components/history-screen";
import { ProfileScreen } from "@/app/components/profile-screen";
import { SettingsScreen } from "@/app/components/settings-screen";
import { HelpSupportScreen } from "@/app/components/help-support-screen";
import { WaterTrackingScreen } from "@/app/components/water-tracking-screen";
import { StepsTrackingScreen } from "@/app/components/steps-tracking-screen";
import { SleepTrackingScreen } from "@/app/components/sleep-tracking-screen";
import { AboutScreen } from "@/app/components/about-screen";
import { RecipesScreen } from "@/app/components/recipes-screen";
import { MainLayout } from "@/app/components/main-layout";
import { ErrorBoundary } from "@/app/components/error-boundary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/welcome",
    Component: WelcomeScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    Component: LoginScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup",
    Component: SignUpScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/personal-details",
    Component: PersonalDetailsScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/body-details",
    Component: BodyDetailsScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/food-preferences",
    Component: FoodPreferencesScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/lifestyle",
    Component: LifestyleScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/health-goal",
    Component: HealthGoalScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/goal-weight",
    Component: GoalWeightScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/health-conditions",
    Component: HealthConditionsDetailedScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/final-preferences",
    Component: FinalPreferencesScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/stress-management",
    Component: StressMindCareScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/app",
    Component: MainLayout,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        Component: HomeDashboard,
      },
      {
        path: "stress-mind-care",
        Component: StressMindCareScreen,
      },
      {
        path: "guided-practice",
        Component: GuidedPracticeScreen,
      },
      {
        path: "meals",
        Component: MealPlanScreen,
      },
      {
        path: "log-food",
        Component: FoodLoggingScreen,
      },
      {
        path: "insights",
        Component: NutritionInsightsScreen,
      },
      {
        path: "recommendations",
        Component: AIRecommendationsScreen,
      },
      {
        path: "history",
        Component: HistoryScreen,
      },
      {
        path: "profile",
        Component: ProfileScreen,
      },
      {
        path: "settings",
        Component: SettingsScreen,
      },
      {
        path: "help",
        Component: HelpSupportScreen,
      },
      {
        path: "water-tracking",
        Component: WaterTrackingScreen,
      },
      {
        path: "steps-tracking",
        Component: StepsTrackingScreen,
      },
      {
        path: "sleep-tracking",
        Component: SleepTrackingScreen,
      },
      {
        path: "about",
        Component: AboutScreen,
      },
      {
        path: "recipes",
        Component: RecipesScreen,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Navigate to="/app" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);