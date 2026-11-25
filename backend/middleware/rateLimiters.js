import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import MESSAGES from "../constants/messages.js";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const createLimiter = ({ limit, message, ...options }) =>
    rateLimit({
        windowMs: FIFTEEN_MINUTES,
        limit,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        // same response shape as every other error in your API
        handler: (req, res) => {
            res.status(429).json({ success: false, message, data: null });
        },
        ...options
    });

// every /api request
export const apiLimiter = createLimiter({
    limit: 600,
    message: MESSAGES.COMMON.TOO_MANY_REQUESTS
});

// only FAILED logins count, per IP + email, so one shared IP cannot lock everybody out
export const loginLimiter = createLimiter({
    limit: 8,
    skipSuccessfulRequests: true,
    keyGenerator: (req) =>
        `${ipKeyGenerator(req.ip)}|${String(req.body?.email || "").toLowerCase()}`,
    message: MESSAGES.COMMON.TOO_MANY_LOGIN_ATTEMPTS
});

// register, verify-otp and resend-otp: each one sends mail or tests a code
export const otpLimiter = createLimiter({
    limit: 15,
    message: MESSAGES.COMMON.TOO_MANY_REQUESTS
});

export const paymentLimiter = createLimiter({
    limit: 40,
    message: MESSAGES.COMMON.TOO_MANY_REQUESTS
});