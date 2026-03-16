import { useState, useEffect } from "react";
import { RefreshCw, Edit2, Save, X, Plus, Minus, Info, Sparkles, AlertCircle, CheckCircle, Circle } from "lucide-react";
import { generateMealPlan, getUserProfile, getHealthRecommendations } from "@/app/helpers/meal-plan-helper";

interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  items: MealItem[];
  mealType: string;
}

export function MealPlanScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [editingMealIndex, setEditingMealIndex] = useState<number | null>(null);
  const [editedMeal, setEditedMeal] = useState<Meal | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [consumedMeals, setConsumedMeals] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadMealPlan();
    loadConsumedMeals();
  }, []);

  const loadMealPlan = () => {
    const email = localStorage.getItem('currentUserEmail');
    const saved = localStorage.getItem(`mealPlan_${email}`);
    
    if (saved) {
      setMeals(JSON.parse(saved));
    } else {
      generateNewMealPlan();
    }
  };

  const loadConsumedMeals = () => {
    const email = localStorage.getItem('currentUserEmail');
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`consumedMeals_${email}_${today}`);
    if (saved) {
      setConsumedMeals(new Set(JSON.parse(saved)));
    }
  };

  const generateNewMealPlan = () => {
    const mealsPerDay = parseInt(localStorage.getItem('mealsPerDay') || '4');
    const newMeals = generateMealPlan(mealsPerDay);
    setMeals(newMeals);
    
    // Save to localStorage
    const email = localStorage.getItem('currentUserEmail');
    localStorage.setItem(`mealPlan_${email}`, JSON.stringify(newMeals));
  };

  const toggleMealConsumed = (mealIndex: number) => {
    const email = localStorage.getItem('currentUserEmail');
    const today = new Date().toDateString();
    const meal = meals[mealIndex];
    const newConsumedMeals = new Set(consumedMeals);

    if (consumedMeals.has(mealIndex)) {
      newConsumedMeals.delete(mealIndex);
      // Remove from food logs
      const foodLogs = JSON.parse(localStorage.getItem(`foodLogs_${email}`) || '[]');
      const filteredLogs = foodLogs.filter((log: any) => 
        !(log.mealPlanIndex === mealIndex && new Date(log.timestamp).toDateString() === today)
      );
      localStorage.setItem(`foodLogs_${email}`, JSON.stringify(filteredLogs));
    } else {
      newConsumedMeals.add(mealIndex);
      // Add to food logs
      const foodLogs = JSON.parse(localStorage.getItem(`foodLogs_${email}`) || '[]');
      const timestamp = new Date().toISOString();
      meal.items.forEach((item) => {
        foodLogs.push({
          name: item.name,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fats: item.fats,
          quantity: 1,
          unit: 'serving',
          timestamp,
          mealPlanIndex: mealIndex,
          mealType: meal.mealType,
          source: 'meal_plan'
        });
      });
      localStorage.setItem(`foodLogs_${email}`, JSON.stringify(foodLogs));
    }

    const consumedArray = Array.from(newConsumedMeals);
    localStorage.setItem(`consumedMeals_${email}_${today}`, JSON.stringify(consumedArray));
    setConsumedMeals(newConsumedMeals);
    window.dispatchEvent(new Event('storage'));
  };

  const handleEditMeal = (index: number) => {
    setEditingMealIndex(index);
    setEditedMeal({ ...meals[index] });
  };

  const handleSaveMeal = () => {
    if (editingMealIndex !== null && editedMeal) {
      const updatedMeals = [...meals];
      updatedMeals[editingMealIndex] = editedMeal;
      setMeals(updatedMeals);
      
      // Save to localStorage
      const email = localStorage.getItem('currentUserEmail');
      localStorage.setItem(`mealPlan_${email}`, JSON.stringify(updatedMeals));
      
      setEditingMealIndex(null);
      setEditedMeal(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingMealIndex(null);
    setEditedMeal(null);
  };

  const updateItemQuantity = (itemIndex: number, newQuantityString: string) => {
    if (!editedMeal) return;
    
    const updatedItems = [...editedMeal.items];
    const item = updatedItems[itemIndex];
    
    // Store original values on first edit (if not already stored)
    if (!item.hasOwnProperty('_originalQuantity')) {
      (item as any)._originalQuantity = parseFloat(item.quantity);
      (item as any)._originalCalories = item.calories;
      (item as any)._originalProtein = item.protein;
      (item as any)._originalCarbs = item.carbs;
      (item as any)._originalFats = item.fats;
    }
    
    // Extract the unit from the current quantity
    const unit = item.quantity.replace(/[0-9.]/g, '').trim();
    
    // Allow empty string or partial input (for backspace handling)
    if (newQuantityString === '' || newQuantityString === '0') {
      updatedItems[itemIndex] = {
        ...item,
        quantity: newQuantityString + (unit ? ' ' + unit : ''),
      };
      setEditedMeal({
        ...editedMeal,
        items: updatedItems,
      });
      return;
    }
    
    // Parse new quantity - extract only the numeric part
    const newNumericValue = parseFloat(newQuantityString);
    
    // Only update if we have a valid number
    if (isNaN(newNumericValue)) return;
    
    // Get original values
    const originalQuantity = (item as any)._originalQuantity || parseFloat(item.quantity);
    const originalCalories = (item as any)._originalCalories || item.calories;
    const originalProtein = (item as any)._originalProtein || item.protein;
    const originalCarbs = (item as any)._originalCarbs || item.carbs;
    const originalFats = (item as any)._originalFats || item.fats;
    
    // Calculate based on original values to prevent cumulative errors
    const multiplier = newNumericValue / originalQuantity;
    
    updatedItems[itemIndex] = {
      ...item,
      quantity: newQuantityString + (unit ? ' ' + unit : ''),
      calories: Math.round(originalCalories * multiplier),
      protein: Math.round((originalProtein * multiplier) * 10) / 10,
      carbs: Math.round((originalCarbs * multiplier) * 10) / 10,
      fats: Math.round((originalFats * multiplier) * 10) / 10,
      _originalQuantity: originalQuantity,
      _originalCalories: originalCalories,
      _originalProtein: originalProtein,
      _originalCarbs: originalCarbs,
      _originalFats: originalFats
    } as any;
    
    // Recalculate meal totals from scratch (reset and recompute)
    const totals = updatedItems.reduce((sum, i) => ({
      calories: sum.calories + i.calories,
      protein: sum.protein + i.protein,
      carbs: sum.carbs + i.carbs,
      fats: sum.fats + i.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    
    setEditedMeal({
      ...editedMeal,
      items: updatedItems,
      ...totals
    });
  };

  const removeItem = (itemIndex: number) => {
    if (!editedMeal) return;
    
    const updatedItems = editedMeal.items.filter((_, i) => i !== itemIndex);
    
    // Recalculate meal totals
    const totals = updatedItems.reduce((sum, i) => ({
      calories: sum.calories + i.calories,
      protein: sum.protein + i.protein,
      carbs: sum.carbs + i.carbs,
      fats: sum.fats + i.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    
    setEditedMeal({
      ...editedMeal,
      items: updatedItems,
      ...totals
    });
  };

  const getTotalNutrition = () => {
    return meals.reduce((totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fats: totals.fats + meal.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const getConsumedNutrition = () => {
    return meals.reduce((totals, meal, index) => {
      if (consumedMeals.has(index)) {
        return {
          calories: totals.calories + meal.calories,
          protein: totals.protein + meal.protein,
          carbs: totals.carbs + meal.carbs,
          fats: totals.fats + meal.fats
        };
      }
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const profile = getUserProfile();
  const recommendations = getHealthRecommendations(profile);
  const totalNutrition = getTotalNutrition();
  const consumedNutrition = getConsumedNutrition();

  const getMealIcon = (mealType: string) => {
    const icons: any = {
      breakfast: '🌅',
      lunch: '🌞',
      dinner: '🌙',
      snack: '🍎'
    };
    return icons[mealType] || '🍽️';
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-8 pb-32 px-6 rounded-[2rem] shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between max-w-5xl mx-auto">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl text-white font-black tracking-tight mb-2">Today's Meal Plan</h1>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-semibold">
                🔥 Plan: {Math.round(totalNutrition.calories)} kcal
              </span>
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-semibold">
                ✅ Consumed: {Math.round(consumedNutrition.calories)} kcal
              </span>
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-semibold">
                {consumedMeals.size} of {meals.length} meals eaten
              </span>
            </div>
          </div>
          <button 
            onClick={generateNewMealPlan}
            className="self-start md:self-auto bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center space-x-2 text-white font-bold transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Generate New</span>
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meals.map((meal, index) => {
                const isEditing = editingMealIndex === index;
                const displayMeal = isEditing && editedMeal ? editedMeal : meal;
                const isConsumed = consumedMeals.has(index);

                return (
                  <div key={index} className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow border ${isConsumed ? 'border-green-400 ring-2 ring-green-400' : 'border-gray-100 dark:border-gray-700'}`}>
                    {/* Meal Header */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm text-2xl">
                          {getMealIcon(meal.mealType)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white capitalize">{meal.mealType}</h3>
                      </div>
                      {!isEditing ? (
                        <button onClick={() => handleEditMeal(index)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition">
                          <Edit2 className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="flex space-x-1">
                          <button onClick={handleCancelEdit} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition"><X className="w-5 h-5" /></button>
                          <button onClick={handleSaveMeal} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition"><Save className="w-5 h-5" /></button>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">{displayMeal.name}</h4>

                      {/* Mark as Eaten Button */}
                      <button
                        onClick={() => toggleMealConsumed(index)}
                        className={`w-full py-2.5 px-4 rounded-xl font-medium transition-all mb-4 flex items-center justify-center space-x-2 ${
                          isConsumed
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300'
                        }`}
                      >
                        {isConsumed ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Meal Consumed ✓</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-5 h-5" />
                            <span>Mark as Eaten</span>
                          </>
                        )}
                      </button>
                      
                      {/* Nutrition Grid */}
                      <div className="grid grid-cols-4 gap-2 mb-6">
                        <div className="bg-green-50/50 rounded-xl p-2 text-center border border-green-100">
                          <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Cals</p>
                          <p className="text-sm font-black text-green-700">{Math.round(displayMeal.calories)}</p>
                        </div>
                        <div className="bg-blue-50/50 rounded-xl p-2 text-center border border-blue-100">
                          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Prot</p>
                          <p className="text-sm font-black text-blue-700">{Math.round(displayMeal.protein)}g</p>
                        </div>
                        <div className="bg-orange-50/50 rounded-xl p-2 text-center border border-orange-100">
                          <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Carb</p>
                          <p className="text-sm font-black text-orange-700">{Math.round(displayMeal.carbs)}g</p>
                        </div>
                        <div className="bg-amber-50/50 rounded-xl p-2 text-center border border-amber-100">
                          <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Fat</p>
                          <p className="text-sm font-black text-amber-700">{Math.round(displayMeal.fats)}g</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-4">
                        {displayMeal.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl">
                            <div className="flex-1">
                              <p className="font-bold text-gray-800 dark:text-white text-sm">{item.name}</p>
                              {isEditing ? (
                                <div className="flex items-center space-x-2 mt-2">
                                  <input
                                    type="number"
                                    value={parseFloat(item.quantity) || ''}
                                    onChange={(e) => updateItemQuantity(itemIndex, e.target.value)}
                                    className="w-16 px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                  />
                                  <span className="text-[10px] font-bold text-gray-400">{item.quantity.replace(/[0-9.]/g, '').trim()}</span>
                                  <button onClick={() => removeItem(itemIndex)} className="text-red-400 hover:text-red-600"><Minus className="w-4 h-4" /></button>
                                </div>
                              ) : (
                                <p className="text-xs font-bold text-green-600">{item.quantity}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-black text-gray-800 dark:text-white text-sm">{item.calories} <span className="text-[10px] font-bold text-gray-400">kcal</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-8">
             {/* Target Box */}
             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-white/20">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Daily Target</h2>
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl mb-4">
                <span className="text-green-800 dark:text-green-300 font-bold">Recommended</span>
                <span className="text-xl font-black text-green-600">{profile.targetCalories} <span className="text-sm">kcal</span></span>
              </div>
              <div className={`p-4 rounded-2xl flex items-center justify-between font-bold ${
                Math.abs(totalNutrition.calories - profile.targetCalories) < 100 ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
              }`}>
                <span>Variance</span>
                <span>{totalNutrition.calories > profile.targetCalories ? '+' : ''}{Math.round(totalNutrition.calories - profile.targetCalories)} kcal</span>
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-900/30 rounded-3xl p-8">
                <div className="flex items-center space-x-3 mb-6 font-bold text-amber-900 dark:text-amber-400">
                  <Info className="w-6 h-6" />
                  <span>Health Insights</span>
                </div>
                <div className="space-y-4">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personalization Info */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
              <Sparkles className="w-12 h-12 mb-6 opacity-80 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Precision Plan</h3>
              <p className="text-blue-100 text-sm leading-relaxed font-medium">
                This plan is precision-tuned for <strong>{profile.goal.replace('-', ' ')}</strong>. We've optimized every macro to support your activity levels.
              </p>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}