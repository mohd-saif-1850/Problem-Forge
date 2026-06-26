import mongoose, { Document, Schema, Types } from "mongoose";

type ContestDifficulty =
    | "easy"
    | "medium"
    | "hard";

type ContestStatus =
    | "upcoming"
    | "running"
    | "ended"
    | "cancelled";

type ContestVisibility =
    | "public"
    | "followers";

interface IContestExample {
    input: string;
    output: string;
    explanation?: string;
}

interface IContestTestCase {
    input: string;
    expectedOutput: string;
}

interface IContestStats {
    totalSubmissions: number;
    acceptedSubmissions: number;
    acceptanceRate: number;
}

interface IContestRating {
    averageRating: number;
    totalRatings: number;
}

interface IContestWinner {
    user: Types.ObjectId;
    username: string;
    profilePicture: string;

    rank: 1 | 2 | 3;

    rewardPoints: number;

    submittedAt: Date;
}

export interface IContest extends Document {

    title: string;

    slug: string;

    problemStatement: string;

    description: string;

    difficulty: ContestDifficulty;

    tags: string[];

    examples: IContestExample[];

    constraints: string[];

    visibleTestCases: IContestTestCase[];

    hiddenTestCases: IContestTestCase[];

    timeLimit: number;

    memoryLimit: number;

    createdBy: Types.ObjectId;

    creatorEntryCost: number;

    creatorReward: number;

    participantEntryCost: number;

    rewardMultiplier: {
        first: number;
        second: number;
        third: number;
    };

    rewardDistributed: boolean;

    totalParticipants: number;

    minimumParticipants: number;

    maxParticipants: number;

    maxAttempts: number;

    winners: IContestWinner[];

    registrationDeadline: Date;

    startTime: Date;

    endTime: Date;

    rewardDistributionTime: Date;

    visibility: ContestVisibility;

    isPublished: boolean;

    status: ContestStatus;

    stats: IContestStats;

    rating: IContestRating;

    cancelReason?: string;
}

const contestSchema = new Schema<IContest>({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "Title must be at least 5 characters long"],
        maxlength: [100, "Title cannot exceed 100 characters"]
    },

    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    problemStatement: {
        type: String,
        required: true,
        trim: true,
        minlength: [20, "Problem statement must be at least 20 characters long"],
        maxlength: [10000, "Problem statement cannot exceed 10000 characters"]
    },

    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: [5000, "Description cannot exceed 5000 characters"]
    },

    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },

    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],

    examples: [{
        input: {
            type: String,
            required: true,
            trim: true
        },
        output: {
            type: String,
            required: true,
            trim: true
        },
        explanation: {
            type: String,
            trim: true,
            default: ""
        }
    }],

    constraints: [{
        type: String,
        required: true,
        trim: true
    }],

    visibleTestCases: [{
        input: {
            type: String,
            required: true,
            trim: true
        },
        output: {
            type: String,
            required: true,
            trim: true
        }
    }],

    hiddenTestCases: [{
        input: {
            type: String,
            required: true,
            trim: true
        },
        output: {
            type: String,
            required: true,
            trim: true
        }
    }],

    timeLimit: {
        type: Number,
        default: 1000,
        min: 1
    },

    memoryLimit: {
        type: Number,
        default: 256,
        min: 1
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    creatorEntryCost: {
        type: Number,
        required: true,
        min: [0, "Creator entry cost cannot be negative"]
    },

    creatorReward: {
        type: Number,
        required: true,
        min: [0, "Creator reward cannot be negative"]
    },

    participantEntryCost: {
        type: Number,
        required: true,
        min: [0, "Participant entry cost cannot be negative"]
    },

    rewardMultiplier: {
        first: {
            type: Number,
            default: 15,
            min: 1
        },
        second: {
            type: Number,
            default: 10,
            min: 1
        },
        third: {
            type: Number,
            default: 5,
            min: 1
        }
    },

    rewardDistributed: {
        type: Boolean,
        default: false
    },

    totalParticipants: {
        type: Number,
        default: 0,
        min: 0
    },

    minimumParticipants: {
        type: Number,
        min: [3, "Minimum participants must be at least 3"],
        default: 3
    },

    maxParticipants: {
        type: Number,
        default: 30,
        min: [30, "Maximum participants must be at least 30"]
    },

    maxAttempts: {
        type: Number,
        default: 3,
        min: [1, "Maximum attempts must be at least 1"]
    },

    winners: [{
        _id: false,

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        username: {
            type: String,
            required: true,
            trim: true
        },

        profilePicture: {
            type: String,
            required: true
        },

        rank: {
            type: Number,
            enum: [1, 2, 3],
            required: true
        },

        rewardPoints: {
            type: Number,
            required: true,
            min: 0
        },

        submittedAt: {
            type: Date,
            required: true
        }
    }],

    registrationDeadline: {
        type: Date,
        required: true
    },

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true
    },

    rewardDistributionTime: {
        type: Date,
        required: true
    },

    visibility: {
        type: String,
        enum: ["public", "followers"],
        default: "public"
    },

    isPublished: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: [
            "upcoming",
            "running",
            "ended",
            "cancelled"
        ],
        default: "upcoming",
        index: true
    },

    stats: {
        _id: false,

        totalSubmissions: {
            type: Number,
            default: 0,
            min: 0
        },

        acceptedSubmissions: {
            type: Number,
            default: 0,
            min: 0
        },

        acceptanceRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },

    rating: {
        _id: false,

        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        totalRatings: {
            type: Number,
            default: 0,
            min: 0
        }
    },

    cancelReason: {
        type: String,
        trim: true,
        maxlength: [500, "Cancel reason cannot exceed 500 characters"],
        default: ""
    }
}, { timestamps: true })

export const Contest = mongoose.model<IContest>("Contest", contestSchema)