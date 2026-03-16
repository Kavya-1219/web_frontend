import { useState } from "react";
import { useNavigate } from "react-router";
import { Brain, Leaf, Moon, Heart, ArrowLeft, Check } from "lucide-react";

const stressReliefFoods = [
  {
    category: "Magnesium-Rich Foods",
    icon: "🥬",
    foods: ["Dark leafy greens", "Almonds", "Avocado", "Dark chocolate (70%+)"],
    benefit: "Helps regulate cortisol and calm the nervous system"
  },
  {
    category: "Tryptophan Foods",
    icon: "🥛",
    foods: ["Milk", "Bananas", "Oats", "Turkey", "Eggs"],
    benefit: "Promotes serotonin production for better mood"
  },
  {
    category: "Antioxidant-Rich",
    icon: "🫐",
    foods: ["Berries", "Green tea", "Turmeric", "Walnuts"],
    benefit: "Reduces inflammation and oxidative stress"
  },
  {
    category: "Omega-3 Foods",
    icon: "🐟",
    foods: ["Fatty fish", "Flaxseeds", "Chia seeds", "Walnuts"],
    benefit: "Supports brain health and reduces anxiety"
  }
];

const breathingExercises = [
  {
    name: "4-7-8 Breathing",
    duration: "5 minutes",
    steps: ["Breathe in for 4 counts", "Hold for 7 counts", "Exhale for 8 counts", "Repeat 4 times"],
    bestTime: "Before meals or bedtime"
  },
  {
    name: "Box Breathing",
    duration: "3 minutes",
    steps: ["Breathe in for 4 counts", "Hold for 4 counts", "Exhale for 4 counts", "Hold for 4 counts"],
    bestTime: "During stressful moments"
  }
];

const sleepTips = [
  "Avoid caffeine after 2 PM",
  "Eat light dinner 2-3 hours before bed",
  "Have warm milk with turmeric before sleep",
  "Limit screen time 1 hour before bed",
  "Keep bedroom cool and dark"
];

export function StressManagementScreen() {
  const navigate = useNavigate();
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const toggleFood = (category: string) => {
    setSelectedFoods(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    // Save stress management preferences
    localStorage.setItem('stressManagement', JSON.stringify({
      selectedFoods,
      selectedExercise
    }));
    navigate("/final-preferences");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 pt-12 pb-20 px-6 rounded-b-[2rem]">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/10 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center justify-center mb-3">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl text-white text-center mb-2">
          Manage Stress
        </h1>
        <p className="text-indigo-50 text-center">
          Nutrition + Lifestyle for Mental Wellness
        </p>
      </div>

      {/* Introduction */}
      <div className="px-6 -mt-8 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start space-x-3 mb-4">
            <Heart className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-800 mb-2">How Nutrition Helps Reduce Stress</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your brain needs specific nutrients to manage stress hormones, produce calming neurotransmitters, 
                and maintain emotional balance. We'll help you choose foods that support both your body and mind.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stress-Relief Foods */}
      <div className="px-6 mb-6">
        <h2 className="text-lg text-gray-800 mb-4 flex items-center">
          <Leaf className="w-5 h-5 mr-2 text-green-600" />
          Foods for Stress Relief
        </h2>
        <div className="space-y-3">
          {stressReliefFoods.map((item) => {
            const isSelected = selectedFoods.includes(item.category);
            
            return (
              <button
                key={item.category}
                onClick={() => toggleFood(item.category)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-semibold text-gray-800">{item.category}</span>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="ml-11 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {item.foods.map((food) => (
                      <span
                        key={food}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 italic">✨ {item.benefit}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Breathing Exercises */}
      <div className="px-6 mb-6">
        <h2 className="text-lg text-gray-800 mb-4 flex items-center">
          <Moon className="w-5 h-5 mr-2 text-blue-600" />
          Simple Breathing Exercises
        </h2>
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {breathingExercises.map((exercise) => (
            <div key={exercise.name} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                  {exercise.duration}
                </span>
              </div>
              <div className="space-y-1 mb-2">
                {exercise.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-500 text-sm mt-0.5">{idx + 1}.</span>
                    <span className="text-sm text-gray-600">{step}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 italic">⏰ Best time: {exercise.bestTime}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sleep Tips */}
      <div className="px-6 mb-6">
        <h2 className="text-lg text-gray-800 mb-4">Sleep-Friendly Eating Tips</h2>
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <div className="space-y-2">
            {sleepTips.map((tip, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-purple-700">✓</span>
                </div>
                <span className="text-sm text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Daily Routine */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">Your Daily Stress-Relief Routine</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <span className="text-lg">🌅</span>
              <div>
                <p className="font-medium text-gray-800">Morning</p>
                <p className="text-gray-600">Green tea + Oatmeal with berries and almonds</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-lg">☀️</span>
              <div>
                <p className="font-medium text-gray-800">Afternoon</p>
                <p className="text-gray-600">Practice 5-min breathing before lunch</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-lg">🌙</span>
              <div>
                <p className="font-medium text-gray-800">Evening</p>
                <p className="text-gray-600">Warm milk with turmeric 1 hour before bed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-xl shadow-lg transition bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl"
        >
          Continue to Dietary Preferences
        </button>
      </div>
    </div>
  );
}