import mongoose, {
    Schema,
    Types,
    Document
} from "mongoose";

export interface IComment extends Document {
    content: string;

    owner: Types.ObjectId;

    problem: Types.ObjectId;

    parentComment?: Types.ObjectId | null;

    likes: Types.ObjectId[];

    likesCount: number;

    repliesCount: number;

    isEdited: boolean;

    isDeleted: boolean;
}

const commentSchema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: true,
            trim: true
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        problem: {
            type: Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },

        parentComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },

        likes: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],

        likesCount: {
            type: Number,
            default: 0
        },

        repliesCount: {
            type: Number,
            default: 0
        },

        isEdited: {
            type: Boolean,
            default: false
        },

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

commentSchema.index({
    problem: 1,
    createdAt: -1
});

commentSchema.index({
    parentComment: 1
});

export const Comment = mongoose.model<IComment>(
    "Comment",
    commentSchema
);