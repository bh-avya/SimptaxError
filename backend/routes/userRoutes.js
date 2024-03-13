import express from "express";
import {createUser, 
    loginUser,
    logoutUser, 
    getAllUsers, 
    getCurrentUser, 
    updateCurrentUser, 
    deleteUser, 
    getUserByID, 
    updateUserByID
} from "../controllers/userController.js"

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(createUser).get(authenticate, authorizeAdmin, getAllUsers);
router.post("/auth", loginUser);
router.post("/logout", logoutUser);
router.route("/profile").get(authenticate, getCurrentUser).put(authenticate, updateCurrentUser)
router.route("/:id").delete(authenticate, authorizeAdmin, deleteUser).get(authenticate, authorizeAdmin,getUserByID).put(authenticate, authorizeAdmin, updateUserByID);

export default router;