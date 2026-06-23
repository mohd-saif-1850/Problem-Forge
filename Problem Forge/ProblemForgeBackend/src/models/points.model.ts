import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPointHistory extends Document {
    user: Types.ObjectId;
    problem?: Types.ObjectId;
    points: number;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}

const pointHistorySchema = new Schema<IPointHistory>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },

        problem: {
            type: Schema.Types.ObjectId,
            ref: "Problem"
        },

        points: {
            type: Number,
            required: [true, "Points are required"]
        },

        reason: {
            type: String,
            required: [true, "Reason is required"],
            trim: true
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