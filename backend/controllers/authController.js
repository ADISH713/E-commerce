import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/userModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken'
import MESSAGES from '../constants/messages.js';
import sendEmail from '../utils/sendEmail.js';
import { generateOtp, hashOtp, isSameHash } from '../utils/otp.js';

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

const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;

const issueOtp = async (user) => {
    const otp = generateOtp();

    await User.updateOne(
        {_id:user._id},
        {
            otpHash:hashOtp(otp,user._id),
            otpExpires:new Date(Date.now() + OTP_EXPIRY_MINUTES*60*1000),
            otpAttempts:0,
            otpLastSentAt:new Date()
        }
    );

    try{
        await sendEmail({
            to:user.email,
            subject:"Your Torque RC verification code",
            text:`Hi ${user.name}, your verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`
        });
    }catch(error){
        console.error("OTP email failed:",error.message);
        throw new AppError(MESSAGES.AUTH.OTP_SEND_FAILED,502);
    }
};

const secondsUntilResend = (user) => {
    if(!user.otpLastSentAt) return 0;
    const elapsed = (Date.now() - user.otpLastSentAt.getTime()) / 1000;
    return Math.max(0,Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - elapsed));
};

export const register = async (req,res,next)=>{
    try{
        const {name,email,password} = req.body;

        const existing = await User.findOne({email});
        const hashed = await bcrypt.hash(password,10);

        let user;
        if(existing){
            if(existing.isVerified !== false) throw new AppError(MESSAGES.AUTH.EMAIL_EXISTS,409);

            existing.name = name;
            existing.password = hashed;
            await existing.save();
            user = existing;
        }else{
            user = await User.create({name,email,password:hashed,role:"user",isVerified:false});
        }

        await issueOtp(user);

        res.status(201).json({
            success:true,
            message:MESSAGES.AUTH.OTP_SENT,
            data:{email:user.email}
        });
    }catch(error){
        next(error);
    }
}

export const verifyOtp = async (req,res,next)=>{
    try{
        const {email,otp} = req.body;

        const user = await User.findOne({email}).select("+otpHash +otpExpires +otpAttempts");

        if(!user || user.isVerified !== false || !user.otpHash){
            throw new AppError(MESSAGES.AUTH.OTP_NOT_PENDING,400);
        }

        if(!user.otpExpires || user.otpExpires.getTime() < Date.now()){
            throw new AppError(MESSAGES.AUTH.OTP_EXPIRED,400);
        }

        if(user.otpAttempts >= OTP_MAX_ATTEMPTS){
            throw new AppError(MESSAGES.AUTH.OTP_TOO_MANY_ATTEMPTS,429);
        }

        if(!isSameHash(hashOtp(otp,user._id),user.otpHash)){
            await User.updateOne({_id:user._id},{$inc:{otpAttempts:1}});
            throw new AppError(MESSAGES.AUTH.OTP_INVALID,400);
        }

        await User.updateOne(
            {_id:user._id},
            {
                isVerified:true,
                $unset:{otpHash:1,otpExpires:1,otpAttempts:1,otpLastSentAt:1}
            }
        );

        res.status(200).json({
            success:true,
            message:MESSAGES.AUTH.EMAIL_VERIFIED,
            data:null
        });
    }catch(error){
        next(error);
    }
};

export const resendOtp = async (req,res,next)=>{
    try{
        const {email} = req.body;

        const user = await User.findOne({email}).select("+otpLastSentAt");

        if(!user || user.isVerified !== false){
            throw new AppError(MESSAGES.AUTH.OTP_NOT_PENDING,400);
        }

        const wait = secondsUntilResend(user);
        if(wait > 0) throw new AppError(MESSAGES.AUTH.OTP_RESEND_WAIT(wait),429);

        await issueOtp(user);

        res.status(200).json({
            success:true,
            message:MESSAGES.AUTH.OTP_SENT,
            data:{email:user.email}
        });
    }catch(error){
        next(error);
    }
};

const loginWithRole = (requiredRole) => async (req,res,next) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email}).select("+password");

        if (!user || (requiredRole && user.role !== requiredRole)) {
            throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match) throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS,401);

        if(user.isVerified === false) throw new AppError(MESSAGES.AUTH.EMAIL_NOT_VERIFIED,403); 
        if(user.isBlocked) throw new AppError(MESSAGES.AUTH.ACCOUNT_BLOCKED, 403);
        if(!user.isActive) throw new AppError(MESSAGES.AUTH.ACCOUNT_DEACTIVATED,403);

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
            message:MESSAGES.AUTH.LOGIN_SUCCESS,
            data:{
                accessToken,
                user:userPayload(user)
            }
        });
    }catch(error){
        next(error);
    }
};

export const login = loginWithRole(null);
export const adminLogin = loginWithRole("admin");

export const refresh = async (req,res,next) =>{
    try{
        const token = req.cookies?.refreshToken;
        if(!token) throw new AppError(MESSAGES.AUTH.NOT_AUTHORIZED,401)

        let decoded;
        try{
            decoded = jwt.verify(token,process.env.JWT_REFRESH_SECRET);
        }catch{
            res.clearCookie("refreshToken",cookieOptions);
            throw new AppError(MESSAGES.AUTH.SESSION_EXPIRED,401);

        }
        const user = await User.findById(decoded.id).select("+refreshToken");
        
        if(!user || user.refreshToken !== hashToken(token)){
            res.clearCookie("refreshToken",cookieOptions);
            throw new AppError(MESSAGES.AUTH.SESSION_EXPIRED,401);
        }
        if(user.isBlocked) throw new AppError(MESSAGES.AUTH.ACCOUNT_BLOCKED,403);
        if(!user.isActive) throw new AppError(MESSAGES.AUTH.ACCOUNT_DEACTIVATED,403);

        res.status(200).json({
            success:true,
            message:MESSAGES.AUTH.TOKEN_REFRESHED,
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
            message:MESSAGES.AUTH.LOGOUT_SUCCESS,
            data:null
        });

    }catch(error){
        next(error);
    }
};