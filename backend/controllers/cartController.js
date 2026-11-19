
import Cart from "../models/cartModel.js";
import Products from "../models/productModel.js";
import AppError from "../utils/AppError.js";
import MESSAGES from "../constants/messages.js";

const PRODUCT_FIELDS = "name price images category brand stock isActive";

const buildCartResponse = async (userId) => {
    const cart = await Cart.findOne({ user: userId })
        .populate("items.product", PRODUCT_FIELDS);

    if (!cart) return { items: [], totalItems: 0, totalPrice: 0 };

    const items = cart.items
        .filter((item) => item.product)
        .map((item) => ({
            product: item.product,
            quantity: item.quantity,
            subtotal: item.product.isActive ? item.product.price * item.quantity : 0
        }));

    return {
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + item.subtotal, 0)
    };
};

export const getCart = async (req, res, next) => {
    try {
        const data = await buildCartResponse(req.user._id);

        res.status(200).json({
            success: true,
            message: MESSAGES.CART.FETCHED,
            data
        });
    } catch (error) {
        next(error);
    }
};

export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Products.findOne({ _id: productId, isActive: true });
        if (!product) throw new AppError(MESSAGES.PRODUCT.NOT_AVAILABLE, 404);

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) cart = new Cart({ user: req.user._id, items: [] });

        const existing = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        const data = await buildCartResponse(req.user._id);

        res.status(200).json({
            success: true,
            message: MESSAGES.CART.ITEM_ADDED,
            data
        });
    } catch (error) {
        next(error);
    }
};
export const updateCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        const item = cart?.items.find(
            (cartItem) => cartItem.product.toString() === productId
        );
        if (!item) throw new AppError(MESSAGES.CART.ITEM_NOT_FOUND, 404);

        const product = await Products.findOne({ _id: productId, isActive: true });
        if (!product) throw new AppError(MESSAGES.PRODUCT.NOT_AVAILABLE, 404);

        item.quantity = quantity;
        await cart.save();

        const data = await buildCartResponse(req.user._id);

        res.status(200).json({
            success: true,
            message: MESSAGES.CART.UPDATED,
            data
        });
    } catch (error) {
        next(error);
    }
};

export const removeCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) throw new AppError(MESSAGES.CART.ITEM_NOT_FOUND, 404);

        const before = cart.items.length;
        cart.items = cart.items.filter(
            (cartItem) => cartItem.product.toString() !== productId
        );
        if (cart.items.length === before) {
            throw new AppError(MESSAGES.CART.ITEM_NOT_FOUND, 404);
        }

        await cart.save();

        const data = await buildCartResponse(req.user._id);

        res.status(200).json({
            success: true,
            message: MESSAGES.CART.ITEM_REMOVED,
            data
        });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
 
        res.status(200).json({
            success: true,
            message: MESSAGES.CART.CLEARED,
            data: { items: [], totalItems: 0, totalPrice: 0 }
        });
    } catch (error) {
        next(error);
    }
};