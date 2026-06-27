import mongoose, { Document, Schema } from "mongoose";

export type NotificationType =
    | "follow"
    | "badge"
    | "problem"
    | "submission"
    | "contest"
    | "system"
    | "achievement"
    | "feedback";

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;

    title: string;
    message: string;

    type: NotificationType;

    isRead: boolean;

    metadata?: {
        userId?: mongoose.Types.ObjectId;
        problemId?: mongoose.Types.ObjectId;
        submissionId?: mongoose.Types.ObjectId;
        badgeId?: mongoose.Types.ObjectId;
        contestId?: mongoose.Types.ObjectId;
    };
}

const notificationSchema = new Schema<INotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: [
                "follow",
                "badge",
                "submission",
                "contest",
                "system",
                "achievement",
                "feedback"
            ],
            required: true
        },

        isRead: {
            type: Boolean,
            default: false
        },

        metadata: {
            type: Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({
    recipient: 1,
    createdAt: -1
});

export const Notification = mongoose.model<INotification>(
    "Notification",
    notificationSchema
);