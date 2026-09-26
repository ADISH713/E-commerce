import React from 'react';
import { useSelector } from 'react-redux';
import RevenueChart from '../components/RevenueChart';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {

    const navigate = useNavigate();

    const products = useSelector(
        (state) => state.products.items
    );

    const users = useSelector(
        (state) => state.users.items
    );

    const orders = useSelector(
        (state) => state.orders.items
    );

    const activeProducts = products.filter(
        (product) => !product.deleted
    );

    const stats = [
        {
            title: 'Total Products',
            value: products.length,
        },
        {
            title: 'Active Products',
            value: activeProducts.length,
        },
        {
            title: 'Total Users',
            value: users.length,
        },
        {
            title: 'Total Orders',
            value: orders.length,
        },
    ];

    return (
        <div className="w-full min-w-0">

            {/* Page heading */}
            <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Dashboard
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Overview of your TORQUE store
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition duration-200"
                    >
                        <p className="text-xs sm:text-sm text-gray-500">
                            {stat.title}
                        </p>

                        <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                            {stat.value}
                        </p>

                        <div className="w-8 h-1 bg-orange-500 rounded-full mt-3" />
                    </div>
                ))}

            </div>

            {/* Revenue */}
            <RevenueChart orders={orders} />

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-6 sm:mt-8 overflow-hidden">

                {/* Header */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Recent Orders
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Latest orders placed by customers
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate('/admin/orders')
                        }
                        className="self-start sm:self-auto text-sm font-medium text-orange-600 hover:text-orange-700 transition"
                    >
                        View All Orders →
                    </button>

                </div>

                {orders.length === 0 ? (

                    <div className="px-4 sm:px-6 py-10 text-center">
                        <p className="text-sm text-gray-500">
                            No orders found.
                        </p>
                    </div>

                ) : (

                    <div className="overflow-x-auto scrollbar-none">

                        <table className="w-full min-w-[700px] text-xs sm:text-sm">

                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-left">

                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">
                                        Order ID
                                    </th>

                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">
                                        Customer
                                    </th>

                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">
                                        Total
                                    </th>

                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-4 sm:px-6 py-3 font-medium text-gray-500">
                                        Date
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {orders
                                    .slice()
                                    .sort(
                                        (a, b) =>
                                            new Date(b.createdAt) -
                                            new Date(a.createdAt)
                                    )
                                    .slice(0, 5)
                                    .map((order) => (

                                        <tr
                                            key={order.id}
                                            className="border-b border-gray-100 last:border-b-0 hover:bg-orange-50/40 transition"
                                        >

                                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700 break-all">
                                                {order.id}
                                            </td>

                                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700 break-words max-w-[180px]">
                                                {order.shippingAddress?.fullName ||
                                                    'Unknown'}
                                            </td>

                                            <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                                                ₹{Number(order.total).toLocaleString('en-IN')}
                                            </td>

                                            <td className="px-4 sm:px-6 py-3 sm:py-4">

                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                                                        order.status ===
                                                        'placed'
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : order.status ===
                                                              'shipped'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : order.status ===
                                                              'delivered'
                                                            ? 'bg-green-100 text-green-700'
                                                            : order.status ===
                                                              'cancelled'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>

                                            </td>

                                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 whitespace-nowrap">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString(
                                                    'en-IN'
                                                )}
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