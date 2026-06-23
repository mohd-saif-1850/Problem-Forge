import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { commentValidationSchema } from "../validation/comment/commen.validation";
import apiError from "../utils/apiError";
import { Problem } from "../models/problem.model";
import { Comment } from "../models/comments.model";
import apiResponse from "../utils/apiResponse";
import { User } from "../models/user.model";
import redis from "../config/redis";

const createComment = async (
    req: AuthenticatedRequest,
    res: Response
) => {

    const userId = req.user._id;

    const result =
        commentValidationSchema.safeParse(
            req.body
        );

    if (!result.success) {
        throw new apiError(
            400,
            result.error.issues[0].message
        );
    }

    const {
        content,
        problemId,
        parentCommentId
    } = result.data;

    const problem = await Problem.findById(
        problemId
    );

    if (!problem) {
        throw new apiError(
            404,
            "Problem not found"
        );
    }

    let parentComment = null;

    if (parentCommentId) {

        parentComment =
            await Comment.findById(
                parentCommentId
            );

        if (!parentComment) {
            throw new apiError(
                404,
                "Parent comment not found"
            );
        }

        if (
            !parentComment.problem.equals(
                problem._id
            )
        ) {
            throw new apiError(
                400,
                "Invalid parent comment"
            );
        }
    }

    const comment =
        await Comment.create({
            content,
            owner: userId,
            problem: problemId,
            parentComment:
                parentCommentId || null
        });

    if (parentComment) {

        parentComment.repliesCount += 1;

        await parentComment.save();
    }

    return res.status(201).json(
        new apiResponse(
            201,
            "Comment created successfully",
            comment
        )
    );

};

const getProblemComments = async (
    req: Request,
    res: Response
) => {

    const { problemId } = req.params;

    const problem = await Problem.findById(
        problemId
    );

    if (!problem) {
        throw new apiError(
            404,
            "Problem not found"
        );
    }

    const comments = await Comment.find({
        problem: problemId,
        parentComment: null,
        isDeleted: false
    })
        .populate(
            "owner",
            "username profilePicture"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json(
        new apiResponse(
            200,
            "Comments fetched successfully",
            comments
        )
    );

};

const getCommentReplies = async (
    req: Request,
    res: Response
) => {

    const { commentId } = req.params;

    const comment = await Comment.findById(
        commentId
    );

    if (!comment) {
        throw new apiError(
            404,
            "Comment not found"
        );
    }

    const replies = await Comment.find({
        parentComment: commentId,
        isDeleted: false
    })
        .populate(
            "owner",
            "username profilePicture"
        )
        .sort({
            createdAt: 1
        });

    return res.status(200).json(
        new apiResponse(
            200,
            "Replies fetched successfully",
            replies
        )
    );

};

const getMyComments = async (
    req: Request,
    res: Response
) => {

    const { userId } = req.params;

    const user = await User.findById(
        userId
    );

    if (!user) {
        throw new apiError(
            404,
            "User not found"
        );
    }

    const comments = await Comment.find({
        owner: userId,
        isDeleted: false
    })
        .populate(
            "problem",
            "title slug difficulty"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json(
        new apiResponse(
            200,
            "Comments fetched successfully",
            comments
        )
    );

};

const toggleCommentLike = async (
    req: AuthenticatedRequest,
    res: Response
) => {

    const userId = req.user._id;

    const { commentId } = req.params;

    const cooldownKey =
        `comment-like:${userId}:${commentId}`;

    const ttl = await redis.ttl(
        cooldownKey
    );

    if (ttl > 0) {
        throw new apiError(
            429,
            `Please wait ${ttl} seconds before trying again`
        );
    }

    const comment = await Comment.findById(
        commentId
    );

    if (!comment) {
        throw new apiError(
            404,
            "Comment not found"
        );
    }

    const alreadyLiked =
        comment.likes.some(
            (id) => id.equals(userId)
        );

    if (alreadyLiked) {

        comment.likes =
            comment.likes.filter(
                (id) => !id.equals(userId)
            );

        comment.likesCount -= 1;
    }
    else {

        comment.likes.push(userId);

        comment.likesCount += 1;
    }

    await comment.save();

    await redis.set(
        cooldownKey,
        "liked",
        "EX",
        10
    );

    return res.status(200).json(
        new apiResponse(
            200,
            alreadyLiked
                ? "Comment unliked successfully"
                : "Comment liked successfully",
            {
                likesCount:
                    comment.likesCount,
                isLiked:
                    !alreadyLiked
            }
        )
    );

};

const getCommentLikes = async (
    req: AuthenticatedRequest,
    res: Response
) => {

    const { commentId } = req.params;

    const user = await User.findById(
        req.user._id
    );

    if (!user) {
        throw new apiError(
            404,
            "User not found"
        );
    }

    const isPremium =
        user.subscription.plan === "premium" &&
        user.subscription.expiresAt &&
        user.subscription.expiresAt > new Date();

    if (!isPremium) {
        throw new apiError(
            403,
            "Premium subscription required"
        );
    }

    const comment = await Comment.findById(
        commentId
    )
        .populate(
            "likes",
            "username name profilePicture"
        );

    if (!comment) {
        throw new apiError(
            404,
            "Comment not found"
        );
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Likes fetched successfully",
            comment.likes
        )
    );

};

export {
    createComment,
    getProblemComments,
    getCommentReplies,
    getMyComments,
    toggleCommentLike,
    getCommentLikes
}