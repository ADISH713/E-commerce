import Order from "../models/orderModel.js";
import Products from "../models/productModel.js";
import User from "../models/userModel.js";
import MESSAGES from "../constants/messages.js";
import { ORDER_TRANSITIONS } from "../utils/orderStatus.js";

const TIMEZONE = "Asia/Kolkata";
const IST_OFFSET_MS = 330 * 60 * 1000; // India has no daylight saving
const DAY_MS = 24 * 60 * 60 * 1000;
const LOW_STOCK_LIMIT = 5;

// revenue = money actually received for orders that were not cancelled
const REVENUE_MATCH = { paymentStatus: "paid", orderStatus: { $ne: "cancelled" } };

// today's calendar date in India
const todayInIndia = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const get = (type) => Number(parts.find((p) => p.type === type).value);
    return { year: get("year"), month: get("month"), day: get("day") };
};

const { year, month, day } = todayInIndia();
// calendar dates are stored as UTC midnight milliseconds, which keeps date maths simple
const todayMs = Date.UTC(year, month - 1, day);

const dayKey = (ms) => new Date(ms).toISOString().slice(0, 10);

const shortDate = (ms) =>
    new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

// midnight in India, as a real point in time (what the database compares against)
const toRealInstant = (calendarMs) => new Date(calendarMs - IST_OFFSET_MS);

const revenueBy = (format, fromMs) =>
    Order.aggregate([
        { $match: { ...REVENUE_MATCH, createdAt: { $gte: toRealInstant(fromMs) } } },
        {
            $group: {
                _id: { $dateToString: { format, date: "$createdAt", timezone: TIMEZONE } },
                revenue: { $sum: "$totalAmount" }
            }
        }
    ]);

const toMap = (rows) => new Map(rows.map((row) => [row._id, row.revenue]));

const buildDaily = (map) =>
    Array.from({ length: 30 }, (_, i) => {
        const ms = todayMs - (29 - i) * DAY_MS;
        return { period: shortDate(ms), revenue: map.get(dayKey(ms)) || 0 };
    });

const buildWeekly = (map) => {
    const thisWeekStart = todayMs - new Date(todayMs).getUTCDay() * DAY_MS; // weeks start on Sunday

    return Array.from({ length: 8 }, (_, i) => {
        const start = thisWeekStart - (7 - i) * 7 * DAY_MS;
        let revenue = 0;
        for (let d = 0; d < 7; d++) revenue += map.get(dayKey(start + d * DAY_MS)) || 0;
        return { period: `Week ${shortDate(start)}`, revenue };
    });
};

const buildMonthly = (map) =>
    Array.from({ length: 12 }, (_, i) => {
        const date = new Date(Date.UTC(year, month - 1 - (11 - i), 1));
        const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

        return {
            period: date.toLocaleString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" }),
            revenue: map.get(key) || 0
        };
    });

export const getDashboardStats = async (req, res, next) => {
    try {
        const [
            activeProducts,
            trashedProducts,
            customers,
            blockedUsers,
            statusGroups,
            revenueRows,
            codRows,
            dailyRows,
            monthlyRows,
            lowStockItems,
            lowStockCount,
            topProducts,
            recentOrders
        ] = await Promise.all([
            Products.countDocuments({ isActive: true }),
            Products.countDocuments({ isActive: false }),
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "user", isBlocked: true }),

            Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),

            Order.aggregate([
                { $match: REVENUE_MATCH },
                { $group: { _id: null, total: { $sum: "$totalAmount" }, orders: { $sum: 1 } } }
            ]),
            Order.aggregate([
                { $match: { paymentMethod: "cod", paymentStatus: "pending", orderStatus: { $ne: "cancelled" } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]),

            // last 56 days is enough for both the daily and the weekly charts
            revenueBy("%Y-%m-%d", todayMs - 55 * DAY_MS),
            revenueBy("%Y-%m", Date.UTC(year, month - 1 - 11, 1)),

            Products.find({ isActive: true, stock: { $lte: LOW_STOCK_LIMIT } })
                .sort({ stock: 1 })
                .limit(5)
                .select("name stock category images"),
            Products.countDocuments({ isActive: true, stock: { $lte: LOW_STOCK_LIMIT } }),

            Order.aggregate([
                { $match: REVENUE_MATCH },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.product",
                        name: { $first: "$items.name" },
                        image: { $first: "$items.image" },
                        unitsSold: { $sum: "$items.quantity" },
                        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                    }
                },
                { $sort: { unitsSold: -1 } },
                { $limit: 5 }
            ]),

            Order.find()
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .limit(5)
                .select("user items totalAmount orderStatus paymentMethod paymentStatus createdAt shippingAddress")
        ]);

        const byStatus = Object.fromEntries(Object.keys(ORDER_TRANSITIONS).map((s) => [s, 0]));
        statusGroups.forEach(({ _id, count }) => {
            byStatus[_id] = count;
        });

        const monthly = buildMonthly(toMap(monthlyRows));
        const dailyMap = toMap(dailyRows);

        res.status(200).json({
            success: true,
            message: MESSAGES.STATS.FETCHED,
            data: {
                counts: {
                    products: { active: activeProducts, trash: trashedProducts },
                    users: { customers, blocked: blockedUsers },
                    orders: {
                        total: Object.values(byStatus).reduce((sum, n) => sum + n, 0),
                        byStatus
                    }
                },
                revenue: {
                    total: revenueRows[0]?.total || 0,
                    paidOrders: revenueRows[0]?.orders || 0,
                    thisMonth: monthly[monthly.length - 1].revenue,
                    codToCollect: codRows[0]?.total || 0
                },
                series: {
                    daily: buildDaily(dailyMap),
                    weekly: buildWeekly(dailyMap),
                    monthly
                },
                lowStock: { limit: LOW_STOCK_LIMIT, count: lowStockCount, items: lowStockItems },
                topProducts,
                recentOrders
            }
        });
    } catch (error) {
        next(error);
    }
};