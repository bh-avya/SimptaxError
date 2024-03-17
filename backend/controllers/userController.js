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
        res.status(201).json({
            message: " User has been created successfully",
            newUser
        });
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
                email  :currUser.email,
                message: "User has logged in successfully",
                admin : currUser.admin
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

const getAllUsers = asyncHandler(async (req,res)=>{
    const users = await User.find({});
    res.json(users);
})

const getCurrentUser = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.user._id);
    if(user){
        res.json({
            user
        })
    }
    else{
        res.status(404);
        throw new Error("User not found!");
    }
})

const updateCurrentUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);
    if (user){
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if(req.body.password){
            const salt = await bcrypt.genSalt(15);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword;
        }

        const updateUser = await user.save();

        res.json({
            message : "User detials have been updated successfully",
            user
        })

    }
    else{
        res.status(404);
        throw new Error("User not found!");
    }
})

const deleteUser = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id);
    if(user){
        if(user.admin){
            res.status(400);            
            throw new Error("Cannot delete Admin User");
        }

        await User.deleteOne({_id : user._id});
        res.json({message : "User has been removed successfully"});
    }
    else{
        res.status(404);
        throw new Error("User not found!");
    }
});

const getUserByID = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id).select("-password");
    if(user){
        res.json(user);
    }
    else{
        res.status(404);
        throw new Error("User not found!");
    }
})

const updateUserByID = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id);
    if(user){
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.admin = Boolean(req.body.admin);

        const updatedUser = await user.save();
        res.json({
            message : "The user has been updated successfully",
            updatedUser
        })
    }
    else{
        res.status(404);
        throw new Error("User not found!");
    }


}) 

export {createUser,loginUser, logoutUser, getAllUsers, getCurrentUser, updateCurrentUser, deleteUser, getUserByID, updateUserByID};