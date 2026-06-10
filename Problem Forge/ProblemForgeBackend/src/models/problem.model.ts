import mongoose, { Document, Schema } from "mongoose";

export type Difficulty = "easy" | "medium" | "hard";

export interface IExample {
    input: string;
    output: string;
    explanation?: string;
}

export interface ITestCase {
    input: string;
    output: string;
}

export interface IProblem extends Document {
    // Problem Details
    title: string;
    slug: string;
    problemStatement: string;
    description?: string;
    difficulty: Difficulty;
    points: number;

    // Constraints
    constraints: string[];

    // Examples
    examples: IExample[];

    // Test Cases
    testCases: ITestCase[];
    hiddenCases: ITestCase[];

    // Metadata
    tags?: string[];
    createdBy: mongoose.Types.ObjectId;
    timeTaken?: number;

    // Statistics
    totalSubmissions: number;
    totalAcceptedSubmissions: number;
    totalSolvedUsers: number;

    // Code
    referenceSolution?: string;

    // Limits
    timeLimit: number; // milliseconds
    memoryLimit: number; // MB

    // Visibility
    isPublished: boolean;
    isPremium: boolean;
}

const exampleSchema = new Schema(
    {
        input: {
            type: String,
            required: true,
            trim: true,
        },
        output: {
            type: String,
            required: true,
            trim: true,
        },
        explanation: {
            type: String,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const testCaseSchema = new Schema(
    {
        input: {
            type: String,
            required: true,
        },
        output: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const problemSchema = new Schema<IProblem>(
    {
        // Problem Details
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        problemStatement: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
        },

        points: {
            type: Number,
            required: true,
            default: 100,
            min: 0,
        },

        // Constraints
        constraints: [
            {
                type: String,
                trim: true,
            },
        ],

        // Examples
        examples: {
            type: [exampleSchema],
            default: [],
        },

        // Test Cases
        testCases: {
            type: [testCaseSchema],
            default: [],
        },

        hiddenCases: {
            type: [testCaseSchema],
            default: [],
        },

        // Metadata
        tags: {
            type: [String],
            default: [],
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        timeTaken: {
            type: Number
        },

        // Statistics
        totalSubmissions: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalAcceptedSubmissions: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalSolvedUsers: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Code
        referenceSolution: {
            type: String
        },

        // Limits
        timeLimit: {
            type: Number,
            default: 1000, // 1 second
            min: 1,
        },

        memoryLimit: {
            type: Number,
            default: 256, // 256 MB
            min: 1,
        },

        // Visibility
        isPublished: {
            type: Boolean,
            default: false,
        },

        isPremium: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

problemSchema.index({ slug: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });

export const Problem = mongoose.model<IProblem>(
    "Problem",
    problemSchema
);