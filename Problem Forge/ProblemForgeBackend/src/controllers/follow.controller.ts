import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import apiError from "../utils/apiError";
import { User } from "../models/user.model";
import { Follow } from "../models/follow.model";
import { createNotification } from "../services/notification.service";
import apiResponse from "../utils/apiResponse";

const followUser = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const currentUserId = req.user._id;

    const { username } = req.params;

    if (!username) {
        throw new apiError(
            400,
            "Username is required."
        );
    }

    const targetUser = await User.findOne({
        username
    }).select("_id username");

    if (!targetUser) {
        throw new apiError(
            404,
            "User not found."
        );
    }

    if (
        targetUser._id.toString() ===
        currentUserId.toString()
    ) {
        throw new apiError(
            400,
            "You cannot follow yourself."
        );
    }

    const alreadyFollowing = await Follow.findOne({
        follower: currentUserId,
        following: targetUser._id
    });

    if (alreadyFollowing) {
        throw new apiError(
            400,
            "You are already following this user."
        );
    }

    await Follow.create({
        follower: currentUserId,
        following: targetUser._id
    });

    await User.findByIdAndUpdate(
        currentUserId,
        {
            $inc: {
                followingCount: 1
            }
        }
    );

    await User.findByIdAndUpdate(
        targetUser._id,
        {
            $inc: {
                followersCount: 1
            }
        }
    );

    await createNotification({
        recipient: targetUser._id,

        title: "New Follower",

        message: `${req.user.username} started following you.`,

        type: "follow",

        metadata: {
            userId: currentUserId
        }
    });

    return res.status(200).json(
        new apiResponse(
            200,
            "User followed successfully."
        )
    );
};

const unfollowUser = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const currentUserId = req.user._id;

    const { username } = req.params;

    if (!username) {
        throw new apiError(
            400,
            "Username is required."
        );
    }

    const targetUser = await User.findOne({
        username
    }).select("_id");

    if (!targetUser) {
        throw new apiError(
            404,
            "User not found."
        );
    }

    const follow = await Follow.findOneAndDelete({
        follower: currentUserId,
        following: targetUser._id
    });

    if (!follow) {
        throw new apiError(
            400,
            "You are not following this user."
        );
    }

    await Promise.all([
        User.findByIdAndUpdate(
            currentUserId,
            {
                $inc: {
                    followingCount: -1
                }
            }
        ),

        User.findByIdAndUpdate(
            targetUser._id,
            {
                $inc: {
                    followersCount: -1
                }
            }
        )
    ]);

    return res.status(200).json(
        new apiResponse(
            200,
            "User unfollowed successfully."
        )
    );
};

const getFollowers = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const { username } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    if (!username) {
        throw new apiError(
            400,
            "Username is required."
        );
    }

    const user = await User.findOne({
        username
    }).select("_id");

    if (!user) {
        throw new apiError(
            404,
            "User not found."
        );
    }

    const followers = await Follow.find({
        following: user._id
    })
        .populate({
            path: "follower",
            select: "username profilePicture"
        })
        .skip((page - 1) * limit)
        .limit(limit);

    const totalFollowers = await Follow.countDocuments({
        following: user._id
    });

    return res.status(200).json(
        new apiResponse(
            200,
            "Followers fetched successfully.",
            {
                followers,
                totalFollowers,
                page,
                limit
            }
        )
    );
};

const getFollowing = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const { username } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    if (!username) {
        throw new apiError(
            400,
            "Username is required."
        );
    }

    const user = await User.findOne({
        username
    }).select("_id");

    if (!user) {
        throw new apiError(
            404,
            "User not found."
        );
    }

    const following = await Follow.find({
        follower: user._id
    })
        .populate({
            path: "following",
            select: "username profilePicture"
        })
        .skip((page - 1) * limit)
        .limit(limit);

    const totalFollowing = await Follow.countDocuments({
        follower: user._id
    });

    return res.status(200).json(
        new apiResponse(
            200,
            "Following fetched successfully.",
            {
                following,
                totalFollowing,
                page,
                limit
            }
        )
    );
};

const isFollowing = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const currentUserId = req.user._id;

    const { username } = req.params;

    if (!username) {
        throw new apiError(
            400,
            "Username is required."
        );
    }

    const targetUser = await User.findOne({
        username
    }).select("_id");

    if (!targetUser) {
        throw new apiError(
            404,
            "User not found."
        );
    }

    const following = await Follow.exists({
        follower: currentUserId,
        following: targetUser._id
    });

    return res.status(200).json(
        new apiResponse(
            200,
            "Follow status fetched successfully.",
            {
                isFollowing: !!following
            }
        )
    );
};

export {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    isFollowing
}