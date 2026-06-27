import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import apiError from "../utils/apiError";
import { Notification } from "../models/notification.model";
import apiResponse from "../utils/apiResponse";

const getMyNotifications = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id;

    if (!userId) {
        throw new apiError(404, "User Id not found");
    }

    const {
        page = "1",
        type,
        isRead
    } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const limit = 30;
    const skip = (currentPage - 1) * limit;

    const filter: any = {
        recipient: userId
    };

    if (type) {
        filter.type = type;
    }

    if (isRead !== undefined) {
        filter.isRead = isRead === "true";
    }

    const [notifications, totalNotifications] = await Promise.all([
        Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        Notification.countDocuments(filter)
    ]);

    if (isRead !== "false" && notifications.length > 0) {
        const unreadNotificationIds = notifications
            .filter(notification => !notification.isRead)
            .map(notification => notification._id);

        if (unreadNotificationIds.length > 0) {
            await Notification.updateMany(
                {
                    _id: {
                        $in: unreadNotificationIds
                    }
                },
                {
                    $set: {
                        isRead: true
                    }
                }
            );

            notifications.forEach(notification => {
                notification.isRead = true;
            });
        }
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Notifications fetched successfully.",
            {
                notifications,
                currentPage,
                totalPages: Math.ceil(totalNotifications / limit),
                totalNotifications,
                hasNextPage: currentPage * limit < totalNotifications,
                hasPreviousPage: currentPage > 1
            }
        )
    );
};

const getUnreadNotificationsCount = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id;

    if (!userId) {
        throw new apiError(404, "User Id not found");
    }

    const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false
    });

    return res.status(200).json(
        new apiResponse(
            200,
            "Unread notifications count fetched successfully.",
            {
                unreadCount
            }
        )
    );
};

const deleteAllNotifications = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id;

    if (!userId) {
        throw new apiError(404, "User Id not found");
    }

    await Notification.deleteMany({
        recipient: userId
    });

    return res.status(200).json(
        new apiResponse(
            200,
            "All notifications deleted successfully."
        )
    );
};

const getNotification = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id;
    const { notificationId } = req.params;

    if (!userId) {
        throw new apiError(404, "User Id not found");
    }

    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId
    }).populate("sender", "username name profilePicture");

    if (!notification) {
        throw new apiError(404, "Notification not found.");
    }

    if (!notification.isRead) {
        notification.isRead = true;
        await notification.save();
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Notification fetched successfully.",
            notification
        )
    );
};

export {
    getMyNotifications,
    getUnreadNotificationsCount,
    deleteAllNotifications,
    getNotification
}