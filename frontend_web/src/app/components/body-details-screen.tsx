import { useState } from "react";
import { useNavigate } from "react-router";
import { Scale, ArrowLeft } from "lucide-react";

export function BodyDetailsScreen() {
  const navigate = useNavigate();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");

  const handleContinue = () => {
    if (height && weight) {
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
      
      // Also store weight separately for later use
      localStorage.setItem('userWeight', weightInKg.toString());
      
      navigate("/food-preferences");
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
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-12 pb-20 px-6 rounded-b-[2rem]">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-white/10 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center justify-center mb-3">
          <Scale className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl text-white text-center mb-2">
          Body Details
        </h1>
        <p className="text-green-50 text-center">
          Help us calculate your nutrition needs
        </p>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white/30 rounded-full"></div>
          <div className="w-8 h-1 bg-white/30 rounded-full"></div>
          <div className="w-8 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 -mt-8 pb-32">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Height */}
          <div>
            <label className="block text-sm text-gray-700 mb-2 font-medium">
              Height
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={heightUnit === "cm" ? "170" : "5.7"}
                step={heightUnit === "cm" ? "1" : "0.1"}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
              />
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setHeightUnit("cm")}
                  className={`px-4 py-2 rounded-lg transition ${
                    heightUnit === "cm"
                      ? "bg-white text-green-600 shadow"
                      : "text-gray-600"
                  }`}
                >
                  cm
                </button>
                <button
                  onClick={() => setHeightUnit("ft")}
                  className={`px-4 py-2 rounded-lg transition ${
                    heightUnit === "ft"
                      ? "bg-white text-green-600 shadow"
                      : "text-gray-600"
                  }`}
                >
                  ft
                </button>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm text-gray-700 mb-2 font-medium">
              Current Weight
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={weightUnit === "kg" ? "70" : "154"}
                step={weightUnit === "kg" ? "0.1" : "1"}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
              />
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setWeightUnit("kg")}
                  className={`px-4 py-2 rounded-lg transition ${
                    weightUnit === "kg"
                      ? "bg-white text-green-600 shadow"
                      : "text-gray-600"
                  }`}
                >
                  kg
                </button>
                <button
                  onClick={() => setWeightUnit("lbs")}
                  className={`px-4 py-2 rounded-lg transition ${
                    weightUnit === "lbs"
                      ? "bg-white text-green-600 shadow"
                      : "text-gray-600"
                  }`}
                >
                  lbs
                </button>
              </div>
            </div>
          </div>

          {/* BMI Display */}
          {bmi && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 font-medium">Your BMI</span>
                <span className="text-3xl font-bold text-blue-600">{bmi}</span>
              </div>
              <div className="text-xs text-gray-600">
                {parseFloat(bmi) < 18.5 && "Underweight"}
                {parseFloat(bmi) >= 18.5 && parseFloat(bmi) < 25 && "Normal weight"}
                {parseFloat(bmi) >= 25 && parseFloat(bmi) < 30 && "Overweight"}
                {parseFloat(bmi) >= 30 && "Obese"}
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    parseFloat(bmi) < 18.5 ? "bg-yellow-400 w-1/4" :
                    parseFloat(bmi) < 25 ? "bg-green-500 w-1/2" :
                    parseFloat(bmi) < 30 ? "bg-orange-400 w-3/4" :
                    "bg-red-500 w-full"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs text-green-800 leading-relaxed">
              💡 Your height and weight help us calculate your BMR (Basal Metabolic Rate) and daily calorie requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
        <button
          onClick={handleContinue}
          disabled={!height || !weight}
          className={`w-full py-4 rounded-xl shadow-lg transition ${
            height && weight
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
