import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectDB from "../config/db.js"
import User from "../models/userModel.js";

const seedAdmin = async () =>{
    await connectDB();

    const email = (process.env.ADMIN_EMAIL || "admin@rccarstore.com").toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const existing = await User.findOne({ email });

    if(existing){
        console.log(`Admin already exists:${email}`);
    }
    else{
        await User.create({
            name:"Admin",
            email,
            password: await bcrypt.hash(password, 10),
            role:"admin"
        });
        console.log("Admin created: ${email}");

    }
    await mongoose.disconnect();
}
seedAdmin().catch((error)=>{
    console.error(error);
    process.exit(1);
})