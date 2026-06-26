import { z } from "zod";

const contestExampleSchema = z.object({
    input: z
        .string()
        .trim()
        .min(1, "Example input is required"),

    output: z
        .string()
        .trim()
        .min(1, "Example output is required"),

    explanation: z
        .string()
        .trim()
        .optional()
});

const contestTestCaseSchema = z.object({
    input: z
        .string()
        .trim()
        .min(1, "Test case input is required"),

    output: z
        .string()
        .trim()
        .min(1, "Test case output is required")
});

export const contestValidationSchema = z.object({

    title: z
        .string()
        .trim()
        .min(5, "Title must be at least 5 characters long")
        .max(100, "Title cannot exceed 100 characters"),

    problemStatement: z
        .string()
        .trim()
        .min(20, "Problem statement must be at least 20 characters long")
        .max(10000, "Problem statement cannot exceed 10000 characters"),

    description: z
        .string()
        .trim()
        .min(20, "Description must be at least 20 characters long")
        .max(5000, "Description cannot exceed 5000 characters"),

    difficulty: z.enum([
        "easy",
        "medium",
        "hard"
    ]),

    tags: z
        .array(z.string().trim())
        .min(1, "At least one tag is required")
        .max(10, "Maximum 10 tags are allowed")
        .max(10, "Maximum 10 tags are allowed"),

    examples: z
        .array(contestExampleSchema)
        .min(1, "At least one example is required")
        .max(5, "Maximum 5 examples are allowed"),

    constraints: z
        .array(z.string().trim())
        .min(1, "At least one constraint is required")
        .max(10, "Maximum 10 constraints are allowed"),

    visibleTestCases: z
        .array(contestTestCaseSchema)
        .min(1, "At least one visible test case is required")
         .max(5, "Maximum 5 visible test cases are allowed"),

    hiddenTestCases: z
        .array(contestTestCaseSchema)
        .min(5, "At least five hidden test cases are required")
        .max(100, "Maximum 100 hidden test cases are allowed"),

    maxParticipants: z
        .number()
        .int()
        .min(10, "Maximum participants must be at least 10"),

    visibility: z.enum([
        "public",
        "followers"
    ])

});