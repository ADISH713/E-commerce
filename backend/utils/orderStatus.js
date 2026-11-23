export const ORDER_TRANSITIONS = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: []
};

// the statuses the admin may actually pick next for this order
export const getAllowedNextStatuses = (order) => {
    const next = ORDER_TRANSITIONS[order.orderStatus] || [];

    // an unpaid online order can only be cancelled
    if (order.paymentMethod !== "cod" && order.paymentStatus !== "paid") {
        return next.filter((status) => status === "cancelled");
    }

    return next;
};

// COD and card orders took stock at creation; UPI only after payment was verified
export const stockWasReduced = (order) =>
    order.paymentMethod !== "upi" || order.paymentStatus === "paid";