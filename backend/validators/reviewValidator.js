import { body, param, query } from "express-validator";
import MESSAGES from "../constants/messages.js";

const { VALIDATION } = MESSAGES;

const productIdParam = param("productId").isMongoId().withMessage(VALIDATION.PRODUCT_ID_INVALID);
const reviewIdParam = param("id").isMongoId().withMessage(VALIDATION.REVIEW_ID_INVALID);

export const productIdValidator = [productIdParam];
export const reviewIdValidator = [reviewIdParam];

export const reviewListValidator = [
    productIdParam,
    query("page").optional().isInt({ min: 1 }).withMessage(VALIDATION.PAGE_INVALID),
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage(VALIDATION.LIMIT_INVALID)
];

export const createReviewValidator = [
    productIdParam,
    body("rating").isInt({ min: 1, max: 5 }).withMessage(VALIDATION.RATING_INVALID).bail().toInt(),
    body("comment").trim().isLength({ min: 3, max: 1000 }).withMessage(VALIDATION.COMMENT_INVALID)
];

export const updateReviewValidator = [
    reviewIdParam,
    body("rating").optional().isInt({ min: 1, max: 5 }).withMessage(VALIDATION.RATING_INVALID).bail().toInt(),
    body("comment").optional().trim().isLength({ min: 3, max: 1000 }).withMessage(VALIDATION.COMMENT_INVALID),
    body().custom((_, { req }) => {
        if (req.body.rating === undefined && req.body.comment === undefined) {
            throw new Error(VALIDATION.REVIEW_EMPTY_UPDATE);
        }
        return true;
    })
];