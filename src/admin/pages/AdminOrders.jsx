import React, { useState } from 'react';
import Pagination from '../components/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { useSelector } from 'react-redux';

function AdminOrders() {
    const [selectedOrder, setSelectedOrder] = useState(null);
      const {items: orders,isLoading,error,} = useSelector((state) => state.orders);
        const {
        currentPage,
        totalPages,
        paginatedItems: paginatedOrders,
        goToPage,
        nextPage,
        previousPage,
    } = usePagination(orders, 5);

    if (isLoading) {
        return <p>Loading orders...</p>;
    }

    if (error) {
        return <p className="text-red-600">Error: {error}</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">
                Orders
            </h2>

            {orders.length === 0 ? (
                <p className="text-gray-500">
                    No orders found.
                </p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4">Order ID</th>
                                <th className="text-left p-4">User ID</th>
                                <th className="text-left p-4">Items</th>
                                <th className="text-left p-4">Total</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="border-t cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="p-4">
                                        {order.id}
                                    </td>

                                    <td className="p-4">
                                        {order.userId}
                                    </td>

                                    <td className="p-4">
                                        {order.items?.length || 0}
                                    </td>

                                    <td className="p-4">
                                        ₹{order.total}
                                    </td>

                                    <td className="p-4">
                                        {order.status}
                                    </td>

                                    <td className="p-4">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
                nextPage={nextPage}
                previousPage={previousPage}
            />

            {selectedOrder && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                    Order Details
                </h3>

                <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-red-600"
                >
                    Close
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                    <strong>Order ID:</strong> {selectedOrder.id}
                </p>

                <p>
                    <strong>User ID:</strong> {selectedOrder.userId}
                </p>
                <p>
                    <strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}
                </p>
                <p>
                    <strong>Email ID:</strong> {selectedOrder.shippingAddress?.email}
                </p>

                <p>
                    <strong>Payment:</strong> {selectedOrder.paymentMethod}
                </p>

                <p>
                    <strong>Status:</strong> {selectedOrder.status}
                </p>

                <p>
                    <strong>Subtotal:</strong> ₹{selectedOrder.subtotal}
                </p>

                <p>
                    <strong>Shipping:</strong> ₹{selectedOrder.shipping}
                </p>

                <p>
                    <strong>Total:</strong> ₹{selectedOrder.total}
                </p>

                <p>
                    <strong>Date:</strong>{' '}
                    {new Date(
                        selectedOrder.createdAt
                    ).toLocaleString()}
                </p>
            </div>

            <div className="mt-6">
                <h4 className="font-semibold mb-3">
                    Items
                </h4>

                <div className="space-y-3">
                    {selectedOrder.items?.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between border-b pb-3"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.name}
                                </p>

                                <p className="text-gray-500 text-sm">
                                    Quantity: {item.quantity}
                                </p>
                            </div>

                            <p>
                                ₹{item.price} × {item.quantity}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <h4 className="font-semibold mb-3">
                    Shipping Address
                </h4>

                <div className="text-sm text-gray-600">
                    <p>{selectedOrder.shippingAddress?.name}</p>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>
                        {selectedOrder.shippingAddress?.city},{' '}
                        {selectedOrder.shippingAddress?.state}
                    </p>
                    <p>
                        {selectedOrder.shippingAddress?.pincode}
                    </p>
                    <p>
                        Phone: {selectedOrder.shippingAddress?.phone}
                    </p>
                </div>
            </div>
        </div>
    )}
        </div>
    );
}

export default AdminOrders;