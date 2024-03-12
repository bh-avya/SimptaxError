import jwt from "jsonwebtoken";

const generateToken = (res, userID)=>{
    const token = jwt.sign({userID}, process.env.JWT_UTIL, {expiresIn : '30d'});

    res.cookie("jwt", token, {
        httpOnly : true, 
        secure : process.env.NODE_EN != 'development', 
        sameSite: 'strict', 
        maxAge : 30*24*3600*1000
    });
    return token;
};

export default generateToken;