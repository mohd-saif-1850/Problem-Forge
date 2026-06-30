import crypto from "crypto";
import redis from "../config/redis";
import { IUser } from "../models/user.model";
import { sendMail } from "./sendMail";
import { twoStepVerificationLayout } from "../emails/twoStepVerificationEmailLayout";
import apiError from "./apiError";

export const sendTwoStepVerification =
    async (
        user: IUser
    ): Promise<void> => {

        const ttl = await redis.ttl(
            `twoStepVerification:code:${user.email}`
        )

        if (ttl > 0) {

            const minutes = Math.max(
                1,
                Math.ceil(ttl / 60)
            )

            throw new apiError(
                400,
                `A verification code has already been sent. Please wait ${minutes} minute(s) before requesting another code.`
            )
        }

        const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let code = "";

        for (let i = 0; i < 4; i++) {
            code += characters[
                crypto.randomInt(characters.length)
            ];
        }

        await redis.set(
            `twoStepVerification:code:${user.email}`,
            code,
            "EX",
            300
        )

        await sendMail({
            email: user.email || "",
            subject:
                "Your Problem Forge Security Code",
            layout:
                twoStepVerificationLayout(
                    user.username,
                    code
                ),
        })
    }