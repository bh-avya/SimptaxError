import { isValidObjectId } from "mongoose";

function confID(req,res, next){
    if(!isValidObjectId(req.params.id)){
        res.status(404);
        throw new Error("Invalid Object! Specify a valid object");
    }
    next();
}

export default confID;