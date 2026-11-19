import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import MESSAGES from "../constants/messages.js";

export const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            throw new AppError(MESSAGES.AUTH.NOT_AUTHORIZED, 401);
        }

        const token = header.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch {
            throw new AppError(MESSAGES.AUTH.TOKEN_INVALID, 401);
        }

        const user = await User.findById(decoded.id);
        if (!user) throw new AppError(MESSAGES.AUTH.USER_NOT_FOUND, 401);
        if (user.isBlocked) throw new AppError(MESSAGES.AUTH.ACCOUNT_BLOCKED, 403);
        if (!user.isActive) throw new AppError(MESSAGES.AUTH.ACCOUNT_DEACTIVATED, 403);

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return next(new AppError(MESSAGES.AUTH.ADMIN_ONLY, 403));
    }
    next();
};