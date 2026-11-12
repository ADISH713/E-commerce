import express from "express"
import { createProduct, deleteProduct, getCategories, getProductByID, getProducts, updateProduct } from "../controllers/productController.js";
import { createProductValidator, updateProductValidator } from "../validators/productValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductByID);

router.post("/", protect, adminOnly, createProductValidator, validateRequest, createProduct);
router.patch("/:id", protect, adminOnly, updateProductValidator, validateRequest, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;