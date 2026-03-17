// Smart Health System - Comprehensive health analysis and timeline management

// Medical disclaimer constant
export const MEDICAL_DISCLAIMER = 
  "⚠️ These are estimates based on average results. Individual results vary due to genetics, hormones, " +
  "medical conditions, and lifestyle factors. This app is not medical advice. Consult a healthcare provider " +
  "before starting any weight loss program, especially if you have medical conditions.";

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  targetWeight: number; // in kg
  activityLevel: string;
  dietType: string;
  foodAllergies: string[];
  foodDislikes: string[];
  healthGoal: string;
  healthConditions: string[];
  mealsPerDay: number;
  timeline: number; // weeks
  startDate: string;
}

export interface HealthAnalysis {
  bmi: number;
  bmiCategory: string;
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  dailyCalorieTarget: number;
  dailyCalorieBurnNeeded: number;
  weeklyWeightChangeNeeded: number; // kg per week
  totalWeightToChange: number; // total kg to lose/gain
  totalCaloriesNeeded: number; // total calories to burn/gain
  recommendations: string[];
  healthRisks: string[];
  nutritionFocus: {
    protein: number; // grams per day
    carbs: number;
    fats: number;
    fiber: number;
    water: number; // glasses per day
  };
}

export interface TimelineProgress {
  startDate: string;
  endDate: string;
  totalDays: number;
  daysPassed: number;
  daysRemaining: number;
  currentWeight: number;
  targetWeight: number;
  weightToGo: number;
  dailyCalorieTarget: number;
  totalCaloriesNeeded: number;
  caloriesBurnedSoFar: number;
  caloriesRemaining: number;
  isOnTrack: boolean;
  daysAheadBehind: number; // positive = ahead, negative = behind
  adjustedEndDate?: string; // if timeline needs extension
  missedCalories: number;
}

export interface DailyProgress {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  netCalories: number;
  targetCalories: number;
  stepsCount: number;
  waterGlasses: number;
  sleepHours: number;
  mealsEaten: number;
  isOnTrack: boolean;
}

// Calculate BMI
export function calculateBMI(weight: number, height: number): { bmi: number; category: string } {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  
  return { bmi: Math.round(bmi * 10) / 10, category };
}

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
export function calculateBMR(
  weight: number, 
  height: number, 
  age: number, 
  gender: string,
  healthConditions?: string[]
): number {
  let bmr = 0;
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Adjust for PCOS (women with PCOS often have 10% lower BMR due to insulin resistance)
  if (healthConditions?.includes('PCOS') && gender !== 'male') {
    bmr = bmr * 0.90;
  }
  
  return Math.round(bmr);
}

// Calculate TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(bmr: number, activityLevel?: string | null): number {
  const activityMultipliers: { [key: string]: number } = {
    'sedentary': 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'very active': 1.725,
    'extremely active': 1.9
  };
  
  // Safety check for undefined/null activityLevel - use default
  const safeActivityLevel = (activityLevel || 'moderately active').toLowerCase();
  const multiplier = activityMultipliers[safeActivityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

// Analyze user health comprehensively
export function analyzeUserHealth(profile: UserProfile): HealthAnalysis {
  const { bmi, category: bmiCategory } = calculateBMI(profile.weight, profile.height);
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender, profile.healthConditions);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  
  // Calculate weight change needed
  const totalWeightToChange = profile.targetWeight - profile.weight;
  const isLosingWeight = totalWeightToChange < 0;
  const isGainingWeight = totalWeightToChange > 0;
  
  // Safe weight change: 0.5-1 kg per week for losing, 0.25-0.5 kg per week for gaining
  const timelineInWeeks = profile.timeline;
  const weeklyWeightChangeNeeded = totalWeightToChange / timelineInWeeks;
  
  // 1 kg of body weight = ~7700 calories
  const totalCaloriesNeeded = Math.abs(totalWeightToChange) * 7700;
  const dailyCalorieDeficitOrSurplus = totalCaloriesNeeded / (timelineInWeeks * 7);
  
  // Calculate daily calorie target
  let dailyCalorieTarget = tdee;
  if (isLosingWeight) {
    dailyCalorieTarget = tdee - dailyCalorieDeficitOrSurplus;
  } else if (isGainingWeight) {
    dailyCalorieTarget = tdee + dailyCalorieDeficitOrSurplus;
  }
  
  // Ensure safe limits
  if (isLosingWeight && dailyCalorieTarget < 1200) dailyCalorieTarget = 1200; // Minimum safe calories
  if (isGainingWeight && dailyCalorieTarget > tdee + 500) dailyCalorieTarget = tdee + 500; // Max safe surplus
  
  // Calculate macronutrient distribution
  const proteinMultiplier = profile.healthGoal === 'Gain Muscle' ? 2.2 : 1.6;
  const proteinGrams = Math.round(profile.weight * proteinMultiplier);
  const proteinCalories = proteinGrams * 4;
  
  const fatPercentage = 0.25; // 25% of calories from fat
  const fatCalories = dailyCalorieTarget * fatPercentage;
  const fatGrams = Math.round(fatCalories / 9);
  
  const carbCalories = dailyCalorieTarget - proteinCalories - fatCalories;
  const carbGrams = Math.round(carbCalories / 4);
  
  const fiberGrams = Math.round(dailyCalorieTarget / 1000 * 14); // 14g per 1000 calories
  
  // Water recommendation based on weight and activity
  const waterGlasses = Math.round((profile.weight * 0.033) / 0.25); // 33ml per kg, in 250ml glasses
  
  // Generate recommendations
  const recommendations: string[] = [];
  const healthRisks: string[] = [];
  
  // BMI-based recommendations
  if (bmiCategory === 'Underweight') {
    recommendations.push('Focus on nutrient-dense, calorie-rich foods');
    recommendations.push('Include healthy fats like nuts, avocados, and olive oil');
    healthRisks.push('Low BMI may affect immune function');
  } else if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
    recommendations.push('Prioritize whole foods and vegetables');
    recommendations.push('Limit processed foods and added sugars');
    healthRisks.push('Elevated BMI increases risk of cardiovascular issues');
  }
  
  // Health condition-based recommendations
  profile.healthConditions.forEach(condition => {
    if (condition === 'Diabetes') {
      recommendations.push('Monitor carbohydrate intake carefully');
      recommendations.push('Choose low glycemic index foods');
      recommendations.push('Include fiber-rich foods to stabilize blood sugar');
      healthRisks.push('Blood sugar management is critical');
    }
    
    if (condition === 'PCOS') {
      recommendations.push('Focus on low-carb, high-protein meals');
      recommendations.push('Include anti-inflammatory foods');
      recommendations.push('Avoid refined carbohydrates');
    }
    
    if (condition === 'High Blood Pressure') {
      recommendations.push('Reduce sodium intake significantly');
      recommendations.push('Increase potassium-rich foods (bananas, spinach)');
      recommendations.push('Limit caffeine and alcohol');
      healthRisks.push('Monitor blood pressure regularly');
    }
    
    if (condition === 'Thyroid Issues') {
      recommendations.push('Ensure adequate iodine and selenium intake');
      recommendations.push('Maintain consistent meal timing');
    }
  });
  
  // Timeline-based recommendations
  if (Math.abs(weeklyWeightChangeNeeded) > 1) {
    recommendations.push('⚠️ Your timeline is aggressive. Consider extending it for safety.');
    healthRisks.push('Rapid weight change can be harmful');
  }
  
  // Activity recommendations
  if (profile.activityLevel === 'sedentary') {
    recommendations.push('Aim for 10,000 steps daily');
    recommendations.push('Include 30 minutes of moderate exercise');
  }
  
  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    dailyCalorieTarget: Math.round(dailyCalorieTarget),
    dailyCalorieBurnNeeded: Math.round(dailyCalorieDeficitOrSurplus),
    weeklyWeightChangeNeeded: Math.round(weeklyWeightChangeNeeded * 100) / 100,
    totalWeightToChange: Math.round(totalWeightToChange * 100) / 100,
    totalCaloriesNeeded: Math.round(totalCaloriesNeeded),
    recommendations,
    healthRisks,
    nutritionFocus: {
      protein: proteinGrams,
      carbs: carbGrams,
      fats: fatGrams,
      fiber: fiberGrams,
      water: waterGlasses
    }
  };
}

// Helper function to calculate calories burned from steps (weight-based)
export function calculateStepsCalories(steps: number, weightKg: number): number {
  // More accurate formula: (steps / 1000) × (weight_kg × 0.4)
  // This accounts for heavier people burning more calories per step
  return Math.round((steps / 1000) * (weightKg * 0.4));
}

// Helper function to check if health behaviors are met
export function checkHealthBehaviors(
  waterGlasses: number,
  sleepHours: number,
  stepsCount: number,
  recommendedWater: number = 8
) {
  return {
    metWaterGoal: waterGlasses >= recommendedWater,
    metSleepGoal: sleepHours >= 7 && sleepHours <= 9,
    metStepsGoal: stepsCount >= 8000
  };
}

// Track timeline progress with automatic adjustment
export function trackTimelineProgress(
  profile: UserProfile,
  foodLogs: any[],
  stepsLogs: any[],
  waterLogs: any[],
  sleepLogs: any[]
): TimelineProgress {
  const startDate = new Date(profile.startDate);
  const totalDays = profile.timeline * 7;
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + totalDays);
  
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  const daysRemaining = Math.max(0, totalDays - daysPassed);
  
  // Calculate total calories needed
  const analysis = analyzeUserHealth(profile);
  const totalCaloriesNeeded = analysis.totalCaloriesNeeded;
  const dailyCalorieTarget = analysis.dailyCalorieTarget;
  
  // Calculate calories burned so far (from all tracked data)
  let caloriesBurnedSoFar = 0;
  let missedCalories = 0;
  
  // Process each day
  for (let i = 0; i < daysPassed; i++) {
    const checkDate = new Date(startDate);
    checkDate.setDate(checkDate.getDate() + i);
    const checkDateString = checkDate.toDateString();
    
    // Calculate calories for this day
    const dayFoodLogs = foodLogs.filter(log => 
      new Date(log.timestamp).toDateString() === checkDateString
    );
    const dayStepsLogs = stepsLogs.filter(log => 
      new Date(log.timestamp).toDateString() === checkDateString
    );
    const dayWaterLogs = waterLogs.filter(log => 
      new Date(log.timestamp).toDateString() === checkDateString
    );
    const daySleepLog = sleepLogs.find(log => 
      new Date(log.date).toDateString() === checkDateString
    );
    
    const foodCalories = dayFoodLogs.reduce((sum, log) => sum + (log.calories * (log.quantity || 1)), 0);
    // Use weight-based steps calculation for accuracy
    const stepsCalories = dayStepsLogs.reduce((sum, log) => sum + calculateStepsCalories(log.steps, profile.weight), 0);
    
    // Water and sleep do NOT burn calories - they support health behaviors
    // Track them separately, don't include in calorie calculations
    
    // Net calories = food consumed - exercise calories from steps
    const netCalories = foodCalories - stepsCalories;
    caloriesBurnedSoFar += (dailyCalorieTarget - netCalories); // If losing weight
    
    // Track missed calories
    const expectedCaloriesBurned = dailyCalorieTarget;
    const actualNetCalories = netCalories;
    if (profile.healthGoal === 'Lose Weight' && actualNetCalories > expectedCaloriesBurned) {
      missedCalories += (actualNetCalories - expectedCaloriesBurned);
    }
  }
  
  const caloriesRemaining = totalCaloriesNeeded - caloriesBurnedSoFar;
  
  // Check if on track
  const expectedCaloriesBurnedByNow = analysis.dailyCalorieBurnNeeded * daysPassed;
  const isOnTrack = caloriesBurnedSoFar >= (expectedCaloriesBurnedByNow * 0.9); // 90% tolerance
  
  // Calculate days ahead/behind
  const daysAheadBehind = Math.floor((caloriesBurnedSoFar - expectedCaloriesBurnedByNow) / analysis.dailyCalorieBurnNeeded);
  
  // Adjust timeline if needed
  let adjustedEndDate: string | undefined;
  if (missedCalories > 0) {
    const additionalDaysNeeded = Math.ceil(missedCalories / analysis.dailyCalorieBurnNeeded);
    const newEndDate = new Date(endDate);
    newEndDate.setDate(newEndDate.getDate() + additionalDaysNeeded);
    adjustedEndDate = newEndDate.toISOString();
  }
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    totalDays,
    daysPassed: Math.max(0, daysPassed),
    daysRemaining,
    currentWeight: profile.weight,
    targetWeight: profile.targetWeight,
    weightToGo: Math.abs(profile.targetWeight - profile.weight),
    dailyCalorieTarget,
    totalCaloriesNeeded,
    caloriesBurnedSoFar: Math.round(caloriesBurnedSoFar),
    caloriesRemaining: Math.round(caloriesRemaining),
    isOnTrack,
    daysAheadBehind: Math.round(daysAheadBehind),
    adjustedEndDate,
    missedCalories: Math.round(missedCalories)
  };
}

// Calculate daily progress
export function calculateDailyProgress(
  profile: UserProfile,
  date: string,
  foodLogs: any[],
  stepsLogs: any[],
  waterLogs: any[],
  sleepLogs: any[]
): DailyProgress {
  const analysis = analyzeUserHealth(profile);
  
  const dayFoodLogs = foodLogs.filter(log => 
    new Date(log.timestamp).toDateString() === new Date(date).toDateString()
  );
  const dayStepsLogs = stepsLogs.filter(log => 
    new Date(log.timestamp).toDateString() === new Date(date).toDateString()
  );
  const dayWaterLogs = waterLogs.filter(log => 
    new Date(log.timestamp).toDateString() === new Date(date).toDateString()
  );
  const daySleepLog = sleepLogs.find(log => 
    new Date(log.date).toDateString() === new Date(date).toDateString()
  );
  
  const caloriesConsumed = dayFoodLogs.reduce((sum, log) => sum + (log.calories * (log.quantity || 1)), 0);
  const stepsCount = dayStepsLogs.reduce((sum, log) => sum + log.steps, 0);
  
  // Use weight-based steps calculation for accuracy
  const stepsCalories = calculateStepsCalories(stepsCount, profile.weight);
  
  const waterGlasses = dayWaterLogs.reduce((sum, log) => sum + log.amount, 0);
  const sleepHours = daySleepLog ? daySleepLog.hours : 0;
  
  // IMPORTANT: Water and sleep do NOT burn calories
  // They support health and metabolism but shouldn't be counted as calorie burn
  // Only steps count as exercise calories
  
  const caloriesBurned = stepsCalories; // Only exercise calories from steps
  const netCalories = caloriesConsumed - caloriesBurned;
  
  const isOnTrack = netCalories <= analysis.dailyCalorieTarget;
  
  return {
    date,
    caloriesConsumed: Math.round(caloriesConsumed),
    caloriesBurned: Math.round(caloriesBurned),
    netCalories: Math.round(netCalories),
    targetCalories: analysis.dailyCalorieTarget,
    stepsCount,
    waterGlasses,
    sleepHours,
    mealsEaten: dayFoodLogs.length,
    isOnTrack
  };
}

// Get nutrition recommendations based on what was eaten
export function getNutritionRecommendations(
  consumed: { protein: number; carbs: number; fats: number; fiber: number },
  target: { protein: number; carbs: number; fats: number; fiber: number }
): string[] {
  const recommendations: string[] = [];
  
  const proteinDiff = consumed.protein - target.protein;
  const carbsDiff = consumed.carbs - target.carbs;
  const fatsDiff = consumed.fats - target.fats;
  const fiberDiff = consumed.fiber - target.fiber;
  
  if (proteinDiff < -20) {
    recommendations.push('🍗 Add more protein: eggs, chicken, lentils, or Greek yogurt');
  } else if (proteinDiff > 20) {
    recommendations.push('⚠️ Reduce protein intake slightly');
  }
  
  if (carbsDiff < -50) {
    recommendations.push('🍚 Add healthy carbs: brown rice, quinoa, or sweet potatoes');
  } else if (carbsDiff > 50) {
    recommendations.push('⚠️ Reduce carbs: skip refined grains and sweets');
  }
  
  if (fatsDiff < -10) {
    recommendations.push('🥑 Add healthy fats: nuts, avocado, or olive oil');
  } else if (fatsDiff > 10) {
    recommendations.push('⚠️ Reduce fats: limit fried foods and butter');
  }
  
  if (fiberDiff < -10) {
    recommendations.push('🥗 Increase fiber: add vegetables, fruits, and whole grains');
  }
  
  return recommendations;
}

// Simplified function to calculate daily calorie target
export function calculateDailyCalorieTarget(
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel?: string | null,
  goal?: string | null,
  healthConditions?: string[] | null
): number {
  const bmr = calculateBMR(weight, height, age, gender, healthConditions || undefined);
  const tdee = calculateTDEE(bmr, activityLevel);
  
  let target = tdee;
  
  if (goal === 'lose_weight') {
    target = tdee - 500; // 500 calorie deficit for ~0.5kg/week loss
  } else if (goal === 'gain_weight' || goal === 'gain_muscle') {
    target = tdee + 300; // 300 calorie surplus for ~0.25kg/week gain
  }
  
  // Ensure safe limits
  if (goal === 'lose_weight') {
    if (gender.toLowerCase() === 'male' && target < 1500) target = 1500;
    else if (target < 1200) target = 1200;
  }
  if ((goal === 'gain_weight' || goal === 'gain_muscle') && target > tdee + 500) target = tdee + 500;
  
  return Math.round(target);
}

// Calculate user metrics (BMI, BMR, TDEE)
export function calculateUserMetrics(
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel?: string | null
) {
  const { bmi, category } = calculateBMI(weight, height);
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  
  return {
    bmi,
    bmiCategory: category,
    bmr,
    tdee
  };
}
