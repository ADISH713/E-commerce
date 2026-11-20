import axios from "axios";
import api from "./api";

const API_URL = "http://localhost:3001/orders";

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const mapOrder = (order) => ({
    ...order,
    id: order._id,
    status: capitalize(order.orderStatus),
    subtotal: order.totalAmount,
    shipping: 0,
    total: order.totalAmount,
    items: order.items.map((item) => ({
        ...item,
        id: item.product,
    })),
});

export const createOrder = async ({ shippingAddress, paymentMethod }) => {
    const { data } = await api.post("/orders", { shippingAddress, paymentMethod });
    return mapOrder(data.data);
};

export const createRazorpayOrder = async ({ shippingAddress }) => {
    const { data } = await api.post("/payments/razorpay/order", {
        shippingAddress,
        paymentMethod: "upi",
    });
    return data.data; // { order, razorpay }
};

export const verifyRazorpayPayment = async (payload) => {
    const { data } = await api.post("/payments/razorpay/verify", payload);
    return data.data;
};

export const markPaymentFailed = async (orderId) => {
    const { data } = await api.post("/payments/razorpay/failed", { orderId });
    return data.data;
};

export const getMyOrders = async () => {
    const { data } = await api.get("/orders");
    return data.data.map(mapOrder);
};

export const getAllOrders = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};
export const updateOrderStatus = async (id, status) => {
    const { data } = await axios.patch(
        `${API_URL}/${id}`,
        { status }
    );

    return data;
};