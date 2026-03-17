// Comprehensive Indian Food Database with Nutritional Information

export interface FoodItem {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  fiber: number; // grams
  servingSize: string;
  servingUnit: string;
  vitamins?: {
    vitaminA?: number; // mcg
    vitaminC?: number; // mg
    vitaminD?: number; // mcg
    vitaminB12?: number; // mcg
  };
  minerals?: {
    calcium?: number; // mg
    iron?: number; // mg
    magnesium?: number; // mg
    potassium?: number; // mg
  };
}

export const foodDatabase: FoodItem[] = [
  // ==================== BREAKFAST (10 Most Popular) ====================
  {
    id: 'bf001',
    name: 'Idli (2 pieces)',
    category: 'breakfast',
    calories: 78,
    protein: 2,
    carbs: 17,
    fats: 0.2,
    fiber: 1,
    servingSize: '2',
    servingUnit: 'pieces',
    vitamins: { vitaminB12: 0.1, vitaminC: 0.5 },
    minerals: { calcium: 16, iron: 0.4, potassium: 25 }
  },
  {
    id: 'bf002',
    name: 'Dosa (1 plain)',
    category: 'breakfast',
    calories: 133,
    protein: 3.5,
    carbs: 22,
    fats: 3.5,
    fiber: 1.2,
    servingSize: '1',
    servingUnit: 'piece',
    vitamins: { vitaminC: 0.3 },
    minerals: { calcium: 20, iron: 0.8, potassium: 45 }
  },
  {
    id: 'bf003',
    name: 'Paratha (1 plain)',
    category: 'breakfast',
    calories: 210,
    protein: 4,
    carbs: 28,
    fats: 9,
    fiber: 2,
    servingSize: '1',
    servingUnit: 'piece',
    minerals: { calcium: 25, iron: 1.2, magnesium: 18 }
  },
  {
    id: 'bf004',
    name: 'Upma (1 bowl)',
    category: 'breakfast',
    calories: 165,
    protein: 4,
    carbs: 26,
    fats: 4.5,
    fiber: 2.5,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminC: 2, vitaminB12: 0.2 },
    minerals: { iron: 1.5, magnesium: 30 }
  },
  {
    id: 'bf005',
    name: 'Poha (1 bowl)',
    category: 'breakfast',
    calories: 180,
    protein: 3,
    carbs: 30,
    fats: 5,
    fiber: 2,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminC: 8, vitaminA: 150 },
    minerals: { iron: 2.5, potassium: 100 }
  },
  {
    id: 'bf006',
    name: 'Masala Dosa',
    category: 'breakfast',
    calories: 295,
    protein: 6,
    carbs: 42,
    fats: 11,
    fiber: 3,
    servingSize: '1',
    servingUnit: 'piece',
    vitamins: { vitaminC: 10, vitaminA: 200 },
    minerals: { iron: 1.8, potassium: 250 }
  },
  {
    id: 'bf007',
    name: 'Aloo Paratha',
    category: 'breakfast',
    calories: 320,
    protein: 6,
    carbs: 42,
    fats: 14,
    fiber: 3.5,
    servingSize: '1',
    servingUnit: 'piece',
    vitamins: { vitaminC: 12, vitaminB12: 0.3 },
    minerals: { iron: 1.5, potassium: 350 }
  },
  {
    id: 'bf008',
    name: 'Medu Vada (2 pieces)',
    category: 'breakfast',
    calories: 220,
    protein: 8,
    carbs: 20,
    fats: 12,
    fiber: 4,
    servingSize: '2',
    servingUnit: 'pieces',
    vitamins: { vitaminC: 1 },
    minerals: { iron: 2, magnesium: 35 }
  },
  {
    id: 'bf009',
    name: 'Puri Bhaji (2 puris)',
    category: 'breakfast',
    calories: 380,
    protein: 7,
    carbs: 45,
    fats: 18,
    fiber: 4,
    servingSize: '2',
    servingUnit: 'puris',
    vitamins: { vitaminA: 300, vitaminC: 15 },
    minerals: { iron: 2.5, potassium: 400 }
  },
  {
    id: 'bf010',
    name: 'Rava Idli (2 pieces)',
    category: 'breakfast',
    calories: 145,
    protein: 3,
    carbs: 24,
    fats: 4,
    fiber: 1.5,
    servingSize: '2',
    servingUnit: 'pieces',
    vitamins: { vitaminC: 5 },
    minerals: { calcium: 30, iron: 0.8 }
  },

  // ==================== LUNCH (10 Most Popular) ====================
  {
    id: 'ln001',
    name: 'Dal Tadka (1 bowl)',
    category: 'lunch',
    calories: 180,
    protein: 10,
    carbs: 28,
    fats: 4,
    fiber: 12,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminC: 8, vitaminB12: 0.5 },
    minerals: { iron: 3.5, magnesium: 60, potassium: 400 }
  },
  {
    id: 'ln002',
    name: 'Rajma (1 bowl)',
    category: 'lunch',
    calories: 240,
    protein: 14,
    carbs: 38,
    fats: 4,
    fiber: 11,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminC: 3, vitaminB12: 0.3 },
    minerals: { iron: 4.5, magnesium: 70, potassium: 550 }
  },
  {
    id: 'ln003',
    name: 'Chole (Chickpea Curry) 1 bowl',
    category: 'lunch',
    calories: 210,
    protein: 11,
    carbs: 32,
    fats: 5,
    fiber: 10,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminC: 5, vitaminA: 100 },
    minerals: { iron: 3.8, magnesium: 55, calcium: 60 }
  },
  {
    id: 'ln004',
    name: 'Paneer Butter Masala (1 bowl)',
    category: 'lunch',
    calories: 310,
    protein: 16,
    carbs: 12,
    fats: 22,
    fiber: 3,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminA: 350, vitaminD: 0.5 },
    minerals: { calcium: 250, iron: 0.8, magnesium: 25 }
  },
  {
    id: 'ln005',
    name: 'Biryani (1 plate)',
    category: 'lunch',
    calories: 400,
    protein: 18,
    carbs: 52,
    fats: 14,
    fiber: 3.5,
    servingSize: '1',
    servingUnit: 'plate',
    vitamins: { vitaminA: 200, vitaminC: 10 },
    minerals: { iron: 2.5, potassium: 300, magnesium: 40 }
  },
  {
    id: 'ln006',
    name: 'Kadhi (1 bowl)',
    category: 'lunch',
    calories: 150,
    protein: 6,
    carbs: 18,
    fats: 6,
    fiber: 2,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminB12: 0.4, vitaminA: 80 },
    minerals: { calcium: 180, iron: 0.5 }
  },
  {
    id: 'ln007',
    name: 'Palak Paneer (1 bowl)',
    category: 'lunch',
    calories: 280,
    protein: 16,
    carbs: 10,
    fats: 20,
    fiber: 4,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminA: 800, vitaminC: 25, vitaminD: 0.3 },
    minerals: { calcium: 280, iron: 3.5, magnesium: 65 }
  },
  {
    id: 'ln008',
    name: 'Mixed Vegetable Curry (1 bowl)',
    category: 'lunch',
    calories: 140,
    protein: 4,
    carbs: 22,
    fats: 4,
    fiber: 6,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminA: 400, vitaminC: 40 },
    minerals: { iron: 1.8, potassium: 450, magnesium: 35 }
  },
  {
    id: 'ln009',
    name: 'Sambar (1 bowl)',
    category: 'lunch',
    calories: 120,
    protein: 6,
    carbs: 20,
    fats: 2,
    fiber: 7,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminA: 250, vitaminC: 18 },
    minerals: { iron: 2.5, magnesium: 45, potassium: 380 }
  },
  {
    id: 'ln010',
    name: 'Roti (1 piece)',
    category: 'lunch',
    calories: 80,
    protein: 3,
    carbs: 15,
    fats: 0.8,
    fiber: 2,
    servingSize: '1',
    servingUnit: 'piece',
    vitamins: { vitaminB12: 0.1 },
    minerals: { iron: 0.7, magnesium: 15, calcium: 10 }
  },

  // ==================== SNACKS (10 Most Popular) ====================
  {
    id: 'sn001',
    name: 'Samosa (1 piece)',
    category: 'snack',
    calories: 262,
    protein: 4,
    carbs: 30,
    fats: 14,
    fiber: 3,
    servingSize: '1',
    servingUnit: 'piece',
    vitamins: { vitaminC: 8, vitaminA: 50 },
    minerals: { iron: 1.2, potassium: 180 }
  },
  {
    id: 'sn002',
    name: 'Pakora/Bhaji (100g)',
    category: 'snack',
    calories: 280,
    protein: 6,
    carbs: 28,
    fats: 16,
    fiber: 4,
    servingSize: '100',
    servingUnit: 'g',
    vitamins: { vitaminC: 12, vitaminA: 120 },
    minerals: { iron: 1.8, calcium: 40 }
  },
  {
    id: 'sn003',
    name: 'Dhokla (1 piece)',
    category: 'snack',
    calories: 150,
    protein: 5,
    carbs: 25,
    fats: 3,
    fiber: 2,
    servingSize: '1',
    servingUnit: 'piece',
    vitamins: { vitaminC: 5, vitaminB12: 0.2 },
    minerals: { iron: 1, calcium: 30, magnesium: 20 }
  },
  {
    id: 'sn004',
    name: 'Kachori (1 piece)',
    category: 'snack',
    calories: 185,
    protein: 4,
    carbs: 22,
    fats: 9,
    fiber: 3.5,
    servingSize: '1',
    servingUnit: 'piece',
    vitamins: { vitaminC: 3 },
    minerals: { iron: 1.5, magnesium: 25 }
  },
  {
    id: 'sn005',
    name: 'Vada Pav (1 piece)',
    category: 'snack',
    calories: 290,
    protein: 6,
    carbs: 38,
    fats: 12,
    fiber: 3,
    servingSize: '1',
    servingUnit: 'piece',
    vitamins: { vitaminC: 15, vitaminB12: 0.15 },
    minerals: { iron: 1.8, potassium: 250 }
  },
  {
    id: 'sn006',
    name: 'Pani Puri (6 pieces)',
    category: 'snack',
    calories: 240,
    protein: 5,
    carbs: 40,
    fats: 7,
    fiber: 4,
    servingSize: '6',
    servingUnit: 'pieces',
    vitamins: { vitaminC: 20, vitaminA: 80 },
    minerals: { iron: 1.2, potassium: 200 }
  },
  {
    id: 'sn007',
    name: 'Bhel Puri (1 bowl)',
    category: 'snack',
    calories: 220,
    protein: 6,
    carbs: 36,
    fats: 6,
    fiber: 5,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminC: 25, vitaminA: 150 },
    minerals: { iron: 2, potassium: 280 }
  },
  {
    id: 'sn008',
    name: 'Namkeen Mix (50g)',
    category: 'snack',
    calories: 265,
    protein: 7,
    carbs: 30,
    fats: 14,
    fiber: 3,
    servingSize: '50',
    servingUnit: 'g',
    vitamins: { vitaminC: 1 },
    minerals: { iron: 1.5, calcium: 25 }
  },
  {
    id: 'sn009',
    name: 'Chakli (3 pieces)',
    category: 'snack',
    calories: 180,
    protein: 4,
    carbs: 24,
    fats: 8,
    fiber: 2,
    servingSize: '3',
    servingUnit: 'pieces',
    vitamins: { vitaminC: 0.5 },
    minerals: { iron: 1, calcium: 15 }
  },
  {
    id: 'sn010',
    name: 'Roasted Chana (1/2 cup)',
    category: 'snack',
    calories: 140,
    protein: 8,
    carbs: 24,
    fats: 2,
    fiber: 7,
    servingSize: '0.5',
    servingUnit: 'cup',
    vitamins: { vitaminC: 3, vitaminB12: 0.1 },
    minerals: { iron: 2.8, magnesium: 50, calcium: 45 }
  },

  // ==================== DINNER (10 Most Popular) ====================
  {
    id: 'dn001',
    name: 'Khichdi (1 bowl)',
    category: 'dinner',
    calories: 210,
    protein: 8,
    carbs: 38,
    fats: 4,
    fiber: 6,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminC: 10, vitaminB12: 0.2 },
    minerals: { iron: 2.5, magnesium: 55, potassium: 300 }
  },
  {
    id: 'dn002',
    name: 'Dal Makhani (1 bowl)',
    category: 'dinner',
    calories: 320,
    protein: 12,
    carbs: 35,
    fats: 14,
    fiber: 10,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminA: 120, vitaminC: 5 },
    minerals: { iron: 4, magnesium: 70, calcium: 80 }
  },
  {
    id: 'dn003',
    name: 'Paneer Tikka (6 pieces)',
    category: 'dinner',
    calories: 280,
    protein: 18,
    carbs: 8,
    fats: 20,
    fiber: 2,
    servingSize: '6',
    servingUnit: 'pieces',
    vitamins: { vitaminA: 200, vitaminD: 0.4 },
    minerals: { calcium: 300, iron: 1, magnesium: 25 }
  },
  {
    id: 'dn004',
    name: 'Chicken Curry (1 bowl)',
    category: 'dinner',
    calories: 320,
    protein: 35,
    carbs: 8,
    fats: 18,
    fiber: 2,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminB12: 1.2, vitaminA: 150 },
    minerals: { iron: 1.8, potassium: 400, magnesium: 30 }
  },
  {
    id: 'dn005',
    name: 'Fish Curry (1 bowl)',
    category: 'dinner',
    calories: 250,
    protein: 28,
    carbs: 6,
    fats: 13,
    fiber: 1.5,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminD: 5, vitaminB12: 2.5, vitaminA: 100 },
    minerals: { calcium: 40, iron: 1.2, potassium: 380 }
  },
  {
    id: 'dn006',
    name: 'Aloo Gobi (1 bowl)',
    category: 'dinner',
    calories: 160,
    protein: 4,
    carbs: 26,
    fats: 5,
    fiber: 5,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminC: 55, vitaminA: 50 },
    minerals: { iron: 1.5, potassium: 550, calcium: 35 }
  },
  {
    id: 'dn007',
    name: 'Baingan Bharta (1 bowl)',
    category: 'dinner',
    calories: 140,
    protein: 3,
    carbs: 18,
    fats: 6,
    fiber: 8,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminC: 12, vitaminA: 60 },
    minerals: { iron: 0.9, potassium: 380, magnesium: 30 }
  },
  {
    id: 'dn008',
    name: 'Bhindi Masala (1 bowl)',
    category: 'dinner',
    calories: 120,
    protein: 3,
    carbs: 16,
    fats: 5,
    fiber: 4,
    servingSize: '1',
    servingUnit: 'bowl',
    vitamins: { vitaminC: 22, vitaminA: 115 },
    minerals: { iron: 1.2, calcium: 60, magnesium: 40 }
  },
  {
    id: 'dn010',
    name: 'Egg Curry (2 eggs)',
    category: 'dinner',
    calories: 240,
    protein: 16,
    carbs: 8,
    fats: 17,
    fiber: 1.5,
    servingSize: '2',
    servingUnit: 'eggs',
    vitamins: { vitaminD: 1.8, vitaminB12: 1.5, vitaminA: 280 },
    minerals: { iron: 2, calcium: 65, potassium: 180 }
  }
];

// Helper function to get foods by category
export function getFoodsByCategory(category: string): FoodItem[] {
  if (category === 'all') return foodDatabase;
  return foodDatabase.filter(food => food.category === category);
}

// Helper function to search foods
export function searchFoods(query: string): FoodItem[] {
  const lowercaseQuery = query.toLowerCase();
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowercaseQuery)
  );
}

// Helper function to get food by ID
export function getFoodById(id: string): FoodItem | undefined {
  return foodDatabase.find(food => food.id === id);
}

// Helper to filter based on user preferences
export function getPersonalizedFoods(
  dietType: string,
  allergies: string[],
  dislikes: string[]
): FoodItem[] {
  return foodDatabase.filter(food => {
    const nameLower = food.name.toLowerCase();
    
    // Check diet type
    if (dietType === 'Vegetarian' || dietType === 'Vegan') {
      if (nameLower.includes('chicken') || nameLower.includes('fish') || 
          nameLower.includes('egg') || nameLower.includes('mutton')) {
        return false;
      }
    }
    
    if (dietType === 'Vegan') {
      if (nameLower.includes('paneer') || nameLower.includes('ghee') || 
          nameLower.includes('butter') || nameLower.includes('curd') ||
          nameLower.includes('yogurt') || nameLower.includes('milk')) {
        return false;
      }
    }
    
    // Check allergies
    for (const allergy of allergies) {
      if (nameLower.includes(allergy.toLowerCase())) {
        return false;
      }
    }
    
    // Check dislikes
    for (const dislike of dislikes) {
      if (nameLower.includes(dislike.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  });
}
