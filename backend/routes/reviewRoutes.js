import express from "express";
import {
    getProductReviews,
    getMyReviewStatus,
    createReview,
    updateReview,
    deleteReview
} from "../controllers/reviewController.js";
import {
    reviewListValidator,
    productIdValidator,
    createReviewValidator,
    updateReviewValidator,
    reviewIdValidator
} from "../validators/reviewValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/products/:productId/reviews", reviewListValidator, validateRequest, getProductReviews);
router.get("/products/:productId/reviews/me", protect, productIdValidator, validateRequest, getMyReviewStatus);
router.post("/products/:productId/reviews", protect, createReviewValidator, validateRequest, createReview);

router.patch("/reviews/:id", protect, updateReviewValidator, validateRequest, updateReview);
router.delete("/reviews/:id", protect, reviewIdValidator, validateRequest, deleteReview);

export default router;