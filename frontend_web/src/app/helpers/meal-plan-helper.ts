// Meal Plan Helper - Generates personalized meal plans based on user profile

interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  dietType: string;
  goal: string;
  healthConditions: string[];
  allergicFoods: string[];
  targetCalories: number;
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

interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// Comprehensive meal database organized by diet type
const mealDatabase = {
  vegetarian: {
    breakfast: [
      {
        name: "Protein-Rich Oats Bowl",
        items: [
          { name: "Oats", quantity: "50g", calories: 195, protein: 8.5, carbs: 33, fats: 3.5 },
          { name: "Milk", quantity: "200ml", calories: 122, protein: 8, carbs: 12, fats: 5 },
          { name: "Almonds", quantity: "15g", calories: 87, protein: 3.2, carbs: 3.2, fats: 7.5 },
          { name: "Banana", quantity: "1 medium", calories: 105, protein: 1.3, carbs: 27, fats: 0.3 }
        ]
      },
      {
        name: "Paneer Sandwich with Veggies",
        items: [
          { name: "Whole Wheat Bread", quantity: "2 slices", calories: 140, protein: 6, carbs: 26, fats: 2 },
          { name: "Paneer", quantity: "50g", calories: 132, protein: 9, carbs: 1.8, fats: 10 },
          { name: "Vegetables (tomato, cucumber)", quantity: "50g", calories: 15, protein: 0.5, carbs: 3, fats: 0 },
          { name: "Butter", quantity: "5g", calories: 36, protein: 0, carbs: 0, fats: 4 }
        ]
      },
      {
        name: "Poha with Peanuts",
        items: [
          { name: "Flattened Rice (Poha)", quantity: "60g", calories: 222, protein: 4.2, carbs: 48, fats: 1.2 },
          { name: "Peanuts", quantity: "15g", calories: 85, protein: 3.8, carbs: 3.2, fats: 7.2 },
          { name: "Vegetables", quantity: "50g", calories: 20, protein: 1, carbs: 4, fats: 0 },
          { name: "Oil", quantity: "5ml", calories: 45, protein: 0, carbs: 0, fats: 5 }
        ]
      }
    ],
    lunch: [
      {
        name: "Dal Rice with Vegetables",
        items: [
          { name: "Brown Rice", quantity: "150g cooked", calories: 162, protein: 3.8, carbs: 33.8, fats: 1.4 },
          { name: "Moong Dal", quantity: "100g cooked", calories: 116, protein: 9, carbs: 20, fats: 0.4 },
          { name: "Mixed Vegetables", quantity: "100g", calories: 55, protein: 2.5, carbs: 10, fats: 0.5 },
          { name: "Roti", quantity: "2 medium", calories: 142, protein: 6, carbs: 30, fats: 0.8 }
        ]
      },
      {
        name: "Paneer Curry with Quinoa",
        items: [
          { name: "Quinoa", quantity: "150g cooked", calories: 167, protein: 6, carbs: 29.2, fats: 2.7 },
          { name: "Paneer Curry", quantity: "150g", calories: 265, protein: 18, carbs: 8, fats: 18 },
          { name: "Salad", quantity: "100g", calories: 25, protein: 1, carbs: 5, fats: 0 }
        ]
      },
      {
        name: "Chole with Brown Rice",
        items: [
          { name: "Chickpeas (Chole)", quantity: "150g", calories: 210, protein: 12, carbs: 35, fats: 3.5 },
          { name: "Brown Rice", quantity: "150g", calories: 162, protein: 3.8, carbs: 33.8, fats: 1.4 },
          { name: "Curd", quantity: "100g", calories: 60, protein: 3.5, carbs: 4.5, fats: 3 }
        ]
      }
    ],
    dinner: [
      {
        name: "Vegetable Khichdi",
        items: [
          { name: "Rice", quantity: "50g", calories: 102, protein: 2.2, carbs: 22.5, fats: 0.2 },
          { name: "Moong Dal", quantity: "50g", calories: 58, protein: 4.5, carbs: 10, fats: 0.2 },
          { name: "Mixed Vegetables", quantity: "100g", calories: 55, protein: 2.5, carbs: 10, fats: 0.5 },
          { name: "Ghee", quantity: "5g", calories: 45, protein: 0, carbs: 0, fats: 5 }
        ]
      },
      {
        name: "Roti with Palak Paneer",
        items: [
          { name: "Roti", quantity: "2 medium", calories: 142, protein: 6, carbs: 30, fats: 0.8 },
          { name: "Palak Paneer", quantity: "150g", calories: 180, protein: 12, carbs: 8, fats: 12 },
          { name: "Curd", quantity: "100g", calories: 60, protein: 3.5, carbs: 4.5, fats: 3 }
        ]
      }
    ],
    snacks: [
      {
        name: "Mixed Nuts & Fruits",
        items: [
          { name: "Almonds", quantity: "20g", calories: 116, protein: 4.3, carbs: 4.3, fats: 10 },
          { name: "Apple", quantity: "1 medium", calories: 95, protein: 0.5, carbs: 25, fats: 0.3 }
        ]
      },
      {
        name: "Sprouts Salad",
        items: [
          { name: "Mixed Sprouts", quantity: "100g", calories: 90, protein: 8, carbs: 15, fats: 0.5 },
          { name: "Lemon & Spices", quantity: "10g", calories: 5, protein: 0, carbs: 1, fats: 0 }
        ]
      }
    ]
  },
  nonVegetarian: {
    breakfast: [
      {
        name: "Egg Omelette with Toast",
        items: [
          { name: "Eggs", quantity: "2 large", calories: 155, protein: 13, carbs: 1.1, fats: 11 },
          { name: "Whole Wheat Toast", quantity: "2 slices", calories: 140, protein: 6, carbs: 26, fats: 2 },
          { name: "Butter", quantity: "5g", calories: 36, protein: 0, carbs: 0, fats: 4 },
          { name: "Orange Juice", quantity: "1 cup", calories: 112, protein: 1.7, carbs: 26, fats: 0.5 }
        ]
      },
      {
        name: "Chicken Sandwich",
        items: [
          { name: "Whole Wheat Bread", quantity: "2 slices", calories: 140, protein: 6, carbs: 26, fats: 2 },
          { name: "Grilled Chicken", quantity: "60g", calories: 99, protein: 18.6, carbs: 0, fats: 2.2 },
          { name: "Vegetables", quantity: "50g", calories: 15, protein: 0.5, carbs: 3, fats: 0 }
        ]
      }
    ],
    lunch: [
      {
        name: "Grilled Chicken with Brown Rice",
        items: [
          { name: "Grilled Chicken Breast", quantity: "150g", calories: 248, protein: 46.5, carbs: 0, fats: 5.4 },
          { name: "Brown Rice", quantity: "150g", calories: 162, protein: 3.8, carbs: 33.8, fats: 1.4 },
          { name: "Steamed Vegetables", quantity: "100g", calories: 55, protein: 2.5, carbs: 10, fats: 0.5 },
          { name: "Salad", quantity: "100g", calories: 25, protein: 1, carbs: 5, fats: 0 }
        ]
      },
      {
        name: "Fish Curry with Rice",
        items: [
          { name: "Fish Curry", quantity: "150g", calories: 200, protein: 25, carbs: 3, fats: 10 },
          { name: "White Rice", quantity: "150g", calories: 154, protein: 3.2, carbs: 33.8, fats: 0.3 },
          { name: "Dal", quantity: "100g", calories: 116, protein: 9, carbs: 20, fats: 0.4 }
        ]
      }
    ],
    dinner: [
      {
        name: "Chicken Stir-Fry",
        items: [
          { name: "Chicken Breast", quantity: "120g", calories: 198, protein: 37.2, carbs: 0, fats: 4.3 },
          { name: "Mixed Vegetables", quantity: "150g", calories: 83, protein: 3.8, carbs: 15, fats: 0.8 },
          { name: "Brown Rice", quantity: "100g", calories: 108, protein: 2.5, carbs: 22.5, fats: 0.9 }
        ]
      },
      {
        name: "Grilled Fish with Quinoa",
        items: [
          { name: "Grilled Salmon", quantity: "120g", calories: 250, protein: 24, carbs: 0, fats: 15.6 },
          { name: "Quinoa", quantity: "150g", calories: 167, protein: 6, carbs: 29.2, fats: 2.7 },
          { name: "Steamed Broccoli", quantity: "100g", calories: 55, protein: 3.7, carbs: 11, fats: 0.6 }
        ]
      }
    ],
    snacks: [
      {
        name: "Boiled Eggs & Fruit",
        items: [
          { name: "Boiled Eggs", quantity: "2", calories: 155, protein: 13, carbs: 1.1, fats: 11 },
          { name: "Apple", quantity: "1 medium", calories: 95, protein: 0.5, carbs: 25, fats: 0.3 }
        ]
      }
    ]
  },
  vegan: {
    breakfast: [
      {
        name: "Oatmeal with Almond Milk",
        items: [
          { name: "Oats", quantity: "50g", calories: 195, protein: 8.5, carbs: 33, fats: 3.5 },
          { name: "Almond Milk", quantity: "200ml", calories: 60, protein: 2, carbs: 8, fats: 2.5 },
          { name: "Chia Seeds", quantity: "10g", calories: 49, protein: 1.6, carbs: 4.2, fats: 3.1 },
          { name: "Berries", quantity: "50g", calories: 29, protein: 0.4, carbs: 7, fats: 0.2 }
        ]
      }
    ],
    lunch: [
      {
        name: "Tofu Buddha Bowl",
        items: [
          { name: "Tofu", quantity: "150g", calories: 114, protein: 12, carbs: 2.9, fats: 7.2 },
          { name: "Brown Rice", quantity: "150g", calories: 162, protein: 3.8, carbs: 33.8, fats: 1.4 },
          { name: "Mixed Vegetables", quantity: "150g", calories: 83, protein: 3.8, carbs: 15, fats: 0.8 },
          { name: "Tahini Dressing", quantity: "15g", calories: 89, protein: 2.6, carbs: 3.2, fats: 8 }
        ]
      }
    ],
    dinner: [
      {
        name: "Lentil Curry with Rice",
        items: [
          { name: "Red Lentils", quantity: "100g", calories: 116, protein: 9, carbs: 20, fats: 0.4 },
          { name: "Brown Rice", quantity: "150g", calories: 162, protein: 3.8, carbs: 33.8, fats: 1.4 },
          { name: "Coconut Milk", quantity: "50ml", calories: 115, protein: 1.2, carbs: 2.8, fats: 12 }
        ]
      }
    ],
    snacks: [
      {
        name: "Hummus with Veggies",
        items: [
          { name: "Hummus", quantity: "60g", calories: 102, protein: 3, carbs: 12, fats: 5 },
          { name: "Carrot Sticks", quantity: "100g", calories: 41, protein: 0.9, carbs: 10, fats: 0.2 }
        ]
      }
    ]
  }
};

// Get user profile from localStorage
export function getUserProfile(): UserProfile {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email || user.username || localStorage.getItem('currentUserEmail') || 'default';
  
  const personalDetails = JSON.parse(localStorage.getItem(`personalDetails_${userEmail}`) || localStorage.getItem('personalDetails') || '{}');
  const bodyDetails = JSON.parse(localStorage.getItem(`bodyDetails_${userEmail}`) || localStorage.getItem('bodyDetails') || '{}');
  const lifestyle = JSON.parse(localStorage.getItem(`lifestyle_${userEmail}`) || localStorage.getItem('lifestyle') || '{}');
  const foodPreferences = JSON.parse(localStorage.getItem(`foodPreferences_${userEmail}`) || localStorage.getItem('foodPreferences') || '{}');
  const goals = JSON.parse(localStorage.getItem(`userGoals_${userEmail}`) || localStorage.getItem('userGoals') || '["maintain-weight"]');
  const healthConditions = JSON.parse(localStorage.getItem(`healthConditions_${userEmail}`) || localStorage.getItem('healthConditions') || '[]');
  const healthConditionDetails = JSON.parse(localStorage.getItem(`healthConditionDetails_${userEmail}`) || localStorage.getItem('healthConditionDetails') || '{}');

  // Calculate target calories
  const weight = parseFloat(bodyDetails.weight) || 70;
  const height = parseFloat(bodyDetails.height) || 170;
  const age = parseFloat(personalDetails.age) || 25;
  const gender = personalDetails.gender || 'Male';
  
  // Calculate BMR
  let bmr;
  if (gender === 'Male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  
  const multiplier = lifestyle.multiplier || 1.375;
  const tdee = Math.round(bmr * multiplier);
  
  let targetCalories = tdee;
  if (goals.includes('lose-weight')) {
    targetCalories = tdee - 500;
  } else if (goals.includes('gain-weight') || goals.includes('gain-muscle')) {
    targetCalories = tdee + 300;
  }

  return {
    weight,
    height,
    age,
    gender,
    activityLevel: lifestyle.activityLevel || 'moderate',
    dietType: foodPreferences.dietType?.toLowerCase() || 'vegetarian',
    goal: goals[0] || 'maintain-weight',
    healthConditions,
    allergicFoods: healthConditionDetails.allergicFoods || [],
    targetCalories
  };
}

// Check if meal contains allergic foods
function containsAllergens(meal: any, allergicFoods: string[]): boolean {
  if (!allergicFoods || allergicFoods.length === 0) return false;
  
  const mealText = (meal.name + ' ' + meal.items.map((i: any) => i.name).join(' ')).toLowerCase();
  
  return allergicFoods.some(allergen => {
    const allergenLower = allergen.toLowerCase();
    
    // Check for specific allergen mappings
    if (allergenLower.includes('peanut') && mealText.includes('peanut')) return true;
    if (allergenLower.includes('nut') && (mealText.includes('almond') || mealText.includes('cashew') || mealText.includes('walnut'))) return true;
    if (allergenLower.includes('dairy') || allergenLower.includes('milk')) {
      if (mealText.includes('milk') || mealText.includes('paneer') || mealText.includes('curd') || 
          mealText.includes('yogurt') || mealText.includes('butter') || mealText.includes('ghee')) return true;
    }
    if (allergenLower.includes('egg') && mealText.includes('egg')) return true;
    if (allergenLower.includes('soy') && (mealText.includes('soy') || mealText.includes('tofu'))) return true;
    if (allergenLower.includes('wheat') || allergenLower.includes('gluten')) {
      if (mealText.includes('wheat') || mealText.includes('bread') || mealText.includes('roti') || 
          mealText.includes('oats')) return true;
    }
    if (allergenLower.includes('shellfish') && mealText.includes('shellfish')) return true;
    if (allergenLower.includes('fish') && mealText.includes('fish') && !mealText.includes('shellfish')) return true;
    if (allergenLower.includes('sesame') && mealText.includes('sesame')) return true;
    
    // Generic check
    if (mealText.includes(allergenLower)) return true;
    
    return false;
  });
}

// Calculate meal totals
function calculateMealTotals(items: MealItem[]) {
  return items.reduce((totals, item) => ({
    calories: totals.calories + item.calories,
    protein: totals.protein + item.protein,
    carbs: totals.carbs + item.carbs,
    fats: totals.fats + item.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
}

// Generate personalized meal plan
export function generateMealPlan(mealsPerDay: number = 4): Meal[] {
  const profile = getUserProfile();
  
  // Get appropriate meal database based on diet type
  let dietDatabase = mealDatabase.vegetarian;
  if (profile.dietType.includes('non-vegetarian') || profile.dietType === 'eggetarian') {
    dietDatabase = mealDatabase.nonVegetarian;
  } else if (profile.dietType === 'vegan') {
    dietDatabase = mealDatabase.vegan;
  }

  const mealPlan: Meal[] = [];
  
  // Filter out meals with allergens
  const safeBreakfast = dietDatabase.breakfast.filter(meal => !containsAllergens(meal, profile.allergicFoods));
  const safeLunch = dietDatabase.lunch.filter(meal => !containsAllergens(meal, profile.allergicFoods));
  const safeDinner = dietDatabase.dinner.filter(meal => !containsAllergens(meal, profile.allergicFoods));
  const safeSnacks = dietDatabase.snacks.filter(meal => !containsAllergens(meal, profile.allergicFoods));

  // If no safe options, use defaults (this should rarely happen)
  const breakfast = safeBreakfast.length > 0 ? safeBreakfast : dietDatabase.breakfast;
  const lunch = safeLunch.length > 0 ? safeLunch : dietDatabase.lunch;
  const dinner = safeDinner.length > 0 ? safeDinner : dietDatabase.dinner;
  const snacks = safeSnacks.length > 0 ? safeSnacks : dietDatabase.snacks;

  // Add meals based on mealsPerDay
  if (mealsPerDay >= 1) {
    const breakfastMeal = breakfast[Math.floor(Math.random() * breakfast.length)];
    const totals = calculateMealTotals(breakfastMeal.items);
    mealPlan.push({
      ...breakfastMeal,
      ...totals,
      fiber: 5,
      mealType: 'breakfast'
    });
  }

  if (mealsPerDay >= 2) {
    const lunchMeal = lunch[Math.floor(Math.random() * lunch.length)];
    const totals = calculateMealTotals(lunchMeal.items);
    mealPlan.push({
      ...lunchMeal,
      ...totals,
      fiber: 8,
      mealType: 'lunch'
    });
  }

  if (mealsPerDay >= 3) {
    const dinnerMeal = dinner[Math.floor(Math.random() * dinner.length)];
    const totals = calculateMealTotals(dinnerMeal.items);
    mealPlan.push({
      ...dinnerMeal,
      ...totals,
      fiber: 6,
      mealType: 'dinner'
    });
  }

  if (mealsPerDay >= 4) {
    const snackMeal = snacks[Math.floor(Math.random() * snacks.length)];
    const totals = calculateMealTotals(snackMeal.items);
    mealPlan.push({
      ...snackMeal,
      ...totals,
      fiber: 3,
      mealType: 'snack'
    });
  }

  return mealPlan;
}

// Get health-specific recommendations
export function getHealthRecommendations(profile: UserProfile): string[] {
  const recommendations: string[] = [];

  if (profile.healthConditions.includes('diabetes')) {
    recommendations.push("Focus on low-GI foods and monitor carb intake");
    recommendations.push("Spread meals evenly throughout the day");
  }

  if (profile.healthConditions.includes('high-bp') || profile.healthConditions.includes('low-bp')) {
    if (profile.healthConditions.includes('high-bp')) {
      recommendations.push("Reduce sodium intake below 2300mg/day");
    } else {
      recommendations.push("Ensure adequate sodium and fluid intake");
    }
  }

  if (profile.healthConditions.includes('high-cholesterol')) {
    recommendations.push("Choose lean proteins and avoid saturated fats");
    recommendations.push("Include omega-3 rich foods like fish and flaxseeds");
  }

  if (profile.healthConditions.includes('pcos')) {
    recommendations.push("Focus on high-fiber, low-GI foods");
    recommendations.push("Include anti-inflammatory foods");
  }

  if (profile.healthConditions.includes('thyroid')) {
    recommendations.push("Ensure adequate iodine and selenium intake");
  }

  if (profile.healthConditions.includes('anemia')) {
    recommendations.push("Increase iron-rich foods (spinach, lentils, meat)");
    recommendations.push("Pair iron sources with vitamin C for better absorption");
  }

  return recommendations;
}
