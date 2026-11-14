import { body, param } from "express-validator";

export const addToCartValidator = [
    body("productId")
        .notEmpty().withMessage("Product id is required")
        .isMongoId().withMessage("Invalid product id"),
    body("quantity")
        .optional()
        .isInt({ min: 1 }).withMessage("Quantity must be a whole number of 1 or more")
        .toInt()
];

export const updateCartValidator = [
    param("productId")
        .isMongoId().withMessage("Invalid product id"),
    body("quantity")
        .notEmpty().withMessage("Quantity is required")
        .isInt({ min: 1 }).withMessage("Quantity must be a whole number of 1 or more")
        .toInt()
];

export const removeFromCartValidator = [
    param("productId")
        .isMongoId().withMessage("Invalid product id")
];