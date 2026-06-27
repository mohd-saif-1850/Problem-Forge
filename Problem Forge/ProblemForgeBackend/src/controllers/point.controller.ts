import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import apiError from "../utils/apiError";
import { PointsHistory } from "../models/points.model";
import apiResponse from "../utils/apiResponse";

const getPointHistory = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id;

    if (!userId) {
        throw new apiError(404, "User Id not found");
    }

    const {
        page = "1",
        limit = "20",
        type,
        reason,
        from,
        to
    } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const pageLimit = Math.max(Number(limit), 1);
    const skip = (currentPage - 1) * pageLimit;

    const filter: any = {
        user: userId
    };

    if (type) {
        filter.type = type;
    }

    if (reason) {
        filter.reason = {
            $regex: reason,
            $options: "i"
        };
    }

    if (from || to) {
        filter.createdAt = {};

        if (from) {
            filter.createdAt.$gte = new Date(from as string);
        }

        if (to) {
            filter.createdAt.$lte = new Date(to as string);
        }
    }

    const [points, totalPoints] = await Promise.all([
        PointsHistory.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageLimit),

        PointsHistory.countDocuments(filter)
    ]);

    return res.status(200).json(
        new apiResponse(
            200,
            "Point history fetched successfully.",
            {
                points,
                currentPage,
                totalPages: Math.ceil(totalPoints / pageLimit),
                totalPoints,
                hasNextPage: currentPage * pageLimit < totalPoints,
                hasPreviousPage: currentPage > 1
            }
        )
    );
};

export {
    getPointHistory
}