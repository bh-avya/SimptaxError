import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_UTIL);
            req.user = await User.findById(decoded.userID).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Authorization Failed");
        }
    } 
    else {
        res.status(401);
        throw new Error("Authorization Failed (no token)");
    }
});

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
        next();
    } 
    else {
        res.status(401).send("Admin Authorization Failed!");
    }
};

export { authenticate, authorizeAdmin };