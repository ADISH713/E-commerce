import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Products from "../models/productModel.js";
import AppError from "../utils/AppError.js";
import MESSAGES from "../constants/messages.js";

export const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        const cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

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

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            totalAmount,
            paymentStatus: "paid",
            orderStatus: "pending"
        });

        await Products.bulkWrite(
            orderItems.map((item) => ({
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { stock: -item.quantity } }
                }
            }))
        );

        cart.items = [];
        await cart.save();

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