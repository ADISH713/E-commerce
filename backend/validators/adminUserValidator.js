import { body, param, query } from "express-validator";
import MESSAGES from "../constants/messages.js";

const { VALIDATION } = MESSAGES;

export const adminUserListValidator = [
    query("status").optional().isIn(["all", "active", "blocked"]).withMessage(VALIDATION.USER_STATUS_INVALID),
    query("role").optional().isIn(["all", "user", "admin"]).withMessage(VALIDATION.USER_ROLE_INVALID),
    query("page").optional().isInt({ min: 1 }).withMessage(VALIDATION.PAGE_INVALID),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage(VALIDATION.LIMIT_INVALID)
];

export const blockStatusValidator = [
    param("id").isMongoId().withMessage(VALIDATION.USER_ID_INVALID),
    body("isBlocked")
        .isBoolean().withMessage(VALIDATION.BLOCK_FLAG_INVALID)
        .bail()
        .toBoolean()
];