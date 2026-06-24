import mongoose from "mongoose";

import {
    Notification,
    NotificationType
} from "../models/notification.model";

interface ICreateNotification {
    recipient: mongoose.Types.ObjectId;

    title: string;
    message: string;

    type: NotificationType;

    metadata?: {
        userId?: mongoose.Types.ObjectId;
        problemId?: mongoose.Types.ObjectId;
        submissionId?: mongoose.Types.ObjectId;
        badgeId?: mongoose.Types.ObjectId;
        contestId?: mongoose.Types.ObjectId;
    };
}

const createNotification = async ({
    recipient,
    title,
    message,
    type,
    metadata = {}
}: ICreateNotification) => {
    const notification = await Notification.create({
        recipient,
        title,
        message,
        type,
        metadata
    });

    return notification;
};

export {
    createNotification
};