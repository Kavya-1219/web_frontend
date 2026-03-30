import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, RefreshCw, Edit2, Save, X, Plus, Minus, Info, Sparkles, AlertCircle, CheckCircle, Circle } from "lucide-react";
import { generateMealPlan, getUserProfile, getHealthRecommendations } from "@/app/helpers/meal-plan-helper";
import api, { endpoints } from "../helpers/api";

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
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [editingMealIndex, setEditingMealIndex] = useState<number | null>(null);
  const [editedMeal, setEditedMeal] = useState<Meal | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [consumedMeals, setConsumedMeals] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMealPlan();

    const handleRefresh = () => loadMealPlan();
    window.addEventListener('refreshDashboard', handleRefresh);
    return () => window.removeEventListener('refreshDashboard', handleRefresh);
  }, []);

  const loadMealPlan = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(endpoints.mealPlan);
      if (response.data && response.data.meals) {
        // Map backend response to frontend Meal interface
        const mappedMeals = response.data.meals.map((m: any) => ({
          name: m.title || m.name,
          calories: m.calories,
          protein: m.protein,
          carbs: m.carbs,
          fats: m.fats,
          fiber: m.fiber || 0,
          mealType: m.mealType,
          isConsumed: m.is_consumed || m.isConsumed || false,
          items: (m.items || []).map((i: any) => ({
            name: i.name,
            quantity: i.quantity,
            calories: i.calories,
            protein: i.protein,
            carbs: i.carbs,
            fats: i.fats,
          }))
        }));
        setMeals(mappedMeals);
        
        // Update consumedMeals set
        const consumedSet = new Set<number>();
        mappedMeals.forEach((meal: any, index: number) => {
          if (meal.isConsumed) consumedSet.add(index);
        });
        setConsumedMeals(consumedSet);
      } else {
        throw new Error("Empty meal plan from server");
      }
    } catch (error) {
      console.error("Failed to fetch meal plan from backend:", error);
      // Fallback to local storage if backend fails
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = user.email || user.username || localStorage.getItem('currentUserEmail') || 'default';
      const saved = localStorage.getItem(`mealPlan_${userEmail}`);
      if (saved) {
        setMeals(JSON.parse(saved));
        setConsumedMeals(new Set());
      } else {
        generateNewMealPlan();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewMealPlan = async () => {
    setIsLoading(true);
    try {
      // POST to refresh the plan
      const response = await api.post(endpoints.mealPlan);
      if (response.data && response.data.meals) {
         const mappedMeals = response.data.meals.map((m: any) => ({
          name: m.title || m.name,
          calories: m.calories,
          protein: m.protein,
          carbs: m.carbs,
          fats: m.fats,
          fiber: m.fiber || 0,
          mealType: m.mealType,
          isConsumed: m.is_consumed || m.isConsumed || false,
          items: (m.items || []).map((i: any) => ({
            name: i.name,
            quantity: i.quantity,
            calories: i.calories,
            protein: i.protein,
            carbs: i.carbs,
            fats: i.fats,
          }))
        }));
        setMeals(mappedMeals);
        // Clear consumed status for a new plan
        setConsumedMeals(new Set());
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userEmail = user.email || user.username || localStorage.getItem('currentUserEmail') || 'default';
        localStorage.setItem(`mealPlan_${userEmail}`, JSON.stringify(mappedMeals)); // Keep local backup
      }
    } catch (error) {
      console.error("Failed to generate new meal plan:", error);
      const mealsPerDay = parseInt(localStorage.getItem('mealsPerDay') || '4');
      const newMeals = generateMealPlan(mealsPerDay);
      setMeals(newMeals);
      setConsumedMeals(new Set()); // Clear consumed status for a new plan
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = user.email || user.username || localStorage.getItem('currentUserEmail') || 'default';
      localStorage.setItem(`mealPlan_${userEmail}`, JSON.stringify(newMeals));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMealConsumed = async (mealIndex: number) => {
    const meal = meals[mealIndex];
    const newIsConsumed = !consumedMeals.has(mealIndex);
    
    // Optimistic UI update
    const newConsumedMeals = new Set(consumedMeals);
    if (newIsConsumed) {
      newConsumedMeals.add(mealIndex);
    } else {
      newConsumedMeals.delete(mealIndex);
    }
    setConsumedMeals(newConsumedMeals);

    try {
      // 1. Toggle in backend
      await api.post(endpoints.toggleMealConsumed, {
        meal_type: meal.mealType,
        is_eaten: newIsConsumed,
        date: new Date().toISOString().split('T')[0]
      });

      // 2. If consumed, log individual items to food history
      if (newIsConsumed) {
        const todayYMD = new Date().toISOString().split('T')[0];
        
        // Log items concurrently
        await Promise.all((meal.items || []).map(item => 
          api.post(endpoints.logFood, {
            meal_type: meal.mealType,
            food_name: item.name,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fats: item.fats,
            quantity: 100, 
            date: todayYMD
          }).catch(err => console.error(`Failed to log ${item.name}:`, err))
        ));
      }
      
      // Use the new dispatchRefresh helper
      const { dispatchRefresh } = await import("../helpers/api");
      dispatchRefresh();
    } catch (error) {
      console.error("Failed to toggle meal consumed status:", error);
      // Revert optimistic update on error
      const revertSet = new Set(consumedMeals);
      setConsumedMeals(revertSet);
      alert("Failed to update meal status. Please check your connection.");
    }
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-8 pb-20 px-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
             <button
              onClick={() => navigate("/app")}
              className="p-2 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl text-white font-semibold">Today's Meal Plan</h1>
          </div>
          <button 
            onClick={generateNewMealPlan}
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition"
          >
            <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-green-50 mb-1">Plan: {Math.round(totalNutrition.calories)} kcal • Consumed: {Math.round(consumedNutrition.calories)} kcal</p>
        <p className="text-green-50 text-sm">
          {consumedMeals.size} of {meals.length} meals eaten today
        </p>
        
        {/* Target Comparison */}
        <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/90">Target: {profile.targetCalories} kcal</span>
            <span className={`font-semibold ${
              Math.abs(consumedNutrition.calories - profile.targetCalories) < 100 ? 'text-green-300' : 'text-yellow-300'
            }`}>
              {consumedNutrition.calories > profile.targetCalories ? '+' : ''}
              {Math.round(consumedNutrition.calories - profile.targetCalories)} kcal
            </span>
          </div>
        </div>
      </div>

      {/* Personalization Banner */}
      <div className="px-6 -mt-12 mb-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">
                Personalized for Your Goals
              </h3>
              <p className="text-sm text-blue-800">
                This plan is customized for {profile.goal.replace('-', ' ')} and your {profile.dietType} diet.
                {profile.allergicFoods.length > 0 && ` Allergic foods excluded: ${profile.allergicFoods.join(', ')}.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Recommendations */}
      {recommendations.length > 0 && (
        <div className="px-6 mb-4">
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="w-full bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-center justify-between hover:bg-amber-100 transition"
          >
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-900">Health Recommendations</span>
            </div>
            <span className="text-amber-600">{showRecommendations ? '−' : '+'}</span>
          </button>
          
          {showRecommendations && (
            <div className="mt-2 bg-white border-2 border-amber-200 rounded-xl p-4 space-y-2">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Meal Cards - Single Column List */}
      <div className="px-6 space-y-4">
        {meals.map((meal, index) => {
          const isEditing = editingMealIndex === index;
          const displayMeal = isEditing && editedMeal ? editedMeal : meal;
          const isConsumed = consumedMeals.has(index);

          return (
            <div key={index} className={`bg-white rounded-2xl shadow-lg p-5 border-2 transition-all duration-300 ${isConsumed ? 'border-green-500' : 'border-transparent'}`}>
              {/* Meal Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl">{getMealIcon(meal.mealType)}</span>
                    <h3 className="text-lg font-semibold text-gray-800 capitalize">{meal.mealType}</h3>
                  </div>
                  <h4 className="text-base text-gray-600 mb-2">{displayMeal.name}</h4>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => handleEditMeal(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSaveMeal}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

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

              {/* Nutrition Summary */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">Calories</p>
                  <p className="text-sm font-bold text-green-600">{Math.round(displayMeal.calories)}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">Protein</p>
                  <p className="text-sm font-bold text-blue-600">{Math.round(displayMeal.protein)}g</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">Carbs</p>
                  <p className="text-sm font-bold text-orange-600">{Math.round(displayMeal.carbs)}g</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">Fats</p>
                  <p className="text-sm font-bold text-yellow-600">{Math.round(displayMeal.fats)}g</p>
                </div>
              </div>

              {/* Food Items */}
              <div className="space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Items</p>
                {displayMeal.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="border-t border-gray-100 pt-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        {isEditing ? (
                          <div className="flex items-center space-x-2 mt-1">
                            <input
                              type="number"
                              inputMode="decimal"
                              value={parseFloat(item.quantity) || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                  updateItemQuantity(itemIndex, value);
                                }
                              }}
                              onBlur={(e) => {
                                const value = e.target.value;
                                if (value === '' || value === '0') {
                                  updateItemQuantity(itemIndex, '1');
                                }
                              }}
                              className="w-24 px-2 py-1 text-sm border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                              min="0"
                              step="1"
                            />
                            <span className="text-sm text-gray-600">{item.quantity.replace(/[0-9.]/g, '').trim()}</span>
                            <button
                              onClick={() => removeItem(itemIndex)}
                              className="p-1"
                            >
                              <Minus className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-green-600">{item.quantity}</p>
                        )}
                      </div>
                      <div className="text-right ml-3">
                        <p className="font-semibold text-gray-800">{item.calories} kcal</p>
                        <p className="text-xs text-gray-500">
                          P:{Math.round(item.protein)}g C:{Math.round(item.carbs)}g F:{Math.round(item.fats)}g
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    💡 <strong>Tip:</strong> Adjust quantities to match your portions. Totals will update automatically!
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="px-6 mt-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-purple-800">
              <strong>Note:</strong> Mark meals as eaten to track your progress. 
              Click edit to customize portions or refresh to generate a new plan!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}