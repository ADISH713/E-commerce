import express from "express"
import { createProduct, deleteProduct, getProductByID, getProducts, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/",getProducts);
router.get("/:id",getProductByID)
router.post("/",createProduct);
router.patch("/:id",updateProduct);
router.delete("/:id",deleteProduct);

export default router;