import {body, param, query } from "express-validator";
import MESSAGES from "../constants/messages.js";

const { VALIDATION } = MESSAGES;

export const adminOrderListValidator = [
    query("status")
        .optional()
        .isIn(["all", "pending", "processing", "shipped", "delivered", "cancelled"])
        .withMessage(VALIDATION.ORDER_STATUS_INVALID),
    query("paymentStatus")
        .optional()
        .isIn(["all", "pending", "paid", "failed"])
        .withMessage(VALIDATION.PAYMENT_STATUS_INVALID),
    query("search").optional().trim().isLength({ max: 100 }).withMessage(VALIDATION.SEARCH_TOO_LONG),
    query("page").optional().isInt({ min: 1 }).withMessage(VALIDATION.PAGE_INVALID),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage(VALIDATION.LIMIT_INVALID),
    query("sort").optional().isIn(["newest", "oldest", "highest", "lowest"]).withMessage(VALIDATION.SORT_INVALID),
];

export const orderStatusValidator = [
    param("id").isMongoId().withMessage(VALIDATION.ORDER_ID_INVALID),
    body("status")
        .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
        .withMessage(VALIDATION.ORDER_STATUS_INVALID)
];

export const orderIdValidator = [
    param("id").isMongoId().withMessage(VALIDATION.ORDER_ID_INVALID)
];