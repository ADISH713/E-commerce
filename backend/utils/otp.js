import crypto from "crypto";

export const generateOtp = () =>
    String(crypto.randomInt(0, 1000000)).padStart(6, "0");

export const hashOtp = (otp, userId) =>
    crypto.createHash("sha256").update(`${userId}:${otp}`).digest("hex");

export const isSameHash = (a, b) => {
    const x = Buffer.from(a);
    const y = Buffer.from(b);
    return x.length === y.length && crypto.timingSafeEqual(x, y);
};