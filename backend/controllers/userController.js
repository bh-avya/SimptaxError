import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import genToken from "../utilities/tokenGen.js";

const createUser = asyncHandler(async(req,res) => {
    const {username, email, password} = req.body;
    
    if(!username || !email || !password){
        throw new Error("Please fill all details correctly")
    }

    const currUser = await User.findOne({email});
    if(currUser){
        res.status(201).json({message: "This email is currently in use! Proceed to Login"});
    }

    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({username, email, password:hashedPassword})

    try {
        await newUser.save();
        genToken(res, newUser._id);
        res.status(201).json({message: " User has been created successfully"});
    } catch (err) {
        res.status(500);
        throw new Error("Invalid data provided!");   
    }
}) 

const loginUser = asyncHandler(async (req,res)=>{
    const{email, password} = req.body;
    const currUser = await User.findOne({email});
    if(currUser){
        const isPassValid = await bcrypt.compare(password,currUser.password);
    
        if(isPassValid){
            genToken(res, currUser._id);
            res.status(201).json({
                username : currUser.username,
                email  :currUser.email
            });
            return
        }
    }
})

const logoutUser = asyncHandler(async (req,res)=>{
    res.cookie('jwt', '',{
        httpOnly : true, 
        expires : new Date(0)
    })
    res.status(200).json({message : "Logged out successfully !"});
})

export {createUser,loginUser, logoutUser};