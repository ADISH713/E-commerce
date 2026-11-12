import {body} from "express-validator";

export const registerValidator = [
    body("name").trim().isLength({min:2}).withMessage("Name must contain at least 2 characters"),
    body("email").trim().isEmail().withMessage("Enter a valid email address").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
]
export const loginValidator = [
    body("email").trim().isEmail().withMessage("Enter a valid email address").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required")
];
