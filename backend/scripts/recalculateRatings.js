import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Products from "../models/productModel.js";
import { recalculateProductRating } from "../utils/reviewHelpers.js";

const run = async () => {
    await connectDB();

    const products = await Products.find().select("_id");
    for (const product of products) {
        await recalculateProductRating(product._id);
    }

    console.log(`Recalculated ratings for ${products.length} products`);
    await mongoose.disconnect();
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});