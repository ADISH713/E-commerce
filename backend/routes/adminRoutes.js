import express from "express";
import {
    getAdminProducts,
    restoreProduct,
    permanentDeleteProduct
} from "../controllers/adminProductController.js";
import { adminProductListValidator, productIdValidator } from "../validators/adminProductValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();


router.use(protect, adminOnly);

router.get("/products", adminProductListValidator, validateRequest, getAdminProducts);
router.patch("/products/:id/restore", productIdValidator, validateRequest, restoreProduct);
router.delete("/products/:id/permanent", productIdValidator, validateRequest, permanentDeleteProduct);

export default router;