import { query } from "express-validator";
import MESSAGES from "../constants/messages.js";

const { VALIDATION } = MESSAGES;

export const adminReviewListValidator = [
    query("search").optional().trim().isLength({ max: 100 }).withMessage(VALIDATION.SEARCH_TOO_LONG),
    query("rating").optional().isInt({ min: 1, max: 5 }).withMessage(VALIDATION.RATING_FILTER_INVALID),
    query("sort").optional().isIn(["newest", "oldest", "lowest", "highest"]).withMessage(VALIDATION.SORT_INVALID),
    query("page").optional().isInt({ min: 1 }).withMessage(VALIDATION.PAGE_INVALID),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage(VALIDATION.LIMIT_INVALID)
];