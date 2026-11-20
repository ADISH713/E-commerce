import { body } from "express-validator";
import MESSAGES from "../constants/messages.js";

const { VALIDATION } = MESSAGES;

export const verifyPaymentValidator = [
    body("orderId").isMongoId().withMessage(VALIDATION.ORDER_ID_INVALID),
    body("razorpay_order_id").trim().notEmpty().withMessage(VALIDATION.PAYMENT_FIELDS_REQUIRED),
    body("razorpay_payment_id").trim().notEmpty().withMessage(VALIDATION.PAYMENT_FIELDS_REQUIRED),
    body("razorpay_signature").trim().notEmpty().withMessage(VALIDATION.PAYMENT_FIELDS_REQUIRED)
];

export const paymentFailedValidator = [
    body("orderId").isMongoId().withMessage(VALIDATION.ORDER_ID_INVALID)
];