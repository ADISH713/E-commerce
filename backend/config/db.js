import mongoose from "mongoose";
import "dotenv/config"

const connectDB = async()=>{
    try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected successfully");
    }
    catch(error){
        console.log("Failed to connect mongoDB:",error.message)
        throw error;
    }
}

export default connectDB;