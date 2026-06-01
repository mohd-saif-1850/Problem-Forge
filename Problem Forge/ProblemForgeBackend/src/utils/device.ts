import { Request } from "express";
import { UAParser } from "ua-parser-js";

export interface DeviceInfo {
    browser: string;
    os: string;
    deviceType: string;
    fingerprint: string;
}

export const getDeviceInfo = (
    req: Request
): DeviceInfo => {
    const parser = new UAParser(
        req.headers["user-agent"]
    );

    const browser =
        parser.getBrowser().name ||
        "Unknown Browser";

    const os =
        parser.getOS().name ||
        "Unknown OS";

    const deviceType =
        parser.getDevice().type ||
        "Desktop";

    const fingerprint =
        `${browser}-${os}-${deviceType}`;

    return {
        browser,
        os,
        deviceType,
        fingerprint,
    };
};