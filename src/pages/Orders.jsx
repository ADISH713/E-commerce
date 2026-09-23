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
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm sm:text-base">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

      {/* HEADER */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          My Orders
        </h1>

        <p className="text-gray-500 text-sm sm:text-base mt-1">
          View your previous orders
        </p>
      </div>

      {orders.length === 0 ? (

        /* EMPTY STATE */
        <div className="text-center py-12 sm:py-16 px-4">

          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            No orders yet
          </h2>

          <p className="text-gray-500 text-sm sm:text-base mb-6">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="inline-block bg-orange-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-orange-700 transition text-sm sm:text-base"
          >
            Start Shopping
          </Link>

        </div>

      ) : (

        /* ORDERS */
        <div className="space-y-4 sm:space-y-6">

          {orders.map((order) => (

            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm"
            >

              {/* ORDER HEADER */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5">

                <div className="min-w-0">

                  <h2 className="font-semibold text-sm sm:text-base break-words">
                    Order #{order.id}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                </div>

                <span className="self-start bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm shrink-0">
                  {order.status}
                </span>

              </div>

              {/* ORDER ITEMS */}
              <div className="space-y-3">

                {order.items.map((item) => (

                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 text-sm"
                  >

                    <span className="break-words min-w-0">
                      {item.name} × {item.quantity}
                    </span>

                    <span className="font-medium shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>

                  </div>

                ))}

              </div>

              {/* PAYMENT + TOTAL */}
              <div className="border-t mt-5 pt-4 flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">

                <span className="font-medium break-words">
                  Payment: {order.paymentMethod}
                </span>

                <span className="font-bold">
                  Total: {formatPrice(order.total)}
                </span>

              </div>

              {/* VIEW DETAILS */}
              <div className="mt-5 flex justify-start sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id
                    )
                  }
                  className="text-sm text-orange-600 font-medium hover:text-orange-700"
                >
                  {expandedOrder === order.id
                    ? "Hide Details"
                    : "View Details"}
                </button>

              </div>

              {/* EXPANDED DETAILS */}
              {expandedOrder === order.id && (

                <div className="border-t mt-5 pt-5 space-y-6">

                  {/* PRODUCTS */}
                  <div>

                    <h3 className="font-semibold mb-3">
                      Products
                    </h3>

                    <div className="space-y-4">

                      {order.items.map((item) => (

                        <div
                          key={item.id}
                          className="flex items-start gap-3 sm:gap-4"
                        >

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md border shrink-0"
                          />

                          <div className="flex-1 min-w-0">

                            <p className="font-medium text-sm sm:text-base break-words">
                              {item.name}
                            </p>

                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                              Quantity: {item.quantity}
                            </p>

                          </div>

                          <p className="font-medium text-sm shrink-0">
                            {formatPrice(item.price * item.quantity)}
                          </p>

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* SHIPPING ADDRESS */}
                  <div>

                    <h3 className="font-semibold mb-2">
                      Shipping Address
                    </h3>

                    <div className="space-y-0.5">

                      <p className="text-sm text-gray-600 break-words">
                        {order.shippingAddress.fullName}
                      </p>

                      <p className="text-sm text-gray-600 break-words">
                        {order.shippingAddress.addressLine1}
                      </p>

                      {order.shippingAddress.addressLine2 && (
                        <p className="text-sm text-gray-600 break-words">
                          {order.shippingAddress.addressLine2}
                        </p>
                      )}

                      <p className="text-sm text-gray-600 break-words">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.pincode}
                      </p>

                      <p className="text-sm text-gray-600 break-words">
                        Phone: {order.shippingAddress.phone}
                      </p>

                    </div>

                  </div>

                  {/* ORDER SUMMARY */}
                  <div>

                    <h3 className="font-semibold mb-3">
                      Order Summary
                    </h3>

                    <div className="space-y-2 text-sm">

                      <div className="flex justify-between gap-4">
                        <span>Subtotal</span>
                        <span className="shrink-0">
                          {formatPrice(order.subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span>Shipping</span>

                        <span className="shrink-0">
                          {order.shipping === 0
                            ? "Free"
                            : formatPrice(order.shipping)}
                        </span>

                      </div>

                      <div className="border-t pt-2 flex justify-between gap-4 font-bold">

                        <span>Total</span>

                        <span className="shrink-0">
                          {formatPrice(order.total)}
                        </span>

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
