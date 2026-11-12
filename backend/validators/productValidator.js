import {body} from "express-validator";

export const createProductValidator = [
    body("name").trim().isLength({min:2}).withMessage("Name must contain at least 2 characters"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("price").isFloat({min:1}).withMessage("Price must beat least 1"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("brand").trim().notEmpty().withMessage("Brand is required"),
    body("images").isArray({min:1}).withMessage("At least one image is required"),
    body("stock").optional().isInt({min:0}).withMessage("Stock must be a non-negative integer"),
    body("specs").isObject().withMessage("specs must be an object"),
    body("grade").trim().notEmpty().withMessage("Grade is required")

];

export const updateProductValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 }),

    body("description")
        .optional()
        .trim()
        .notEmpty(),

    body("price")
        .optional()
        .isFloat({ min: 1 }),

    body("category")
        .optional()
        .trim()
        .notEmpty(),

    body("brand")
        .optional()
        .trim()
        .notEmpty(),

    body("images")
        .optional()
        .isArray({ min: 1 }),

    body("stock")
        .optional()
        .isInt({ min: 0 }),

    body("specs")
        .optional()
        .isObject(),

    body("grade")
        .optional()
        .trim()
        .notEmpty()
];


