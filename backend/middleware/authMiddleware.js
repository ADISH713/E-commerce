import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";

export const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            throw new AppError("Not authorized, please login", 401);
        }

        const token = header.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch {
            throw new AppError("Not authorized, invalid or expired token", 401);
        }

        const user = await User.findById(decoded.id);
        if (!user) throw new AppError("Not authorized, user no longer exists", 401);
        if (user.isBlocked) throw new AppError("Your account has been blocked", 403);
        if (!user.isActive) throw new AppError("Your account is deactivated", 403);

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return next(new AppError("Admin access only", 403));
    }
    next();
};