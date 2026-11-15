import { body, param } from "express-validator";

export const addToWishlistValidator = [
    body("productId")
        .notEmpty().withMessage("Product id is required")
        .isMongoId().withMessage("Invalid product id")
];

export const removeFromWishlistValidator = [
    param("productId")
        .isMongoId().withMessage("Invalid product id")
];