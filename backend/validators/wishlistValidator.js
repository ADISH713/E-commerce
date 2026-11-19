import { body, param } from "express-validator";
import MESSAGES from "../constants/messages.js";

const { VALIDATION } = MESSAGES;

export const addToWishlistValidator = [
    body("productId")
        .notEmpty().withMessage(VALIDATION.PRODUCT_ID_REQUIRED)
        .isMongoId().withMessage(VALIDATION.PRODUCT_ID_INVALID)
];

export const removeFromWishlistValidator = [
    param("productId")
        .isMongoId().withMessage(VALIDATION.PRODUCT_ID_INVALID)
];