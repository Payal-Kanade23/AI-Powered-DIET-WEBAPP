// controllers/profileController.js
import UserProfile from "../models/UserProfile.js"
import FoodScan from "../../backend/models/FoodScan.js";
import generateWeeklyPlan from "../utils/gemini.js"
import { buildFallbackPlan, calculateTargets, getBmiSummary, goalLabels } from "../utils/nutrition.js";
import { getLocalDayRange, requestTimeZone } from "../utils/localDay.js";

const numberOrZero = (value) => Number(value) || 0;

const profileGuide = (profile) => ({
  profile: {
    height: profile.height,
    weight: profile.weight,
    age: profile.age,
    gender: profile.gender,
    activityLevel: profile.activityLevel,
    dietaryPreference: profile.dietaryPreference,
    goal: profile.goal,
    goalLabel: goalLabels[profile.goal] || profile.goal,
    bmi: getBmiSummary(profile.height, profile.weight),
  },
  targets: {
    calories: profile.targetCalories,
    protein: profile.targetProtein,
    carbs: profile.targetCarbs,
    fat: profile.targetFat,
  },
  weeklyPlan: profile.weeklyPlan || [],
  generatedAt: profile.planGeneratedAt,
});


// Create/update profile + generate plan
export const saveProfileAndGeneratePlan = async (req, res) => {
  try {
    const { height, weight, age, gender, activityLevel, goal, dietaryPreference } = req.body;

    if (![height, weight, age].every((value) => Number(value) > 0)) {
      return res.status(400).json({ message: "Height, weight and age must be positive numbers." });
    }

    const targets = calculateTargets({ height, weight, age, gender, activityLevel, goal });
    let weeklyPlan;
    try {
      weeklyPlan = await generateWeeklyPlan({ height, weight, age, gender, activityLevel, goal, dietaryPreference });
    } catch (aiError) {
      console.error("Weekly plan generation failed; using a curated fallback.", aiError.message);
      weeklyPlan = buildFallbackPlan({ dietaryPreference, goal });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        height, weight, age, gender, activityLevel, goal, dietaryPreference,
        targetCalories: targets.calories,
        targetProtein: targets.protein,
        targetCarbs: targets.carbs,
        targetFat: targets.fat,
        weeklyPlan,
        planGeneratedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json(profileGuide(profile));
  } catch (err) {
    console.error("Failed to save profile and generate guide:", err);

    res.status(500).json({ message: "Failed to generate plan" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: "Complete your profile to generate a guide." });
    res.json(profileGuide(profile));
  } catch (err) {
    res.status(500).json({ message: "Failed to load your guide." });
  }
};

// Daily analytics: compare today's scanned food totals vs target
export const getTodayAnalytics = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: "No profile found" });

    const { start, end, timeZone, date } = getLocalDayRange(requestTimeZone(req));

    const todaysFood = await FoodScan.find({
      user: req.user.id,
      createdAt: { $gte: start, $lt: end },
    });

    const totals = todaysFood.reduce(
      (acc, item) => {
        acc.calories += item.calories || 0;
        acc.protein += item.protein || 0;
        acc.carbs += item.carbs || 0;
        acc.fat += item.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const targets = {
      calories: numberOrZero(profile.targetCalories),
      protein: numberOrZero(profile.targetProtein),
      carbs: numberOrZero(profile.targetCarbs),
      fat: numberOrZero(profile.targetFat),
    };
    const nutrients = Object.entries(targets).map(([key, target]) => {
      const total = totals[key];
      const difference = Math.round(target - total);
      return {
        key,
        consumed: total,
        target,
        remaining: Math.max(0, difference),
        overBy: Math.max(0, -difference),
        percentage: target ? Math.round((total / target) * 100) : 0,
        status: total > target ? "over" : total >= target * 0.9 ? "on_track" : "below",
      };
    });
    const calorie = nutrients.find((nutrient) => nutrient.key === "calories");
    const protein = nutrients.find((nutrient) => nutrient.key === "protein");
    const insights = [
      calorie.status === "over" ? `You are ${calorie.overBy} kcal above today’s calorie target.` : calorie.remaining ? `${calorie.remaining} kcal remain in today’s budget.` : "You have reached today’s calorie target.",
      protein.status === "below" ? `Add about ${protein.remaining}g of protein to support your goal.` : "Your protein intake is on track today.",
    ];

    res.json({
      guide: profileGuide(profile).profile,
      totals,
      targets,
      nutrients,
      achieved: {
        calories: totals.calories >= profile.targetCalories * 0.9 && totals.calories <= profile.targetCalories * 1.1,
        protein: totals.protein >= profile.targetProtein,
        carbs: totals.carbs <= profile.targetCarbs,
        fat: totals.fat <= profile.targetFat,
      },
      itemsToday: todaysFood.length,
      scans: todaysFood.sort((a, b) => b.createdAt - a.createdAt),
      date,
      timeZone,
      insights,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Failed to load analytics" });
  }
};
