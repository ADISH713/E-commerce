import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Order from "../models/orderModel.js";
import AppError from "../utils/AppError.js";
import MESSAGES from "../constants/messages.js";
import { buildOrderFromCart, reduceStock, clearUserCart } from "../utils/orderHelpers.js";

// Step 1: create Razorpay order + our pending order
export const createRazorpayOrder = async (req, res, next) => {
    try {
        const { shippingAddress } = req.body;

        const { orderItems, totalAmount } = await buildOrderFromCart(req.user._id);

        // Razorpay works in paise (1 rupee = 100 paise), must be an integer
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: `rcpt_${Date.now()}`
        });

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod: "upi",
            totalAmount,
            paymentStatus: "pending",
            orderStatus: "pending",
            razorpayOrderId: razorpayOrder.id
        });

        res.status(201).json({
            success: true,
            message: MESSAGES.PAYMENT.ORDER_CREATED,
            data: {
                order,
                razorpay: {
                    keyId: process.env.RAZORPAY_KEY_ID,
                    orderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Step 2: verify signature, then mark paid
export const verifyRazorpayPayment = async (req, res, next) => {
    try {
        const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
            razorpayOrderId: razorpay_order_id
        });

        if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
        if (order.paymentStatus === "paid") throw new AppError(MESSAGES.PAYMENT.ALREADY_PAID, 400);

        const expected = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const received = Buffer.from(razorpay_signature, "utf8");
        const expectedBuf = Buffer.from(expected, "utf8");

        const isValid =
            received.length === expectedBuf.length &&
            crypto.timingSafeEqual(received, expectedBuf);

        if (!isValid) {
            await Order.updateOne(
                { _id: order._id, paymentStatus: "pending" },
                { paymentStatus: "failed" }
            );
            throw new AppError(MESSAGES.PAYMENT.VERIFY_FAILED, 400);
        }

        // Atomic pending -> paid, so a double request can't reduce stock twice
        const paidOrder = await Order.findOneAndUpdate(
            { _id: order._id, paymentStatus: { $ne: "paid" } },
            { paymentStatus: "paid", razorpayPaymentId: razorpay_payment_id },
            { returnDocument: "after" }
        );

        if (!paidOrder) throw new AppError(MESSAGES.PAYMENT.ALREADY_PAID, 400);

        await reduceStock(paidOrder.items);
        await clearUserCart(req.user._id);

        res.status(200).json({
            success: true,
            message: MESSAGES.PAYMENT.VERIFIED,
            data: paidOrder
        });
    } catch (error) {
        next(error);
    }
};

// Called when the user closes the popup or the payment fails
export const markPaymentFailed = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findOneAndUpdate(
            { _id: orderId, user: req.user._id, paymentStatus: "pending" },
            { paymentStatus: "failed" },
            { returnDocument: "after" }
        );

        res.status(200).json({
            success: true,
            message: MESSAGES.PAYMENT.FAILED_RECORDED,
            data: order
        });
    } catch (error) {
        next(error);
    }
};