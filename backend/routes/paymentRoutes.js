import express from "express";
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    markPaymentFailed
} from "../controllers/paymentController.js";
import { createOrderValidator } from "../validators/orderValidator.js";
import { verifyPaymentValidator, paymentFailedValidator } from "../validators/paymentValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect } from "../middleware/authMiddleware.js";
import { paymentLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.use(protect, paymentLimiter);

router.post("/razorpay/order", createOrderValidator, validateRequest, createRazorpayOrder);
router.post("/razorpay/verify", verifyPaymentValidator, validateRequest, verifyRazorpayPayment);
router.post("/razorpay/failed", paymentFailedValidator, validateRequest, markPaymentFailed);

export default router;