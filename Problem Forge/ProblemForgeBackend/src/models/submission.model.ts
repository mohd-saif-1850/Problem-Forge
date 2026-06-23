import mongoose, {Schema, Document} from "mongoose";

export type statusType = "Pending" | "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error"
export type languageType = "javascript" | "c" | "cpp" | "java" | "python"

export interface ISubmission extends Document{
    submittedBy: mongoose.Types.ObjectId;
    problem : mongoose.Types.ObjectId;

    code: string;
    language: languageType;
    status: statusType;

    testCasesPassed: number;
    totalTestCases: number;

    executionTime: number;
    memoryUsed: number;

    timeTaken?: number;
}

const submissionSchema = new Schema<ISubmission>({
    submittedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    problem: {
        type: Schema.Types.ObjectId,
        ref: "Problem",
        required: true
    },

    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        enum: ["javascript", "c", "cpp", "java", "python"],
        required: true
    },
    status: {
        type: String,
        enum: ["Pending","Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"],
        default: "Pending"
    },

    testCasesPassed: {
        type: Number,
        default: 0
    },
    totalTestCases: {
        type: Number,
        default: 0
    },

    executionTime: {
        type: Number,
        default: 0
    },
    memoryUsed: {
        type: Number,
        default: 0
    },

    timeTaken: {
        type: Number,
        default: null
    }
},{timestamps: true})

submissionSchema.index({ submittedBy: 1 });
submissionSchema.index({ problem: 1 });

export const Submission = mongoose.model<ISubmission>(
    "Submission",
    submissionSchema
);