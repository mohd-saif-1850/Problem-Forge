import { Request, Response } from "express";
import mongoose from "mongoose";
import redis from "../config/redis";
import bcrypt from "bcryptjs";
import axios from "axios";
import apiError from "../utils/apiError";
import { userValidation } from "../validation/user.validation";
import { User } from "../models/user.model";
import sendEmail from "saifstack-email";
import { verifyEmailLayout } from "../emails/verificationEmailLayout";
import { welcomeEmailLayout } from "../emails/welcomeEmailLayout";
import apiResponse from "../utils/apiResponse";

const registerUser = async (req : Request, res : Response) => {
    const {email, username, password} = req.body

    userValidation.email.parse(email);
    userValidation.username.parse(username);
    userValidation.password.parse(password);

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const existedUser = await User.findOne({
        $or:[
            { email},{username}
        ]
    })
    if(existedUser){
        throw new apiError(400,"User already exist with the same email or username")
    }

    //Redis exists
    const [
        otpExists,
        registrationExists,
        usernameExists
    ] = await Promise.all([
        redis.exists(`otp:${email}`),
        redis.exists(`registerationData:${email}`),
        redis.exists(`pendingUsername:${username}`)
    ]);

    if (otpExists) {
        throw new apiError(
            400,
            "An OTP has already been sent to this email. Please verify your account first."
        );
    }

    if (registrationExists) {
        throw new apiError(
            400,
            "A registration request already exists for this email."
        );
    }

    if (usernameExists) {
        throw new apiError(
            400,
            "This username is currently reserved by another pending registration."
        );
    }

    //Main logic/Building logic

    const hashedPassword = await bcrypt.hash(password,10)

    const registerUserInfo = {
        email,
        username,
        password: hashedPassword
    }

    await redis.set(
        `otp:${email}`,otp,'EX', 600
    )

    await redis.set(
        `registerationData:${email}`,JSON.stringify(registerUserInfo),'EX',600
    )
    await redis.set(
        `pendingUsername:${username}`,username,'EX', 600
    )

    await sendEmail({
        api: process.env.MAIL_API_KEY!,
        domainName: (process.env.DOMAIN_NAME)?.toString() || "",
        email,
        subject: "Verify Your Problem Forge Account",
        otp,
        layout: verifyEmailLayout(
            username,
            otp
        ),
    })

    return res.status(200).json(
        new apiResponse(200,"Please verify your email")
    )
}

const verifyEmail = async (req : Request, res: Response) => {
    const {email, otp} = req.body;

    const storedOtp = await redis.get(
        `otp:${email}`
    )

    if(!storedOtp){
        throw new apiError(404,"Otp expired or not found. Please request a new one.")
    }

    if(storedOtp !== otp){
        throw new apiError(404,"Incorrect otp")
    }

    const registeredUserData = await redis.get(
        `registerationData:${email}`
    )

    if (!registeredUserData) {
        throw new apiError(
            400,
            "Registration session expired.Please register again"
        );
    }

    const userData = JSON.parse(registeredUserData)

    const user = await User.create({
        email: userData.email,
        username: userData.username,
        password: userData.password,
        isEmailVerified: true
    })

    if(!user){
        throw new apiError(500,"Server failed to register the user")
    }

    await redis.del(
        `otp:${email}`,
        `registerationData:${email}`,
        `pendingUsername:${user.username}`
    );

    await sendEmail({
        api: process.env.MAIL_API_KEY!,
        domainName: (process.env.DOMAIN_NAME)?.toString() || "",
        email,
        subject: "Verify Your Problem Forge Account",
        layout: welcomeEmailLayout(user.username)
    })

    return res.status(200).json(
        new apiResponse(200,"Welcome! User registered successfully.")
    )
}


export {
    registerUser,
    verifyEmail
}