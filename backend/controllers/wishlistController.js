import Wishlist from "../models/wishlistModel.js";
import Products from "../models/productModel.js";
import AppError from "../utils/AppError.js";

const PRODUCT_FIELDS = "name price images category brand stock rating isActive";

const buildWishlistResponse = async (userId) => {
    const wishlist = await Wishlist.findOne({ user: userId })
        .populate("products", PRODUCT_FIELDS);

    const products = wishlist
        ? wishlist.products.filter((product) => product && product.isActive)
        : [];

    return { products, totalItems: products.length };
};

export const getWishlist = async (req, res, next) => {
    try {
        const data = await buildWishlistResponse(req.user._id);

        res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            data
        });
    } catch (error) {
        next(error);
    }
};

export const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;

        const product = await Products.findOne({ _id: productId, isActive: true });
        if (!product) throw new AppError("Product not found or unavailable", 404);

        await Wishlist.findOneAndUpdate(
            { user: req.user._id },
            { $addToSet: { products: productId } },
            { upsert: true }
        );

        const data = await buildWishlistResponse(req.user._id);

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            data
        });
    } catch (error) {
        next(error);
    }
};

export const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        const inWishlist = wishlist?.products.some(
            (id) => id.toString() === productId
        );
        if (!inWishlist) throw new AppError("Product not found in wishlist", 404);

        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId
        );
        await wishlist.save();

        const data = await buildWishlistResponse(req.user._id);

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            data
        });
    } catch (error) {
        next(error);
    }
};