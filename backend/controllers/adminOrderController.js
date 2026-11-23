import Order from "../models/orderModel.js";
import AppError from "../utils/AppError.js";
import MESSAGES from "../constants/messages.js";
import { restoreStock } from "../utils/orderHelpers.js";
import {
    ORDER_TRANSITIONS,
    getAllowedNextStatuses,
    stockWasReduced
} from "../utils/orderStatus.js";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const SORT_OPTIONS = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    highest: { totalAmount: -1 },
    lowest: { totalAmount: 1 }
};

// send the allowed next statuses with every order, so the UI never has to guess
const withNextStatuses = (order) => ({
    ...order.toObject(),
    allowedNextStatuses: getAllowedNextStatuses(order)
});

export const getAdminOrders = async (req, res, next) => {
    try {
        const { status = "all", paymentStatus = "all", search } = req.query;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

        const filter = {};
        if (status !== "all") filter.orderStatus = status;
        if (paymentStatus !== "all") filter.paymentStatus = paymentStatus;

        if (search) {
            const safe = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = { $regex: safe, $options: "i" };

            filter.$or = [
                { "shippingAddress.fullName": regex },
                { "shippingAddress.email": regex },
                { "shippingAddress.phone": regex }
            ];

            if (/^[0-9a-fA-F]{24}$/.test(search)) {
                filter.$or.push({ _id: search });
            }
        }

        const [orders, total, grouped] = await Promise.all([
            Order.find(filter)
                .populate("user", "name email")
                .sort(SORT_OPTIONS[req.query.sort] || SORT_OPTIONS.newest)
                .skip((page - 1) * limit)
                .limit(limit),
            Order.countDocuments(filter),
            Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }])
        ]);

        // { pending: 3, processing: 0, ... } with zeros for statuses that have no orders
        const statusCounts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0]));
        grouped.forEach(({ _id, count }) => {
            statusCounts[_id] = count;
        });

        res.status(200).json({
            success: true,
            message: MESSAGES.ORDER.LIST_FETCHED,
            data: {
                orders: orders.map(withNextStatuses),
                total,
                page,
                pages: Math.ceil(total / limit),
                statusCounts
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);

        res.status(200).json({
            success: true,
            message: MESSAGES.ORDER.FETCHED,
            data: withNextStatuses(order)
        });
    } catch (error) {
        next(error);
    }
};

export const updateAdminOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);

        const allowed = getAllowedNextStatuses(order);

        if (!allowed.includes(status)) {
            const byStatusOnly = ORDER_TRANSITIONS[order.orderStatus] || [];

            throw byStatusOnly.includes(status)
                ? new AppError(MESSAGES.ORDER.PAYMENT_NOT_COMPLETED, 400)
                : new AppError(MESSAGES.ORDER.INVALID_TRANSITION(order.orderStatus, status), 400);
        }

        const update = { orderStatus: status };

        // cash is collected on delivery
        if (status === "delivered" && order.paymentMethod === "cod") {
            update.paymentStatus = "paid";
        }

        // only change the order if it is STILL in the state we just validated
        const updated = await Order.findOneAndUpdate(
            { _id: order._id, orderStatus: order.orderStatus },
            update,
            { new: true }
        ).populate("user", "name email");

        if (!updated) throw new AppError(MESSAGES.ORDER.STATUS_CHANGED, 409);

        if (status === "cancelled" && stockWasReduced(order)) {
            await restoreStock(updated.items);
        }

        res.status(200).json({
            success: true,
            message: MESSAGES.ORDER.STATUS_UPDATED,
            data: withNextStatuses(updated)
        });
    } catch (error) {
        next(error);
    }
};