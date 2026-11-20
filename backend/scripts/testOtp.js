import { generateOtp, hashOtp, isSameHash } from "../utils/otp.js";

const otp = generateOtp();
const stored = hashOtp(otp, "user123");

console.log("Code:", otp);
console.log("Stored hash:", stored);
console.log("Right code:", isSameHash(hashOtp(otp, "user123"), stored));
console.log("Wrong code:", isSameHash(hashOtp("000000", "user123"), stored));