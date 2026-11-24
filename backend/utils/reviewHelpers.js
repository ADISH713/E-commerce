import mongoose from "mongoose";
import Review from "../models/reviewModel.js";
import Order from "../models/orderModel.js";
import Products from "../models/productModel.js";

// aggregate() does not turn strings into ObjectIds the way find() does, so we do it
const toObjectId = (id) => new mongoose.Types.ObjectId(String(id));

// average and count always come from the real reviews, rounded to 1 decimal
export const recalculateProductRating = async (productId) => {
    const [stats] = await Review.aggregate([
        { $match: { product: toObjectId(productId) } },
        { $group: { _id: "$product", average: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    await Products.updateOne(
        { _id: productId },
        {
            rating: stats ? Math.round(stats.average * 10) / 10 : 0,
            reviewsCount: stats ? stats.count : 0
        }
    );
};

// { 5: 3, 4: 1, 3: 0, 2: 0, 1: 0 }, ready for the bars on the product page
export const getRatingBreakdown = async (productId) => {
    const grouped = await Review.aggregate([
        { $match: { product: toObjectId(productId) } },
        { $group: { _id: "$rating", count: { $sum: 1 } } }
    ]);

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    grouped.forEach(({ _id, count }) => {
        breakdown[_id] = count;
    });

    return breakdown;
};

// verified buyer = has at least one delivered order containing this product
export const hasPurchasedProduct = async (userId, productId) => {
    const order = await Order.exists({
        user: userId,
        orderStatus: "delivered",
        "items.product": productId
    });

    return Boolean(order);
};