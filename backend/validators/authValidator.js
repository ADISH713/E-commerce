import { body } from "express-validator";
import MESSAGES from "../constants/messages.js";

export const registerValidator = [
    body("name").trim().isLength({ min: 2 }).withMessage(MESSAGES.VALIDATION.NAME_MIN),
    body("email").trim().isEmail().withMessage(MESSAGES.VALIDATION.EMAIL_INVALID).normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage(MESSAGES.VALIDATION.PASSWORD_MIN)
];

export const loginValidator = [
    body("email").trim().isEmail().withMessage(MESSAGES.VALIDATION.EMAIL_INVALID).normalizeEmail(),
    body("password").notEmpty().withMessage(MESSAGES.VALIDATION.PASSWORD_REQUIRED)
];