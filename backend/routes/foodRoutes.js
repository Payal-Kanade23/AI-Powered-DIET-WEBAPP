import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { registerUser, loginUser } from '../controllers/authController.js';
import upload from '../middleware/upload.js';
import { scanFood  , getHistory } from '../controllers/foodController.js';

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


export default router;