import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { addToWishlistValidator, removeFromWishlistValidator } from "../validators/wishlistValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);
router.post("/", addToWishlistValidator, validateRequest, addToWishlist);
router.delete("/:productId", removeFromWishlistValidator, validateRequest, removeFromWishlist);

export default router;