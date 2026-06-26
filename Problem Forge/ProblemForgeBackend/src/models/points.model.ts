import mongoose, { Document, Schema, Types } from "mongoose";

type PointHistoryType =
    | "problem"
    | "contest"
    | "shop"
    | "badge"
    | "subscription"
    | "streak"
    | "achievement"
    | "admin"
    | "other";

export interface IPointHistory extends Document {
    user: Types.ObjectId;

    type: PointHistoryType;

    points: number;

    reason: string;

    metadata?: {
        problemId?: Types.ObjectId;
        contestId?: Types.ObjectId;
        badgeId?: Types.ObjectId;
        shopItemId?: Types.ObjectId;
        subscriptionId?: Types.ObjectId;
    };
}

const pointHistorySchema = new Schema<IPointHistory>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        type: {
            type: String,
            enum: [
                "problem",
                "contest",
                "shop",
                "badge",
                "subscription",
                "streak",
                "achievement",
                "admin",
                "other"
            ],
            required: true
        },

        points: {
            type: Number,
            required: true
        },

        reason: {
            type: String,
            required: true,
            trim: true
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

export const PointsHistory = mongoose.model<IPointHistory>(
    "PointsHistory",
    pointHistorySchema
);