import mongoose, { Document, Types, Schema } from "mongoose";

type RegistrationStatus =
    | "registered"
    | "cancelled"
    | "completed"
    | "disqualified";

export interface IContestRegistration extends Document {

    contest: Types.ObjectId;

    participant: Types.ObjectId;

    entryFee: number;

    status: RegistrationStatus;
}

const registrationSchema = new Schema<IContestRegistration>({
    contest: {
        type: Types.ObjectId,
        ref: "Contest",
        required: true
    },
    participant: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    entryFee: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["registered", "cancelled", "completed", "disqualified"],
        default: "registered"
    }
}, { timestamps: true })

registrationSchema.index(
    {
        contest: 1,
        participant: 1
    },
    {
        unique: true
    }
);

export const Registration = mongoose.model<IContestRegistration>("Registration", registrationSchema)