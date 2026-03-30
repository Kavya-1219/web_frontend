import { useState } from "react";
import { useNavigate } from "react-router";
import { Scale, ArrowLeft, Loader2 } from "lucide-react";
import api, { endpoints } from "../helpers/api";

export function BodyDetailsScreen() {
  const navigate = useNavigate();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (height && weight) {
      setIsLoading(true);
      try {
        // Convert to standard units (cm and kg)
        let heightInCm = parseFloat(height);
        let weightInKg = parseFloat(weight);
        
        if (heightUnit === "ft") {
          heightInCm = heightInCm * 30.48; // feet to cm
        }
        if (weightUnit === "lbs") {
          weightInKg = weightInKg * 0.453592; // lbs to kg
        }

        // Calculate BMI
        const heightInM = heightInCm / 100;
        const bmi = (weightInKg / (heightInM * heightInM)).toFixed(1);

        localStorage.setItem('bodyDetails', JSON.stringify({
          height: heightInCm,
          weight: weightInKg,
          bmi,
          heightUnit,
          weightUnit
        }));
        
        localStorage.setItem('userWeight', weightInKg.toString());

        await api.post(endpoints.bodyDetails, {
          height: heightInCm,
          weight: weightInKg,
        });
        
        navigate("/food-preferences");
      } catch (error) {
        console.error("Failed to save body details:", error);
        navigate("/food-preferences");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Calculate BMI for display
  const calculateBMI = () => {
    if (!height || !weight) return null;
    
    let heightInCm = parseFloat(height);
    let weightInKg = parseFloat(weight);
    
    if (heightUnit === "ft") {
      heightInCm = heightInCm * 30.48;
    }
    if (weightUnit === "lbs") {
      weightInKg = weightInKg * 0.453592;
    }

    const heightInM = heightInCm / 100;
    return (weightInKg / (heightInM * heightInM)).toFixed(1);
  };

  const bmi = calculateBMI();

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
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-white font-black text-center mb-2 tracking-tight">Body Details</h1>
            <p className="text-green-50 text-center text-lg font-medium opacity-90">Help us calculate your nutrition needs</p>
          </div>

          {/* Progress Indicator - App Style */}
          <div className="mt-10 flex items-center justify-center space-x-3 w-full px-4">
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white rounded-full shadow-sm"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 px-6 -mt-10 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Height */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-800 ml-1">
                  Height
                </label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={heightUnit === "cm" ? "170" : "5.7"}
                    step={heightUnit === "cm" ? "1" : "0.1"}
                    className="flex-1 px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:bg-white focus:outline-none transition-all text-gray-800 font-medium"
                  />
                  <div className="flex bg-gray-100 rounded-2xl p-1.5">
                    <button
                      onClick={() => setHeightUnit("cm")}
                      className={`px-6 py-2 rounded-xl font-bold transition-all ${
                        heightUnit === "cm"
                          ? "bg-white text-green-600 shadow-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      cm
                    </button>
                    <button
                      onClick={() => setHeightUnit("ft")}
                      className={`px-6 py-2 rounded-xl font-bold transition-all ${
                        heightUnit === "ft"
                          ? "bg-white text-green-600 shadow-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      ft
                    </button>
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-800 ml-1">
                  Current Weight
                </label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={weightUnit === "kg" ? "70" : "154"}
                    step={weightUnit === "kg" ? "0.1" : "1"}
                    className="flex-1 px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:bg-white focus:outline-none transition-all text-gray-800 font-medium"
                  />
                  <div className="flex bg-gray-100 rounded-2xl p-1.5">
                    <button
                      onClick={() => setWeightUnit("kg")}
                      className={`px-6 py-2 rounded-xl font-bold transition-all ${
                        weightUnit === "kg"
                          ? "bg-white text-green-600 shadow-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      kg
                    </button>
                    <button
                      onClick={() => setWeightUnit("lbs")}
                      className={`px-6 py-2 rounded-xl font-bold transition-all ${
                        weightUnit === "lbs"
                          ? "bg-white text-green-600 shadow-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      lbs
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* BMI Display */}
            {bmi && (
              <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/10 border-2 border-blue-100 rounded-[2rem] p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Your BMI</h4>
                      <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                        {parseFloat(bmi) < 18.5 && "Underweight"}
                        {parseFloat(bmi) >= 18.5 && parseFloat(bmi) < 25 && "Normal weight"}
                        {parseFloat(bmi) >= 25 && parseFloat(bmi) < 30 && "Overweight"}
                        {parseFloat(bmi) >= 30 && "Obese"}
                      </p>
                    </div>
                  </div>
                  <span className="text-4xl font-black text-gray-800">{bmi}</span>
                </div>
                
                <div className="relative pt-2">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        parseFloat(bmi) < 18.5 ? "bg-yellow-400 w-1/4" :
                        parseFloat(bmi) < 25 ? "bg-green-500 w-1/2" :
                        parseFloat(bmi) < 30 ? "bg-orange-400 w-3/4" :
                        "bg-red-500 w-full"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between mt-2 px-1 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    <span>Under</span>
                    <span>Normal</span>
                    <span>Over</span>
                    <span>Obese</span>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5 flex items-start space-x-4">
              <span className="text-xl">💡</span>
              <p className="text-sm text-green-800 font-medium leading-relaxed">
                Your height and weight help us calculate your BMR (Basal Metabolic Rate) and personalized daily calorie requirements.
              </p>
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <button
                onClick={handleContinue}
                disabled={isLoading || !height || !weight}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform flex items-center justify-center ${
                  isLoading || !height || !weight
                    ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-200 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99]"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Saving Details...
                  </>
                ) : (
                  "Continue to Food Preferences"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
