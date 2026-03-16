// Helper functions to generate personalized meal recommendations

export interface MealItem {
  name: string;
  portion: string;
  calories: number;
  protein?: number;
  carbs?: number;
  notes?: string;
}

export interface Meal {
  type: "Breakfast" | "Lunch" | "Snack" | "Dinner";
  time: string;
  items: MealItem[];
  color: string;
  tip?: string;
}

// Get personalized meals based on user data
export function getPersonalizedMeals(): Meal[] {
  const userGoals = JSON.parse(localStorage.getItem('userGoals') || '[]');
  const healthConditions = JSON.parse(localStorage.getItem('healthConditions') || '[]');
  const foodPrefs = JSON.parse(localStorage.getItem('foodPreferences') || '{}');
  
  const isVegetarian = foodPrefs.dietType === 'veg' || foodPrefs.dietType === 'vegan';
  const isEggetarian = foodPrefs.dietType === 'eggetarian';
  const hasDiabetes = healthConditions.includes('diabetes');
  const hasPCOS = healthConditions.includes('pcos');
  const hasHighBP = healthConditions.includes('high-bp');
  const hasDigestive = healthConditions.includes('digestive');
  const hasAnemia = healthConditions.includes('anemia');
  const isWeightLoss = userGoals.includes('lose-weight');
  const isMuscleGain = userGoals.includes('gain-muscle');
  const isStressManagement = userGoals.includes('manage-stress');
  
  // Breakfast
  const breakfast: Meal = {
    type: "Breakfast",
    time: "8:00 AM",
    color: "bg-yellow-50 border-yellow-200",
    items: []
  };

  if (isStressManagement) {
    breakfast.items = [
      { name: "Oatmeal with Berries", portion: "1 cup (240g)", calories: 280, protein: 8, carbs: 54 },
      { name: "Almonds", portion: "10-12 pieces (15g)", calories: 85, protein: 3, carbs: 3, notes: "Rich in magnesium" },
      { name: "Green Tea", portion: "1 cup (240ml)", calories: 2, notes: "Contains L-theanine for calm" }
    ];
    breakfast.tip = "Start your day calm: Foods rich in magnesium help regulate stress hormones";
  } else if (hasDiabetes || hasPCOS) {
    breakfast.items = [
      { name: "Moong Dal Chilla", portion: "2 pieces (150g)", calories: 210, protein: 12, carbs: 28, notes: "Low GI" },
      { name: "Greek Yogurt", portion: "½ cup (120g)", calories: 95, protein: 16, carbs: 6 },
      { name: "Cucumber slices", portion: "1 cup (100g)", calories: 16 }
    ];
    breakfast.tip = "Low glycemic breakfast to keep blood sugar stable";
  } else if (isMuscleGain) {
    breakfast.items = isVegetarian ? [
      { name: "Paneer Bhurji", portion: "150g", calories: 290, protein: 22, carbs: 8 },
      { name: "Whole Wheat Toast", portion: "2 slices (60g)", calories: 160, protein: 6, carbs: 30 },
      { name: "Banana", portion: "1 medium (120g)", calories: 105, carbs: 27 }
    ] : isEggetarian ? [
      { name: "Scrambled Eggs", portion: "3 eggs (150g)", calories: 260, protein: 19, carbs: 2 },
      { name: "Whole Wheat Toast", portion: "2 slices (60g)", calories: 160, protein: 6, carbs: 30 },
      { name: "Banana", portion: "1 medium (120g)", calories: 105, carbs: 27 }
    ] : [
      { name: "Grilled Chicken Breast", portion: "150g", calories: 248, protein: 47, carbs: 2 },
      { name: "Whole Wheat Toast", portion: "2 slices (60g)", calories: 160, protein: 6, carbs: 30 },
      { name: "Banana", portion: "1 medium (120g)", calories: 105, carbs: 27 }
    ];
    breakfast.tip = "High-protein breakfast for muscle recovery and growth";
  } else if (isWeightLoss) {
    breakfast.items = [
      { name: "Vegetable Poha", portion: "1 cup (150g)", calories: 180, protein: 4, carbs: 32 },
      { name: "Boiled Egg Whites", portion: "2 eggs (66g)", calories: 34, protein: 7 },
      { name: "Green Tea", portion: "1 cup (240ml)", calories: 2 }
    ];
    breakfast.tip = "Light, filling breakfast to keep you energized without excess calories";
  } else {
    breakfast.items = [
      { name: "Oatmeal with Berries", portion: "1 cup (240g)", calories: 280, protein: 8, carbs: 54 },
      { name: "Almonds", portion: "10 pieces (14g)", calories: 80, protein: 3 },
      { name: "Milk", portion: "1 cup (240ml)", calories: 120, protein: 8, carbs: 12 }
    ];
  }

  // Lunch
  const lunch: Meal = {
    type: "Lunch",
    time: "1:00 PM",
    color: "bg-orange-50 border-orange-200",
    items: []
  };

  if (hasHighBP) {
    lunch.items = isVegetarian ? [
      { name: "Dal Tadka (low salt)", portion: "1 cup (200g)", calories: 180, protein: 12, notes: "Low sodium" },
      { name: "Brown Rice", portion: "¾ cup (150g)", calories: 165, carbs: 35 },
      { name: "Spinach Sabzi", portion: "1 cup (100g)", calories: 40, notes: "Rich in potassium" },
      { name: "Cucumber Raita", portion: "½ cup (100g)", calories: 60 }
    ] : [
      { name: "Grilled Chicken Breast", portion: "150g", calories: 248, protein: 47, notes: "No added salt" },
      { name: "Quinoa", portion: "1 cup (185g)", calories: 220, protein: 8, carbs: 39 },
      { name: "Steamed Broccoli", portion: "1 cup (90g)", calories: 30, notes: "Potassium-rich" }
    ];
    lunch.tip = "Low-sodium meal with potassium-rich vegetables to support healthy blood pressure";
  } else if (hasDigestive) {
    lunch.items = [
      { name: "Khichdi", portion: "1.5 cups (300g)", calories: 280, protein: 10, notes: "Easy to digest" },
      { name: "Curd", portion: "1 cup (240g)", calories: 150, protein: 12, notes: "Probiotic-rich" },
      { name: "Steamed Carrots", portion: "1 cup (120g)", calories: 50 }
    ];
    lunch.tip = "Gut-friendly meal with probiotics and easy-to-digest foods";
  } else if (isMuscleGain) {
    lunch.items = isVegetarian ? [
      { name: "Rajma Curry", portion: "1.5 cups (300g)", calories: 360, protein: 18, carbs: 54 },
      { name: "Brown Rice", portion: "1 cup (200g)", calories: 220, protein: 5, carbs: 46 },
      { name: "Paneer Tikka", portion: "100g", calories: 190, protein: 14 }
    ] : [
      { name: "Grilled Chicken Breast", portion: "200g", calories: 330, protein: 62 },
      { name: "Sweet Potato", portion: "1 medium (150g)", calories: 130, carbs: 30 },
      { name: "Mixed Vegetables", portion: "1 cup (150g)", calories: 70 }
    ];
    lunch.tip = "High-protein, moderate-carb meal for muscle building";
  } else if (isWeightLoss) {
    lunch.items = isVegetarian ? [
      { name: "Roti", portion: "2 pieces (80g)", calories: 160, carbs: 32 },
      { name: "Mixed Dal", portion: "1 cup (200g)", calories: 180, protein: 12 },
      { name: "Vegetable Curry", portion: "1 cup (150g)", calories: 90 }
    ] : [
      { name: "Grilled Fish", portion: "150g", calories: 210, protein: 40 },
      { name: "Roti", portion: "2 pieces (80g)", calories: 160, carbs: 32 },
      { name: "Salad", portion: "2 cups (150g)", calories: 50 }
    ];
    lunch.tip = "Balanced meal with controlled portions for steady weight loss";
  } else {
    lunch.items = isVegetarian ? [
      { name: "Roti", portion: "3 pieces (120g)", calories: 240, carbs: 48 },
      { name: "Dal", portion: "1 cup (200g)", calories: 200, protein: 12 },
      { name: "Aloo Sabzi", portion: "1 cup (150g)", calories: 150 }
    ] : [
      { name: "Chicken Curry", portion: "150g", calories: 280, protein: 35 },
      { name: "Rice", portion: "1 cup (200g)", calories: 200, carbs: 44 },
      { name: "Raita", portion: "½ cup (100g)", calories: 60 }
    ];
  }

  // Snack
  const snack: Meal = {
    type: "Snack",
    time: "4:00 PM",
    color: "bg-green-50 border-green-200",
    items: []
  };

  if (isStressManagement) {
    snack.items = [
      { name: "Dark Chocolate (70%+)", portion: "2 squares (20g)", calories: 110, notes: "Antioxidants, mood booster" },
      { name: "Walnuts", portion: "5-6 pieces (15g)", calories: 95, notes: "Omega-3 for brain health" },
      { name: "Chamomile Tea", portion: "1 cup (240ml)", calories: 2, notes: "Calming" }
    ];
  } else if (hasAnemia) {
    snack.items = [
      { name: "Dates", portion: "3 pieces (24g)", calories: 66, notes: "Iron-rich" },
      { name: "Orange", portion: "1 medium (130g)", calories: 62, notes: "Vitamin C for iron absorption" },
      { name: "Pumpkin Seeds", portion: "2 tbsp (16g)", calories: 90, notes: "Iron + Zinc" }
    ];
    snack.tip = "Iron-rich snack with Vitamin C to boost absorption";
  } else if (isWeightLoss) {
    snack.items = [
      { name: "Apple", portion: "1 medium (180g)", calories: 95, carbs: 25 },
      { name: "Herbal Tea", portion: "1 cup (240ml)", calories: 2 }
    ];
  } else {
    snack.items = [
      { name: "Mixed Nuts", portion: "¼ cup (30g)", calories: 170, protein: 5 },
      { name: "Banana", portion: "1 medium (120g)", calories: 105, carbs: 27 }
    ];
  }

  // Dinner
  const dinner: Meal = {
    type: "Dinner",
    time: "7:30 PM",
    color: "bg-blue-50 border-blue-200",
    items: []
  };

  if (isStressManagement) {
    dinner.items = isVegetarian ? [
      { name: "Palak Paneer", portion: "1 cup (200g)", calories: 220, protein: 14, notes: "Magnesium-rich" },
      { name: "Roti", portion: "2 pieces (80g)", calories: 160, carbs: 32 },
      { name: "Warm Turmeric Milk", portion: "1 cup (240ml)", calories: 130, notes: "1 hour before bed - aids sleep" }
    ] : [
      { name: "Grilled Turkey", portion: "150g", calories: 220, protein: 42, notes: "Tryptophan for sleep" },
      { name: "Quinoa", portion: "¾ cup (140g)", calories: 170, carbs: 30 },
      { name: "Steamed Vegetables", portion: "1 cup (150g)", calories: 70 }
    ];
    dinner.tip = "Light dinner 2-3 hours before bed. Warm milk promotes relaxation and sleep";
  } else if (hasDiabetes || hasPCOS) {
    dinner.items = isVegetarian ? [
      { name: "Tofu Stir-fry", portion: "150g", calories: 190, protein: 18, notes: "Low GI protein" },
      { name: "Cauliflower Rice", portion: "1 cup (120g)", calories: 25, carbs: 5 },
      { name: "Mixed Vegetables", portion: "1 cup (150g)", calories: 70 }
    ] : [
      { name: "Baked Fish", portion: "150g", calories: 210, protein: 40 },
      { name: "Zucchini Noodles", portion: "1 cup (120g)", calories: 20, carbs: 4 },
      { name: "Spinach Salad", portion: "2 cups (120g)", calories: 40 }
    ];
    dinner.tip = "Low-carb dinner to maintain stable overnight blood sugar";
  } else if (isMuscleGain) {
    dinner.items = isVegetarian ? [
      { name: "Chana Masala", portion: "1.5 cups (300g)", calories: 340, protein: 16, carbs: 48 },
      { name: "Roti", portion: "2 pieces (80g)", calories: 160, carbs: 32 },
      { name: "Paneer", portion: "100g", calories: 260, protein: 18 }
    ] : [
      { name: "Grilled Salmon", portion: "180g", calories: 360, protein: 40, notes: "Omega-3 for recovery" },
      { name: "Sweet Potato", portion: "1 medium (150g)", calories: 130, carbs: 30 },
      { name: "Asparagus", portion: "1 cup (130g)", calories: 27 }
    ];
  } else if (isWeightLoss) {
    dinner.items = isVegetarian ? [
      { name: "Vegetable Soup", portion: "2 cups (480ml)", calories: 120, protein: 4 },
      { name: "Roti", portion: "1 piece (40g)", calories: 80, carbs: 16 },
      { name: "Paneer Tikka", portion: "80g", calories: 150, protein: 11 }
    ] : [
      { name: "Grilled Chicken", portion: "150g", calories: 248, protein: 47 },
      { name: "Vegetable Salad", portion: "2 cups (200g)", calories: 60 },
      { name: "Olive Oil Dressing", portion: "1 tbsp (15ml)", calories: 120 }
    ];
    dinner.tip = "Light dinner to avoid late-night calorie loading";
  } else {
    dinner.items = isVegetarian ? [
      { name: "Dal", portion: "1 cup (200g)", calories: 200, protein: 12 },
      { name: "Roti", portion: "2 pieces (80g)", calories: 160, carbs: 32 },
      { name: "Sabzi", portion: "1 cup (150g)", calories: 100 }
    ] : [
      { name: "Chicken Curry", portion: "150g", calories: 280, protein: 35 },
      { name: "Rice", portion: "¾ cup (150g)", calories: 150, carbs: 33 },
      { name: "Salad", portion: "1 cup (100g)", calories: 30 }
    ];
  }

  return [breakfast, lunch, snack, dinner];
}

export function getTotalNutrition(meals: Meal[]) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;

  meals.forEach(meal => {
    meal.items.forEach(item => {
      totalCalories += item.calories;
      totalProtein += item.protein || 0;
      totalCarbs += item.carbs || 0;
    });
  });

  return { totalCalories, totalProtein, totalCarbs };
}