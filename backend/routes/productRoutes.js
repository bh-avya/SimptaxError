import express from "express";
import formid from "express-formidable";
import { 
    addProduct, 
    updateProduct,
    deleteProduct,
    getProducts,
    getProductByID,
    getAllProducts,
    addProductReview,
    getTop,
    getLatest

 } from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import confID from "../middlewares/confID.js"

const router = express.Router();

router.get("/top", getTop);
router.get("/latest", getLatest);
router.route("/allproducts").get(getAllProducts);
router.route("/").get(getProducts).post(authenticate, authorizeAdmin, formid(), addProduct);
router.route("/:id").put(authenticate, authorizeAdmin, formid(), updateProduct).delete(authenticate, authorizeAdmin, deleteProduct).get(getProductByID);
router.route("/:id/reviews").post(authenticate, authorizeAdmin, confID, addProductReview);

export default router;
