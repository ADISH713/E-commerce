import React from 'react';
import { useNavigate } from 'react-router-dom';
import RevenueChart from '../components/RevenueChart';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { getErrorMessage } from '../../utils/getErrorMessage';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const STATUS_BADGE = {
    pending: 'bg-orange-100 text-orange-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

function AdminDashboard() {
    const navigate = useNavigate();
    const { data, isLoading, isError, error, refetch } = useDashboardStats();

    if (isLoading) {
        return <p className="text-sm text-gray-500">Loading dashboard...</p>;
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm text-red-600 break-words">
                    Error: {getErrorMessage(error)}
                </p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-3 text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                    Try again
                </button>
            </div>
        );
    }

    const { counts, revenue, series, lowStock, topProducts, recentOrders } = data;

    const cards = [
        {
            title: 'Revenue',
            value: money(revenue.total),
            note: `${revenue.paidOrders} paid orders`,
            extra: revenue.codToCollect > 0 ? `${money(revenue.codToCollect)} COD to collect` : null,
        },
        {
            title: 'Orders',
            value: counts.orders.total,
            note: `${counts.orders.byStatus.pending} pending`,
        },
        {
            title: 'Customers',
            value: counts.users.customers,
            note: `${counts.users.blocked} blocked`,
        },
        {
            title: 'Products',
            value: counts.products.active,
            note: `${counts.products.trash} in trash`,
        },
    ];

    return (
        <div className="w-full min-w-0">
            <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-500 mt-1">Overview of your TORQUE store</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition duration-200"
                    >
                        <p className="text-xs sm:text-sm text-gray-500">{card.title}</p>
                        <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2 break-words">
                            {card.value}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{card.note}</p>
                        {card.extra && <p className="text-xs text-amber-700 mt-1">{card.extra}</p>}
                        <div className="w-8 h-1 bg-orange-500 rounded-full mt-3" />
                    </div>
                ))}
            </div>

            {/* Revenue */}
            <RevenueChart
                series={series}
                totalRevenue={revenue.total}
                paidOrders={revenue.paidOrders}
            />

            {/* Top sellers and low stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Top Sellers</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            By units sold in paid orders
                        </p>
                    </div>

                    {topProducts.length === 0 ? (
                        <p className="px-4 sm:px-6 py-8 text-center text-sm text-gray-500">
                            No sales yet.
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {topProducts.map((product) => (
                                <li key={product._id} className="flex items-center gap-3 px-4 sm:px-6 py-3">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-12 h-12 object-contain rounded bg-gray-50 shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{product.unitsSold} sold</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                        {money(product.revenue)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Low Stock</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {lowStock.count} products with {lowStock.limit} or fewer left
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="text-sm font-medium text-orange-600 hover:text-orange-700 shrink-0"
                        >
                            Manage →
                        </button>
                    </div>

                    {lowStock.items.length === 0 ? (
                        <p className="px-4 sm:px-6 py-8 text-center text-sm text-gray-500">
                            All products are well stocked.
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {lowStock.items.map((product) => (
                                <li key={product._id} className="flex items-center gap-3 px-4 sm:px-6 py-3">
                                    <img
                                        src={product.images?.[0]}
                                        alt={product.name}
                                        className="w-12 h-12 object-contain rounded bg-gray-50 shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{product.category}</p>
                                    </div>
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                            product.stock === 0
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-amber-100 text-amber-700'
                                        }`}
                                    >
                                        {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-6 sm:mt-8 overflow-hidden">
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Orders</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Latest orders placed by customers
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/orders')}
                        className="self-start sm:self-auto text-sm font-medium text-orange-600 hover:text-orange-700 transition"
                    >
                        View All Orders →
                    </button>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="px-4 sm:px-6 py-10 text-center">
                        <p className="text-sm text-gray-500">No orders found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-none">
                        <table className="w-full min-w-[700px] text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Order ID</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Customer</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Total</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Status</th>
                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="border-b border-gray-100 last:border-b-0 hover:bg-orange-50/40 transition"
                                    >
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700 break-all">
                                            {order._id}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700 break-words max-w-[180px]">
                                            {order.user?.name || order.shippingAddress?.fullName || 'Unknown'}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {money(order.totalAmount)}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap capitalize ${
                                                    STATUS_BADGE[order.orderStatus] || 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;