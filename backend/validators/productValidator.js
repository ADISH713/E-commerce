import { body,query } from "express-validator";
import MESSAGES from "../constants/messages.js";

const { VALIDATION } = MESSAGES;

export const createProductValidator = [
    body("name").trim().isLength({ min: 2 }).withMessage(VALIDATION.NAME_MIN),
    body("description").trim().notEmpty().withMessage(VALIDATION.DESCRIPTION_REQUIRED),
    body("price").isFloat({ min: 1 }).withMessage(VALIDATION.PRICE_MIN),
    body("category").trim().notEmpty().withMessage(VALIDATION.CATEGORY_REQUIRED),
    body("brand").trim().notEmpty().withMessage(VALIDATION.BRAND_REQUIRED),
    body("images").isArray({ min: 1 }).withMessage(VALIDATION.IMAGES_REQUIRED),
    body("stock").optional().isInt({ min: 0 }).withMessage(VALIDATION.STOCK_INVALID),
    body("specs").isObject().withMessage(VALIDATION.SPECS_INVALID),
    body("grade").trim().notEmpty().withMessage(VALIDATION.GRADE_REQUIRED)
];

export const updateProductValidator = [
    body("name").optional().trim().isLength({ min: 2 }).withMessage(VALIDATION.NAME_MIN),
    body("description").optional().trim().notEmpty().withMessage(VALIDATION.DESCRIPTION_REQUIRED),
    body("price").optional().isFloat({ min: 1 }).withMessage(VALIDATION.PRICE_MIN),
    body("category").optional().trim().notEmpty().withMessage(VALIDATION.CATEGORY_REQUIRED),
    body("brand").optional().trim().notEmpty().withMessage(VALIDATION.BRAND_REQUIRED),
    body("images").optional().isArray({ min: 1 }).withMessage(VALIDATION.IMAGES_REQUIRED),
    body("stock").optional().isInt({ min: 0 }).withMessage(VALIDATION.STOCK_INVALID),
    body("specs").optional().isObject().withMessage(VALIDATION.SPECS_INVALID),
    body("grade").optional().trim().notEmpty().withMessage(VALIDATION.GRADE_REQUIRED)
];

export const productListValidator = [
    query("search").optional().trim().isLength({ max: 100 }).withMessage(VALIDATION.SEARCH_TOO_LONG),
    query("category").optional().trim().isLength({ min: 1, max: 50 }).withMessage(VALIDATION.CATEGORY_INVALID),
    query("grade").optional().trim().isLength({ min: 1, max: 30 }).withMessage(VALIDATION.GRADE_INVALID),
    query("minPrice").optional().isFloat({ min: 0 }).withMessage(VALIDATION.PRICE_FILTER_INVALID),
    query("maxPrice")
        .optional()
        .isFloat({ min: 0 }).withMessage(VALIDATION.PRICE_FILTER_INVALID)
        .bail()
        .custom((value, { req }) => {
            const min = req.query.minPrice;
            if (min !== undefined && Number(value) < Number(min)) {
                throw new Error(VALIDATION.PRICE_RANGE_INVALID);
            }
            return true;
        }),
    query("sort").optional().isIn(["newest", "price-low", "price-high", "rating"]).withMessage(VALIDATION.SORT_INVALID),
    query("page").optional().isInt({ min: 1 }).withMessage(VALIDATION.PAGE_INVALID),
    query("limit").optional().isInt({ min: 1 }).withMessage(VALIDATION.LIMIT_INVALID)
];