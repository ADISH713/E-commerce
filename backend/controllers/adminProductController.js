import Products from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import Wishlist from "../models/wishlistModel.js";
import AppError from "../utils/AppError.js";
import MESSAGES from "../constants/messages.js";

const SORT_OPTIONS = {
    newest: { createdAt: -1 },
    "price-low": { price: 1 },
    "price-high": { price: -1 },
    "stock-low": { stock: 1 },
    name: { name: 1 }
};

export const getAdminProducts = async (req, res, next) => {
    try {
        const { search, category, status = "active", sort = "newest" } = req.query;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

        const filter = {};
        if (status === "active") filter.isActive = true;
        if (status === "trash") filter.isActive = false;

        if (category) filter.category = category;

        if (search) {
            const safe = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.name = { $regex: safe, $options: "i" };
        }

        const [products, total, activeCount, trashCount] = await Promise.all([
            Products.find(filter)
                .sort(SORT_OPTIONS[sort] || SORT_OPTIONS.newest)
                .skip((page - 1) * limit)
                .limit(limit),
            Products.countDocuments(filter),
            Products.countDocuments({ isActive: true }),
            Products.countDocuments({ isActive: false })
        ]);

        res.status(200).json({
            success: true,
            message: MESSAGES.PRODUCT.ADMIN_LIST_FETCHED,
            data: {
                products,
                total,
                page,
                pages: Math.ceil(total / limit),
                counts: { active: activeCount, trash: trashCount }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const restoreProduct = async (req, res, next) => {
    try {
        const product = await Products.findOneAndUpdate(
            { _id: req.params.id, isActive: false },
            { isActive: true },
            { new: true }
        );
        if (!product) throw new AppError(MESSAGES.PRODUCT.TRASH_NOT_FOUND, 404);

        res.status(200).json({
            success: true,
            message: MESSAGES.PRODUCT.RESTORED,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

export const permanentDeleteProduct = async (req, res, next) => {
    try {
        // only products already in the trash can be removed for good
        const product = await Products.findOneAndDelete({
            _id: req.params.id,
            isActive: false
        });
        if (!product) throw new AppError(MESSAGES.PRODUCT.TRASH_NOT_FOUND, 404);

        // remove dangling references; old orders keep their own copy of name/price/image
        await Promise.all([
            Cart.updateMany({}, { $pull: { items: { product: product._id } } }),
            Wishlist.updateMany({}, { $pull: { products: product._id } })
        ]);

        res.status(200).json({
            success: true,
            message: MESSAGES.PRODUCT.PERMANENTLY_DELETED,
            data: null
        });
    } catch (error) {
        next(error);
    }
};