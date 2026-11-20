import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        refreshToken:{
            type:String,
            select:false,
        },
        isVerified: {
            type: Boolean,
            default: true
        },
        otpHash: {
            type: String,
            select: false
        },
        otpExpires: {
            type: Date,
            select: false
        },
        otpAttempts: {
            type: Number,
            default: 0,
            select: false
        },
        otpLastSentAt: {
            type: Date,
            select: false
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;