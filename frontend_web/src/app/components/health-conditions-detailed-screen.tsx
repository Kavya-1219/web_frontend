import { useState } from "react";
import { useNavigate } from "react-router";
import { Heart, ArrowLeft, Check, ChevronRight, Loader2 } from "lucide-react";
import api, { endpoints } from "../helpers/api";

interface ConditionDetail {
  diabetesType?: string;
  bpReading?: { systolic: string; diastolic: string };
  cholesterolLevel?: string;
  allergicFoods?: string[];
  thyroidType?: string;
  customAllergy?: string;
}

const healthConditions = [
  { id: "none", label: "None", icon: "✅", description: "No health conditions" },
  { id: "diabetes", label: "Diabetes", icon: "🩺", description: "Blood sugar management", needsDetail: true },
  { id: "pcos", label: "PCOS", icon: "💊", description: "Hormonal balance" },
  { id: "thyroid", label: "Thyroid Issues", icon: "🦋", description: "Thyroid regulation", needsDetail: true },
  { id: "high-bp", label: "High Blood Pressure", icon: "❤️", description: "Blood pressure control", needsDetail: true },
  { id: "low-bp", label: "Low Blood Pressure", icon: "💙", description: "Blood pressure support", needsDetail: true },
  { id: "high-cholesterol", label: "High Cholesterol", icon: "🫀", description: "Cholesterol management", needsDetail: true },
  { id: "digestive", label: "Digestive Issues", icon: "🍃", description: "Gut health" },
  { id: "anemia", label: "Anemia", icon: "🩸", description: "Iron deficiency" },
  { id: "food-allergies", label: "Food Allergies", icon: "⚠️", description: "Allergy management", needsDetail: true },
];

export function HealthConditionsDetailedScreen() {
  const navigate = useNavigate();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [conditionDetails, setConditionDetails] = useState<ConditionDetail>({});
  const [isLoading, setIsLoading] = useState(false);

  const toggleCondition = (conditionId: string) => {
    if (conditionId === "none") {
      setSelectedConditions(["none"]);
    } else {
      setSelectedConditions(prev => {
        const filtered = prev.filter(id => id !== "none");
        if (filtered.includes(conditionId)) {
          return filtered.filter(id => id !== conditionId);
        } else {
          return [...filtered, conditionId];
        }
      });
    }
  };

  const needsDetailScreen = selectedConditions.some(id => 
    healthConditions.find(c => c.id === id)?.needsDetail
  );

  const handleContinue = async () => {
    if (selectedConditions.length > 0) {
      if (needsDetailScreen && !showDetails) {
        setShowDetails(true);
      } else {
        setIsLoading(true);
        try {
          // Save all data
          localStorage.setItem('healthConditions', JSON.stringify(selectedConditions));
          localStorage.setItem('healthConditionDetails', JSON.stringify(conditionDetails));
          
          // First sync basic conditions
          await api.post(endpoints.healthConditions, {
            healthConditions: selectedConditions,
          });

          // Then sync specific details if they exist
          if (needsDetailScreen) {
            const payload: any = {};
            if (conditionDetails.diabetesType) payload.diabetesType = conditionDetails.diabetesType;
            if (conditionDetails.bpReading) {
              payload.systolic = parseInt(conditionDetails.bpReading.systolic);
              payload.diastolic = parseInt(conditionDetails.bpReading.diastolic);
            }
            if (conditionDetails.thyroidType) payload.thyroidCondition = conditionDetails.thyroidType;
            if (conditionDetails.cholesterolLevel) payload.cholesterolLevel = conditionDetails.cholesterolLevel;
            if (conditionDetails.allergicFoods) payload.foodAllergies = conditionDetails.allergicFoods;
            if (conditionDetails.customAllergy) payload.otherAllergies = conditionDetails.customAllergy;

            await api.post(endpoints.healthDetails, payload);
          }

          // Check if user selected "Manage stress" goal
          const userGoals = JSON.parse(localStorage.getItem('userGoals') || '[]');
          const hasStressGoal = userGoals.includes('manage-stress');
          
          if (hasStressGoal) {
            navigate("/stress-management");
          } else {
            navigate("/final-preferences");
          }
        } catch (error) {
          console.error("Failed to save health conditions:", error);
          navigate("/final-preferences");
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const commonAllergies = [
    "Peanuts", "Tree nuts", "Milk/Dairy", "Eggs", "Soy", "Wheat/Gluten", 
    "Shellfish", "Fish", "Sesame"
  ];

  if (showDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 pt-12 pb-20 px-6 rounded-b-[2rem]">
          <button
            onClick={() => setShowDetails(false)}
            className="mb-4 p-2 hover:bg-white/10 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-3xl text-white text-center mb-2">
            Health Details
          </h1>
          <p className="text-green-50 text-center">
            Help us personalize your nutrition plan
          </p>
        </div>

        {/* Details Form */}
        <div className="flex-1 px-6 -mt-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* Diabetes Details */}
            {selectedConditions.includes("diabetes") && (
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <span>🩺</span>
                  <span>Diabetes Type</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {["Type 1", "Type 2", "Prediabetes"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setConditionDetails({...conditionDetails, diabetesType: type})}
                      className={`py-3 px-4 rounded-xl border-2 transition ${
                        conditionDetails.diabetesType === type
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* High BP Details */}
            {selectedConditions.includes("high-bp") && (
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <span>❤️</span>
                  <span>Blood Pressure Reading</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Systolic (top)</label>
                    <input
                      type="number"
                      placeholder="120"
                      value={conditionDetails.bpReading?.systolic || ""}
                      onChange={(e) => setConditionDetails({
                        ...conditionDetails,
                        bpReading: { ...conditionDetails.bpReading!, systolic: e.target.value, diastolic: conditionDetails.bpReading?.diastolic || "" }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Diastolic (bottom)</label>
                    <input
                      type="number"
                      placeholder="80"
                      value={conditionDetails.bpReading?.diastolic || ""}
                      onChange={(e) => setConditionDetails({
                        ...conditionDetails,
                        bpReading: { systolic: conditionDetails.bpReading?.systolic || "", diastolic: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Normal: &lt;120/80 | High: ≥140/90</p>
              </div>
            )}

            {/* Low BP Details */}
            {selectedConditions.includes("low-bp") && (
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <span>💙</span>
                  <span>Blood Pressure Reading</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Systolic (top)</label>
                    <input
                      type="number"
                      placeholder="90"
                      value={conditionDetails.bpReading?.systolic || ""}
                      onChange={(e) => setConditionDetails({
                        ...conditionDetails,
                        bpReading: { ...conditionDetails.bpReading!, systolic: e.target.value, diastolic: conditionDetails.bpReading?.diastolic || "" }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Diastolic (bottom)</label>
                    <input
                      type="number"
                      placeholder="60"
                      value={conditionDetails.bpReading?.diastolic || ""}
                      onChange={(e) => setConditionDetails({
                        ...conditionDetails,
                        bpReading: { systolic: conditionDetails.bpReading?.systolic || "", diastolic: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Normal: &lt;120/80 | Low: &lt;90/60</p>
              </div>
            )}

            {/* Thyroid Details */}
            {selectedConditions.includes("thyroid") && (
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <span>🦋</span>
                  <span>Thyroid Condition</span>
                </h3>
                <div className="space-y-2">
                  {["Hypothyroidism (Underactive)", "Hyperthyroidism (Overactive)", "Hashimoto's", "Not sure"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setConditionDetails({...conditionDetails, thyroidType: type})}
                      className={`w-full py-3 px-4 rounded-xl border-2 transition text-left ${
                        conditionDetails.thyroidType === type
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cholesterol Details */}
            {selectedConditions.includes("high-cholesterol") && (
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <span>🫀</span>
                  <span>Cholesterol Level (mg/dL)</span>
                </h3>
                <input
                  type="number"
                  placeholder="e.g., 220"
                  value={conditionDetails.cholesterolLevel || ""}
                  onChange={(e) => setConditionDetails({...conditionDetails, cholesterolLevel: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all shadow-inner"
                />
                <p className="text-xs text-gray-500 mt-2">Normal: &lt;200 | High: ≥240 mg/dL</p>
              </div>
            )}

            {/* Food Allergies Details */}
            {selectedConditions.includes("food-allergies") && (
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>Select Your Food Allergies</span>
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonAllergies.map((allergy) => {
                    const isSelected = conditionDetails.allergicFoods?.includes(allergy);
                    return (
                      <button
                        key={allergy}
                        onClick={() => {
                          const current = conditionDetails.allergicFoods || [];
                          setConditionDetails({
                            ...conditionDetails,
                            allergicFoods: isSelected
                              ? current.filter(a => a !== allergy)
                              : [...current, allergy]
                          });
                        }}
                        className={`px-3 py-2 rounded-full border-2 transition text-sm ${
                          isSelected
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 text-gray-700"
                        }`}
                      >
                        {allergy}
                      </button>
                    );
                  })}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Other allergies (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Strawberries, Mustard"
                    value={conditionDetails.customAllergy || ""}
                    onChange={(e) => setConditionDetails({...conditionDetails, customAllergy: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl shadow-lg transition flex items-center justify-center ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving Details...
              </>
            ) : (
              "Save & Continue"
            )}
          </button>
        </div>
      </div>
    );
  }

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
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl text-white text-center mb-2">
          Health Conditions
        </h1>
        <p className="text-green-50 text-center">
          Select any conditions you have
        </p>
      </div>

      {/* Conditions List */}
      <div className="flex-1 px-6 -mt-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
          {healthConditions.map((condition) => {
            const isSelected = selectedConditions.includes(condition.id);
            
            return (
              <button
                key={condition.id}
                onClick={() => toggleCondition(condition.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{condition.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{condition.label}</div>
                    <div className="text-xs text-gray-500">{condition.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {condition.needsDetail && isSelected && (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  {isSelected && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-800 leading-relaxed">
            💡 Your food and nutrition recommendations will be customized based on your health conditions.
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
        <button
          onClick={handleContinue}
          disabled={isLoading || selectedConditions.length === 0}
          className={`w-full py-4 rounded-xl shadow-lg transition flex items-center justify-center ${
            isLoading || selectedConditions.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            selectedConditions.length > 0 && needsDetailScreen ? "Add Details" : "Continue"
          )}
        </button>
      </div>
    </div>
  );
}