// utils/gemini.js
import { GoogleGenAI } from "@google/genai";


async function generateWeeklyPlan(profile) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `
You are a nutrition coach. Based on this user profile, return ONLY valid JSON (no markdown, no backticks).

User:
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Age: ${profile.age}
- Gender: ${profile.gender}
- Activity level: ${profile.activityLevel}
- Goal: ${profile.goal}
- Dietary preference: ${profile.dietaryPreference || "none"}

Return JSON exactly in this shape:
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "meals": [
        "Breakfast: ...",
        "Lunch: ...",
        "Dinner: ...",
        "Snack: ..."
      ],
      "tip": "short tip"
    }
  ]
}

Include all 7 days.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text.trim();
  const result = JSON.parse(text);
  return result.weeklyPlan;
}



 export default generateWeeklyPlan;
