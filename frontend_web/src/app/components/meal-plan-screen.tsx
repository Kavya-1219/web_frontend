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
    loadConsumedMeals();
  }, []);

  const loadMealPlan = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(endpoints.mealPlan);
      if (response.data && response.data.meals) {
        // Map backend response to frontend Meal interface
        const mappedMeals = response.data.meals.map((m: any) => ({
          name: m.name,
          calories: m.calories,
          protein: m.protein,
          carbs: m.carbs,
          fats: m.fats,
          fiber: m.fiber || 0,
          mealType: m.meal_type || m.mealType,
          items: m.items.map((i: any) => ({
            name: i.name,
            quantity: i.quantity,
            calories: i.calories,
            protein: i.protein,
            carbs: i.carbs,
            fats: i.fats,
          }))
        }));
        setMeals(mappedMeals);
      } else {
        throw new Error("Empty meal plan from server");
      }
    } catch (error) {
      console.error("Failed to fetch meal plan from backend, using local:", error);
      const email = localStorage.getItem('currentUserEmail');
      const saved = localStorage.getItem(`mealPlan_${email}`);
      if (saved) {
        setMeals(JSON.parse(saved));
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
          name: m.name,
          calories: m.calories,
          protein: m.protein,
          carbs: m.carbs,
          fats: m.fats,
          fiber: m.fiber || 0,
          mealType: m.meal_type || m.mealType,
          items: m.items.map((i: any) => ({
            name: i.name,
            quantity: i.quantity,
            calories: i.calories,
            protein: i.protein,
            carbs: i.carbs,
            fats: i.fats,
          }))
        }));
        setMeals(mappedMeals);
        const email = localStorage.getItem('currentUserEmail');
        localStorage.setItem(`mealPlan_${email}`, JSON.stringify(mappedMeals));
      }
    } catch (error) {
      console.error("Failed to generate new meal plan:", error);
      const mealsPerDay = parseInt(localStorage.getItem('mealsPerDay') || '4');
      const newMeals = generateMealPlan(mealsPerDay);
      setMeals(newMeals);
      const email = localStorage.getItem('currentUserEmail');
      localStorage.setItem(`mealPlan_${email}`, JSON.stringify(newMeals));
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen pb-24 bg-gray-50/50">
          <div className="bg-gradient-to-r from-green-600 to-green-700 pt-8 pb-6 px-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="w-full relative z-10">
          <button
            onClick={() => navigate("/app")}
            className="mb-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-95 text-white flex items-center space-x-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-xs uppercase tracking-widest">Back</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h1 className="text-3xl text-white font-bold tracking-tight mb-4">Today's Meal Plan</h1>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-[1.5rem] border border-white/20 shadow-inner flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-100 opacity-70">Target</span>
                  <span className="text-xl font-black text-white">{Math.round(totalNutrition.calories)} <span className="text-sm font-bold opacity-70">kcal</span></span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-[1.5rem] border border-white/20 shadow-inner flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-100 opacity-70">Consumed</span>
                  <span className="text-xl font-black text-white">{Math.round(consumedNutrition.calories)} <span className="text-sm font-bold opacity-70">kcal</span></span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-[1.5rem] border border-white/20 shadow-inner flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-100 opacity-70">Progress</span>
                  <span className="text-xl font-black text-white">{consumedMeals.size} / {meals.length} <span className="text-sm font-bold opacity-70">Meals</span></span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={generateNewMealPlan}
              className="group bg-white text-green-700 hover:bg-green-50 px-8 py-5 rounded-3xl flex items-center space-x-3 font-black transition-all shadow-2xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-lg">Generate New Plan</span>
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-black/5 rounded-full blur-2xl"></div>
      </div>

      <div className="px-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {meals.map((meal, index) => {
                const isEditing = editingMealIndex === index;
                const displayMeal = isEditing && editedMeal ? editedMeal : meal;
                const isConsumed = consumedMeals.has(index);

                return (
                  <div key={index} className={`bg-white rounded-[2.5rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 ${isConsumed ? 'border-green-500 scale-[1.02]' : 'border-transparent'}`}>
                    {/* Meal Header */}
                    <div className="p-8 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-3xl">
                          {getMealIcon(displayMeal.mealType)}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-gray-800 tracking-tight capitalize">{displayMeal.mealType}</h3>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{displayMeal.items.length} Items</p>
                        </div>
                      </div>
                      {!isEditing ? (
                        <button 
                          onClick={() => handleEditMeal(index)} 
                          className="p-3 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
                        >
                          <Edit2 className="w-6 h-6" />
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button onClick={handleCancelEdit} className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all active:scale-90"><X className="w-6 h-6" /></button>
                          <button onClick={handleSaveMeal} className="p-3 text-green-500 hover:bg-green-50 rounded-2xl transition-all active:scale-90"><Save className="w-6 h-6" /></button>
                        </div>
                      )}
                    </div>

                    <div className="p-8 space-y-8">
                      <h4 className="text-2xl font-black text-gray-800 tracking-tight leading-tight">{displayMeal.name}</h4>

                      {/* Nutrition Micro Grid */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center border border-gray-100">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Cals</span>
                          <span className="text-lg font-black text-gray-800">{Math.round(displayMeal.calories)}</span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center border border-gray-100">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Prot</span>
                          <span className="text-lg font-black text-gray-800">{Math.round(displayMeal.protein)}g</span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center border border-gray-100">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Carb</span>
                          <span className="text-lg font-black text-gray-800">{Math.round(displayMeal.carbs)}g</span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center border border-gray-100">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Fat</span>
                          <span className="text-lg font-black text-gray-800">{Math.round(displayMeal.fats)}g</span>
                        </div>
                      </div>

                      {/* Consumed States */}
                      <button
                        onClick={() => toggleMealConsumed(index)}
                        className={`w-full py-5 rounded-[1.75rem] font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                          isConsumed
                            ? 'bg-green-500 text-white shadow-xl shadow-green-100'
                            : 'bg-white text-gray-400 border-2 border-dashed border-gray-200 hover:border-green-300 hover:text-green-500'
                        }`}
                      >
                        {isConsumed ? (
                          <>
                            <CheckCircle className="w-6 h-6 animate-spring" />
                            <span>Plan Executed</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-6 h-6 opacity-30" />
                            <span>Mark as Consumed</span>
                          </>
                        )}
                      </button>

                      {/* Items Details */}
                      <div className="space-y-4">
                        <h5 className="text-xs font-black text-gray-300 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">Ingredients / Items</h5>
                        {displayMeal.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="group/item flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <div className="flex-1">
                              <p className="font-bold text-gray-700 group-hover/item:text-green-600 transition-colors uppercase tracking-tight">{item.name}</p>
                              {isEditing ? (
                                <div className="flex items-center space-x-3 mt-3">
                                  <div className="relative">
                                    <input
                                      type="number"
                                      value={parseFloat(item.quantity) || ''}
                                      onChange={(e) => updateItemQuantity(itemIndex, e.target.value)}
                                      className="w-20 px-4 py-2 bg-gray-50 rounded-xl font-black text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    />
                                    <span className="absolute right-[-2.5rem] top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">
                                      {item.quantity.replace(/[0-9.]/g, '').trim()}
                                    </span>
                                  </div>
                                  <button 
                                    onClick={() => removeItem(itemIndex)} 
                                    className="p-2 text-red-300 hover:text-red-500 transition-colors"
                                  >
                                    <Minus className="w-5 h-5" />
                                  </button>
                                </div>
                              ) : (
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1 group-hover/item:text-green-400 transition-colors">{item.quantity}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-black text-gray-800 tracking-tighter">{item.calories}</span>
                              <span className="ml-1 text-[10px] font-black text-gray-300 uppercase">kcal</span>
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

          {/* Sidebar / Analysis */}
          <div className="lg:col-span-4 space-y-8">
            {/* Health Analysis */}
            <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-white/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-150 transition-transform duration-1000">
                <Sparkles className="w-48 h-48 text-indigo-600" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                  <Sparkles className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-6">Plan Integrity</h2>
                
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Recommended Goal</span>
                       <span className="text-sm font-black text-indigo-600">{profile.targetCalories} kcal</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (totalNutrition.calories / profile.targetCalories) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-3xl flex items-center justify-between font-black ${
                    Math.abs(totalNutrition.calories - profile.targetCalories) < 100 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Variance</span>
                    </div>
                    <span className="text-lg">{totalNutrition.calories > profile.targetCalories ? '+' : ''}{Math.round(totalNutrition.calories - profile.targetCalories)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Insights */}
            {recommendations.length > 0 && (
              <div className="bg-amber-50 rounded-[2.5rem] p-10 border-2 border-amber-100/50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-amber-200 rounded-2xl flex items-center justify-center shadow-sm">
                    <Info className="w-6 h-6 text-amber-800" />
                  </div>
                  <h3 className="text-xl font-black text-amber-900 tracking-tight">Expert Analysis</h3>
                </div>
                <div className="space-y-6">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </div>
                      <p className="text-sm font-bold text-amber-800 leading-relaxed opacity-80 pt-1">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Precision Meta */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4 tracking-tight">Adaptive Planning</h3>
                  <p className="text-indigo-100 font-medium leading-relaxed opacity-90">
                    This strategy is dynamically calculated for <strong>{profile.goal.replace('-', ' ')}</strong>. Every meal adjusts your metabolic throughput.
                  </p>
               </div>
               <div className="absolute bottom-[-10%] right-[-10%] opacity-10">
                  <RefreshCw className="w-40 h-40 animate-[spin_10s_linear_infinite]" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}