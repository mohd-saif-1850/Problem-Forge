import { Request } from "express";
import redis from "../config/redis";
import { IUser } from "../models/user.model";
import { getDeviceInfo } from "./device";
import { sendMail } from "./sendMail";
import { newDeviceLoginLayout } from "../emails/newDeviceLoginEmailLayout";

export const handleDeviceLogin = async (
    req: Request,
    user: IUser
): Promise<void> => {
    const device = getDeviceInfo(req);

    const knownDevice =
        await redis.sismember(
            `devices:${user._id}`,
            device.fingerprint
        );

    if (knownDevice) {
        return;
    }

    await redis.sadd(
        `devices:${user._id}`,
        device.fingerprint
    );

    await redis.expire(
        `devices:${user._id}`,
        28 * 24 * 60 * 60
    );

    try {
        await sendMail({
            email: user.email || "",
            subject:
                "New Device Login Detected",
            layout: newDeviceLoginLayout(
                user.username,
                `${device.browser} on ${device.os}`,
                "Unknown Location",
                req.ip || "Unknown IP",
                new Date().toLocaleString()
            ),
        });
    } catch (error) {
        console.error(
            "Failed to send device email",
            error
        );
    }
};