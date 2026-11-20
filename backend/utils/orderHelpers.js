import Cart from "../models/cartModel.js";
import Products from "../models/productModel.js";
import AppError from "./AppError.js";
import MESSAGES from "../constants/messages.js";

export const buildOrderFromCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new AppError(MESSAGES.ORDER.CART_EMPTY, 400);
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
        const product = item.product;

        if (!product || !product.isActive) {
            throw new AppError(MESSAGES.ORDER.PRODUCT_UNAVAILABLE(product?.name), 400);
        }

        if (item.quantity > product.stock) {
            throw new AppError(MESSAGES.ORDER.INSUFFICIENT_STOCK(product.stock, product.name), 400);
        }

        orderItems.push({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: item.quantity
        });

        totalAmount += product.price * item.quantity;
    }

    return { cart, orderItems, totalAmount };
};

export const reduceStock = async (orderItems) => {
    await Products.bulkWrite(
        orderItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { stock: -item.quantity } }
            }
        }))
    );
};

export const clearUserCart = async (userId) => {
    await Cart.updateOne({ user: userId }, { $set: { items: [] } });
};