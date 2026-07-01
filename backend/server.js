import cors from "cors";
import express from "express";
import dotenv from "dotenv"
import path from "path";
import connectDB from "./config/db.js";
import foodRoutes from "./routes/foodRoutes.js"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use("/api/food", foodRoutes);

app.listen(5000, async()=>{
    connectDB();

    console.log("Server running!")
})

