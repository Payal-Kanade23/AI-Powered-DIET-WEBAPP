const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS = {
  lose_weight: -450,
  gain_weight: 300,
  maintain: 0,
  build_muscle: 200,
};

export const goalLabels = {
  lose_weight: "Weight loss",
  gain_weight: "Weight gain",
  maintain: "Weight maintenance",
  build_muscle: "Build muscle",
};

export function calculateTargets({ height, weight, age, gender, activityLevel, goal }) {
  const heightCm = Number(height);
  const weightKg = Number(weight);
  const years = Number(age);
  const baseBmr = 10 * weightKg + 6.25 * heightCm - 5 * years;
  const bmr = baseBmr + (gender === "male" ? 5 : gender === "female" ? -161 : -78);
  const calories = Math.max(1200, Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.55) + (GOAL_ADJUSTMENTS[goal] || 0)));
  const proteinPerKg = goal === "build_muscle" ? 1.8 : goal === "lose_weight" ? 1.6 : 1.4;
  const protein = Math.round(weightKg * proteinPerKg);
  const fat = Math.round((calories * 0.27) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  return { calories, protein, carbs, fat };
}

export function getBmiSummary(height, weight) {
  const bmi = Number(weight) / Math.pow(Number(height) / 100, 2);
  const roundedBmi = Number(bmi.toFixed(1));
  const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy range" : bmi < 30 ? "Overweight" : "Obesity range";
  return { value: roundedBmi, category };
}

export function buildFallbackPlan({ dietaryPreference, goal }) {
  const preference = dietaryPreference?.trim() || "your preferred foods";
  const goalText = goalLabels[goal] || "your goal";
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealSets = [
    ["Breakfast: Oats with fruit and Greek yogurt", "Lunch: Grain bowl with vegetables, protein and olive oil", "Dinner: Lentil or lean-protein curry with rice and salad", "Snack: Fruit with nuts"],
    ["Breakfast: Eggs or tofu scramble with whole-grain toast", "Lunch: Chickpea or chicken wrap with salad", "Dinner: Stir-fried vegetables with tofu, fish or paneer", "Snack: Yogurt or roasted chana"],
    ["Breakfast: Smoothie with milk/soy milk, banana and seeds", "Lunch: Dal, roti and mixed vegetables", "Dinner: Protein-rich soup with a whole-grain side", "Snack: Apple with peanut butter"],
  ];
  return days.map((day, index) => ({
    day,
    meals: mealSets[index % mealSets.length],
    tip: `Choose portions that support ${goalText} and keep meals aligned with ${preference}.`,
  }));
}
