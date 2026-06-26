import mongoose, { Document, Schema, Types } from "mongoose";

export type ContestSubmissionStatus =
    | "pending"
    | "accepted"
    | "wrong_answer"
    | "time_limit_exceeded"
    | "runtime_error"
    | "memory_limit_exceeded"
    | "compilation_error"
    | "internal_error";

export interface IContestSubmission extends Document {
    contest: Types.ObjectId;

    participant: Types.ObjectId;

    sourceCode: string;

    language: string;

    status: ContestSubmissionStatus;

    attemptsLeft: number;

    points: number;

    xp: number;

    executionTime: number;

    memoryUsed: number;

    acceptedAt?: Date;
}

const contestSubmissionSchema = new Schema<IContestSubmission>(
    {
        contest: {
            type: Schema.Types.ObjectId,
            ref: "Contest",
            required: true,
            index: true
        },

        participant: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        sourceCode: {
            type: String,
            required: true,
            trim: true
        },

        language: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "wrong_answer",
                "time_limit_exceeded",
                "runtime_error",
                "memory_limit_exceeded",
                "compilation_error",
                "internal_error"
            ],
            default: "pending"
        },

        attemptsLeft: {
            type: Number,
            default: 3,
            min: 0
        },

        points: {
            type: Number,
            default: 0,
            min: 0
        },

        xp: {
            type: Number,
            default: 0,
            min: 0
        },

        executionTime: {
            type: Number,
            default: 0,
            min: 0
        },

        memoryUsed: {
            type: Number,
            default: 0,
            min: 0
        },

        acceptedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

contestSubmissionSchema.index(
    {
        contest: 1,
        participant: 1
    },
    {
        unique: true
    }
);

contestSubmissionSchema.index({
    contest: 1,
    status: 1
});

contestSubmissionSchema.index({
    participant: 1
});

export const ContestSubmission = mongoose.model<IContestSubmission>(
    "ContestSubmission",
    contestSubmissionSchema
);