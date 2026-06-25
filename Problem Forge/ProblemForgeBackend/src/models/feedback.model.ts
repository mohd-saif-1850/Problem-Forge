import mongoose, { Schema, Document, Types } from "mongoose";

type categoryType = "feedback" | "bug" | "feature" | "other" | "ui/ux" | "performance";
type statusType = "pending" | "reviewed" | "resolved" | "rejected";

export interface IFeedback extends Document {
    user: Types.ObjectId;
    message: string;
    rating: number;
    category: categoryType;
    status: statusType;
    adminReply?: string;
}

const feedbackSchema = new Schema<IFeedback>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, "Message must be at least 10 characters long"],
        maxlength: [2000, "Message cannot exceed 2000 characters"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    category: {
        type: String,
        enum : ["feedback", "bug", "feature", "other", "ui/ux", "performance"],
        default: "feedback"
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "resolved", "rejected"],
        default: "pending"
    },
    adminReply: {
        type: String
    }
},{timestamps: true})

export const Feedback = mongoose.model<IFeedback>(
    "Feedback",
    feedbackSchema
)