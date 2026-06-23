import { Request, Response } from "express";
import redis from "../config/redis";
import bcrypt from "bcryptjs";
import apiError from "../utils/apiError";
import { userValidation } from "../validation/user.validation";
import { User } from "../models/user.model";
import { verifyEmailLayout } from "../emails/verificationEmailLayout";
import { welcomeEmailLayout } from "../emails/welcomeEmailLayout";
import apiResponse from "../utils/apiResponse";
import generateAccessAndRefreshTokens from "../utils/jwt";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { handleDeviceLogin } from "../utils/deviceLogin";
import { sendTwoStepVerification } from "../utils/twoStepVerification";
import { sendMail } from "../utils/sendMail";
import crypto from "crypto"
import { toggleTwoStepVerificationLayout } from "../emails/toggleTwoStepVerificationLayout";
import uploadProfilePicture from "../services/uploadProfilePicture";
import { forgotPasswordLayout } from "../emails/forgotPasswordEmailLayout";

const registerUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body

    userValidation.email.parse(email);
    userValidation.username.parse(username);
    userValidation.password.parse(password);

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const existedUser = await User.findOne({
        $or: [
            { email }, { username }
        ]
    })
    if (existedUser) {
        throw new apiError(400, "User already exist with the same email or username")
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

    const hashedPassword = await bcrypt.hash(password, 10)

    const registerUserInfo = {
        email,
        username,
        password: hashedPassword
    }

    await redis.set(
        `otp:${email}`, otp, 'EX', 600
    )

    await redis.set(
        `registerationData:${email}`, JSON.stringify(registerUserInfo), 'EX', 600
    )
    await redis.set(
        `pendingUsername:${username}`, username, 'EX', 600
    )

    await sendMail({
        email,
        subject: "Verify Your Problem Forge Account",
        layout: verifyEmailLayout(
            username,
            otp
        )
    }
    )

    return res.status(200).json(
        new apiResponse(200, "Please verify your email", email)
    )
}

const verifyEmail = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
        throw new apiError(
            400,
            "Otp expired or not found. Please request a new one."
        );
    }

    if (storedOtp !== otp) {
        throw new apiError(400, "Incorrect otp");
    }

    const registeredUserData = await redis.get(
        `registerationData:${email}`
    );

    if (!registeredUserData) {
        throw new apiError(
            400,
            "Registration session expired. Please register again."
        );
    }

    const userData = JSON.parse(registeredUserData);

    const user = await User.create({
        email: userData.email,
        username: userData.username,
        password: userData.password,
        isEmailVerified: true,
        authProvider: "email"
    });

    await redis.del(
        `otp:${email}`,
        `registerationData:${email}`,
        `pendingUsername:${userData.username}`
    );

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
    };

    try {
        await sendMail({
            email,
            subject: "Welcome to Problem Forge",
            layout: welcomeEmailLayout(user.username)
        })
    } catch (error) {
        console.error("Failed to send welcome email:", error);
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        .json(
            new apiResponse(
                200,
                "Welcome! User registered successfully.",
                {
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                    },
                }
            )
        );
};

const login = async (req: Request, res: Response) => {
    const { email, password, username } = req.body

    if (!email && !username) {
        throw new apiError(404, "Please provide email or username")
    }

    if (!password) {
        throw new apiError(404, "Please provide password")
    }

    const user = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (!user) {
        throw new apiError(400, "User doesn't exist")
    }

    if (!user.password) {
        throw new apiError(400, "Password didn't exist")
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    )

    if (!isPasswordCorrect) {
        throw new apiError(401, "Incorrect password")
    }

    if (user.isBanned) {
        throw new apiError(
            403,
            "Your account has been banned"
        )
    }

    if (user.twoStepVerification) {
        await sendTwoStepVerification(user)

        return res.status(200).json(
            new apiResponse(
                200,
                "Please confirm your account",
                email
            )
        )
    }

    await handleDeviceLogin(
        req,
        user
    )

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(
            user._id
        )

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        .json(
            new apiResponse(
                200,
                "User logged in successfully",
                {
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                    },
                }
            )
        )
}

const verifyTwoStepVerification = async (
    req: Request,
    res: Response
) => {
    const { email, code } = req.body

    if (!email) {
        throw new apiError(
            400,
            "Please provide email"
        )
    }

    if (!code) {
        throw new apiError(
            400,
            "Please provide verification code"
        )
    }

    const storedCode = await redis.get(
        `twoStepVerification:code:${email}`
    )

    if (!storedCode) {
        throw new apiError(
            400,
            "Verification code expired"
        )
    }

    if (storedCode !== code) {
        throw new apiError(
            401,
            "Invalid verification code"
        )
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new apiError(
            404,
            "User doesn't exist"
        )
    }

    if (user.isBanned) {
        throw new apiError(
            403,
            "Your account has been banned"
        )
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(
            user._id
        )

    await handleDeviceLogin(
        req,
        user
    )

    await redis.del(
        `twoStepVerification:code:${email}`
    )

    user.lastLogin = new Date()
    await user.save()

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        .json(
            new apiResponse(
                200,
                "User logged in successfully",
                {
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                    }
                }
            )
        )
}

const getCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response
) => {

    const user = await User.findById(
        req.user._id
    ).select(
        "-password -refreshToken"
    )

    if (!user) {
        throw new apiError(
            404,
            "User not found"
        )
    }

    if (user.lastSolvedDate) {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastSubmission = new Date(user.lastSolvedDate);
        lastSubmission.setHours(0, 0, 0, 0);

        const diffDays =
            (today.getTime() - lastSubmission.getTime()) /
            (1000 * 60 * 60 * 24);

        if (diffDays > 1 && user.streaks !== 0) {
            user.streaks = 0;
            await user.save();
        }
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "User fetched successfully",
            user
        )
    )
}

const logoutUser = async (req: AuthenticatedRequest, res: Response) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        }
    );

    await redis.del(
        `session:user:${req.user._id}`
    );

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new apiResponse(
                200,
                "User logged out successfully"
            )
        );
};

const toggleTwoStepVerification = async (
    req: AuthenticatedRequest,
    res: Response
) => {

    const user = req.user

    if (!user.email) {
        throw new apiError(
            400,
            "Email address not found"
        )
    }

    if (user.twoStepVerificationChangedAt) {

        const twentyFourHours =
            24 * 60 * 60 * 1000

        const lastChanged =
            new Date(
                user.twoStepVerificationChangedAt
            ).getTime()

        const remainingTime =
            twentyFourHours -
            (
                Date.now() -
                lastChanged
            )

        if (remainingTime > 0) {
            const remainingHours = Math.floor(
                remainingTime / (60 * 60 * 1000)
            )

            const remainingMinutes = Math.ceil(
                (
                    remainingTime %
                    (60 * 60 * 1000)
                ) /
                (60 * 1000)
            )

            throw new apiError(
                400,
                `You can change two-step verification again in ${remainingHours} hour(s) and ${remainingMinutes} minute(s)`
            )
        }
    }

    const ttl = await redis.ttl(
        `twoStepVerification:toggle:${user._id}`
    )

    if (ttl > 0) {

        const minutes = Math.ceil(
            ttl / 60
        )

        throw new apiError(
            400,
            `A verification code has already been sent to your email. Please wait ${minutes} minute(s) before requesting another code.`
        )
    }

    const code = crypto
        .randomBytes(2)
        .toString("hex")
        .toUpperCase()

    await redis.set(
        `twoStepVerification:toggle:${user._id}`,
        code,
        "EX",
        300
    )

    await sendMail({
        email: user.email,
        subject: user.twoStepVerification
            ? "Disable Two-Step Verification"
            : "Enable Two-Step Verification",
        layout: toggleTwoStepVerificationLayout(
            user.username,
            code,
            user.twoStepVerification
                ? "Disable"
                : "Enable"
        )
    }
    )

    return res.status(200).json(
        new apiResponse(
            200,
            user.twoStepVerification
                ? "Verification code sent to disable two-step verification"
                : "Verification code sent to enable two-step verification",
            { email: user.email }
        )
    )
}

const verifyTwoStepVerificationToggle = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const { code } = req.body

    if (!code) {
        throw new apiError(
            400,
            "Please provide verification code"
        )
    }

    const storedCode = await redis.get(
        `twoStepVerification:toggle:${req.user._id}`
    )

    if (!storedCode) {
        throw new apiError(
            400,
            "Verification code expired"
        )
    }

    if (storedCode !== code) {
        throw new apiError(
            401,
            "Invalid verification code"
        )
    }

    const user = await User.findById(
        req.user._id
    )

    if (!user) {
        throw new apiError(
            404,
            "User not found"
        )
    }

    user.twoStepVerification = !user.twoStepVerification
    user.twoStepVerificationChangedAt = new Date()

    await user.save()

    await redis.del(
        `twoStepVerification:toggle:${req.user._id}`
    )

    return res.status(200).json(
        new apiResponse(
            200,
            user.twoStepVerification
                ? "Two-step verification enabled successfully"
                : "Two-step verification disabled successfully"
        )
    )
}

const changeProfilePicture = async (
    req: AuthenticatedRequest,
    res: Response
) => {

    const profilePicturePath =
        req.file?.path

    if (!profilePicturePath) {
        throw new apiError(
            400,
            "Please upload an image"
        )
    }

    try {
        const changes = Number(
            await redis.get(
                `profilePicture:changes:${req.user._id}`
            ) || 0
        )

        if (changes >= 5) {

            const ttl = await redis.ttl(
                `profilePicture:changes:${req.user._id}`
            )

            const hours = Math.floor(
                ttl / 3600
            )

            const minutes = Math.ceil(
                (
                    ttl % 3600
                ) / 60
            )

            throw new apiError(
                400,
                `You have reached the profile picture change limit. Please wait ${hours} hour(s) and ${minutes} minute(s).`
            )
        }

        const uploadedImage =
            await uploadProfilePicture(
                profilePicturePath
            )

        const user =
            await User.findByIdAndUpdate(
                req.user._id,
                {
                    profilePicture:
                        uploadedImage.secure_url
                },
                {
                    new: true
                }
            )

        if (!user) {
            throw new apiError(
                404,
                "User not found"
            )
        }

        await redis.set(
            `profilePicture:changes:${req.user._id}`,
            changes + 1,
            "EX",
            24 * 60 * 60
        )

        return res.status(200).json(
            new apiResponse(
                200,
                "Profile picture updated successfully",
                {
                    profilePicture:
                        user.profilePicture
                }
            )
        )
    } catch (error) {
        console.log("Cloudinary error : ", error)
        throw new apiError(
            500,
            "Failed to upload profile picture"
        )
    }
}

const changeUsername = async (
    req: AuthenticatedRequest,
    res: Response
) => {

    const { username } = req.body

    userValidation.username.parse(username)

    const existingUser = await User.findOne({
        username
    })

    if (
        existingUser &&
        existingUser._id.toString() !== req.user._id.toString()
    ) {
        throw new apiError(
            409,
            "Username already exists"
        )
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            username
        },
        {
            new: true
        }
    )

    if (!user) {
        throw new apiError(
            404,
            "User not found"
        )
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Username updated successfully",
            {
                username: user.username
            }
        )
    )
}

const changeName = async (
    req: AuthenticatedRequest,
    res: Response
) => {

    const { name } = req.body

    userValidation.name.parse(name)

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            name
        },
        {
            new: true
        }
    )

    if (!user) {
        throw new apiError(
            404,
            "User not found"
        )
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Name updated successfully",
            {
                name: user.name
            }
        )
    )
}

const changeBio = async (
    req: AuthenticatedRequest,
    res: Response
) => {

    const { bio } = req.body

    userValidation.bio.parse(bio)

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            bio
        },
        {
            new: true
        }
    )

    if (!user) {
        throw new apiError(
            404,
            "User not found"
        )
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Bio updated successfully",
            {
                bio: user.bio
            }
        )
    )
}

const forgotPassword = async (req: Request, res: Response) => {
    const { email, username } = req.body

    if (!email && !username) {
        throw new apiError(404, "Please provide either email or username")
    }

    const existedUser = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (!existedUser) {
        throw new apiError(400, "User not found")
    }

    if (existedUser.githubId && !existedUser.email) {
        throw new apiError(403, `This account was created using GitHub and doesn't have an email address linked.
                                Please sign in with GitHub and add an email address in your account settings before resetting your password.`)
    }

    const requested = await redis.ttl(
        `password:forgot:${existedUser.email}`
    )

    if (requested > 0) {
        const ttl = requested;

        const minutes = Math.floor(
            ttl / 60
        )

        const seconds = ttl % 60

        throw new apiError(
            400,
            `You already requested a password reset email. Please wait ${minutes} minute(s) and ${seconds} second(s).`
        )
    }

    const token = crypto.randomBytes(32).toString("hex")
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    try {
        await sendMail({
            email: existedUser.email || "",
            subject: "Password reset link",
            layout: forgotPasswordLayout(existedUser.username, resetLink)
        })
        await redis.set(
            `password:reset:${token}`,
            existedUser.email || "",
            "EX",
            10 * 60
        )
        await redis.set(
            `password:forgot:${existedUser.email}`, "Yes", 'EX', 600
        )
    } catch (error) {
        throw new apiError(500, "Server failed to send the reset link")
    }


    return res.status(200).json(
        new apiResponse(200, "Password reset link sent to tour email")
    )
}

const resetPassword = async (
    req: Request,
    res: Response
) => {

    const { token } = req.params
    const { password } = req.body

    userValidation.password.parse(password)

    const email = await redis.get(
        `password:reset:${token}`
    )

    if (!email) {
        throw new apiError(
            400,
            "Invalid or expired reset link. Please request a new one"
        )
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new apiError(
            404,
            "User not found"
        )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user.password = hashedPassword

    await user.save()

    await redis.del(
        `password:reset:${token}`
    )

    await redis.del(
        `password:forgot:${email}`
    )

    await redis.del(
        `session:user:${user._id}`
    )

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
    }

    return res
        .status(200)
        .clearCookie(
            "accessToken",
            cookieOptions
        )
        .clearCookie(
            "refreshToken",
            cookieOptions
        )
        .json(
            new apiResponse(
                200,
                "Password reset successfully"
            )
        )
}

const toggleTimer = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(404, "User not found");
    }

    user.enableProblemTimer = !user.enableProblemTimer;
    await user.save();

    return res.status(200).json(
        new apiResponse(200, "Timer chages successfully")
    )
}

const preferredLanguage = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const { language } = req.body

    if (!language) {
        return res.status(200).json(
            new apiResponse(200, "No language provided-Nothing changed")
        )
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(404, "User not found")
    }

    user.preferredLanguage = language;
    await user.save()

    return res.status(200).json(
        new apiResponse(200, `Preferred language changed to ${language}`)
    )
}

const addEmail = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id
    const { email, password } = req.body

    if (!email) {
        throw new apiError(400, "Email is required.")
    }
    if (!password) {
        throw new apiError(400, "You can't add the email without the password.")
    }

    userValidation.email.parse(email)
    userValidation.password.parse(password)

    const existedUser = await User.findOne({
        email
    })

    if (existedUser) {
        throw new apiError(400, "User already with this email. Please use a different email.")
    }

    const alreadyLinked = await User.findById(userId)

    if (!alreadyLinked) {
        throw new apiError(404, "User not found.")
    }

    if (alreadyLinked?.email) {
        throw new apiError(404, "An email is already linked to this account.")
    }

    const redisTtl = await redis.ttl(`addEmail:email:${userId}`)

    if (redisTtl > 0) {
        throw new apiError(400, `You already requested an otp. Please wait ${redisTtl} seconds to request a new one.`)
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedPassword = await bcrypt.hash(password, 10)

    await sendMail({
        email,
        subject: "Verify Your Problem Forge Account",
        layout: verifyEmailLayout(
            alreadyLinked.username,
            otp
        )
    }
    )

    await redis.set(
        `addEmail:email:${userId}`, email, 'EX', 600
    )
    await redis.set(
        `addEmail:password:${userId}`, hashedPassword, 'EX', 600
    )
    await redis.set(
        `addEmail:otp:${userId}`, otp, 'EX', 600
    )


    return res.status(200).json(
        new apiResponse(200, "Please verify your email.")
    )
}

const verifyAddEmail = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id
    const { otp } = req.body

    if (!otp) {
        throw new apiError(400, "Otp is required.")
    }

    const existedOtp = await redis.get(
        `addEmail:otp:${userId}`
    )

    if (!existedOtp) {
        throw new apiError(404, "Otp doesn't exist.")
    }
    if (existedOtp !== otp) {
        throw new apiError(404, "Incorrect otp.")
    }

    const email = await redis.get(
        `addEmail:email:${userId}`
    )
    const hashedPassword = await redis.get(
        `addEmail:password:${userId}`
    )

    if (!email || !hashedPassword) {
        throw new apiError(
            400,
            "Verification data expired. Please try again."
        );
    }

    const user = await User.findByIdAndUpdate(userId, {
        $set: {
            email,
            isEmailVerified: true,
            password: hashedPassword
        }
    }, {
        returnDocument: 'after'
    }
    )

    if (!user) {
        throw new apiError(400, "Failed to update user. Please try again later.")
    }

    await redis.del(
        `addEmail:email:${userId}`
    )
    await redis.del(
        `addEmail:password:${userId}`
    )
    await redis.del(
        `addEmail:otp:${userId}`
    )

    return res.status(200).json(
        new apiResponse(200, "Email is added to your account.")
    )

}

export {
    registerUser,
    verifyEmail,
    login,
    verifyTwoStepVerification,
    getCurrentUser,
    logoutUser,
    toggleTwoStepVerification,
    verifyTwoStepVerificationToggle,
    changeProfilePicture,
    changeName,
    changeUsername,
    changeBio,
    forgotPassword,
    resetPassword,
    toggleTimer,
    preferredLanguage,
    addEmail,
    verifyAddEmail
}