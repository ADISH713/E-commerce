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
import { useOrderActions } from '../hooks/useOrderActions';

function AdminOrders() {
    const dispatch = useDispatch();

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const { changeOrderStatus } = useOrderActions();

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
            return (
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );
        }

        if (sortOption === 'oldest') {
            return (
                new Date(a.createdAt) -
                new Date(b.createdAt)
            );
        }

        if (sortOption === 'highest') {
            return Number(b.total) - Number(a.total);
        }

        if (sortOption === 'lowest') {
            return Number(a.total) - Number(b.total);
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
            String(order.id) ===
            String(selectedOrder?.id)
    );


   

  
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <p className="text-sm text-gray-500">
                    Loading orders...
                </p>
            </div>
        );
    }

    


    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm text-red-600 break-words">
                    Error: {error}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 text-gray-900">

            {/* HEADER*/}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Orders
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage and track customer orders
                    </p>
                </div>

           

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">

                    {/* Search */}

                    <div className="relative w-full sm:w-64">

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
                                    params.delete(
                                        'search'
                                    );
                                }

                                params.set(
                                    'page',
                                    '1'
                                );

                                setSearchParams(
                                    params
                                );
                            }}
                            className="
                                w-full
                                border border-gray-200
                                rounded-lg
                                px-4 py-2.5
                                text-sm
                                outline-none
                                bg-white
                                transition
                                focus:border-orange-500
                                focus:ring-2
                                focus:ring-orange-100
                            "
                        />

                    </div>

                    {/* Sort */}

                    <select
                        value={sortOption}
                        onChange={(e) => {
                            const params =new URLSearchParams(searchParams);

                            params.set('sort',e.target.value);

                            params.set(
                                'page',
                                '1'
                            );

                            setSearchParams(
                                params
                            );
                        }}
                        className="
                            w-full sm:w-auto
                            border border-gray-200
                            rounded-lg
                            px-4 py-2.5
                            text-sm
                            bg-white
                            outline-none
                            cursor-pointer
                            transition
                            focus:border-orange-500
                            focus:ring-2
                            focus:ring-orange-100
                        "
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

            {/* ORDERS TABLE*/}

            {orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                    <p className="text-sm text-gray-500">
                        No orders found.
                    </p>
                </div>
            ) : (
                <div className="
                    bg-white
                    rounded-xl
                    border border-gray-100
                    shadow-sm
                    overflow-x-auto
                    scrollbar-none
                ">

                    <table className="w-full min-w-[720px]">

                        {/* Table Header */}

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="
                                    text-left
                                    px-4 sm:px-5
                                    py-3.5 sm:py-4
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                ">
                                    Order ID
                                </th>

                                <th className="
                                    text-left
                                    px-4 sm:px-5
                                    py-3.5 sm:py-4
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                ">
                                    User ID
                                </th>

                                <th className="
                                    text-left
                                    px-4 sm:px-5
                                    py-3.5 sm:py-4
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                ">
                                    Items
                                </th>

                                <th className="
                                    text-left
                                    px-4 sm:px-5
                                    py-3.5 sm:py-4
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                ">
                                    Total
                                </th>

                                <th className="
                                    text-left
                                    px-4 sm:px-5
                                    py-3.5 sm:py-4
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                ">
                                    Status
                                </th>

                                <th className="
                                    text-left
                                    px-4 sm:px-5
                                    py-3.5 sm:py-4
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                ">
                                    Date
                                </th>

                            </tr>

                        </thead>

                        {/* Table Body */}

                        <tbody>

                            {paginatedOrders.map(
                                (order) => (
                                    <tr
                                        key={order.id}
                                        onClick={() =>
                                            setSelectedOrder(
                                                order
                                            )
                                        }
                                        className="
                                            border-t
                                            border-gray-100
                                            cursor-pointer
                                            hover:bg-orange-50/40
                                            transition-colors
                                        "
                                    >

                                        {/* Order ID */}

                                        <td className="
                                            px-4 sm:px-5
                                            py-3.5 sm:py-4
                                            text-xs sm:text-sm
                                            break-all
                                            font-medium
                                        ">
                                            {order.id}
                                        </td>

                                        {/* User ID */}

                                        <td className="
                                            px-4 sm:px-5
                                            py-3.5 sm:py-4
                                            text-xs sm:text-sm
                                            text-gray-600
                                        ">
                                            {order.userId}
                                        </td>

                                        {/* Items */}

                                        <td className="
                                            px-4 sm:px-5
                                            py-3.5 sm:py-4
                                            text-xs sm:text-sm
                                            text-gray-600
                                        ">
                                            {order.items?.length ||
                                                0}
                                        </td>

                                        {/* Total */}

                                        <td className="
                                            px-4 sm:px-5
                                            py-3.5 sm:py-4
                                            text-xs sm:text-sm
                                            font-semibold
                                            whitespace-nowrap
                                        ">
                                            ₹
                                            {Number(
                                                order.total
                                            ).toLocaleString(
                                                'en-IN'
                                            )}
                                        </td>

                                        {/* Status */}

                                        <td className="
                                            px-4 sm:px-5
                                            py-3.5 sm:py-4
                                        ">

                                            <select
                                                value={
                                                    order.status
                                                }
                                               onChange={(e) =>
                                                    changeOrderStatus(
                                                        order,
                                                        e.target.value
                                                    )
                                                }
                                                onClick={(
                                                    e
                                                ) =>
                                                    e.stopPropagation()
                                                }
                                                className="
                                                    border
                                                    border-gray-200
                                                    rounded-lg
                                                    px-2.5
                                                    py-1.5
                                                    text-xs sm:text-sm
                                                    bg-white
                                                    outline-none
                                                    cursor-pointer
                                                    transition
                                                    focus:border-orange-500
                                                    focus:ring-2
                                                    focus:ring-orange-100
                                                "
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

                                        {/* Date */}

                                        <td className="
                                            px-4 sm:px-5
                                            py-3.5 sm:py-4
                                            text-xs sm:text-sm
                                            text-gray-600
                                            whitespace-nowrap
                                        ">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString(
                                                'en-IN'
                                            )}
                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>

                </div>
            )}

            {/* PAGINATION*/}

            <div className="mt-5 sm:mt-6 flex justify-center">

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    nextPage={nextPage}
                    previousPage={previousPage}
                />

            </div>

            {/* ORDER DETAILS MODAL */}

            {selectedOrder && (

                <div
                    className="
                        fixed inset-0
                        z-50
                        flex items-center justify-center
                        bg-black/40
                        backdrop-blur-sm
                        p-3 sm:p-4
                    "
                    onClick={() =>
                        setSelectedOrder(null)
                    }
                >

                    <div
                        className="
                            bg-white
                            rounded-2xl
                            w-full
                            max-w-3xl
                            max-h-[90vh]
                            overflow-y-auto
                            scrollbar-none
                            shadow-2xl
                            border border-gray-100
                        "
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER*/}

                        <div className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            px-4 sm:px-6
                            py-4 sm:py-5
                            border-b border-gray-100
                        ">

                            <div className="min-w-0">

                                <h3 className="
                                    text-lg sm:text-xl
                                    font-bold
                                    text-gray-900
                                ">
                                    Order Details
                                </h3>

                                <p className="
                                    text-xs sm:text-sm
                                    text-gray-500
                                    mt-1
                                    break-all
                                ">
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
                                className="
                                    w-9 h-9
                                    flex
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-gray-400
                                    hover:text-red-600
                                    hover:bg-red-50
                                    transition
                                    shrink-0
                                "
                            >
                                ✕
                            </button>

                        </div>

                        {/* MODAL BODY*/}

                        <div className="p-4 sm:p-6">

                            {/* Order Information */}

                            <div>

                                <h4 className="
                                    text-sm
                                    font-semibold
                                    text-gray-900
                                    mb-4
                                ">
                                    Order Information
                                </h4>

                                <div className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-3 sm:gap-4
                                    text-sm
                                ">

                                    <div className="
                                        bg-gray-50
                                        rounded-lg
                                        p-3
                                    ">
                                        <p className="text-xs text-gray-500 mb-1">
                                            User ID
                                        </p>

                                        <p className="font-medium break-all">
                                            {selectedOrder.userId}
                                        </p>
                                    </div>

                                    <div className="
                                        bg-gray-50
                                        rounded-lg
                                        p-3
                                    ">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Customer
                                        </p>

                                        <p className="font-medium break-words">
                                            {
                                                selectedOrder
                                                    .shippingAddress
                                                    ?.fullName
                                            }
                                        </p>
                                    </div>

                                    <div className="
                                        bg-gray-50
                                        rounded-lg
                                        p-3
                                    ">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Email
                                        </p>

                                        <p className="font-medium break-all">
                                            {
                                                selectedOrder
                                                    .shippingAddress
                                                    ?.email
                                            }
                                        </p>
                                    </div>

                                    <div className="
                                        bg-gray-50
                                        rounded-lg
                                        p-3
                                    ">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Payment
                                        </p>

                                        <p className="font-medium">
                                            {
                                                selectedOrder.paymentMethod
                                            }
                                        </p>
                                    </div>

                                    <div className="
                                        bg-gray-50
                                        rounded-lg
                                        p-3
                                    ">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Status
                                        </p>

                                        <p className="
                                            font-medium
                                            text-orange-600
                                        ">
                                            {
                                                selectedOrderDetails?.status
                                            }
                                        </p>
                                    </div>

                                    <div className="
                                        bg-gray-50
                                        rounded-lg
                                        p-3
                                    ">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Date
                                        </p>

                                        <p className="font-medium break-words">
                                            {new Date(
                                                selectedOrder.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/*  PRICE SUMMARY*/}

                            <div className="
                                mt-6
                                border
                                border-gray-100
                                rounded-xl
                                overflow-hidden
                            ">

                                <div className="
                                    bg-gray-50
                                    px-4
                                    py-3
                                    border-b
                                    border-gray-100
                                ">
                                    <h4 className="
                                        font-semibold
                                        text-sm
                                    ">
                                        Price Summary
                                    </h4>
                                </div>

                                <div className="
                                    p-4
                                    space-y-3
                                    text-sm
                                ">

                                    <div className="
                                        flex
                                        justify-between
                                        gap-4
                                    ">
                                        <span className="text-gray-500">
                                            Subtotal
                                        </span>

                                        <span className="font-medium">
                                            ₹
                                            {Number(
                                                selectedOrder.subtotal
                                            ).toLocaleString(
                                                'en-IN'
                                            )}
                                        </span>
                                    </div>

                                    <div className="
                                        flex
                                        justify-between
                                        gap-4
                                    ">
                                        <span className="text-gray-500">
                                            Shipping
                                        </span>

                                        <span className="font-medium">
                                            ₹
                                            {Number(
                                                selectedOrder.shipping
                                            ).toLocaleString(
                                                'en-IN'
                                            )}
                                        </span>
                                    </div>

                                    <div className="
                                        border-t
                                        border-gray-100
                                        pt-3
                                        flex
                                        justify-between
                                        gap-4
                                    ">
                                        <span className="
                                            font-semibold
                                            text-gray-900
                                        ">
                                            Total
                                        </span>

                                        <span className="
                                            font-bold
                                            text-orange-600
                                        ">
                                            ₹
                                            {Number(
                                                selectedOrder.total
                                            ).toLocaleString(
                                                'en-IN'
                                            )}
                                        </span>
                                    </div>

                                </div>

                            </div>

                            {/*ITEMS */}

                            <div className="mt-6">

                                <h4 className="
                                    font-semibold
                                    text-sm
                                    mb-3
                                ">
                                    Items
                                </h4>

                                <div className="space-y-3">

                                    {selectedOrder.items?.map(
                                        (item) => (
                                            <div
                                                key={item.id}
                                                className="
                                                    flex
                                                    flex-col
                                                    sm:flex-row
                                                    sm:justify-between
                                                    sm:items-center
                                                    gap-2
                                                    border
                                                    border-gray-100
                                                    rounded-xl
                                                    p-3.5
                                                    bg-gray-50/50
                                                    hover:bg-orange-50/40
                                                    transition
                                                "
                                            >

                                                <div className="min-w-0">

                                                    <p className="
                                                        font-medium
                                                        text-gray-900
                                                        break-words
                                                    ">
                                                        {item.name}
                                                    </p>

                                                    <p className="
                                                        text-gray-500
                                                        text-xs sm:text-sm
                                                        mt-1
                                                    ">
                                                        Quantity:{' '}
                                                        {
                                                            item.quantity
                                                        }
                                                    </p>

                                                </div>

                                                <p className="
                                                    text-xs sm:text-sm
                                                    font-medium
                                                    whitespace-nowrap
                                                ">
                                                    ₹
                                                    {Number(
                                                        item.price
                                                    ).toLocaleString(
                                                        'en-IN'
                                                    )}{' '}
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

                            {/* SHIPPING ADDRESS*/}

                            <div className="mt-6">

                                <h4 className="
                                    font-semibold
                                    text-sm
                                    mb-3
                                ">
                                    Shipping Address
                                </h4>

                                <div className="
                                    bg-gray-50
                                    border
                                    border-gray-100
                                    rounded-xl
                                    p-4
                                    text-xs sm:text-sm
                                    text-gray-600
                                    space-y-1.5
                                    break-words
                                ">

                                    <p className="
                                        font-medium
                                        text-gray-900
                                    ">
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

                        {/*MODAL FOOTER*/}

                        <div className="
                            flex
                            justify-end
                            p-4 sm:p-5
                            border-t
                            border-gray-100
                        ">

                            <button
                                onClick={() =>
                                    setSelectedOrder(
                                        null
                                    )
                                }
                                className="
                                    w-full
                                    sm:w-auto
                                    px-5
                                    py-2.5
                                    bg-orange-600
                                    text-white
                                    rounded-lg
                                    hover:bg-orange-700
                                    active:bg-orange-800
                                    transition
                                    text-sm sm:text-base
                                    font-medium
                                "
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminOrders;