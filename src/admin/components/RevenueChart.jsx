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

const VIEWS = [
    { value: 'monthly', label: 'Last 12 months' },
    { value: 'weekly', label: 'Last 8 weeks' },
    { value: 'daily', label: 'Last 30 days' },
];

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="bg-white border rounded-lg shadow p-2 sm:p-3">
            <p className="font-medium text-sm sm:text-base">{label}</p>
            <p className="text-orange-500 mt-1 text-xs sm:text-sm">
                Revenue: ₹{payload[0].value.toLocaleString('en-IN')}
            </p>
        </div>
    );
}

// the server already grouped and totalled everything, this only draws it
function RevenueChart({ series, totalRevenue, paidOrders }) {
    const [view, setView] = useState('monthly');

    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-5 md:p-6 mt-5 sm:mt-6 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6">
                <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold">Revenue Overview</h3>

                    <div className="flex items-center gap-3 mt-2">
                        <p className="text-2xl sm:text-3xl font-bold break-words">
                            ₹{Number(totalRevenue).toLocaleString('en-IN')}
                        </p>
                        <span className="text-xs sm:text-sm text-green-600">Total Revenue</span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
                        From {paidOrders} paid orders. Cancelled orders are not counted.
                    </p>
                </div>

                <select
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto shrink-0"
                >
                    {VIEWS.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="h-64 sm:h-72 md:h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={series[view]}>
                        <CartesianGrid stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#f97316"
                            fill="#f97316"
                            fillOpacity={0.1}
                            strokeWidth={1.7}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default RevenueChart;