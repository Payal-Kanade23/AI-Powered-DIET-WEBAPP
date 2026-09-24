import mongoose from "mongoose";

const foodScanSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    foodName:{
        type:String,
        required:true,
    },
    calories:Number,
    protein:Number,
    carbs:Number,
    fat:Number,
    image:String,
    healthRating:String,
    suggestion:String
},
{
    timestamps:true,
})

// Keeps local-day dashboard queries fast as a user's scan history grows.
foodScanSchema.index({ user: 1, createdAt: -1 });

const FoodScan = new mongoose.model("FoodScan", foodScanSchema);
export default FoodScan;
