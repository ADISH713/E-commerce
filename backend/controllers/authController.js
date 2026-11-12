import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/userModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken'

const INVALID_CREDENTIALS = "Invalid email or password";
const REFRESH_MAX_AGE = 7*24*60*60*1000;

const cookieOptions = {
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:"lax",
    path:"/api/auth"
};

const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const userPayload = (user) =>({
    id:user._id,
    name:user.name,
    email:user.email,
    role:user.role
});

export const register = async (req,res,next)=>{
    try{
        const {name,email,password} = req.body;

        const existing = await User.findOne({email});
        if(existing) throw new AppError("Email already registered",409);

        const hashed = await bcrypt.hash(password,10);
        const user = await User.create({name,email,password:hashed,role:"user"});

        res.status(201).json({
            success:true,
            message:"Registration succesfull",
            data:userPayload(user)
        });
    }catch(error){
        next(error);
    }
}

const loginWithRole = (requiredRole) => async (req,res,next) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email}).select("+password");

        if(!user || user.role !== requiredRole){
            throw new AppError(INVALID_CREDENTIALS,401);
        }

        const match = await bcrypt.compare(password,user.password);
        if(!match) throw new AppError(INVALID_CREDENTIALS,401);

        if(user.isBlocked) throw new AppError("Your account has been blocked", 403);
        if(!user.isActive) throw new AppError("Your account is deactivated",403);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await User.updateOne(
            {_id:user._id},
            {refreshToken:hashToken(refreshToken)}
        );

        res.cookie("refreshToken",refreshToken,{
            ...cookieOptions,
            maxAge: REFRESH_MAX_AGE
        });

        res.status(200).json({
            success:true,
            message:"Login successful",
            data:{
                accessToken,
                user:userPayload(user)
            }
        });
    }catch(error){
        next(error);
    }
};

export const login = loginWithRole("user");
export const adminLogin = loginWithRole("admin");

export const refresh = async (req,res,next) =>{
    try{
        const token = req.cookies?.refreshToken;
        if(!token) throw new AppError("Not authorized, please login",401)

        let decoded;
        try{
            decoded = jwt.verify(token,process.env.JWT_REFRESH_SECRET);
        }catch{
            res.clearCookie("refreshToken",cookieOptions);
            throw new AppError("Session expired,please login again",401);

        }
        const user = await User.findById(decoded.id).select("+refreshToken");

        if(!user || user.refreshToken !== hashToken(token)){
            res.clearCookie("refreshToken",cookieOptions);
            throw new AppError("Session expired, please login again",401);
        }
        if(user.isBlocked) throw new AppError("Your account has been blocked",403);
        if(!user.isActive) throw new AppError("Your account is deactivated",403);

        res.status(200).json({
            success:true,
            message:"Token refreshed",
            data:{
                accessToken:generateAccessToken(user),
                user:userPayload(user)
            }
        });
    }catch (error){
        next(error)
    }
};

export const logout = async (req,res,next) =>{
    try{
        const token = req.cookies?.refreshToken;

        if(token){
            await User.updateOne(
                {refreshToken:hashToken(token)},
                {$unset: { refreshToken: 1}}
            );
        }
        res.clearCookie("refreshToken",cookieOptions);

        res.status(200).json({
            success:true,
            message:"Logged out successfully",
            data:null
        });

    }catch(error){
        next(error);
    }
};