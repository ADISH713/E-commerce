import { body, param } from "express-validator";
import MESSAGES from "../constants/messages.js";

const { VALIDATION } = MESSAGES;

export const addToCartValidator = [
    body("productId")
        .notEmpty().withMessage(VALIDATION.PRODUCT_ID_REQUIRED)
        .isMongoId().withMessage(VALIDATION.PRODUCT_ID_INVALID),
    body("quantity")
        .optional()
        .isInt({ min: 1 }).withMessage(VALIDATION.QUANTITY_INVALID)
        .toInt()
];

export const updateCartValidator = [
    param("productId")
        .isMongoId().withMessage(VALIDATION.PRODUCT_ID_INVALID),
    body("quantity")
        .notEmpty().withMessage(VALIDATION.QUANTITY_REQUIRED)
        .isInt({ min: 1 }).withMessage(VALIDATION.QUANTITY_INVALID)
        .toInt()
];

export const removeFromCartValidator = [
    param("productId")
        .isMongoId().withMessage(VALIDATION.PRODUCT_ID_INVALID)
];