import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import apiError from "../utils/apiError";

export interface AuthenticatedRequest extends Request {
    user?: any;
}

const verifyJWT = async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
) => {

    const token = req.cookies?.accessToken;

    if (!token) {
        throw new apiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
    ) as {
        _id: string;
    };

    const user = await User.findById(decoded._id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new apiError(401, "Invalid access token");
    }

    req.user = user;

    next();
};

export default verifyJWT;