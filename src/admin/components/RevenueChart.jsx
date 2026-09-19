import React, { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

function RevenueChart({ orders }) {
    
    const [view, setView] = useState('monthly');

    const totalRevenue = orders.reduce(
        (total, order) => total + (Number(order.total) || 0),
        0
    );

    const revenueData = {};

    orders.forEach((order) => {
        const date = new Date(order.createdAt);
        const revenue = Number(order.total) || 0;

        let key;

        if (view === 'monthly') {
            key = date.toLocaleString('en-US', {
                month: 'short',
            });
        } else {
            const weekStart = new Date(date);

            weekStart.setDate(
                date.getDate() - date.getDay()
            );

            key = `Week ${weekStart.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            })}`;
        }

        if (!revenueData[key]) {
            revenueData[key] = 0;
        }

        revenueData[key] += revenue;
    });

    const data = Object.entries(revenueData).map(
        ([period, revenue]) => ({
            period,
            revenue,
        })
    );

    const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    return (
        <div className="bg-white border rounded-lg shadow p-3">
            <p className="font-medium">{label}</p>

            <p className="text-orange-500 mt-1">
                Revenue: ₹{payload[0].value.toLocaleString('en-IN')}
            </p>
        </div>
    );
};

    return (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold">
                        Revenue Overview
                    </h3>

                    <div className="flex items-center gap-3 mt-2">
                        <p className="text-3xl font-bold">
                            ₹{totalRevenue.toLocaleString('en-IN')}
                        </p>

                        <span className="text-sm text-green-600">
                            Total Revenue
                        </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                        Revenue generated from all orders
                    </p>
                </div>

                <select
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>

            <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <CartesianGrid stroke="#f1f5f9" vertical={false} />

                        <XAxis dataKey="period" />

                        <YAxis />

                        <Tooltip content={<CustomTooltip />} />
                        
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#f97316"
                            fill="#f97316"
                            fillOpacity={0.10}
                            strokeWidth={1.7}
                        />    
                    </AreaChart>
                </ResponsiveContainer>
        </div>
        </div>
    );
}

export default RevenueChart;