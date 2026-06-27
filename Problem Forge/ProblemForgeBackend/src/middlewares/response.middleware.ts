import { NextFunction, Request, Response } from "express";

import apiError from "../utils/apiError";
import apiResponse from "../utils/apiResponse";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof apiError) {
        return res.status(err.statusCode).json(
            new apiResponse(
                err.statusCode,
                err.message,
                null
            )
        );
    }

    console.error(err);

    return res.status(500).json(
        new apiResponse(
            500,
            "Internal Server Error.",
            null
        )
    );
};

export default errorHandler;