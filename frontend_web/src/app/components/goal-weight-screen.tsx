import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Target, TrendingDown, TrendingUp, Calendar, ArrowLeft, AlertCircle, Check } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 pt-12 pb-24 px-6 rounded-b-[3rem] shadow-xl">
        <div className="max-w-4xl mx-auto w-full">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-white font-black text-center mb-2 tracking-tight">Goal Weight</h1>
            <p className="text-green-50 text-center text-lg font-medium opacity-90">Set your target weight and timeline</p>
          </div>

          {/* Progress Indicator - App Style */}
          <div className="mt-10 flex items-center justify-center space-x-2 w-full px-4">
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 -mt-10 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-10 border border-white/20">
            {/* Current Weight Display */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100 flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-black uppercase tracking-widest mb-1">Current Weight</p>
                <p className="text-4xl font-black">{currentWeight} <span className="text-xl opacity-80 font-bold">kg</span></p>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>

            {/* Target Weight Input */}
            <div className="space-y-4">
              <label className="block text-xl font-black text-gray-800 tracking-tight">
                What is your target weight?
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  placeholder="Enter target weight"
                  step="0.1"
                  className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:border-green-500 focus:bg-white focus:outline-none transition-all text-2xl font-black text-gray-800 shadow-inner group-hover:border-gray-200"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-xl font-black text-gray-400">kg</span>
                  {isLoseWeight ? (
                    <TrendingDown className="w-8 h-8 text-blue-500" />
                  ) : (
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Weight Difference Display */}
            {targetWeight && (
              <div className={`p-6 rounded-3xl border-2 animate-in fade-in slide-in-from-top-4 duration-500 ${
                isLoseWeight ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-orange-50 border-orange-100 text-orange-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 opacity-50" />
                    <span className="font-bold text-lg">Goal: {isLoseWeight ? 'Lose' : 'Gain'} {weightDiff} kg</span>
                  </div>
                  <span className="text-3xl font-black">{weightDiff}</span>
                </div>
              </div>
            )}

            {/* Estimated Timeline */}
            {estimatedWeeks > 0 && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-100">
                  <div className="flex items-center space-x-4 mb-4">
                    <Calendar className="w-8 h-8 text-purple-200" />
                    <h3 className="text-xl font-black tracking-tight">Estimated Healthy Journey</h3>
                  </div>
                  <div className="flex items-baseline space-x-3">
                    <p className="text-5xl font-black">~{estimatedWeeks}</p>
                    <p className="text-2xl font-bold opacity-80">weeks</p>
                  </div>
                  <p className="mt-4 text-purple-100 font-medium">Sustainable {isLoseWeight ? 'weight loss' : 'weight gain'} of 0.75 kg/week</p>
                </div>

                {/* Timeline Selection */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-gray-800 tracking-tight">Choose Your Pace</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {timelineOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedTimeline(option.id)}
                        className={`w-full p-6 rounded-[2rem] border-2 transition-all transform active:scale-[0.99] text-left relative overflow-hidden group ${
                          selectedTimeline === option.id
                            ? 'border-green-500 bg-green-50/50 shadow-xl shadow-green-100'
                            : 'border-gray-100 bg-gray-50/20 hover:border-green-200'
                        }`}
                      >
                        <div className="flex items-start justify-between relative z-10">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-xl font-black text-gray-800 tracking-tight">{option.label}</span>
                              {option.recommended && (
                                <span className="text-[10px] font-black uppercase tracking-widest bg-green-500 text-white px-3 py-1 rounded-full shadow-lg shadow-green-200">
                                  Perfect Pace
                                </span>
                              )}
                            </div>
                            <p className="text-gray-500 font-bold text-sm mb-3">"{option.description}"</p>
                            <div className="flex items-center space-x-2 text-sm font-black text-gray-400 group-hover:text-green-600 transition-colors">
                              <TrendingDown className="w-5 h-5" />
                              <span>{option.pace}</span>
                            </div>
                          </div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            selectedTimeline === option.id ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-gray-100'
                          }`}>
                            {selectedTimeline === option.id && <Check className="w-6 h-6 text-white" />}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Safety Note */}
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-sm text-amber-800 font-medium leading-relaxed">
                    <strong>Medical Note:</strong> Safe {isLoseWeight ? 'weight loss' : 'weight gain'} is 0.5-1 kg per week. 
                    Rapid weight changes can impact organ function and hormone levels. Always prioritize sustainability.
                  </p>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <div className="pt-6">
              <button
                onClick={handleContinue}
                disabled={!targetWeight || !selectedTimeline}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                  targetWeight && selectedTimeline
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-200 hover:shadow-2xl"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue to Health Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
