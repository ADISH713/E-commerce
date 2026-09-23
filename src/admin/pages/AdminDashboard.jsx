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
            <h2 className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6">
                Dashboard
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white rounded-lg shadow p-4 sm:p-5 md:p-6"
                    >
                        <p className="text-xs sm:text-sm text-gray-500">
                            {stat.title}
                        </p>

                        <p className="text-2xl sm:text-3xl font-bold mt-2">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <RevenueChart orders={orders} />

            <div className="bg-white rounded-lg shadow p-4 sm:p-5 md:p-6 mt-5 sm:mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold">
                        Recent Orders
                    </h3>

                    <button
                        onClick={() =>
                            navigate('/admin/orders')
                        }
                        className="text-orange-600 font-medium hover:text-orange-700 transition text-sm sm:text-base self-start sm:self-auto"
                    >
                        View All Orders →
                    </button>
                </div>

                {orders.length === 0 ? (
                    <p className="text-gray-500 text-sm sm:text-base">
                        No orders found.
                    </p>
                ) : (
                    <div className="overflow-x-auto scrollbar-none">
                        <table className="w-full min-w-[700px] text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="py-2.5 sm:py-3">
                                        Order ID
                                    </th>

                                    <th className="py-2.5 sm:py-3">
                                        Customer
                                    </th>

                                    <th className="py-2.5 sm:py-3">
                                        Total
                                    </th>

                                    <th className="py-2.5 sm:py-3">
                                        Status
                                    </th>

                                    <th className="py-2.5 sm:py-3">
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
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="py-2.5 sm:py-3 break-all">
                                                {order.id}
                                            </td>

                                            <td className="py-2.5 sm:py-3 break-words max-w-[180px]">
                                                {order.shippingAddress?.fullName ||
                                                    'Unknown'}
                                            </td>

                                            <td className="py-2.5 sm:py-3 font-medium whitespace-nowrap">
                                                ₹
                                                {Number(
                                                    order.total
                                                ).toLocaleString(
                                                    'en-IN'
                                                )}
                                            </td>

                                            <td className="py-2.5 sm:py-3">
                                                <span
                                                    className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
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
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>

                                            <td className="py-2.5 sm:py-3 whitespace-nowrap">
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
