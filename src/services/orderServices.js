import api from "./api";

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// admin orders have a populated user object, customer orders only have the id
const mapOrder = (order) => {
    const customer = order.user && typeof order.user === "object" ? order.user : null;

    return {
        ...order,
        id: order._id,
        userId: customer ? customer._id : order.user,
        customerName: customer?.name || order.shippingAddress?.fullName || "Unknown",
        customerEmail: customer?.email || order.shippingAddress?.email || "",
        status: capitalize(order.orderStatus),
        allowedStatuses: (order.allowedNextStatuses || []).map(capitalize),
        subtotal: order.totalAmount,
        shipping: 0,
        total: order.totalAmount,
        items: order.items.map((item) => ({
            ...item,
            id: item.product,
        })),
    };
};

export const createOrder = async ({ shippingAddress, paymentMethod }) => {
    const { data } = await api.post("/orders", { shippingAddress, paymentMethod });
    return mapOrder(data.data);
};

export const getMyOrders = async () => {
    const { data } = await api.get("/orders");
    return data.data.map(mapOrder);
};

// params: page, limit, status, paymentStatus, search, sort
export const getAdminOrders = async (params) => {
    const { data } = await api.get("/admin/orders", { params });
    const { orders, ...rest } = data.data;
    return { ...rest, orders: orders.map(mapOrder) };
};

export const updateOrderStatus = async (id, status) => {
    const { data } = await api.patch(`/admin/orders/${id}/status`, {
        status: status.toLowerCase(),
    });
    return mapOrder(data.data);
};

// TEMPORARY: useAdminData still calls this for the dashboard (removed on Day 4)
export const getAllOrders = async () => {
    const { orders } = await getAdminOrders({ limit: 100 });
    return orders;
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

export const getAdminOrderById = async (id) => {
    const { data } = await api.get(`/admin/orders/${id}`);
    return mapOrder(data.data);
};