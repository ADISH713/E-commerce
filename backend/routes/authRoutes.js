import express from "express";
import { register, verifyOtp, resendOtp, login, adminLogin, refresh, logout } from "../controllers/authController.js";
import { registerValidator, loginValidator, verifyOtpValidator, resendOtpValidator } from "../validators/authValidator.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/verify-otp", verifyOtpValidator, validateRequest, verifyOtp);
router.post("/resend-otp", resendOtpValidator, validateRequest, resendOtp);
router.post("/login", loginValidator, validateRequest, login);
router.post("/admin/login", loginValidator, validateRequest, adminLogin);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;