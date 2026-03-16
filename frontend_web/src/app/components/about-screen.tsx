import { useNavigate } from "react-router";
import { ArrowLeft, Heart, Shield, Target, Users, Sparkles } from "lucide-react";

export function AboutScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900/20 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-700 dark:to-emerald-800 pt-8 pb-20 px-6 rounded-b-[2rem]">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/10 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl text-white font-semibold mb-2">Personalised Nutrition</h1>
          <p className="text-green-50">Version 1.0.0</p>
        </div>
      </div>

      <div className="px-6 -mt-12 space-y-6">
        {/* Mission Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Our Mission</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            To empower individuals on their health journey by providing personalized nutrition guidance, 
            AI-powered recommendations, and comprehensive tracking tools. We believe everyone deserves 
            access to professional-grade nutrition planning tailored to their unique needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Key Features</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white mb-1">AI-Powered Nutrition</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advanced AI analyzes your meals and provides personalized recommendations
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white mb-1">Personalized Plans</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Custom meal plans based on your goals, health conditions, and preferences
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white mb-1">Privacy First</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your data is stored locally on your device. We never share your information
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white mb-1">Comprehensive Tracking</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track food, water, steps, sleep, and more in one integrated platform
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Health Conditions Support */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Health Conditions We Support</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Diabetes Management",
              "PCOS Support",
              "High Blood Pressure",
              "Stress Management",
              "Weight Loss",
              "Muscle Gain",
              "Heart Health",
              "Food Allergies"
            ].map((condition, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {condition}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-800 rounded-2xl p-5">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">⚠️ Medical Disclaimer</h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-400 leading-relaxed">
            This app is for informational purposes only and should not replace professional medical advice. 
            Always consult with a healthcare provider or registered dietitian before making significant 
            changes to your diet or exercise routine, especially if you have existing health conditions.
          </p>
        </div>

        {/* Credits */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">Made with ❤️ for your health journey</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © 2026 Personalised Nutrition App. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
