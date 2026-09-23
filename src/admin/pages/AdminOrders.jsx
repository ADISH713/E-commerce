import React, { useState } from 'react';
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

    const {
        items: orders,
        isLoading,
        error,
    } = useSelector((state) => state.orders);

    const filtered = orders.filter((order) => {
        return (
            String(order.id)
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            String(order.userId)
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    });

    const sortedOrdered = [...filtered].sort((a, b) => {
        if (sortOption === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }

        if (sortOption === 'oldest') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }

        if (sortOption === 'highest') {
            return b.total - a.total;
        }

        if (sortOption === 'lowest') {
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

    const selectedOrderDetails = orders.find(
        (order) =>
            String(order.id) === String(selectedOrder?.id)
    );

    const handleStatusChange = async (orderId, status) => {
        try {
            const order = orders.find(
                (order) =>
                    String(order.id) === String(orderId)
            );

            if (!order) {
                throw new Error('Order not found');
            }

            // Restore stock only when changing an active order to Cancelled
            if (
                status === 'Cancelled' &&
                order.status !== 'Cancelled'
            ) {
                await Promise.all(
                    order.items.map(async (item) => {
                        const product = await getProductById(item.id);

                        return updateProduct(product.id, {
                            stock:
                                product.stock +
                                item.quantity,
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
        return (
            <p className="text-red-600 break-words">
                Error: {error}
            </p>
        );
    }

    return (
        <div className="w-full min-w-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">
                    Orders
                </h2>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => {
                            const params =
                                new URLSearchParams(
                                    searchParams
                                );

                            if (e.target.value) {
                                params.set(
                                    'search',
                                    e.target.value
                                );
                            } else {
                                params.delete('search');
                            }

                            params.set('page', '1');
                            setSearchParams(params);
                        }}
                        className="border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base w-full sm:w-64"
                    />

                    <select
                        value={sortOption}
                        onChange={(e) => {
                            const params =
                                new URLSearchParams(
                                    searchParams
                                );

                            params.set(
                                'sort',
                                e.target.value
                            );

                            params.set('page', '1');

                            setSearchParams(params);
                        }}
                        className="border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base w-full sm:w-auto"
                    >
                        <option value="newest">
                            Newest
                        </option>

                        <option value="oldest">
                            Oldest
                        </option>

                        <option value="highest">
                            Highest Amount
                        </option>

                        <option value="lowest">
                            Lowest Amount
                        </option>
                    </select>
                </div>
            </div>

            {/* Orders */}
            {orders.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">
                    No orders found.
                </p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto scrollbar-none">
                    <table className="w-full min-w-[720px]">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm">
                                    Order ID
                                </th>

                                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm">
                                    User ID
                                </th>

                                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm">
                                    Items
                                </th>

                                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm">
                                    Total
                                </th>

                                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm">
                                    Status
                                </th>

                                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() =>
                                        setSelectedOrder(order)
                                    }
                                    className="border-t cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="p-3 sm:p-4 text-xs sm:text-sm break-all">
                                        {order.id}
                                    </td>

                                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                                        {order.userId}
                                    </td>

                                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                                        {order.items?.length || 0}
                                    </td>

                                    <td className="p-3 sm:p-4 text-xs sm:text-sm whitespace-nowrap">
                                        ₹{order.total}
                                    </td>

                                    <td className="p-3 sm:p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                            className="border rounded px-2 py-1 text-xs sm:text-sm"
                                        >
                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Processing">
                                                Processing
                                            </option>

                                            <option value="Shipped">
                                                Shipped
                                            </option>

                                            <option value="Delivered">
                                                Delivered
                                            </option>

                                            <option value="Cancelled">
                                                Cancelled
                                            </option>
                                        </select>
                                    </td>

                                    <td className="p-3 sm:p-4 text-xs sm:text-sm whitespace-nowrap">
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

            {/* Pagination */}
            <div className="mt-4 sm:mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    nextPage={nextPage}
                    previousPage={previousPage}
                />
            </div>

            {selectedOrder && (
                <div className="mt-5 sm:mt-6 bg-white rounded-lg shadow p-4 sm:p-5 md:p-6">
                    <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-semibold">
                            Order Details
                        </h3>

                        <button
                            onClick={() =>
                                setSelectedOrder(null)
                            }
                            className="text-gray-500 hover:text-red-600 text-sm sm:text-base shrink-0"
                        >
                            Close
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <p className="break-words">
                            <strong>Order ID:</strong>{' '}
                            {selectedOrder.id}
                        </p>

                        <p className="break-words">
                            <strong>User ID:</strong>{' '}
                            {selectedOrder.userId}
                        </p>

                        <p className="break-words">
                            <strong>Name:</strong>{' '}
                            {selectedOrder.shippingAddress?.fullName}
                        </p>

                        <p className="break-words">
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
                            <strong>Subtotal:</strong>{' '}
                            ₹{selectedOrder.subtotal}
                        </p>

                        <p>
                            <strong>Shipping:</strong>{' '}
                            ₹{selectedOrder.shipping}
                        </p>

                        <p>
                            <strong>Total:</strong>{' '}
                            ₹{selectedOrder.total}
                        </p>

                        <p className="break-words">
                            <strong>Date:</strong>{' '}
                            {new Date(
                                selectedOrder.createdAt
                            ).toLocaleString()}
                        </p>
                    </div>

                    <div className="mt-5 sm:mt-6">
                        <h4 className="font-semibold mb-3">
                            Items
                        </h4>

                        <div className="space-y-3">
                            {selectedOrder && (
                                <div
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4"
                                    onClick={() =>
                                        setSelectedOrder(null)
                                    }
                                >
                                    <div
                                        className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-none shadow-xl"
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between gap-4 p-4 sm:p-5 border-b">
                                            <div className="min-w-0">
                                                <h3 className="text-lg sm:text-xl font-semibold">
                                                    Order Details
                                                </h3>

                                                <p className="text-xs sm:text-sm text-gray-500 mt-1 break-all">
                                                    Order ID:{' '}
                                                    {selectedOrder.id}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    setSelectedOrder(
                                                        null
                                                    )
                                                }
                                                className="text-gray-500 hover:text-red-600 text-lg shrink-0"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* Body */}
                                        <div className="p-4 sm:p-5">
                                            {/* Order Information */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm">
                                                <p className="break-words">
                                                    <strong>
                                                        User ID:
                                                    </strong>{' '}
                                                    {
                                                        selectedOrder.userId
                                                    }
                                                </p>

                                                <p className="break-words">
                                                    <strong>
                                                        Name:
                                                    </strong>{' '}
                                                    {
                                                        selectedOrder
                                                            .shippingAddress
                                                            ?.fullName
                                                    }
                                                </p>

                                                <p className="break-words">
                                                    <strong>
                                                        Email ID:
                                                    </strong>{' '}
                                                    {
                                                        selectedOrder
                                                            .shippingAddress
                                                            ?.email
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Payment:
                                                    </strong>{' '}
                                                    {
                                                        selectedOrder.paymentMethod
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Status:
                                                    </strong>{' '}
                                                    {
                                                        selectedOrderDetails?.status
                                                    }
                                                </p>

                                                <p className="break-words">
                                                    <strong>
                                                        Date:
                                                    </strong>{' '}
                                                    {new Date(
                                                        selectedOrder.createdAt
                                                    ).toLocaleString()}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Subtotal:
                                                    </strong>{' '}
                                                    ₹
                                                    {
                                                        selectedOrder.subtotal
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Shipping:
                                                    </strong>{' '}
                                                    ₹
                                                    {
                                                        selectedOrder.shipping
                                                    }
                                                </p>

                                                <p className="font-semibold">
                                                    <strong>
                                                        Total:
                                                    </strong>{' '}
                                                    ₹
                                                    {
                                                        selectedOrder.total
                                                    }
                                                </p>
                                            </div>

                                            {/* Items */}
                                            <div className="mt-5 sm:mt-6">
                                                <h4 className="font-semibold mb-3">
                                                    Items
                                                </h4>

                                                <div className="space-y-3">
                                                    {selectedOrder.items?.map(
                                                        (item) => (
                                                            <div
                                                                key={
                                                                    item.id
                                                                }
                                                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border rounded-lg p-3"
                                                            >
                                                                <div className="min-w-0">
                                                                    <p className="font-medium break-words">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </p>

                                                                    <p className="text-gray-500 text-xs sm:text-sm">
                                                                        Quantity:{' '}
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <p className="text-xs sm:text-sm whitespace-nowrap">
                                                                    ₹
                                                                    {
                                                                        item.price
                                                                    }{' '}
                                                                    ×{' '}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Shipping Address */}
                                            <div className="mt-5 sm:mt-6">
                                                <h4 className="font-semibold mb-3">
                                                    Shipping Address
                                                </h4>

                                                <div className="text-xs sm:text-sm text-gray-600 space-y-1 break-words">
                                                    <p>
                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                ?.fullName
                                                        }
                                                    </p>

                                                    <p>
                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                ?.addressLine1
                                                        }
                                                    </p>

                                                    {selectedOrder
                                                        .shippingAddress
                                                        ?.addressLine2 && (
                                                        <p>
                                                            {
                                                                selectedOrder
                                                                    .shippingAddress
                                                                    .addressLine2
                                                            }
                                                        </p>
                                                    )}

                                                    <p>
                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                ?.city
                                                        }
                                                        ,{' '}
                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                ?.state
                                                        }
                                                    </p>

                                                    <p>
                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                ?.pincode
                                                        }
                                                    </p>

                                                    <p>
                                                        Phone:{' '}
                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                ?.phone
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex justify-end p-4 sm:p-5 border-t">
                                            <button
                                                onClick={() =>
                                                    setSelectedOrder(
                                                        null
                                                    )
                                                }
                                                className="w-full sm:w-auto px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm sm:text-base"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6">
                        <h4 className="font-semibold mb-3">
                            Shipping Address
                        </h4>

                        <div className="text-xs sm:text-sm text-gray-600 space-y-1 break-words">
                            <p>
                                {
                                    selectedOrder
                                        .shippingAddress?.name
                                }
                            </p>

                            <p>
                                {
                                    selectedOrder
                                        .shippingAddress?.address
                                }
                            </p>

                            <p>
                                {
                                    selectedOrder
                                        .shippingAddress?.city
                                }
                                ,{' '}
                                {
                                    selectedOrder
                                        .shippingAddress?.state
                                }
                            </p>

                            <p>
                                {
                                    selectedOrder
                                        .shippingAddress?.pincode
                                }
                            </p>

                            <p>
                                Phone:{' '}
                                {
                                    selectedOrder
                                        .shippingAddress?.phone
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;