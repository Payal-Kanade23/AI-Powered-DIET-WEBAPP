import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { registerUser, loginUser } from '../controllers/authController.js';
import upload from '../middleware/upload.js';
import { scanFood, getHistory, getTodayScans } from '../controllers/foodController.js';
import {saveProfileAndGeneratePlan, getProfile,getTodayAnalytics} from "../controllers/profileController.js"
const router = express.Router();


router.post("/register", registerUser);
router.post("/login",loginUser);
router.get("/profile", protect , (req, res) =>{
    res.json({
        message:"Protected Route Accessed",
        user:req.user,
    })
})
router.post(
  "/scan",
  
  protect,
  
  upload.single("image"),
 
  scanFood
);
router.get("/history", protect , getHistory);
router.get("/history/today", protect, getTodayScans);


router.post("/profile",protect,  saveProfileAndGeneratePlan);
router.get("/profile/me",protect, getProfile);
router.get("/guide/weekly", protect, getProfile);
router.get("/analytics/today",protect, getTodayAnalytics);


export default router;
