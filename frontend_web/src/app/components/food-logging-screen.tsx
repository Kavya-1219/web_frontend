import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Minus, Check, X, UtensilsCrossed, TrendingUp, TrendingDown, Camera, Upload, Sparkles, AlertCircle, ArrowLeft, Zap, Info } from "lucide-react";
import { getUserProfile } from "@/app/helpers/meal-plan-helper";
import { searchFoods, type FoodItem } from "@/app/helpers/food-database";
import { calculateUserMetrics, calculateDailyCalorieTarget } from "@/app/helpers/smart-health-system";
import { scanFoodImage, generatePersonalizedSuggestions, getPersonalizedAlternatives, type ScannedNutrition, type UserHealthProfile, type NutritionSuggestion } from "@/app/helpers/ai-food-scanner";
import api, { endpoints } from "../helpers/api";
import { CommonHeader } from "./common-header";

interface LoggedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: number;
  unit: string;
  timestamp: string;
}

export function FoodLoggingScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showImageScan, setShowImageScan] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedNutrition, setScannedNutrition] = useState<ScannedNutrition | null>(null);
  const [suggestions, setSuggestions] = useState<NutritionSuggestion[]>([]);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [scannedQuantity, setScannedQuantity] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [manualFood, setManualFood] = useState({
    name: "",
    quantity: "",
    unit: "g"
  });
  const [nutritionInfo, setNutritionInfo] = useState<any>(null);
  const [todayCalories, setTodayCalories] = useState(0);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [todayProtein, setTodayProtein] = useState(0);
  const [todayCarbs, setTodayCarbs] = useState(0);
  const [todayFats, setTodayFats] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchProfileData(),
        fetchMacrosData()
      ]);
      setIsLoading(false);
    };
    fetchData();

    const handleRefresh = () => fetchData();
    window.addEventListener('refreshDashboard', handleRefresh);
    return () => window.removeEventListener('refreshDashboard', handleRefresh);
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get(endpoints.home);
      if (response.data) {
        setTargetCalories(response.data.target_calories || response.data.targetCalories || response.data.calorieGoal || 2000);
      }
    } catch (error) {
      console.error("Profile fetch failed:", error);
    }
  };

  const fetchMacrosData = async () => {
    try {
      const response = await api.get(endpoints.todayMacros);
      if (response.data) {
        setTodayCalories(Math.round(response.data.calories || response.data.total_calories || 0));
        setTodayProtein(Math.round(response.data.protein || response.data.total_protein || 0));
        setTodayCarbs(Math.round(response.data.carbs || response.data.total_carbs || 0));
        setTodayFats(Math.round(response.data.fats || response.data.total_fats || 0));
      }
    } catch (error) {
      console.error("Macros fetch failed:", error);
    }
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImage(base64String);
        analyzeImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsScanning(true);
    
    try {
      // Use the AI scanner helper
      const nutrition = await scanFoodImage(imageData);
      setScannedNutrition(nutrition);
      
      // Get user profile for personalized suggestions
      const userProfile = getUserHealthProfile();
      
      // Generate personalized suggestions
      const personalizedSuggestions = generatePersonalizedSuggestions(nutrition, userProfile, scannedQuantity);
      setSuggestions(personalizedSuggestions);
      
      // Get alternative recommendations
      const altRecommendations = getPersonalizedAlternatives(nutrition, userProfile);
      setAlternatives(altRecommendations);
      setScanError(null);
      
    } catch (error: any) {
      console.error('Error scanning food:', error);
      setScanError(error.message || "Unable to detect food. Please try with a clearer image.");
      setScannedNutrition(null);
    } finally {
      setIsScanning(false);
    }
  };

  const getUserHealthProfile = (): UserHealthProfile => {
    const profile = getUserProfile();
    const bmi = profile.weight / ((profile.height / 100) ** 2);
    
    return {
      age: profile.age,
      weight: profile.weight,
      height: profile.height,
      bmi,
      goal: profile.goal,
      healthConditions: profile.healthConditions || [],
      dietType: profile.dietType,
      allergies: profile.allergicFoods || [],
      dislikes: [], // Dislikes could be added to profile later
      dailyCalorieTarget: targetCalories,
      currentCaloriesConsumed: todayCalories
    };
  };

  const getMealTypeByTime = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "Breakfast";
    if (hour >= 11 && hour < 16) return "Lunch";
    if (hour >= 16 && hour < 22) return "Dinner";
    return "Snack";
  };

  const logScannedFood = async () => {
    if (!scannedNutrition) return;

    const mealData = {
      meal_type: getMealTypeByTime(),
      food_name: scannedNutrition.name,
      calories: scannedNutrition.calories * scannedQuantity,
      protein: scannedNutrition.protein * scannedQuantity,
      carbs: scannedNutrition.carbs * scannedQuantity,
      fats: scannedNutrition.fats * scannedQuantity,
      quantity: scannedQuantity * 100, // Sync with backend's expectativa of g
      date: new Date().toISOString().split('T')[0]
    };

    try {
      await api.post(endpoints.logFood, mealData);
      
      const { dispatchRefresh } = await import("../helpers/api");
      dispatchRefresh();
      
      await fetchMacrosData();
    } catch (error) {
      console.error("Backend logging failed:", error);
      alert("Failed to sync food log. Please check your connection.");
    }
    
    // Reset
    setScannedNutrition(null);
    setSuggestions([]);
    setAlternatives([]);
    setUploadedImage(null);
    setShowImageScan(false);
    setScannedQuantity(1);
    window.dispatchEvent(new Event('storage'));
  };

  const logFood = async () => {
    if (!selectedFood) return;

    const mealData = {
      meal_type: getMealTypeByTime(),
      food_name: selectedFood.name,
      calories: selectedFood.calories * quantity,
      protein: selectedFood.protein * quantity,
      carbs: selectedFood.carbs * quantity,
      fats: selectedFood.fats * quantity,
      quantity: quantity * 100,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      await api.post(endpoints.logFood, mealData);
      
      const { dispatchRefresh } = await import("../helpers/api");
      dispatchRefresh();
      
      await fetchMacrosData();
    } catch (error) {
      console.error("Backend logging failed:", error);
      alert("Failed to sync food log. Please check your connection.");
    }
    
    setSelectedFood(null);
    setQuantity(1);
    setSearchQuery("");
    window.dispatchEvent(new Event('storage'));
  };

  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await api.get(`${endpoints.foodSearch}?q=${query}`);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Map backend results to FoodItem interface
        const mappedResults: FoodItem[] = response.data.map((item: any) => ({
          id: (item.id ?? "").toString(),
          name: item.name || "Unknown",
          calories: item.calories || 0,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fats: item.fats || 0,
          fiber: 0, 
          servingSize: (item.servingQuantity ?? 100).toString(),
          servingUnit: item.servingUnit || "g",
          category: 'snack' 
        }));
        setSearchResults(mappedResults);
      } else {
        // Fallback to local search if API returns empty
        const localResults = searchFoods(query);
        setSearchResults(localResults);
      }
    } catch (error) {
      console.error("Search failed, using fallback:", error);
      // Fallback to local search on error
      const localResults = searchFoods(query);
      setSearchResults(localResults);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredFoods = searchResults;

  const remainingCalories = targetCalories - todayCalories;
  const calorieProgress = Math.min((todayCalories / targetCalories) * 100, 100);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <CommonHeader 
        title="Log Food" 
        subtitle="Track your meals with AI precision" 
        gradientClass="bg-log-food-gradient"
        icon={<UtensilsCrossed className="w-8 h-8 text-white/90" />}
      />

      <div className="px-6 -mt-8 relative z-20 space-y-6">
        {/* Today's Progress Card */}
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-black text-gray-900 dark:text-white text-base uppercase tracking-tight leading-none">CALORIES</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Remaining: {Math.max(0, targetCalories - todayCalories)} kcal</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-primary-green-vibrant tracking-tighter">
                {todayCalories} <span className="text-sm text-gray-400">/ {targetCalories}</span>
              </p>
            </div>
          </div>
          
          <div className="relative h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-6 shadow-inner">
            <div 
              className="h-full bg-primary-green-vibrant transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(0,200,83,0.3)]"
              style={{ width: `${calorieProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Carbs</p>
              <p className="text-sm font-black text-carbs-orange tracking-tight">{todayCarbs}g</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Protein</p>
              <p className="text-sm font-black text-protein-blue tracking-tight">{todayProtein}g</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Fats</p>
              <p className="text-sm font-black text-fats-yellow tracking-tight">{todayFats}g</p>
            </div>
          </div>
        </div>
        {/* Action Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.capture = 'environment';
              input.onchange = (e: any) => handleImageUpload(e);
              input.click();
              setShowImageScan(true);
            }}
            className="h-32 bg-ai-gradient rounded-[24px] p-5 flex flex-col justify-between items-start text-white shadow-lg active:scale-95 transition-transform text-left border border-white/10"
          >
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-base leading-tight uppercase tracking-tight">Scan Food</p>
              <p className="text-[10px] opacity-80 uppercase font-bold tracking-widest">AI Recognition</p>
            </div>
          </button>

          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e: any) => handleImageUpload(e);
              input.click();
              setShowImageScan(true);
            }}
            className="h-32 bg-steps-gradient rounded-[24px] p-5 flex flex-col justify-between items-start text-white shadow-lg active:scale-95 transition-transform text-left border border-white/10"
          >
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-base leading-tight uppercase tracking-tight">Upload</p>
              <p className="text-[10px] opacity-80 uppercase font-bold tracking-widest">From Gallery</p>
            </div>
          </button>

          <button
            onClick={() => setShowManualEntry(true)}
            className="col-span-2 h-32 bg-gradient-to-br from-pink-400 to-red-500 rounded-3xl p-5 flex flex-col justify-between items-start text-white shadow-lg active:scale-95 transition-transform text-left"
          >
            <div className="bg-white/20 p-2 rounded-xl">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-base leading-tight">Manual Entry</p>
              <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Type and log food</p>
            </div>
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-lg p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">Search Food</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What did you eat today?"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none text-gray-900 dark:text-white font-medium"
            />
          </div>

          {searchQuery && (
            <div className="mt-4 max-h-72 overflow-y-auto space-y-3 pr-1">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedFood(food);
                      setSearchQuery("");
                    }}
                    className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700 flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">{food.name}</p>
                      <p className="text-xs text-gray-500">{food.servingSize} {food.servingUnit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-red-500">{food.calories}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">kcal</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400">
                   <p className="font-medium">No results found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Food Details */}
        {selectedFood && (
          <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="p-6 bg-gradient-to-b from-green-50/50 to-white dark:from-green-900/10 dark:to-gray-900">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-500">
                    <UtensilsCrossed className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{selectedFood.name}</h3>
                    <p className="text-sm font-medium text-gray-500">100 {selectedFood.servingUnit} • Confidence High</p>
                  </div>
                </div>
                <button onClick={() => setSelectedFood(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">Macronutrients</p>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Calories', value: Math.round(selectedFood.calories * quantity), unit: 'kcal', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                  { label: 'Protein', value: (selectedFood.protein * quantity).toFixed(1), unit: 'g', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Carbs', value: (selectedFood.carbs * quantity).toFixed(1), unit: 'g', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                  { label: 'Fats', value: (selectedFood.fats * quantity).toFixed(1), unit: 'g', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} rounded-2xl p-3 text-center`}>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1">{stat.label}</p>
                    <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Advanced Nutrients Scroll */}
              <div className="flex gap-2 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar">
                {[
                  { label: 'Fiber', value: (selectedFood.fiber * quantity).toFixed(1) + 'g', color: 'bg-green-100 text-green-700' },
                  { label: 'Sugar', value: (0 * quantity).toFixed(1) + 'g', color: 'bg-purple-100 text-purple-700' },
                  { label: 'Iron', value: (0 * quantity).toFixed(1) + 'mg', color: 'bg-amber-100 text-amber-700' },
                ].map((n, i) => (
                  <div key={i} className={`${n.color} px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2`}>
                    <span>{n.label}</span>
                    <span className="opacity-60">{n.value}</span>
                  </div>
                ))}
              </div>

              {/* Serving Controls */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-5 flex items-center justify-between mb-6 shadow-inner">
                <button
                  onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                  className="w-12 h-12 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
                >
                  <Minus className="w-6 h-6 text-gray-900 dark:text-white" />
                </button>
                <div className="text-center">
                  <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{quantity}x</p>
                  <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">Servings</p>
                </div>
                <button
                  onClick={() => setQuantity(quantity + 0.5)}
                  className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                >
                  <Plus className="w-6 h-6 text-white" />
                </button>
              </div>

              <button
                onClick={logFood}
                className="w-full py-5 bg-red-500 text-white rounded-3xl font-bold text-lg shadow-xl shadow-red-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                <Check className="w-6 h-6" />
                Log This Item
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Scan Modal */}
      {showImageScan && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-50">
          <div className="w-full bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">AI Food Scanner</h2>
              <button
                onClick={() => {
                  setShowImageScan(false);
                  setScannedNutrition(null);
                  setUploadedImage(null);
                  setScanError(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {!uploadedImage ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition">
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Food Image</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Take a photo or upload an image of your meal</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <img src={uploadedImage} alt="Uploaded food" className="w-full h-64 object-cover rounded-2xl" />

                {isScanning ? (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-8 text-center">
                    <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">Analyzing your food...</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI is detecting nutrition information</p>
                  </div>
                ) : scannedNutrition ? (
                  <div className="space-y-4">
                    {/* Detection Result */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{scannedNutrition.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Confidence: {(scannedNutrition.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      {/* Nutrition Breakdown */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
                          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            {Math.round(scannedNutrition.calories * scannedQuantity)}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
                          <p className="text-xl font-bold text-gray-800 dark:text-white">
                            {Math.round(scannedNutrition.protein * scannedQuantity)}g
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
                          <p className="text-xl font-bold text-gray-800 dark:text-white">
                            {Math.round(scannedNutrition.carbs * scannedQuantity)}g
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Fats</p>
                          <p className="text-xl font-bold text-gray-800 dark:text-white">
                            {Math.round(scannedNutrition.fats * scannedQuantity)}g
                          </p>
                        </div>
                      </div>

                      {/* Detailed Micronutrients & Macronutrients */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <h4 className="font-semibold text-gray-800 dark:text-white">Complete Nutrient Breakdown</h4>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Macronutrients Section */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Macronutrients</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Fiber</p>
                                <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.fiber || 0) * scannedQuantity).toFixed(1)}g</p>
                              </div>
                              {scannedNutrition.sugar !== undefined && (
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Sugar</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.sugar || 0) * scannedQuantity).toFixed(1)}g</p>
                                </div>
                              )}
                              {scannedNutrition.saturatedFat !== undefined && (
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Saturated Fat</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.saturatedFat || 0) * scannedQuantity).toFixed(1)}g</p>
                                </div>
                              )}
                              {scannedNutrition.cholesterol !== undefined && (
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Cholesterol</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.cholesterol || 0) * scannedQuantity).toFixed(0)}mg</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Vitamins Section */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Vitamins</p>
                            <div className="grid grid-cols-2 gap-2">
                              {scannedNutrition.vitaminA !== undefined && (
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
                                  <p className="text-xs text-orange-700 dark:text-orange-400">Vitamin A</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.vitaminA || 0) * scannedQuantity).toFixed(0)}mcg</p>
                                </div>
                              )}
                              {scannedNutrition.vitaminC !== undefined && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2">
                                  <p className="text-xs text-yellow-700 dark:text-yellow-400">Vitamin C</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.vitaminC || 0) * scannedQuantity).toFixed(1)}mg</p>
                                </div>
                              )}
                              {scannedNutrition.vitaminD !== undefined && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                                  <p className="text-xs text-blue-700 dark:text-blue-400">Vitamin D</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.vitaminD || 0) * scannedQuantity).toFixed(1)}mcg</p>
                                </div>
                              )}
                              {scannedNutrition.vitaminE !== undefined && (
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                                  <p className="text-xs text-green-700 dark:text-green-400">Vitamin E</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.vitaminE || 0) * scannedQuantity).toFixed(1)}mg</p>
                                </div>
                              )}
                              {scannedNutrition.vitaminK !== undefined && (
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                                  <p className="text-xs text-purple-700 dark:text-purple-400">Vitamin K</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.vitaminK || 0) * scannedQuantity).toFixed(0)}mcg</p>
                                </div>
                              )}
                              {scannedNutrition.vitaminB12 !== undefined && (
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                                  <p className="text-xs text-red-700 dark:text-red-400">Vitamin B12</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.vitaminB12 || 0) * scannedQuantity).toFixed(1)}mcg</p>
                                </div>
                              )}
                              {scannedNutrition.folate !== undefined && (
                                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2">
                                  <p className="text-xs text-pink-700 dark:text-pink-400">Folate</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.folate || 0) * scannedQuantity).toFixed(0)}mcg</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Minerals Section */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Minerals</p>
                            <div className="grid grid-cols-2 gap-2">
                              {scannedNutrition.calcium !== undefined && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                                  <p className="text-xs text-blue-700 dark:text-blue-400">Calcium</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.calcium || 0) * scannedQuantity).toFixed(0)}mg</p>
                                </div>
                              )}
                              {scannedNutrition.iron !== undefined && (
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                                  <p className="text-xs text-red-700 dark:text-red-400">Iron</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.iron || 0) * scannedQuantity).toFixed(1)}mg</p>
                                </div>
                              )}
                              {scannedNutrition.magnesium !== undefined && (
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                                  <p className="text-xs text-green-700 dark:text-green-400">Magnesium</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.magnesium || 0) * scannedQuantity).toFixed(0)}mg</p>
                                </div>
                              )}
                              {scannedNutrition.potassium !== undefined && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2">
                                  <p className="text-xs text-yellow-700 dark:text-yellow-400">Potassium</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.potassium || 0) * scannedQuantity).toFixed(0)}mg</p>
                                </div>
                              )}
                              {scannedNutrition.sodium !== undefined && (
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
                                  <p className="text-xs text-orange-700 dark:text-orange-400">Sodium</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.sodium || 0) * scannedQuantity).toFixed(0)}mg</p>
                                </div>
                              )}
                              {scannedNutrition.zinc !== undefined && (
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                                  <p className="text-xs text-purple-700 dark:text-purple-400">Zinc</p>
                                  <p className="font-semibold text-gray-800 dark:text-white">{((scannedNutrition.zinc || 0) * scannedQuantity).toFixed(1)}mg</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Suggestions */}
                      {suggestions.length > 0 && (
                        <div className="space-y-3 mb-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white flex items-center space-x-2">
                            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <span>AI Health Recommendations</span>
                          </h4>
                          {suggestions.map((suggestion, index) => (
                            <div key={index} className={`border-2 rounded-xl p-4 ${
                              suggestion.type === 'decrease' || suggestion.type === 'remove'
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800' 
                                : suggestion.type === 'increase' || suggestion.type === 'add'
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800'
                                : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                            }`}>
                              <div className="flex items-start space-x-3">
                                <span className="text-2xl flex-shrink-0">{suggestion.icon}</span>
                                <div>
                                  <p className={`font-semibold mb-1 ${
                                    suggestion.type === 'decrease' || suggestion.type === 'remove'
                                      ? 'text-red-900 dark:text-red-300' 
                                      : suggestion.type === 'increase' || suggestion.type === 'add'
                                      ? 'text-blue-900 dark:text-blue-300'
                                      : 'text-green-900 dark:text-green-300'
                                  }`}>
                                    {suggestion.title}
                                  </p>
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">({suggestion.message})</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">{suggestion.reason}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Alternative Recommendations */}
                      {alternatives.length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">💡 Healthier Alternatives</h4>
                          <ul className="space-y-2">
                            {alternatives.map((alt, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{alt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Quantity Adjuster */}
                      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 mt-4">
                        <button
                          onClick={() => setScannedQuantity(Math.max(0.3, scannedQuantity - 0.1))}
                          className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                          <Minus className="w-5 h-5 text-gray-700 dark:text-white" />
                        </button>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800 dark:text-white">{scannedQuantity.toFixed(1)}x</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{scannedNutrition.servingSize}</p>
                        </div>
                        <button
                          onClick={() => setScannedQuantity(scannedQuantity + 0.1)}
                          className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center hover:bg-purple-600 transition"
                        >
                          <Plus className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setScannedNutrition(null);
                          setUploadedImage(null);
                        }}
                        className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      >
                        Retake
                      </button>
                      <button
                        onClick={logScannedFood}
                        className="flex-[2] py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center space-x-2"
                      >
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Log This Food</span>
                      </button>
                    </div>
                  </div>
                ) : scanError ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-800 dark:text-white mb-1">Scanning Failed</p>
                      <p className="text-sm text-red-600 dark:text-red-400">{scanError}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setScanError(null);
                      }}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Try Another Photo
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showManualEntry && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-50">
          <div className="w-full bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Manual Food Entry</h2>
              <button
                onClick={() => {
                  setShowManualEntry(false);
                  setManualFood({ name: "", quantity: "", unit: "g" });
                  setNutritionInfo(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Food Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Food Name
                </label>
                <input
                  type="text"
                  value={manualFood.name}
                  onChange={(e) => setManualFood({ ...manualFood, name: e.target.value })}
                  placeholder="e.g., Grilled Chicken"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={manualFood.quantity}
                    onChange={(e) => setManualFood({ ...manualFood, quantity: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit
                  </label>
                  <select
                    value={manualFood.unit}
                    onChange={(e) => setManualFood({ ...manualFood, unit: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-green-500 focus:outline-none"
                  >
                    <option value="g">grams (g)</option>
                    <option value="ml">milliliters (ml)</option>
                    <option value="cup">cup</option>
                    <option value="tbsp">tablespoon</option>
                    <option value="piece">piece</option>
                    <option value="serving">serving</option>
                  </select>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={() => {
                  if (manualFood.name && manualFood.quantity) {
                    // Simulate nutrition calculation
                    const qty = parseFloat(manualFood.quantity);
                    const baseCalories = qty * 1.5; // Simple estimation
                    setNutritionInfo({
                      name: manualFood.name,
                      quantity: qty,
                      unit: manualFood.unit,
                      calories: Math.round(baseCalories),
                      protein: Math.round(baseCalories * 0.15),
                      carbs: Math.round(baseCalories * 0.4),
                      fats: Math.round(baseCalories * 0.2),
                    });
                  }
                }}
                disabled={!manualFood.name || !manualFood.quantity}
                className={`w-full py-4 rounded-xl transition ${
                  manualFood.name && manualFood.quantity
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                Calculate Nutrition
              </button>

              {/* Nutrition Results */}
              {nutritionInfo && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-5 space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                      {nutritionInfo.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {nutritionInfo.quantity} {nutritionInfo.unit}
                    </p>
                  </div>

                  {/* Nutrition Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
                      <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        {nutritionInfo.calories}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">
                        {nutritionInfo.protein}g
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">
                        {nutritionInfo.carbs}g
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Fats</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">
                        {nutritionInfo.fats}g
                      </p>
                    </div>
                  </div>

                  {/* Log Button */}
                   <button
                    onClick={async () => {
                      if (!nutritionInfo) return;
                      const email = localStorage.getItem('currentUserEmail');
                      const logs = JSON.parse(localStorage.getItem(`foodLogs_${email}`) || '[]');
                      const timestamp = new Date().toISOString();
                      
                      const newLog = {
                        name: nutritionInfo.name,
                        calories: nutritionInfo.calories,
                        protein: nutritionInfo.protein,
                        carbs: nutritionInfo.carbs,
                        fats: nutritionInfo.fats,
                        quantity: 1,
                        unit: `${nutritionInfo.quantity}${nutritionInfo.unit}`,
                        timestamp: timestamp
                      };
                      
                      logs.push(newLog);
                      localStorage.setItem(`foodLogs_${email}`, JSON.stringify(logs));

                      // Sync to backend
                      try {
                        await api.post(endpoints.logFood, {
                          meal_type: getMealTypeByTime(),
                          food_name: nutritionInfo.name,
                          calories: nutritionInfo.calories,
                          protein: nutritionInfo.protein,
                          carbs: nutritionInfo.carbs,
                          fats: nutritionInfo.fats,
                          quantity: nutritionInfo.quantity,
                          date: new Date().toISOString().split('T')[0]
                        });
                        window.dispatchEvent(new Event('refreshDashboard'));
                      } catch (error) {
                        console.error("Manual log backend sync failed:", error);
                      }
                      
                      // Reset
                      setShowManualEntry(false);
                      setManualFood({ name: "", quantity: "", unit: "g" });
                      setNutritionInfo(null);
                      fetchMacrosData();
                      window.dispatchEvent(new Event('storage'));
                    }}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Log Food</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}