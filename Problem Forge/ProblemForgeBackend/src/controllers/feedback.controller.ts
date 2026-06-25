import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import apiError from "../utils/apiError";
import { User } from "../models/user.model";
import { Feedback } from "../models/feedback.model";
import apiResponse from "../utils/apiResponse";
import { createNotification } from "../services/notification.service";

const createFeedback = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id

    const {
        message,
        rating,
        category
    } = req.body

    if (!userId) {
        throw new apiError(400, "User Id is required")
    }
    if (!message) {
        throw new apiError(400, "Message is required")
    }

    const feedback = await Feedback.create({
        user: userId,
        message,
        rating,
        category
    })

    if (!feedback) {
        throw new apiError(500, "Server failed to create feedback")
    }

    return res.status(200).json(
        new apiResponse(200, "Feedback created successfully", feedback)
    )
}

const updateFeedback = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const role = req.user.role;

    const {
        feedbackId
    } = req.params;

    const {
        status,
        adminReply
    } = req.body;

    if (role !== "admin") {
        throw new apiError(
            403,
            "Only admin can update feedback"
        );
    }

    if (!feedbackId) {
        throw new apiError(
            400,
            "Feedback ID is required"
        );
    }

    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
        throw new apiError(
            404,
            "Feedback not found"
        );
    }

    if (status) {
        feedback.status = status;
    }

    if (adminReply) {
        feedback.adminReply = adminReply;
    }

    await feedback.save();

    // Send notification if status changed or admin replied
    if (status || adminReply) {
        await createNotification({
            recipient: feedback.user,
            title: "Feedback Updated",
            message: adminReply
                ? "An admin has replied to your feedback."
                : `Your feedback status has been updated to "${feedback.status}".`,
            type: "feedback",
            metadata: {
                userId: feedback.user
            }
        });
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Feedback updated successfully",
            feedback
        )
    );
};

const getFeedback = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const { feedbackId } = req.params;

    if (!feedbackId) {
        throw new apiError(
            400,
            "Feedback ID is required"
        );
    }

    const feedback = await Feedback.findById(feedbackId)
        .populate(
            "user",
            "username profilePicture"
        );

    if (!feedback) {
        throw new apiError(
            404,
            "Feedback not found"
        );
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Feedback fetched successfully",
            feedback
        )
    );
};

const getMyFeedback = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [feedbacks, totalFeedbacks] = await Promise.all([
        Feedback.find({
            user: userId
        })
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit),

        Feedback.countDocuments({
            user: userId
        })
    ]);

    return res.status(200).json(
        new apiResponse(
            200,
            "Feedback fetched successfully",
            {
                feedbacks,
                currentPage: page,
                totalPages: Math.ceil(totalFeedbacks / limit),
                totalFeedbacks,
                limit
            }
        )
    );
};

const getAllFeedback = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const {
        status,
        category,
        search
    } = req.query;

    const filter: any = {};

    // Only admins can use these filters
    if (req.user.role === "admin") {
        if (status) {
            filter.status = status;
        }

        if (category) {
            filter.category = category;
        }
    }

    // Everyone can search
    if (search) {
        filter.message = {
            $regex: search,
            $options: "i"
        };
    }

    const [feedbacks, totalFeedbacks] = await Promise.all([
        Feedback.find(filter)
            .populate(
                "user",
                "username profilePicture"
            )
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit),

        Feedback.countDocuments(filter)
    ]);

    return res.status(200).json(
        new apiResponse(
            200,
            "Feedback fetched successfully",
            {
                feedbacks,
                currentPage: page,
                totalPages: Math.ceil(totalFeedbacks / limit),
                totalFeedbacks,
                limit
            }
        )
    );
};

export {
    createFeedback,
    updateFeedback,
    getFeedback,
    getMyFeedback,
    getAllFeedback
}