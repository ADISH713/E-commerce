import Products from "../models/productModel.js";
import AppError from "../utils/AppError.js";
import MESSAGES from "../constants/messages.js";

const PRODUCT_FIELDS = [
    "name", "description", "price", "category",
    "brand", "images", "stock", "specs", "grade"
];

// only these fields can be written by the admin; everything else is ignored
const pickProductFields = (body) =>
    Object.fromEntries(
        PRODUCT_FIELDS
            .filter((field) => body[field] !== undefined)
            .map((field) => [field, body[field]])
    );

const SORT_OPTIONS = {
    newest: { createdAt: -1 },
    "price-low": { price: 1 },
    "price-high": { price: -1 },
    rating: { rating: -1, reviewsCount: -1 }
};

export const getProducts = async (req, res, next) => {
    try {
        const { search, category, grade, minPrice, maxPrice, sort } = req.query;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 12));

        const filter = { isActive: true };

        if (category) filter.category = category;
        if (grade) filter.grade = grade;

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            const safe = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.name = { $regex: safe, $options: "i" };
        }

        const [products, total] = await Promise.all([
            Products.find(filter)
                .sort(SORT_OPTIONS[sort] || SORT_OPTIONS.newest)
                .skip((page - 1) * limit)
                .limit(limit),
            Products.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            message: MESSAGES.PRODUCT.LIST_FETCHED,
            data: {
                products,
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getProductByID = async (req, res, next) => {
    try {
        const product = await Products.findOne({
            _id: req.params.id,
            isActive: true
        });
        if (!product) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);

        res.status(200).json({
            success: true,
            message: MESSAGES.PRODUCT.FETCHED,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        // const product = await Products.create(req.body);
        const product = await Products.create(pickProductFields(req.body));


        res.status(201).json({
            success: true,
            message: MESSAGES.PRODUCT.CREATED,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const product = await Products.findOneAndUpdate(
            { _id: req.params.id, isActive: true },
            pickProductFields(req.body),
            { new: true, runValidators: true }
        );
        
        if (!product) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);

        res.status(200).json({
            success: true,
            message: MESSAGES.PRODUCT.UPDATED,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Products.findOneAndUpdate(
            { _id: req.params.id, isActive: true },
            { isActive: false },
            { new: true }
        );
        if (!product) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);

        res.status(200).json({
            success: true,
            message: MESSAGES.PRODUCT.DELETED,
            data: null
        });
    } catch (error) {
        next(error);
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Products.distinct("category", { isActive: true });

        res.status(200).json({
            success: true,
            message: MESSAGES.PRODUCT.CATEGORIES_FETCHED,
            data: categories.sort()
        });
    } catch (error) {
        next(error);
    }
};