import api, { endpoints } from "./api";

export interface ScannedNutrition {
  name: string;
  calories: number;
  servingSize: string;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitaminE?: number;
  vitaminK?: number;
  vitaminB12?: number;
  folate?: number;
  calcium?: number;
  iron?: number;
  magnesium?: number;
  potassium?: number;
  sodium?: number;
  zinc?: number;
  sugar?: number;
  saturatedFat?: number;
  cholesterol?: number;
  confidence: number;
}

export interface NutritionSuggestion {
  type: 'increase' | 'decrease' | 'remove' | 'add' | 'perfect';
  title: string;
  message: string;
  reason: string;
  icon: string;
}

export interface UserHealthProfile {
  age: number;
  weight: number;
  height: number;
  bmi: number;
  goal: string;
  healthConditions: string[];
  dietType: string;
  allergies: string[];
  dislikes: string[];
  dailyCalorieTarget: number;
  currentCaloriesConsumed: number;
}

export async function scanFoodImage(imageData: string | File): Promise<ScannedNutrition> {
  try {
    const formData = new FormData();
    if (typeof imageData === 'string') {
      if (imageData.startsWith('data:')) {
        const response = await fetch(imageData);
        const blob = await response.blob();
        formData.append('image', blob, 'scanned_food.jpg');
      } else {
        formData.append('image_url', imageData);
      }
    } else {
      formData.append('image', imageData);
    }

    const response = await api.post(endpoints.foodScan, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data && response.data.detected_items && response.data.detected_items.length > 0) {
      const item = response.data.detected_items[0];
      return {
        name: item.name,
        calories: item.calories || 0,
        servingSize: item.servingQuantity ? `${item.servingQuantity}${item.servingUnit || 'g'}` : (item.serving_size || "100g"),
        protein: item.protein || 0,
        carbs: item.carbs || 0,
        fats: item.fats || 0,
        fiber: item.fiber || 0,
        confidence: item.confidence || 0.9,
        // Optional mapping for vitamins/minerals if backend provides them
        sodium: item.sodium,
        iron: item.iron,
      };
    }
    throw new Error(response.data?.message || "No items detected");
  } catch (error) {
    console.error("AI scanning failed:", error);
    throw error;
  }
}

// Keep the samples for testing if needed
const foodSamples: ScannedNutrition[] = [
    {
      name: "Dal Tadka with Rice",
      calories: 450,
      servingSize: "1 bowl (350g)",
      protein: 15,
      carbs: 78,
      fats: 8,
      fiber: 10,
      sugar: 2,
      saturatedFat: 2,
      vitaminC: 8,
      vitaminB12: 0.5,
      calcium: 60,
      iron: 4.5,
      magnesium: 85,
      potassium: 550,
      sodium: 380,
      zinc: 2.5,
      confidence: 0.93
    },
    {
      name: "Paneer Butter Masala",
      calories: 380,
      servingSize: "1 serving (200g)",
      protein: 18,
      carbs: 14,
      fats: 28,
      fiber: 3,
      sugar: 6,
      saturatedFat: 16,
      cholesterol: 65,
      vitaminA: 450,
      vitaminC: 12,
      vitaminD: 0.8,
      calcium: 320,
      iron: 1.2,
      magnesium: 35,
      potassium: 380,
      sodium: 720,
      zinc: 2,
      confidence: 0.91
    },
    {
      name: "Chicken Biryani",
      calories: 520,
      servingSize: "1 plate (400g)",
      protein: 28,
      carbs: 62,
      fats: 18,
      fiber: 4,
      sugar: 4,
      saturatedFat: 5,
      cholesterol: 85,
      vitaminA: 280,
      vitaminC: 15,
      vitaminB12: 1.8,
      calcium: 80,
      iron: 3.5,
      magnesium: 55,
      potassium: 480,
      sodium: 890,
      zinc: 3.5,
      confidence: 0.89
    },
    {
      name: "Masala Dosa with Sambar",
      calories: 350,
      servingSize: "1 dosa (250g)",
      protein: 8,
      carbs: 58,
      fats: 10,
      fiber: 6,
      sugar: 3,
      saturatedFat: 3,
      vitaminA: 320,
      vitaminC: 22,
      calcium: 85,
      iron: 2.8,
      magnesium: 65,
      potassium: 520,
      sodium: 480,
      zinc: 1.8,
      confidence: 0.94
    },
    {
      name: "Rajma Chawal (Kidney Beans Rice)",
      calories: 420,
      servingSize: "1 plate (350g)",
      protein: 16,
      carbs: 72,
      fats: 6,
      fiber: 14,
      sugar: 4,
      saturatedFat: 1.5,
      vitaminC: 10,
      vitaminB12: 0.2,
      calcium: 95,
      iron: 5.2,
      magnesium: 95,
      potassium: 680,
      sodium: 420,
      zinc: 3,
      folate: 185,
      confidence: 0.92
    },
    {
      name: "Palak Paneer",
      calories: 310,
      servingSize: "1 bowl (200g)",
      protein: 16,
      carbs: 12,
      fats: 22,
      fiber: 5,
      sugar: 4,
      saturatedFat: 12,
      cholesterol: 52,
      vitaminA: 950,
      vitaminC: 35,
      vitaminK: 380,
      vitaminD: 0.6,
      calcium: 350,
      iron: 4.2,
      magnesium: 85,
      potassium: 520,
      sodium: 580,
      zinc: 2.2,
      confidence: 0.95
    },
    {
      name: "Vegetable Pulao",
      calories: 320,
      servingSize: "1 plate (300g)",
      protein: 7,
      carbs: 54,
      fats: 9,
      fiber: 5,
      sugar: 5,
      saturatedFat: 3,
      vitaminA: 420,
      vitaminC: 28,
      calcium: 65,
      iron: 2.2,
      magnesium: 48,
      potassium: 380,
      sodium: 520,
      zinc: 1.5,
      confidence: 0.88
    },
    {
      name: "Idli Sambar (3 idlis)",
      calories: 210,
      servingSize: "3 idlis with sambar (250g)",
      protein: 8,
      carbs: 42,
      fats: 2,
      fiber: 6,
      sugar: 2,
      saturatedFat: 0.5,
      vitaminA: 180,
      vitaminC: 18,
      vitaminB12: 0.3,
      calcium: 75,
      iron: 2.5,
      magnesium: 55,
      potassium: 420,
      sodium: 380,
      zinc: 1.8,
      confidence: 0.96
    }
  ];

// Generate personalized suggestions based on user profile and scanned food
export function generatePersonalizedSuggestions(
  nutrition: ScannedNutrition,
  userProfile: UserHealthProfile,
  quantity: number = 1
): NutritionSuggestion[] {
  const suggestions: NutritionSuggestion[] = [];
  
  const totalCalories = nutrition.calories * quantity;
  const remainingCalories = userProfile.dailyCalorieTarget - userProfile.currentCaloriesConsumed;
  const percentageOfDaily = (totalCalories / userProfile.dailyCalorieTarget) * 100;
  
  // 1. Portion Size Suggestions
  if (remainingCalories < totalCalories * 0.6) {
    const suggestedQuantity = Math.max(0.3, (remainingCalories * 0.8) / nutrition.calories);
    suggestions.push({
      type: 'decrease',
      title: 'Reduce Portion Size',
      message: `Consider eating ${suggestedQuantity.toFixed(1)}x portion instead`,
      reason: `This meal adds ${totalCalories} kcal, but you only have ${remainingCalories} kcal remaining. Reducing portion helps stay within target.`,
      icon: '⬇️'
    });
  } else if (remainingCalories > totalCalories * 2.5 && userProfile.currentCaloriesConsumed < userProfile.dailyCalorieTarget * 0.4) {
    suggestions.push({
      type: 'increase',
      title: 'You Can Eat More',
      message: `Safe to eat up to ${(remainingCalories / nutrition.calories).toFixed(1)}x portion`,
      reason: `You still have ${remainingCalories} kcal remaining. Don't skip meals to meet your goals.`,
      icon: '⬆️'
    });
  }
  
  // 2. Health Condition-Based Suggestions
  if (userProfile.healthConditions.includes('Diabetes')) {
    const carbsPerServing = (nutrition.carbs || 0) * quantity;
    if (carbsPerServing > 60) {
      suggestions.push({
        type: 'decrease',
        title: 'High Carbohydrate Content',
        message: 'Reduce portion by 30-40% for diabetes management',
        reason: `This meal contains ${carbsPerServing}g carbs. For diabetes, aim for 45-60g per meal. Consider pairing with protein-rich foods.`,
        icon: '🩸'
      });
    }
    
    if ((nutrition.sugar || 0) * quantity > 10) {
      suggestions.push({
        type: 'remove',
        title: 'High Sugar Content',
        message: 'Consider a lower-sugar alternative',
        reason: `Contains ${((nutrition.sugar || 0) * quantity).toFixed(1)}g sugar. Diabetes management requires limiting sugar intake.`,
        icon: '🚫'
      });
    }
  }
  
  if (userProfile.healthConditions.includes('High Blood Pressure') || userProfile.healthConditions.includes('PCOS')) {
    if ((nutrition.sodium || 0) * quantity > 600) {
      suggestions.push({
        type: 'decrease',
        title: 'High Sodium Content',
        message: 'Reduce portion or choose low-sodium version',
        reason: `Contains ${((nutrition.sodium || 0) * quantity).toFixed(0)}mg sodium. High BP requires <2000mg/day. This is ${(((nutrition.sodium || 0) * quantity / 2000) * 100).toFixed(0)}% of daily limit.`,
        icon: '🧂'
      });
    }
  }
  
  if (userProfile.healthConditions.includes('PCOS')) {
    const saturatedFat = (nutrition.saturatedFat || 0) * quantity;
    if (saturatedFat > 7) {
      suggestions.push({
        type: 'remove',
        title: 'High Saturated Fat',
        message: 'Switch to a lighter version or reduce portion',
        reason: `Contains ${saturatedFat.toFixed(1)}g saturated fat. PCOS management requires limiting saturated fats to reduce inflammation.`,
        icon: '🔥'
      });
    }
  }
  
  // 3. Goal-Based Suggestions
  if (userProfile.goal === 'lose_weight') {
    const fatContent = (nutrition.fats || 0) * quantity;
    if (fatContent > 15 && percentageOfDaily > 25) {
      suggestions.push({
        type: 'decrease',
        title: 'High Fat for Weight Loss',
        message: 'Reduce portion or choose leaner alternative',
        reason: `Contains ${fatContent.toFixed(1)}g fat (${(fatContent * 9).toFixed(0)} kcal from fat). For weight loss, prioritize protein and complex carbs.`,
        icon: '⚖️'
      });
    }
    
    // Suggest adding protein if low
    const proteinContent = (nutrition.protein || 0) * quantity;
    if (proteinContent < 15 && totalCalories > 300) {
      suggestions.push({
        type: 'add',
        title: 'Add Protein Source',
        message: 'Pair with yogurt, paneer, or dal for satiety',
        reason: `Only ${proteinContent.toFixed(1)}g protein. Weight loss benefits from 20-30g protein per meal to maintain muscle and increase fullness.`,
        icon: '🥩'
      });
    }
  }
  
  if (userProfile.goal === 'gain_muscle') {
    const proteinContent = (nutrition.protein || 0) * quantity;
    const carbsContent = (nutrition.carbs || 0) * quantity;
    
    if (proteinContent < 25 && totalCalories > 300) {
      suggestions.push({
        type: 'add',
        title: 'Increase Protein Intake',
        message: 'Add chicken, fish, eggs, or protein shake',
        reason: `Only ${proteinContent.toFixed(1)}g protein. Muscle gain requires 25-40g protein per meal. Add protein-rich foods.`,
        icon: '💪'
      });
    }
    
    if (carbsContent > 70) {
      suggestions.push({
        type: 'decrease',
        title: 'Balance Carbs and Protein',
        message: 'Reduce carbs, increase protein portion',
        reason: `High carbs (${carbsContent.toFixed(1)}g) relative to protein. Better ratio helps muscle synthesis.`,
        icon: '⚖️'
      });
    }
  }
  
  // 4. Micronutrient Suggestions
  const fiberContent = (nutrition.fiber || 0) * quantity;
  if (fiberContent < 3 && totalCalories > 250) {
    suggestions.push({
      type: 'add',
      title: 'Low Fiber Content',
      message: 'Add vegetables or whole grains',
      reason: `Only ${fiberContent.toFixed(1)}g fiber. Aim for 8-10g per meal for digestive health and blood sugar control.`,
      icon: '🥬'
    });
  }
  
  // 5. Diet Type Compliance
  if (userProfile.dietType === 'Vegetarian' && nutrition.name.toLowerCase().includes('chicken')) {
    suggestions.push({
      type: 'remove',
      title: 'Not Vegetarian',
      message: 'This contains chicken - conflicts with your diet',
      reason: 'Your diet preference is Vegetarian. Consider paneer, tofu, or dal-based alternatives.',
      icon: '🚫'
    });
  }
  
  if (userProfile.dietType === 'Vegan') {
    if (nutrition.name.toLowerCase().includes('paneer') || 
        nutrition.name.toLowerCase().includes('butter') ||
        nutrition.name.toLowerCase().includes('ghee')) {
      suggestions.push({
        type: 'remove',
        title: 'Contains Dairy - Not Vegan',
        message: 'Switch to tofu or plant-based version',
        reason: 'Your diet is Vegan. This contains dairy products. Try tofu-based alternatives.',
        icon: '🌱'
      });
    }
  }
  
  // 6. Positive Feedback
  if (suggestions.length === 0 || 
      (percentageOfDaily >= 20 && percentageOfDaily <= 35 && 
       (nutrition.protein || 0) * quantity >= 15 && 
       fiberContent >= 5)) {
    suggestions.push({
      type: 'perfect',
      title: 'Excellent Choice!',
      message: 'This meal aligns perfectly with your goals',
      reason: `Balanced nutrition: ${percentageOfDaily.toFixed(0)}% of daily calories, adequate protein (${((nutrition.protein || 0) * quantity).toFixed(1)}g), and good fiber (${fiberContent.toFixed(1)}g).`,
      icon: '✅'
    });
  }
  
  return suggestions;
}

// Get personalized meal recommendations
export function getPersonalizedAlternatives(
  nutrition: ScannedNutrition,
  userProfile: UserHealthProfile
): string[] {
  const alternatives: string[] = [];
  
  // Based on health conditions
  if (userProfile.healthConditions.includes('Diabetes')) {
    alternatives.push('Replace white rice with brown rice or quinoa');
    alternatives.push('Add more non-starchy vegetables (spinach, broccoli)');
    alternatives.push('Use olive oil instead of butter/ghee');
  }
  
  if (userProfile.healthConditions.includes('High Blood Pressure')) {
    alternatives.push('Request less salt or low-sodium version');
    alternatives.push('Add potassium-rich foods (bananas, sweet potato)');
    alternatives.push('Choose grilled over fried preparations');
  }
  
  if (userProfile.healthConditions.includes('PCOS')) {
    alternatives.push('Choose whole grains over refined carbs');
    alternatives.push('Add cinnamon or fenugreek for insulin sensitivity');
    alternatives.push('Include anti-inflammatory foods (turmeric, ginger)');
  }
  
  // Based on goals
  if (userProfile.goal === 'lose_weight') {
    alternatives.push('Reduce oil/ghee by 50% in preparation');
    alternatives.push('Increase vegetable portion, decrease rice/bread');
    alternatives.push('Start meal with salad for better satiety');
  }
  
  if (userProfile.goal === 'gain_muscle') {
    alternatives.push('Add grilled chicken, fish, or extra paneer');
    alternatives.push('Include post-meal protein shake');
    alternatives.push('Add nuts or seeds for healthy fats');
  }
  
  // Diet type
  if (userProfile.dietType === 'Vegan') {
    alternatives.push('Replace dairy with almond/soy milk');
    alternatives.push('Use tofu instead of paneer');
    alternatives.push('Add hemp seeds or chia for omega-3');
  }
  
  return alternatives.slice(0, 3); // Return top 3
}
