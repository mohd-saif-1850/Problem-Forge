import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFollow extends Document {
    follower: Types.ObjectId;
    following: Types.ObjectId;
}

const followSchema = new Schema<IFollow>(
    {
        follower: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        following: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

followSchema.index(
    {
        follower: 1,
        following: 1
    },
    {
        unique: true
    }
);

export const Follow = mongoose.model<IFollow>(
    "Follow",
    followSchema
);