import express from "express";
import { createOrder, getMyOrders, getOrderById } from "../controllers/orderController.js";
import { createOrderValidator, orderIdValidator } from "../validators/orderValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createOrderValidator, validateRequest, createOrder);
router.get("/", getMyOrders);
router.get("/:id", orderIdValidator, validateRequest, getOrderById);

export default router;