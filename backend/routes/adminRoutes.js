import express from "express";
import {
    getAdminProducts,
    restoreProduct,
    permanentDeleteProduct
} from "../controllers/adminProductController.js";
import { adminProductListValidator, productIdValidator } from "../validators/adminProductValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAdminUsers, updateUserBlockStatus } from "../controllers/adminUserController.js";
import { adminUserListValidator, blockStatusValidator } from "../validators/adminUserValidator.js";
import { getAdminOrders, getAdminOrderById, updateAdminOrderStatus } from "../controllers/adminOrderController.js";
import { adminOrderListValidator, orderIdValidator, orderStatusValidator } from "../validators/adminOrderValidator.js";
import { getDashboardStats } from "../controllers/adminStatsController.js";
const router = express.Router();


router.use(protect, adminOnly);

router.get("/products", adminProductListValidator, validateRequest, getAdminProducts);
router.patch("/products/:id/restore", productIdValidator, validateRequest, restoreProduct);
router.delete("/products/:id/permanent", productIdValidator, validateRequest, permanentDeleteProduct);
router.get("/users", adminUserListValidator, validateRequest, getAdminUsers);
router.patch("/users/:id/status", blockStatusValidator, validateRequest, updateUserBlockStatus);
router.get("/orders", adminOrderListValidator, validateRequest, getAdminOrders);
router.get("/orders/:id", orderIdValidator, validateRequest, getAdminOrderById);
router.patch("/orders/:id/status", orderStatusValidator, validateRequest, updateAdminOrderStatus);
router.get("/stats", getDashboardStats);

export default router;