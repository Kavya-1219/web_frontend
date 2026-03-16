import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Target, TrendingDown, TrendingUp, Calendar, ArrowLeft, AlertCircle } from "lucide-react";

export function GoalWeightScreen() {
  const navigate = useNavigate();
  const [targetWeight, setTargetWeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState(0);
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [estimatedWeeks, setEstimatedWeeks] = useState(0);
  const [goalType, setGoalType] = useState("");

  useEffect(() => {
    // Get current weight from localStorage
    const bodyDetails = JSON.parse(localStorage.getItem('bodyDetails') || '{}');
    setCurrentWeight(bodyDetails.weight || 70);

    // Get goal type
    const userGoals = JSON.parse(localStorage.getItem('userGoals') || '[]');
    setGoalType(userGoals[0] || '');
  }, []);

  // Calculate estimated timeline
  useEffect(() => {
    if (targetWeight && currentWeight) {
      const target = parseFloat(targetWeight);
      const weightDiff = Math.abs(target - currentWeight);
      
      // Safe weight loss/gain: 0.5-1 kg per week
      // Using 0.75 kg per week as average
      const weeks = Math.ceil(weightDiff / 0.75);
      setEstimatedWeeks(weeks);
    }
  }, [targetWeight, currentWeight]);

  const weightDiff = targetWeight ? Math.abs(parseFloat(targetWeight) - currentWeight).toFixed(1) : 0;
  const isLoseWeight = goalType === 'lose-weight';

  // Generate timeline options based on estimate
  const getTimelineOptions = () => {
    if (!estimatedWeeks) return [];
    
    const minWeeks = Math.ceil(estimatedWeeks * 0.8); // 20% faster
    const maxWeeks = Math.ceil(estimatedWeeks * 1.5); // 50% slower
    
    const options = [];
    
    // Fast option (if safe)
    if (minWeeks >= 4) {
      options.push({
        id: 'fast',
        weeks: minWeeks,
        label: `${minWeeks} weeks`,
        description: 'Aggressive pace',
        pace: isLoseWeight ? '~1 kg/week' : '~1 kg/week',
        color: 'border-orange-300 bg-orange-50'
      });
    }
    
    // Recommended option
    options.push({
      id: 'recommended',
      weeks: estimatedWeeks,
      label: `${estimatedWeeks} weeks`,
      description: 'Recommended pace',
      pace: isLoseWeight ? '~0.75 kg/week' : '~0.75 kg/week',
      color: 'border-green-300 bg-green-50',
      recommended: true
    });
    
    // Gradual option
    options.push({
      id: 'gradual',
      weeks: maxWeeks,
      label: `${maxWeeks} weeks`,
      description: 'Gradual pace',
      pace: isLoseWeight ? '~0.5 kg/week' : '~0.5 kg/week',
      color: 'border-blue-300 bg-blue-50'
    });
    
    return options;
  };

  const timelineOptions = getTimelineOptions();

  const handleContinue = () => {
    if (targetWeight && selectedTimeline) {
      const selected = timelineOptions.find(opt => opt.id === selectedTimeline);
      localStorage.setItem('targetWeight', targetWeight);
      localStorage.setItem('timeline', JSON.stringify({
        weeks: selected?.weeks,
        pace: selected?.pace,
        targetDate: new Date(Date.now() + (selected?.weeks || 0) * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      navigate("/health-conditions");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-12 pb-20 px-6 rounded-b-[2rem]">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/10 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center justify-center mb-3">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl text-white text-center mb-2">
          Goal Weight
        </h1>
        <p className="text-green-50 text-center">
          Set your target weight
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 -mt-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Current Weight Display */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Current Weight</p>
              <p className="text-3xl font-bold text-blue-600">{currentWeight} kg</p>
            </div>
          </div>

          {/* Target Weight Input */}
          <div>
            <label className="block text-sm text-gray-700 mb-2 font-medium">
              Target Weight (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="Enter target weight"
                step="0.1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition text-lg"
              />
              {isLoseWeight ? (
                <TrendingDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500" />
              ) : (
                <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-500" />
              )}
            </div>
          </div>

          {/* Weight Difference Display */}
          {targetWeight && (
            <div className={`border-2 rounded-xl p-4 ${
              isLoseWeight ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Weight to {isLoseWeight ? 'lose' : 'gain'}</span>
                <span className="text-2xl font-bold text-gray-800">{weightDiff} kg</span>
              </div>
            </div>
          )}

          {/* Estimated Timeline */}
          {estimatedWeeks > 0 && (
            <>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-semibold text-gray-800">Estimated Timeline</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600 mb-1">~{estimatedWeeks} weeks</p>
                <p className="text-xs text-gray-600">Based on healthy {isLoseWeight ? 'weight loss' : 'weight gain'} of 0.75 kg/week</p>
              </div>

              {/* Timeline Selection */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">Choose Your Timeline</h3>
                <div className="space-y-3">
                  {timelineOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedTimeline(option.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedTimeline === option.id
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : `${option.color} border-2 hover:shadow-md`
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-800">{option.label}</span>
                            {option.recommended && (
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                        {selectedTimeline === option.id && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <TrendingDown className="w-4 h-4" />
                        <span>{option.pace}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Safety Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Health Tip:</strong> Safe {isLoseWeight ? 'weight loss' : 'weight gain'} is 0.5-1 kg per week. 
                  Rapid changes can be unhealthy. Consult a doctor for personalized advice.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
        <button
          onClick={handleContinue}
          disabled={!targetWeight || !selectedTimeline}
          className={`w-full py-4 rounded-xl shadow-lg transition ${
            targetWeight && selectedTimeline
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
