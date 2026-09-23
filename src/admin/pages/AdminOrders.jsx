import React, { useState} from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
    updateOrderStatus as updateOrderStatusAction,
} from '../../redux/slices/orderSlice';

import {
    updateOrderStatus,
} from '../../services/orderServices';
import {
    getProductById,
    updateProduct,
} from '../../services/productServices';

function AdminOrders() {
    const dispatch = useDispatch();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const sortOption = searchParams.get('sort') || 'newest';
    const {items: orders,isLoading,error,} = useSelector((state) => state.orders);
    const filtered = orders.filter((order)=>{
        return(
         String(order.id).toLowerCase().includes(search.toLowerCase())||
         String(order.userId).toLowerCase().includes(search.toLowerCase())
        );
    });
     const sortedOrdered = [...filtered].sort((a,b)=>{
            if(sortOption === 'newest'){
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            if(sortOption === 'oldest'){
                return new Date(a.createdAt) - new Date(b.createdAt)
            }
            if(sortOption === 'highest'){
                return b.total - a.total;
            }
            if(sortOption === 'lowest'){
                return a.total - b.total;
            }
            return 0;
        });
        
    const {
        currentPage,
        totalPages,
        paginatedItems: paginatedOrders,
        goToPage,
        nextPage,
        previousPage,
    } = usePagination(sortedOrdered, 5);

    const selectedOrderDetails = orders.find((order) => String(order.id) === String(selectedOrder?.id));

    const handleStatusChange = async (orderId, status) => {
    try {
        const order = orders.find(
            (order) => String(order.id) === String(orderId)
        );

        if (!order) {
            throw new Error('Order not found');
        }

        // Restore stock only when changing an active order to Cancelled
        if (status === 'Cancelled' && order.status !== 'Cancelled') {
            await Promise.all(
                order.items.map(async (item) => {
                    const product = await getProductById(item.id);

                    return updateProduct(product.id, {
                        stock: product.stock + item.quantity,
                    });
                })
            );
        }

        const updatedOrder = await updateOrderStatus(
            orderId,
            status
        );

        dispatch(
            updateOrderStatusAction({
                id: updatedOrder.id,
                status: updatedOrder.status,
            })
        );

    } catch (error) {
        console.error(
            'Failed to update order status:',
            error
        );
    }
};
    
    if (isLoading) {
        return <p>Loading orders...</p>;
    }

    if (error) {
        return <p className="text-red-600">Error: {error}</p>;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <h2 className="text-2xl font-semibold">
        Orders
    </h2>

    <div className="flex items-center gap-3">
        <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => {
                const params = new URLSearchParams(searchParams);

                if (e.target.value) {
                    params.set('search', e.target.value);
                } else {
                    params.delete('search');
                }

                params.set('page', '1');
                setSearchParams(params);
            }}
            className="border rounded-lg px-4 py-2 w-64"
        />

        <select
            value={sortOption}
            onChange={(e) => {
                const params = new URLSearchParams(searchParams);

                params.set('sort', e.target.value);
                params.set('page', '1');

                setSearchParams(params);
            }}
            className="border rounded-lg px-4 py-2"
        >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
        </select>
    </div>
</div>
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
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                            className="border rounded px-2 py-1"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
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
                    <strong>Status:</strong> {selectedOrderDetails?.status}
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
                    {selectedOrder && (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={() => setSelectedOrder(null)}
    >
        <div
            className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-none shadow-xl"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
                <div>
                    <h3 className="text-xl font-semibold">
                        Order Details
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Order ID: {selectedOrder.id}
                    </p>
                </div>

                <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-red-600 text-lg"
                >
                    ✕
                </button>
            </div>

            {/* Body */}
            <div className="p-5">

                {/* Order Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p>
                        <strong>User ID:</strong>{' '}
                        {selectedOrder.userId}
                    </p>

                    <p>
                        <strong>Name:</strong>{' '}
                        {selectedOrder.shippingAddress?.fullName}
                    </p>

                    <p>
                        <strong>Email ID:</strong>{' '}
                        {selectedOrder.shippingAddress?.email}
                    </p>

                    <p>
                        <strong>Payment:</strong>{' '}
                        {selectedOrder.paymentMethod}
                    </p>

                    <p>
                        <strong>Status:</strong>{' '}
                        {selectedOrderDetails?.status}
                    </p>

                    <p>
                        <strong>Date:</strong>{' '}
                        {new Date(
                            selectedOrder.createdAt
                        ).toLocaleString()}
                    </p>

                    <p>
                        <strong>Subtotal:</strong>{' '}
                        ₹{selectedOrder.subtotal}
                    </p>

                    <p>
                        <strong>Shipping:</strong>{' '}
                        ₹{selectedOrder.shipping}
                    </p>

                    <p className="font-semibold">
                        <strong>Total:</strong>{' '}
                        ₹{selectedOrder.total}
                    </p>
                </div>

                {/* Items */}
                <div className="mt-6">
                    <h4 className="font-semibold mb-3">
                        Items
                    </h4>

                    <div className="space-y-3">
                        {selectedOrder.items?.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border rounded-lg p-3"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.name}
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        Quantity: {item.quantity}
                                    </p>
                                </div>

                                <p className="text-sm">
                                    ₹{item.price} × {item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="mt-6">
                    <h4 className="font-semibold mb-3">
                        Shipping Address
                    </h4>

                    <div className="text-sm text-gray-600 space-y-1">
                        <p>
                            {selectedOrder.shippingAddress?.fullName}
                        </p>

                        <p>
                            {selectedOrder.shippingAddress?.addressLine1}
                        </p>

                        {selectedOrder.shippingAddress?.addressLine2 && (
                            <p>
                                {selectedOrder.shippingAddress.addressLine2}
                            </p>
                        )}

                        <p>
                            {selectedOrder.shippingAddress?.city},{' '}
                            {selectedOrder.shippingAddress?.state}
                        </p>

                        <p>
                            {selectedOrder.shippingAddress?.pincode}
                        </p>

                        <p>
                            Phone:{' '}
                            {selectedOrder.shippingAddress?.phone}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-5 border-t">
                <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}
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