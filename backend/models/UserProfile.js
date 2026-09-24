// models/UserProfile.js
import mongoose from "mongoose";
const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  height: Number,       // cm
  weight: Number,       // kg
  age: Number,
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  activityLevel: {
    type: String,
    enum: ["sedentary", "light", "moderate", "active", "very_active"],
  },
  goal: {
    type: String,
    enum: ["lose_weight", "gain_weight", "maintain", "build_muscle"],
  },
  dietaryPreference: String, // e.g. "vegetarian", "non-veg", "vegan"

  // calculated targets (Gemini fills these)
  targetCalories: Number,
  targetProtein: Number,
  targetCarbs: Number,
  targetFat: Number,

  // Gemini generated plan
  weeklyPlan: [
    {
      day: String,        // "Monday"
      meals: [String],    // simple text list, easy to render
      tip: String,
    },
  ],

  planGeneratedAt: Date,
}, { timestamps: true });

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
export default UserProfile;
 