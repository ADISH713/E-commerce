import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        quantity: { type: Number, required: true, min: 1 }
    },
    { _id: false }
);


const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: {
            type: [orderItemSchema],
            required: true
        },
        shippingAddress: {
            fullName: { type: String, required: true },
            email: { type: String },
            phone: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true }
        },
        paymentMethod: {
            type: String,
            enum: ["cod", "upi", "card"],
            required: true
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },
        orderStatus: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending"
        },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;