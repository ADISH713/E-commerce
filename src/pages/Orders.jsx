import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrdersByUserId } from "../services/orderServices";
import { formatPrice } from "../utils/formatPrice";

function Orders() {
  const user = useSelector((state) => state.auth.user);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const data = await getOrdersByUserId(user.id);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-gray-500 mt-1">
          View your previous orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">
            No orders yet
          </h2>

          <p className="text-gray-500 mb-6">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="font-semibold">
                    Order #{order.id}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {order.status}
                </span>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-5 pt-4 flex justify-between">
                <span className="font-medium">
                  Payment: {order.paymentMethod}
                </span>

                <span className="font-bold">
                  Total: {formatPrice(order.total)}
                </span>
              </div>
              <div className="mt-5 flex justify-end">
                <button
                    onClick={() =>
                    setExpandedOrder(
                        expandedOrder === order.id ? null : order.id
                    )
                    }
                    className="text-sm text-orange-600 font-medium hover:text-orange-700"
                >
                    {expandedOrder === order.id ? "Hide Details" : "View Details"}
                </button>
            </div>
                {expandedOrder === order.id && (
                    <div className="border-t mt-5 pt-5 space-y-6">

                        {/* Products */}
                        <div>
                        <h3 className="font-semibold mb-3">
                            Products
                        </h3>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4"
                            >
                                <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md border"
                                />

                                <div className="flex-1">
                                <p className="font-medium">
                                    {item.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                </p>
                                </div>

                                <p className="font-medium">
                                {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>
                            ))}
                        </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                        <h3 className="font-semibold mb-2">
                            Shipping Address
                        </h3>

                        <p className="text-sm text-gray-600">
                            {order.shippingAddress.fullName}
                        </p>

                        <p className="text-sm text-gray-600">
                            {order.shippingAddress.addressLine1}
                        </p>

                        {order.shippingAddress.addressLine2 && (
                            <p className="text-sm text-gray-600">
                            {order.shippingAddress.addressLine2}
                            </p>
                        )}

                        <p className="text-sm text-gray-600">
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pincode}
                        </p>

                        <p className="text-sm text-gray-600">
                            Phone: {order.shippingAddress.phone}
                        </p>
                        </div>

                        {/* Price Breakdown */}
                        <div>
                        <h3 className="font-semibold mb-3">
                            Order Summary
                        </h3>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.subtotal)}</span>
                            </div>

                            <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>
                                {order.shipping === 0
                                ? "Free"
                                : formatPrice(order.shipping)}
                            </span>
                            </div>

                            <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>
                        </div>

                    </div>
                    )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;