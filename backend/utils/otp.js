import crypto from "crypto";

// 1. Make a random 6-digit code, like "048291"
export const generateOtp = () =>
    String(crypto.randomInt(0, 1000000)).padStart(6, "0");

// 2. Turn the code into a hash we can safely store
export const hashOtp = (otp, userId) =>
    crypto.createHash("sha256").update(`${userId}:${otp}`).digest("hex");

// 3. Compare two hashes
export const isSameHash = (a, b) => {
    const x = Buffer.from(a);
    const y = Buffer.from(b);
    return x.length === y.length && crypto.timingSafeEqual(x, y);
};