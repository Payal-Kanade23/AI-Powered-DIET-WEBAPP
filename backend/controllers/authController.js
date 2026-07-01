import User from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async(req, res)=>{
    try{
        const {name , email , password } = req.body;
        if(!name || !email || !password){
           return res.status(400).json({message:"Please fill all field"})
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
           return res.status(400).json({message:"User Already exists"})
        }

        const hashPassword = await bcrypt.hash(password , 10);
        const user = await User.create({
            name ,
            email ,
            password: hashPassword,
        });

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.status(201).json({message:'Register Successfully', 
            token ,
            user:{
                name , 
                email ,
                password
            }
        })
    }catch(error){
        res.status(500).json({message:"Internal Server Error"+error})
    }
}

export const loginUser = async(req, res)=>{
    try{
        const { email , password } = req.body;
        if(!email || !password){
           return res.status(400).json({message:"Please fill all field"})
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User does not exists"})
        }

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
          return res.status(400).json({message:"Inavalid password"})
        }

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.status(200).json({message:'Login Successfully', 
            token ,
            user:{
                
                id: user._id,
        email: user.email,
        name: user.name
            }
        })
    }catch(error){
        res.status(500).json({message:"Internal Server Error"+error})
    }
}