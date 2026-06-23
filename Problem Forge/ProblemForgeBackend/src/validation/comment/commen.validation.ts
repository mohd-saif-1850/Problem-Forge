import {z} from "zod";

export const commentValidationSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(200, "Comment cannot exceed 200 characters"),

    problemId: z.string(),

    parentCommentId: z
        .string()
        .optional()
});