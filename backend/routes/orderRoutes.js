import express from "express";
import {
    createOrder,
    getAllOrders,
    userOrders,
    totalOrders,
    calcTotalSales,
    calcTotalSalesByDate,
    orderByID,
    markOrderAsPaid,
    markOrderAsDelivered

} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(authenticate, createOrder).get(authenticate, authorizeAdmin, getAllOrders);
router.route("/myOrders").get(authenticate, userOrders)
router.route("/totalOrders").get(totalOrders);
router.route("/totalSales").get(calcTotalSales);
router.route("/totalSalesByDate").get(calcTotalSalesByDate);
router.route("/:id").get(authenticate, orderByID);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router.route("/:id/deliver").put(authenticate, authorizeAdmin, markOrderAsDelivered);
export default router;