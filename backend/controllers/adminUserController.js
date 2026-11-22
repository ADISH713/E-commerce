import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import MESSAGES from "../constants/messages.js";

// only these fields ever leave the server
const USER_FIELDS = "name email role isBlocked isActive isVerified createdAt";

export const getAdminUsers = async (req, res, next) => {
    try {
        const { search, status = "all", role = "all" } = req.query;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

        const filter = {};

        if (status === "active") filter.isBlocked = false;
        if (status === "blocked") filter.isBlocked = true;
        if (role !== "all") filter.role = role;

        if (search) {
            const safe = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.$or = [
                { name: { $regex: safe, $options: "i" } },
                { email: { $regex: safe, $options: "i" } }
            ];
        }

        const [users, total, blockedCount] = await Promise.all([
            User.find(filter)
                .select(USER_FIELDS)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            User.countDocuments(filter),
            User.countDocuments({ isBlocked: true })
        ]);

        res.status(200).json({
            success: true,
            message: MESSAGES.USERS.LIST_FETCHED,
            data: {
                users,
                total,
                page,
                pages: Math.ceil(total / limit),
                blockedCount
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserBlockStatus = async (req, res, next) => {
    try {
        const { isBlocked } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) throw new AppError(MESSAGES.USERS.NOT_FOUND, 404);

        if (isBlocked) {
            if (user._id.equals(req.user._id)) {
                throw new AppError(MESSAGES.USERS.CANNOT_BLOCK_SELF, 400);
            }
            if (user.role === "admin") {
                throw new AppError(MESSAGES.USERS.CANNOT_BLOCK_ADMIN, 403);
            }
        }

        // blocking also deletes the saved refresh token, ending their session for good
        const update = isBlocked
            ? { isBlocked: true, $unset: { refreshToken: 1 } }
            : { isBlocked: false };

        const updated = await User.findByIdAndUpdate(user._id, update, { new: true })
            .select(USER_FIELDS);

        res.status(200).json({
            success: true,
            message: isBlocked ? MESSAGES.USERS.BLOCKED : MESSAGES.USERS.UNBLOCKED,
            data: updated
        });
    } catch (error) {
        next(error);
    }
};