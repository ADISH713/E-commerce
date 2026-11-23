import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    useQuery,
    useQueryClient,
    keepPreviousData,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

import Pagination from '../components/Pagination';
import { getErrorMessage } from '../../utils/getErrorMessage';

import Swal from 'sweetalert2';
import {
    getAdminOrders,
    getAdminOrderById, 
    updateOrderStatus,
} from '../../services/orderServices';

const PAGE_SIZE = 5;
const STATUS_TABS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const PAYMENT_BADGE = {
    paid: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    failed: 'bg-red-50 text-red-700',
};

function AdminOrders() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedSummary, setSelectedOrder] = useState(null);
    const [busyId, setBusyId] = useState(null);

    const urlSearch = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || 'all';
    const paymentFilter = searchParams.get('payment') || 'all';
    const sortOption = searchParams.get('sort') || 'newest';
    const page = Number(searchParams.get('page')) || 1;

    const [searchInput, setSearchInput] = useState(urlSearch);

    // change several URL params at once; null removes a param
    const updateParams = (changes) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            Object.entries(changes).forEach(([key, value]) => {
                if (value === null || value === '') params.delete(key);
                else params.set(key, String(value));
            });
            return params;
        });
    };

    // wait 400ms after typing, then put the search in the URL
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput.trim() === urlSearch) return;

            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                if (searchInput.trim()) params.set('search', searchInput.trim());
                else params.delete('search');
                params.set('page', '1');
                return params;
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput, urlSearch, setSearchParams]);

    const {
        data,
        isLoading,
        isError,
        error: loadError,
    } = useQuery({
        queryKey: [
            'admin-orders',
            { page, status: statusFilter, payment: paymentFilter, search: urlSearch, sort: sortOption },
        ],
        queryFn: () =>
            getAdminOrders({
                page,
                limit: PAGE_SIZE,
                status: statusFilter === 'all' ? undefined : statusFilter,
                paymentStatus: paymentFilter === 'all' ? undefined : paymentFilter,
                search: urlSearch || undefined,
                sort: sortOption,
            }),
        placeholderData: keepPreviousData,
    });

    const orders = data?.orders ?? [];
    const totalPages = data?.pages ?? 1;
    const statusCounts = data?.statusCounts ?? {};
    const totalCount = Object.values(statusCounts).reduce((sum, n) => sum + n, 0);

    // if the last order on the last page left this filter, step back one page
    useEffect(() => {
        if (data && data.pages > 0 && page > data.pages) {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set('page', String(data.pages));
                return params;
            });
        }
    }, [data, page, setSearchParams]);

    const goToPage = (target) => updateParams({ page: target });
    const nextPage = () => page < totalPages && goToPage(page + 1);
    const previousPage = () => page > 1 && goToPage(page - 1);

    // the modal keeps showing the latest data after a status change
        // fresh copy of the opened order, straight from the server
    const { data: detailedOrder } = useQuery({
        queryKey: ['admin-order', selectedSummary?.id],
        queryFn: () => getAdminOrderById(selectedSummary.id),
        enabled: Boolean(selectedSummary),
    });

    // use the fresh copy when it matches, otherwise the row we clicked
    const selectedOrder =
        detailedOrder && selectedSummary && detailedOrder.id === selectedSummary.id
            ? detailedOrder
            : selectedSummary;

    const selectedOrderDetails = selectedOrder;

        const handleStatusChange = async (order, newStatus) => {
            if (busyId || newStatus === order.status) return;

            if (newStatus === 'Cancelled') {
                const result = await Swal.fire({
                    title: 'Cancel this order?',
                    text: 'This cannot be undone. Stock is returned for items that were already reserved.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Cancel order',
                    cancelButtonText: 'Keep order',
                    confirmButtonColor: '#ef4444',
                    cancelButtonColor: '#6b7280',
                });

                if (!result.isConfirmed) return;
            }

            setBusyId(order.id);

            try {
                await updateOrderStatus(order.id, newStatus);
                toast.success(`Order marked ${newStatus.toLowerCase()}`);
            } catch (error) {
                toast.error(getErrorMessage(error, 'Failed to update order'));
            } finally {
                queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
                queryClient.invalidateQueries({ queryKey: ['admin-order'] }); // the open modal
                queryClient.invalidateQueries({ queryKey: ['admin-products'] });
                queryClient.invalidateQueries({ queryKey: ['products'] });
                setBusyId(null);
            }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <p className="text-sm text-gray-500">Loading orders...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm text-red-600 break-words">
                    Error: {getErrorMessage(loadError)}
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
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search name, email, phone or order ID..."
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
                        onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
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

                        {/* FILTERS */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                <div className="flex flex-wrap gap-2">
                    {STATUS_TABS.map((tab) => {
                        const count = tab === 'all' ? totalCount : statusCounts[tab] ?? 0;
                        const isActive = statusFilter === tab;

                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() =>
                                    updateParams({ status: tab === 'all' ? null : tab, page: 1 })
                                }
                                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium capitalize transition ${
                                    isActive
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-400'
                                }`}
                            >
                                {tab} ({count})
                            </button>
                        );
                    })}
                </div>

                <select
                    value={paymentFilter}
                    onChange={(e) =>
                        updateParams({
                            payment: e.target.value === 'all' ? null : e.target.value,
                            page: 1,
                        })
                    }
                    className="sm:ml-auto border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none cursor-pointer focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                    <option value="all">All payments</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Payment pending</option>
                    <option value="failed">Payment failed</option>
                </select>
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
                                    Customer
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

                                <th className="text-left px-4 sm:px-5 py-3.5 sm:py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Payment
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

                            {orders.map(
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

                                        <td className="px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm text-gray-600">
                                            <p className="font-medium text-gray-900">{order.customerName}</p>
                                            <p className="text-gray-500 break-all">{order.customerEmail}</p>
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
                                            
                                        {/* Payment */}

                                        <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                                            <p className="text-xs sm:text-sm text-gray-600 uppercase">{order.paymentMethod}</p>
                                            <span
                                                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                    PAYMENT_BADGE[order.paymentStatus] || ''
                                                }`}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </td>

                                        {/* Status */}

                                        <td className="
                                            px-4 sm:px-5
                                            py-3.5 sm:py-4
                                        ">

                                            <select
                                                value={order.status}
                                                disabled={busyId === order.id || order.allowedStatuses.length === 0}
                                                onChange={(e) => handleStatusChange(order, e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm bg-white outline-none cursor-pointer transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {STATUS_OPTIONS.map((status) => (
                                                    <option
                                                        key={status}
                                                        value={status}
                                                        disabled={status !== order.status && !order.allowedStatuses.includes(status)}
                                                    >
                                                        {status}
                                                    </option>
                                                ))}
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
                    currentPage={page}
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

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Customer</p>
                                        <p className="font-medium break-words">{selectedOrder.customerName}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Email</p>
                                        <p className="font-medium break-all">{selectedOrder.customerEmail}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Payment method</p>
                                        <p className="font-medium uppercase">{selectedOrder.paymentMethod}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Payment status</p>
                                        <span
                                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                PAYMENT_BADGE[selectedOrder.paymentStatus] || ''
                                            }`}
                                        >
                                            {selectedOrder.paymentStatus}
                                        </span>

                                        {selectedOrder.razorpayPaymentId && (
                                            <p className="text-xs text-gray-500 mt-2 break-all">
                                                Razorpay ID: {selectedOrder.razorpayPaymentId}
                                            </p>
                                        )}

                                        {selectedOrder.status === 'Cancelled' &&
                                            selectedOrder.paymentMethod === 'upi' &&
                                            selectedOrder.paymentStatus === 'paid' && (
                                                <p className="text-xs text-amber-700 bg-amber-50 rounded-md px-2 py-1.5 mt-2">
                                                    Paid online and cancelled. Refund this payment from the Razorpay dashboard.
                                                </p>
                                            )}
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Order status</p>
                                        <select
                                            value={selectedOrder.status}
                                            disabled={busyId === selectedOrder.id || selectedOrder.allowedStatuses.length === 0}
                                            onChange={(e) => handleStatusChange(selectedOrder, e.target.value)}
                                            className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-white outline-none cursor-pointer focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {STATUS_OPTIONS.map((status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                    disabled={
                                                        status !== selectedOrder.status &&
                                                        !selectedOrder.allowedStatuses.includes(status)
                                                    }
                                                >
                                                    {status}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedOrder.allowedStatuses.length === 0 && (
                                            <p className="text-xs text-gray-500 mt-1">This order is final.</p>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Date</p>
                                        <p className="font-medium break-words">
                                            {new Date(selectedOrder.createdAt).toLocaleString()}
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