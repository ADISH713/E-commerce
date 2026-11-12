import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Products from "../models/productModel.js";

const dbPath = process.env.DB_JSON_PATH || path.resolve("..","db.json");

const seeProducts = async ()=>{
    await connectDB();

    const { products } = JSON.parse(fs.readFileSync(dbPath,"utf-8"));

    let saved = 0;
    let skipped = 0;

    for (const p of products){
        const doc = {
            name:p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            brand: p.brand,
            images: p.images,
            stock: p.stock,
            specs: p.specs,
            rating: p.rating,
            reviewsCount: p.reviewsCount,
            grade: p.grade,
            isActive: !p.deleted
        };

        try{
            await Products.findOneAndUpdate(
                {name:doc.name, category:doc.category},
                doc,
                {upsert:true, runValidators:true, setDefaultsOnInsert:true }
            );
            saved++;
        }catch (error){
            skipped++;
            console.log(`Skipped "${p.name}":${error.message}`);
        }
    }

    console.log(`Products saved: ${saved},skipped:${skipped}`);
    await mongoose.disconnect();

};

seeProducts().catch((error)=>{
    console.error(error);
    process.exit(1);
})