import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Target, Heart, Brain, TrendingUp, Apple, Zap, ArrowLeft } from "lucide-react";
import { getUserProfile, getHealthRecommendations } from "@/app/helpers/meal-plan-helper";

interface Recommendation {
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

export function AIRecommendationsScreen() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userName, setUserName] = useState("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    generatePersonalizedRecommendations();
  }, []);

  const generatePersonalizedRecommendations = () => {
    const profile = getUserProfile();
    const personalDetails = JSON.parse(localStorage.getItem('personalDetails') || '{}');
    setUserName(personalDetails.name || 'User');
    setGoal(profile.goal.replace('-', ' '));

    const recs: Recommendation[] = [];

    // Goal-based recommendations
    if (profile.goal === 'lose-weight') {
      recs.push({
        title: "Calorie Deficit Strategy",
        description: `Aim for a deficit of 500 kcal/day (currently targeting ${profile.targetCalories} kcal). This will help you lose ~0.5kg per week safely.`,
        icon: TrendingUp,
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200"
      });
      recs.push({
        title: "Protein Intake",
        description: "Increase protein to 25-30% of calories (${Math.round(profile.targetCalories * 0.25 / 4)}g daily) to preserve muscle mass during weight loss.",
        icon: Apple,
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200"
      });
      recs.push({
        title: "Meal Timing",
        description: "Try eating smaller, frequent meals (4-5 times/day) to keep metabolism active and reduce hunger.",
        icon: Zap,
        color: "text-orange-600",
        bgColor: "bg-orange-50 border-orange-200"
      });
    } else if (profile.goal === 'gain-weight' || profile.goal === 'gain-muscle') {
      recs.push({
        title: "Calorie Surplus",
        description: `Target ${profile.targetCalories} kcal daily with a focus on nutrient-dense foods for healthy weight gain.`,
        icon: TrendingUp,
        color: "text-orange-600",
        bgColor: "bg-orange-50 border-orange-200"
      });
      recs.push({
        title: "High Protein Diet",
        description: `Consume ${Math.round(profile.weight * 1.6)}g protein daily (1.6g per kg body weight) to support muscle growth.`,
        icon: Apple,
        color: "text-purple-600",
        bgColor: "bg-purple-50 border-purple-200"
      });
      recs.push({
        title: "Strength Training",
        description: "Combine your nutrition plan with resistance training 3-4 times per week for optimal muscle gain.",
        icon: Zap,
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200"
      });
    } else {
      recs.push({
        title: "Balanced Nutrition",
        description: `Maintain your current calorie intake of ${profile.targetCalories} kcal with a balanced macro split.`,
        icon: Target,
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200"
      });
      recs.push({
        title: "Consistent Eating",
        description: "Keep meal timing consistent to maintain stable energy levels and metabolism throughout the day.",
        icon: Zap,
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200"
      });
    }

    // Diet-specific recommendations
    if (profile.dietType === 'vegetarian' || profile.dietType === 'vegan') {
      recs.push({
        title: "Complete Protein Sources",
        description: "Combine legumes with grains (dal+rice, hummus+pita) to get all essential amino acids.",
        icon: Apple,
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200"
      });
    }

    // Health condition recommendations
    const healthRecs = getHealthRecommendations(profile);
    healthRecs.forEach((rec, index) => {
      recs.push({
        title: `Health Tip ${index + 1}`,
        description: rec,
        icon: Heart,
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200"
      });
    });

    // Hydration recommendation
    const waterIntake = Math.round(profile.weight * 35); // 35ml per kg
    recs.push({
      title: "Hydration Goal",
      description: `Drink at least ${waterIntake}ml (${Math.round(waterIntake / 250)} glasses) of water daily based on your body weight.`,
      icon: Brain,
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200"
    });

    // Activity recommendation
    if (profile.activityLevel === 'sedentary' || profile.activityLevel === 'lightly-active') {
      recs.push({
        title: "Increase Activity",
        description: "Try to include 30 minutes of moderate exercise daily. Even a brisk walk can boost metabolism and mood.",
        icon: Zap,
        color: "text-purple-600",
        bgColor: "bg-purple-50 border-purple-200"
      });
    }

    setRecommendations(recs);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 pt-8 pb-20 px-6 rounded-b-[2rem]">
        <div className="flex items-center space-x-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <Sparkles className="w-8 h-8 text-white" />
          <h1 className="text-2xl text-white font-semibold">AI Recommendations</h1>
        </div>
        <p className="text-purple-50 ml-14">
          Personalized insights for {userName}
        </p>
      </div>

      {/* Goal Summary */}
      <div className="px-6 -mt-12 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your Goal</p>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">{goal}</h3>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            These recommendations are tailored to help you achieve your goal safely and effectively.
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="px-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Your Personalized Plan
        </h2>
        
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <div
              key={index}
              className={`${rec.bgColor} dark:bg-opacity-20 border-2 rounded-2xl p-5 shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 ${rec.bgColor.replace('50', '100')} dark:bg-opacity-30 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${rec.color} dark:opacity-90`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{rec.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Tips */}
      <div className="px-6 mt-6">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-5">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">Pro Tips</h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Stay hydrated throughout the day</li>
                <li>• Focus on progress, not perfection</li>
                <li>• Get 7-9 hours of quality sleep</li>
                <li>• Manage stress through simple breathing exercises</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Note */}
      <div className="px-6 mt-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            <strong>💡 Note:</strong> These are AI-generated recommendations based on your profile. 
            For medical conditions or specific health concerns, please consult a healthcare professional or registered dietitian.
          </p>
        </div>
      </div>
    </div>
  );
}
