import mongoose, { Document, Schema } from "mongoose";

type UserRole = "user" | "admin";
type UserSubscription = "free" | "premium";

export interface IUser extends Document {
  name?: string;
  username: string;
  email?: string;
  password?: string;

  profilePicture?: string;
  profilePicturePublicId?: string;
  bio?: string;

  subscription: UserSubscription;

  // Verification
  isEmailVerified: boolean;
  twoStepVerification: boolean;
  twoStepVerificationChangedAt?: Date;

  // GitHub
  gitUsername?: string;
  gitId?: string;

  // Security
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  refreshToken?: string;

  // Game
  totalPoints: number;
  experiencePoints: number;
  streaks: number;
  badgesCount: number;

  // Account Status
  role: UserRole;
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;

  // Activity
  lastLogin?: Date;
  lastActiveAt?: Date;

  // Compiler
  preferredLanguage?: string;
  enableProblemTimer: boolean;

  // Social
  followers: number;
  following: number;
  posts: number;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String
    },

    profilePicture: {
      type: String,
      default: "https://res.cloudinary.com/dlzi244at/image/upload/v1763367677/defaultPersonImage_exseqc.avif",
    },
    profilePicturePublicId: {
      type: String,
      default: null
    },

    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    subscription: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },

    // Verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    twoStepVerification: {
      type: Boolean,
      default: false
    },
    twoStepVerificationChangedAt: {
      type: Date,
      default: null
  },

    // GitHub
    gitUsername: {
      type: String,
      default: null,
    },

    gitId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    // Security
    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpiry: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null
    },

    // Game
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    experiencePoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    streaks: {
      type: Number,
      default: 0,
      min: 0,
    },

    badgesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Account Status
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    banReason: {
      type: String,
      default: null,
    },

    // Activity
    lastLogin: {
      type: Date,
    },

    lastActiveAt: {
      type: Date,
    },

    // Compiler
    preferredLanguage: {
      type: String,
      default: "javascript",
    },

    enableProblemTimer: {
      type: Boolean,
      default: false,
    },

    // Social
    followers: {
      type: Number,
      default: 0,
      min: 0,
    },

    following: {
      type: Number,
      default: 0,
      min: 0,
    },

    posts: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);