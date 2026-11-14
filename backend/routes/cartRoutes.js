import express from "express";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cartController.js";
import { addToCartValidator, updateCartValidator, removeFromCartValidator } from "../validators/cartValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/", addToCartValidator, validateRequest, addToCart);
router.patch("/:productId", updateCartValidator, validateRequest, updateCartItem);
router.delete("/:productId", removeFromCartValidator, validateRequest, removeCartItem);
router.delete("/", clearCart);

export default router;