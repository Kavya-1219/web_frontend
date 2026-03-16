import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Minus, Check, X, UtensilsCrossed, TrendingUp, TrendingDown, Camera, Upload, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { getUserProfile } from "@/app/helpers/meal-plan-helper";

// Expanded food database with comprehensive nutrition
const foodDatabase = [
  // Fruits
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fats: 0.3, fiber: 3.1, vitaminC: 10, potassium: 422, iron: 0.3, calcium: 6, unit: "1 medium (118g)", category: "Fruits" },
  { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fats: 0.3, fiber: 4.4, vitaminC: 8, potassium: 195, iron: 0.2, calcium: 11, unit: "1 medium (182g)", category: "Fruits" },
  { name: "Orange", calories: 62, protein: 1.2, carbs: 15, fats: 0.2, fiber: 3.1, vitaminC: 70, potassium: 237, iron: 0.1, calcium: 52, unit: "1 medium (131g)", category: "Fruits" },
  { name: "Mango", calories: 60, protein: 0.8, carbs: 15, fats: 0.4, fiber: 1.6, vitaminC: 36, potassium: 168, iron: 0.2, calcium: 11, unit: "100g", category: "Fruits" },
  { name: "Watermelon", calories: 30, protein: 0.6, carbs: 8, fats: 0.2, fiber: 0.4, vitaminC: 8, potassium: 112, iron: 0.2, calcium: 7, unit: "100g", category: "Fruits" },
  
  // Proteins
  { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, vitaminC: 0, potassium: 256, iron: 0.9, calcium: 15, unit: "100g", category: "Proteins" },
  { name: "Salmon", calories: 208, protein: 20, carbs: 0, fats: 13, fiber: 0, vitaminC: 0, potassium: 628, iron: 0.8, calcium: 12, unit: "100g", category: "Proteins" },
  { name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fats: 11, fiber: 0, vitaminC: 0, potassium: 138, iron: 1.8, calcium: 56, unit: "2 large", category: "Proteins" },
  { name: "Paneer", calories: 265, protein: 18, carbs: 3.6, fats: 20, fiber: 0, vitaminC: 0, potassium: 256, iron: 0.2, calcium: 480, unit: "100g", category: "Proteins" },
  { name: "Tofu", calories: 76, protein: 8, carbs: 1.9, fats: 4.8, fiber: 0.3, vitaminC: 0, potassium: 121, iron: 5.4, calcium: 350, unit: "100g", category: "Proteins" },
  { name: "Lentils (Dal)", calories: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 7.9, vitaminC: 1, potassium: 369, iron: 3.3, calcium: 19, unit: "100g cooked", category: "Proteins" },
  
  // Carbs
  { name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fats: 1.8, fiber: 3.5, vitaminC: 0, potassium: 154, iron: 0.8, calcium: 20, unit: "1 cup cooked", category: "Carbs" },
  { name: "White Rice", calories: 205, protein: 4.3, carbs: 45, fats: 0.4, fiber: 0.6, vitaminC: 0, potassium: 55, iron: 0.2, calcium: 16, unit: "1 cup cooked", category: "Carbs" },
  { name: "Roti (Chapati)", calories: 71, protein: 3, carbs: 15, fats: 0.4, fiber: 2.7, vitaminC: 0, potassium: 58, iron: 0.9, calcium: 10, unit: "1 medium", category: "Carbs" },
  { name: "Quinoa", calories: 222, protein: 8, carbs: 39, fats: 3.6, fiber: 5.2, vitaminC: 0, potassium: 318, iron: 2.8, calcium: 31, unit: "1 cup cooked", category: "Carbs" },
  { name: "Oats", calories: 389, protein: 17, carbs: 66, fats: 7, fiber: 10.6, vitaminC: 0, potassium: 429, iron: 4.7, calcium: 54, unit: "100g", category: "Carbs" },
  { name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3, vitaminC: 2, potassium: 337, iron: 0.6, calcium: 30, unit: "100g", category: "Carbs" },
  
  // Dairy
  { name: "Greek Yogurt", calories: 100, protein: 10, carbs: 6, fats: 4, fiber: 0, vitaminC: 0, potassium: 220, iron: 0.1, calcium: 200, unit: "150g", category: "Dairy" },
  { name: "Milk", calories: 122, protein: 8, carbs: 12, fats: 5, fiber: 0, vitaminC: 0, potassium: 366, iron: 0.1, calcium: 276, unit: "1 cup", category: "Dairy" },
  { name: "Curd", calories: 98, protein: 11, carbs: 4.7, fats: 4.3, fiber: 0, vitaminC: 0, potassium: 234, iron: 0.1, calcium: 275, unit: "1 cup", category: "Dairy" },
  
  // Snacks & Others
  { name: "Almonds", calories: 164, protein: 6, carbs: 6, fats: 14, fiber: 3.5, vitaminC: 0, potassium: 208, iron: 1.1, calcium: 76, unit: "28g (23 almonds)", category: "Snacks" },
  { name: "Peanut Butter", calories: 188, protein: 8, carbs: 7, fats: 16, fiber: 1.6, vitaminC: 0, potassium: 189, iron: 0.5, calcium: 17, unit: "2 tbsp", category: "Snacks" },
  { name: "Avocado", calories: 234, protein: 2.9, carbs: 12, fats: 21, fiber: 10, vitaminC: 20, potassium: 708, iron: 0.8, calcium: 18, unit: "1 whole", category: "Snacks" },
  { name: "Dark Chocolate", calories: 155, protein: 1.4, carbs: 17, fats: 9, fiber: 2.2, vitaminC: 0, potassium: 158, iron: 2.3, calcium: 16, unit: "28g", category: "Snacks" },
  
  // Vegetables
  { name: "Broccoli", calories: 55, protein: 3.7, carbs: 11, fats: 0.6, fiber: 2.4, vitaminC: 89, potassium: 288, iron: 0.7, calcium: 43, unit: "1 cup", category: "Vegetables" },
  { name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2, vitaminC: 28, potassium: 558, iron: 2.7, calcium: 99, unit: "100g", category: "Vegetables" },
  { name: "Carrot", calories: 41, protein: 0.9, carbs: 10, fats: 0.2, fiber: 2.8, vitaminC: 6, potassium: 320, iron: 0.3, calcium: 33, unit: "1 medium", category: "Vegetables" },
];

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

interface ScannedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  unit: string;
  quantity: number;
  image: string;
  confidence: number;
}

export function FoodLoggingScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<typeof foodDatabase[0] | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showImageScan, setShowImageScan] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFood, setScannedFood] = useState<ScannedFood | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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

  useEffect(() => {
    const profile = getUserProfile();
    setTargetCalories(profile.targetCalories);
    loadTodayLogs();
  }, []);

  const loadTodayLogs = () => {
    const today = new Date().toDateString();
    const email = localStorage.getItem('currentUserEmail');
    const logs = JSON.parse(localStorage.getItem(`foodLogs_${email}`) || '[]');
    
    const todayLogs = logs.filter((log: LoggedFood) => 
      new Date(log.timestamp).toDateString() === today
    );
    
    const totalCals = todayLogs.reduce((sum: number, log: LoggedFood) => 
      sum + (log.calories * log.quantity), 0
    );
    const totalProtein = todayLogs.reduce((sum: number, log: LoggedFood) => 
      sum + (log.protein * log.quantity), 0
    );
    const totalCarbs = todayLogs.reduce((sum: number, log: LoggedFood) => 
      sum + (log.carbs * log.quantity), 0
    );
    const totalFats = todayLogs.reduce((sum: number, log: LoggedFood) => 
      sum + (log.fats * log.quantity), 0
    );
    
    setTodayCalories(Math.round(totalCals));
    setTodayProtein(Math.round(totalProtein));
    setTodayCarbs(Math.round(totalCarbs));
    setTodayFats(Math.round(totalFats));
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
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate AI food detection
    const detectedFoods = [
      { name: "Grilled Chicken Salad", calories: 320, protein: 38, carbs: 15, fats: 12, unit: "1 serving", quantity: 1, confidence: 0.94 },
      { name: "Mixed Rice Bowl", calories: 450, protein: 12, carbs: 68, fats: 14, unit: "1 bowl", quantity: 1, confidence: 0.89 },
      { name: "Paneer Tikka", calories: 280, protein: 22, carbs: 8, fats: 18, unit: "150g", quantity: 1, confidence: 0.92 },
      { name: "Fruit Salad", calories: 120, protein: 2, carbs: 28, fats: 0.5, unit: "1 cup", quantity: 1, confidence: 0.91 },
      { name: "Pasta Primavera", calories: 380, protein: 14, carbs: 52, fats: 13, unit: "1 plate", quantity: 1, confidence: 0.87 }
    ];
    
    const randomFood = detectedFoods[Math.floor(Math.random() * detectedFoods.length)];
    
    setScannedFood({
      ...randomFood,
      image: imageData
    });
    setIsScanning(false);
  };

  const getSuggestion = (food: ScannedFood) => {
    const foodCalories = food.calories * food.quantity;
    const remainingCalories = targetCalories - todayCalories;
    const percentageOfDaily = (foodCalories / targetCalories) * 100;

    if (remainingCalories < foodCalories * 0.5) {
      const suggestedQuantity = Math.max(0.3, (remainingCalories / food.calories)).toFixed(1);
      return {
        type: 'decrease',
        message: `Consider reducing to ${suggestedQuantity}x portion`,
        reason: `This will add ${foodCalories} kcal, but you only have ${remainingCalories} kcal remaining today.`
      };
    } else if (remainingCalories > foodCalories * 2 && todayCalories < targetCalories * 0.5) {
      return {
        type: 'increase',
        message: `You can eat ${(remainingCalories / food.calories).toFixed(1)}x more`,
        reason: `You still have ${remainingCalories} kcal to reach your daily goal.`
      };
    } else {
      return {
        type: 'perfect',
        message: 'Perfect portion size!',
        reason: `This meal is ${percentageOfDaily.toFixed(0)}% of your daily target.`
      };
    }
  };

  const logScannedFood = () => {
    if (!scannedFood) return;

    const email = localStorage.getItem('currentUserEmail');
    const logs = JSON.parse(localStorage.getItem(`foodLogs_${email}`) || '[]');
    
    logs.push({
      name: scannedFood.name,
      calories: scannedFood.calories,
      protein: scannedFood.protein,
      carbs: scannedFood.carbs,
      fats: scannedFood.fats,
      quantity: scannedFood.quantity,
      unit: scannedFood.unit,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(`foodLogs_${email}`, JSON.stringify(logs));
    
    // Reset
    setScannedFood(null);
    setUploadedImage(null);
    setShowImageScan(false);
    loadTodayLogs();
  };

  const logFood = () => {
    if (!selectedFood) return;

    const email = localStorage.getItem('currentUserEmail');
    const logs = JSON.parse(localStorage.getItem(`foodLogs_${email}`) || '[]');
    
    logs.push({
      name: selectedFood.name,
      calories: selectedFood.calories,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fats: selectedFood.fats,
      quantity: quantity,
      unit: selectedFood.unit,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(`foodLogs_${email}`, JSON.stringify(logs));
    
    setSelectedFood(null);
    setQuantity(1);
    setSearchQuery("");
    loadTodayLogs();
  };

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const remainingCalories = targetCalories - todayCalories;
  const calorieProgress = Math.min((todayCalories / targetCalories) * 100, 100);

  const suggestion = scannedFood ? getSuggestion(scannedFood) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 dark:from-pink-700 dark:to-orange-700 pt-8 pb-24 px-6 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <UtensilsCrossed className="w-8 h-8 text-white" />
          <h1 className="text-2xl text-white font-semibold">Log Food</h1>
        </div>
        <p className="text-pink-50 ml-14">Track your meals with AI precision</p>
      </div>

      {/* Today's Progress Card */}
      <div className="px-6 -mt-16 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border-2 border-pink-100 dark:border-pink-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-white text-lg">Today's Calories</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Daily nutrition tracker</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                {todayCalories}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">of {targetCalories} kcal</p>
            </div>
          </div>
          
          <div className="relative h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-5 shadow-inner">
            <div 
              className={`h-full transition-all duration-500 ${
                calorieProgress > 100 
                  ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700' 
                  : 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500'
              }`}
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            />
          </div>

          {remainingCalories > 0 ? (
            <div className="flex items-center justify-center space-x-2 mb-4 bg-green-50 dark:bg-green-900/20 rounded-xl py-2">
              <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                {remainingCalories} kcal remaining today
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 mb-4 bg-red-50 dark:bg-red-900/20 rounded-xl py-2">
              <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                {Math.abs(remainingCalories)} kcal over target
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 text-center border-2 border-blue-200 dark:border-blue-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Protein</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{todayProtein}g</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-3 text-center border-2 border-amber-200 dark:border-amber-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Carbs</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{todayCarbs}g</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-3 text-center border-2 border-orange-200 dark:border-orange-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Fats</p>
              <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{todayFats}g</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Manual Entry Button - Full Width */}
        <button
          onClick={() => setShowManualEntry(true)}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-2xl p-5 hover:shadow-2xl transition-all active:scale-95 flex items-center space-x-4 border-2 border-pink-400 shadow-lg"
        >
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8" />
          </div>
          <div className="text-left flex-1">
            <span className="font-bold block text-lg">Manual Entry</span>
            <span className="text-sm opacity-90">Type and log food</span>
          </div>
        </button>

        {/* Scan and Upload Buttons - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowImageScan(true)}
            className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white rounded-2xl p-5 hover:shadow-2xl transition-all active:scale-95 flex flex-col items-center space-y-3 border-2 border-purple-400 shadow-lg"
          >
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
            <div className="text-center">
              <span className="font-semibold block">Scan Food</span>
              <span className="text-xs opacity-90">AI Detection</span>
            </div>
          </button>

          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e: any) => {
                const file = e.target?.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setUploadedImage(reader.result as string);
                    analyzeImage(reader.result as string);
                    setShowImageScan(true);
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
            className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white rounded-2xl p-5 hover:shadow-2xl transition-all active:scale-95 flex flex-col items-center space-y-3 border-2 border-green-400 shadow-lg"
          >
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <div className="text-center">
              <span className="font-semibold block">Upload</span>
              <span className="text-xs opacity-90">From Gallery</span>
            </div>
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-pink-500" />
            <h3 className="font-semibold text-gray-800 dark:text-white text-lg">Search Food</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for food..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-pink-500 focus:outline-none transition"
            />
          </div>

          {searchQuery && (
            <div className="mt-4 max-h-72 overflow-y-auto space-y-2">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedFood(food);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-4 py-4 bg-gradient-to-r from-gray-50 to-pink-50 dark:bg-gray-700 hover:from-pink-100 hover:to-red-100 dark:hover:bg-gray-600 rounded-xl transition border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{food.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{food.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">{food.calories}</p>
                        <p className="text-xs text-gray-500">kcal</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No foods found</p>
              )}
            </div>
          )}
        </div>

        {/* Selected Food */}
        {selectedFood && (
          <div className="bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 border-2 border-pink-300 dark:border-pink-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg">{selectedFood.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedFood.unit}</p>
                </div>
              </div>
              <button onClick={() => setSelectedFood(null)} className="text-gray-500 hover:text-red-500 p-2 hover:bg-white/50 rounded-lg transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-5">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-md">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Calories</p>
                <p className="text-lg font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">{Math.round(selectedFood.calories * quantity)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-md">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Protein</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(selectedFood.protein * quantity).toFixed(1)}g</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-md">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Carbs</p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{(selectedFood.carbs * quantity).toFixed(1)}g</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-md">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fats</p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{(selectedFood.fats * quantity).toFixed(1)}g</p>
              </div>
            </div>

            {/* Quantity Adjuster */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-5 mb-5 shadow-md">
              <button
                onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:shadow-lg transition active:scale-95"
              >
                <Minus className="w-6 h-6 text-gray-700 dark:text-white" />
              </button>
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">{quantity}x</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedFood.unit}</p>
              </div>
              <button
                onClick={() => setQuantity(quantity + 0.5)}
                className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center hover:shadow-lg transition active:scale-95"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>

            <button
              onClick={logFood}
              className="w-full py-4 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white rounded-xl hover:shadow-2xl transition flex items-center justify-center space-x-2 font-semibold border-2 border-pink-400"
            >
              <Check className="w-6 h-6" />
              <span>Log Food</span>
            </button>
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
                  setScannedFood(null);
                  setUploadedImage(null);
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
                ) : scannedFood ? (
                  <div className="space-y-4">
                    {/* Detection Result */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{scannedFood.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Confidence: {(scannedFood.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      {/* Nutrition Breakdown */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
                          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            {Math.round(scannedFood.calories * scannedFood.quantity)}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
                          <p className="text-xl font-bold text-gray-800 dark:text-white">
                            {Math.round(scannedFood.protein * scannedFood.quantity)}g
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
                          <p className="text-xl font-bold text-gray-800 dark:text-white">
                            {Math.round(scannedFood.carbs * scannedFood.quantity)}g
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Fats</p>
                          <p className="text-xl font-bold text-gray-800 dark:text-white">
                            {Math.round(scannedFood.fats * scannedFood.quantity)}g
                          </p>
                        </div>
                      </div>

                      {/* AI Suggestion */}
                      {suggestion && (
                        <div className={`border-2 rounded-xl p-4 ${
                          suggestion.type === 'decrease' 
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800' 
                            : suggestion.type === 'increase'
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800'
                            : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                        }`}>
                          <div className="flex items-start space-x-3">
                            {suggestion.type === 'decrease' ? (
                              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                            ) : suggestion.type === 'increase' ? (
                              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                            ) : (
                              <Check className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                            )}
                            <div>
                              <p className={`font-semibold mb-1 ${
                                suggestion.type === 'decrease' 
                                  ? 'text-red-900 dark:text-red-300' 
                                  : suggestion.type === 'increase'
                                  ? 'text-blue-900 dark:text-blue-300'
                                  : 'text-green-900 dark:text-green-300'
                              }`}>
                                {suggestion.message}
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.reason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quantity Adjuster */}
                      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 mt-4">
                        <button
                          onClick={() => setScannedFood({...scannedFood, quantity: Math.max(0.3, scannedFood.quantity - 0.1)})}
                          className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                          <Minus className="w-5 h-5 text-gray-700 dark:text-white" />
                        </button>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800 dark:text-white">{scannedFood.quantity.toFixed(1)}x</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{scannedFood.unit}</p>
                        </div>
                        <button
                          onClick={() => setScannedFood({...scannedFood, quantity: scannedFood.quantity + 0.1})}
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
                          setScannedFood(null);
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
                    onClick={() => {
                      const email = localStorage.getItem('currentUserEmail');
                      const logs = JSON.parse(localStorage.getItem(`foodLogs_${email}`) || '[]');
                      
                      logs.push({
                        name: nutritionInfo.name,
                        calories: nutritionInfo.calories,
                        protein: nutritionInfo.protein,
                        carbs: nutritionInfo.carbs,
                        fats: nutritionInfo.fats,
                        quantity: 1,
                        unit: `${nutritionInfo.quantity}${nutritionInfo.unit}`,
                        timestamp: new Date().toISOString()
                      });
                      
                      localStorage.setItem(`foodLogs_${email}`, JSON.stringify(logs));
                      
                      // Reset
                      setShowManualEntry(false);
                      setManualFood({ name: "", quantity: "", unit: "g" });
                      setNutritionInfo(null);
                      loadTodayLogs();
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