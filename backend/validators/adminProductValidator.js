import { param, query } from "express-validator";
import MESSAGES from "../constants/messages.js";

const { VALIDATION } = MESSAGES;

export const adminProductListValidator = [
    query("status").optional().isIn(["active", "trash", "all"]).withMessage(VALIDATION.STATUS_INVALID),
    query("page").optional().isInt({ min: 1 }).withMessage(VALIDATION.PAGE_INVALID),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage(VALIDATION.LIMIT_INVALID)
];

export const productIdValidator = [
    param("id").isMongoId().withMessage(VALIDATION.PRODUCT_ID_INVALID)
];