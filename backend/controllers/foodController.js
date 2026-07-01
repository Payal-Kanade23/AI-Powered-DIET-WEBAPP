import fs from "fs";
import FoodScan from "../../backend/models/FoodScan.js";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize outside the handler so you don't recreate it on every request


export const scanFood = async (req, res) => {
  try {
    const ai =new  GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    // Define the schema to force a guaranteed JSON structure
    const foodSchema = {
      type: Type.OBJECT,
      properties: {
        foodName: { type: Type.STRING },
        calories: { type: Type.INTEGER },
        protein: { type: Type.INTEGER },
        carbs: { type: Type.INTEGER },
        fat: { type: Type.INTEGER },
        healthRating: { type: Type.STRING },
        suggestion: { type: Type.STRING },
      },
      required: ["foodName", "calories", "protein", "carbs", "fat", "healthRating", "suggestion"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: "Identify the food in this image and analyze its nutritional value." },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Image,
              },
            },
          ],
        },
      ],
      // Configuration telling Gemini to ONLY return JSON matching your schema
      config: {
        responseMimeType: "application/json",
        responseSchema: foodSchema,
      },
    });

    // Extract text using the proper .text() method or fallback property safely
    const responseText = typeof response.text === 'function' ? response.text() : response.text;
    const result = JSON.parse(responseText);
    const scan = await FoodScan.create({
      user: req.user.id,
      foodName: result.foodName,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      healthRating: result.healthRating,
      suggestion: result.suggestion,
      image: req.file.filename,
    });

    res.status(201).json(scan);
  } catch (error) {
    console.error("Scan Food Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const scans = await FoodScan.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(scans);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};