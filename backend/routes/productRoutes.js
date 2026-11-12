import express from "express"
import { createProduct, deleteProduct, getProductByID, getProducts, updateProduct } from "../controllers/productController.js";
import { createProductValidator, updateProductValidator } from "../validators/productValidator.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/",getProducts);
router.get("/:id",getProductByID)
router.post("/",createProductValidator,validateRequest,createProduct);
router.patch("/:id",updateProductValidator,validateRequest,updateProduct);
router.delete("/:id",deleteProduct);

export default router;