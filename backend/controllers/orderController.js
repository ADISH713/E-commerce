import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Products from "../models/productModel.js";
import AppError from "../utils/AppError.js";

export const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        const cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            throw new AppError("Your cart is empty", 400);
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            const product = item.product;

            if (!product || !product.isActive) {
                throw new AppError(
                    `${product?.name || "A product in your cart"} is no longer available. Please remove it and try again`,
                    400
                );
            }

            if (item.quantity > product.stock) {
                throw new AppError(
                    `Only ${product.stock} of ${product.name} available`,
                    400
                );
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
            message: "Order placed successfully",
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
            message: "Orders fetched successfully",
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

        if (!order) throw new AppError("Order not found", 404);

        res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order
        });
    } catch (error) {
        next(error);
    }
};