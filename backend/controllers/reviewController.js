import Review from "../models/reviewModel.js";
import Products from "../models/productModel.js";
import AppError from "../utils/AppError.js";
import MESSAGES from "../constants/messages.js";
import {
    recalculateProductRating,
    getRatingBreakdown,
    hasPurchasedProduct
} from "../utils/reviewHelpers.js";

const getActiveProduct = async (productId, fields = "_id") => {
    const product = await Products.findOne({ _id: productId, isActive: true }).select(fields);
    if (!product) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    return product;
};

export const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 5));

        const product = await getActiveProduct(productId, "rating reviewsCount");

        const [reviews, total, breakdown] = await Promise.all([
            Review.find({ product: productId })
                .populate("user", "name")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Review.countDocuments({ product: productId }),
            getRatingBreakdown(productId)
        ]);

        res.status(200).json({
            success: true,
            message: MESSAGES.REVIEW.LIST_FETCHED,
            data: {
                reviews,
                total,
                page,
                pages: Math.ceil(total / limit),
                summary: { rating: product.rating, count: product.reviewsCount, breakdown }
            }
        });
    } catch (error) {
        next(error);
    }
};

// tells the product page whether to show the form, and the user's own review if any
export const getMyReviewStatus = async (req, res, next) => {
    try {
        const { productId } = req.params;
        await getActiveProduct(productId);

        const [hasPurchased, myReview] = await Promise.all([
            hasPurchasedProduct(req.user._id, productId),
            Review.findOne({ product: productId, user: req.user._id })
        ]);

        res.status(200).json({
            success: true,
            message: MESSAGES.REVIEW.STATUS_FETCHED,
            data: { hasPurchased, canReview: hasPurchased && !myReview, myReview }
        });
    } catch (error) {
        next(error);
    }
};

export const createReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const product = await getActiveProduct(req.params.productId);

        if (!(await hasPurchasedProduct(req.user._id, product._id))) {
            throw new AppError(MESSAGES.REVIEW.NOT_PURCHASED, 403);
        }

        let review;
        try {
            review = await Review.create({
                product: product._id,
                user: req.user._id,
                rating,
                comment
            });
        } catch (error) {
            // the unique index fired: this user already reviewed this product
            if (error.code === 11000) {
                throw new AppError(MESSAGES.REVIEW.ALREADY_REVIEWED, 409);
            }
            throw error;
        }

        await recalculateProductRating(product._id);
        await review.populate("user", "name");

        res.status(201).json({
            success: true,
            message: MESSAGES.REVIEW.CREATED,
            data: review
        });
    } catch (error) {
        next(error);
    }
};

export const updateReview = async (req, res, next) => {
    try {
        const changes = {};
        if (req.body.rating !== undefined) changes.rating = req.body.rating;
        if (req.body.comment !== undefined) changes.comment = req.body.comment;

        // the user filter means you can only edit your own review
        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            changes,
            { new: true, runValidators: true }
        ).populate("user", "name");

        if (!review) throw new AppError(MESSAGES.REVIEW.NOT_FOUND, 404);

        await recalculateProductRating(review.product);

        res.status(200).json({
            success: true,
            message: MESSAGES.REVIEW.UPDATED,
            data: review
        });
    } catch (error) {
        next(error);
    }
};

export const deleteReview = async (req, res, next) => {
    try {
        const filter = { _id: req.params.id };

        // customers can delete only their own review; admins can delete any
        if (req.user.role !== "admin") filter.user = req.user._id;

        const review = await Review.findOneAndDelete(filter);
        if (!review) throw new AppError(MESSAGES.REVIEW.NOT_FOUND, 404);

        await recalculateProductRating(review.product);

        res.status(200).json({
            success: true,
            message: MESSAGES.REVIEW.DELETED,
            data: null
        });
    } catch (error) {
        next(error);
    }
};