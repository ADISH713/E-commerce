import Order from "../models/orderModel.js";
import AppError from "../utils/AppError.js";
import MESSAGES from "../constants/messages.js";
import { buildOrderFromCart, reduceStock, clearUserCart } from "../utils/orderHelpers.js";

export const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        if (paymentMethod === "upi") {
            throw new AppError(MESSAGES.ORDER.USE_ONLINE_PAYMENT, 400);
        }

        const { orderItems, totalAmount } = await buildOrderFromCart(req.user._id);

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            totalAmount,
            paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
            orderStatus: "pending"
        });

        await reduceStock(orderItems);
        await clearUserCart(req.user._id);

        res.status(201).json({
            success: true,
            message: MESSAGES.ORDER.PLACED,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: MESSAGES.ORDER.LIST_FETCHED,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);

        res.status(200).json({
            success: true,
            message: MESSAGES.ORDER.FETCHED,
            data: order
        });
    } catch (error) {
        next(error);
    }
};