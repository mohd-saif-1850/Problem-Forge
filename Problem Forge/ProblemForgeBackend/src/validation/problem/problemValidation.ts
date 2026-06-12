import { z } from "zod";

export const exampleSchema = z.object({
    input: z
        .string({ error: "Example input is required" })
        .trim()
        .min(1, "Example input cannot be empty"),

    output: z
        .string({ error: "Example output is required" })
        .trim()
        .min(1, "Example output cannot be empty"),

    explanation: z
        .string()
        .trim()
        .optional(),
});

export const testCaseSchema = z.object({
    input: z
        .string({ error: "Test case input is required" })
        .trim()
        .min(1, "Test case input cannot be empty"),

    expectedOutput: z
        .string({ error: "Expected output is required" })
        .trim()
        .min(1, "Expected output cannot be empty"),
});

export const problemValidationSchema = z.object({
    title: z
        .string({ error: "Title is required" })
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(150, "Title cannot exceed 150 characters"),

    problemStatement: z
        .string({ error: "Problem statement is required" })
        .trim()
        .min(
            10,
            "Problem statement must be at least 10 characters"
        ),

    description: z
        .string()
        .trim()
        .optional(),

    difficulty: z.enum(
        ["easy", "medium", "hard"],
        {
            error: "Difficulty is required",
        }
    ),

    constraints: z
        .array(
            z.string().trim(),
            {
                error: "Constraints are required",
            }
        )
        .min(
            1,
            "At least one constraint is required"
        ),

    examples: z
        .array(exampleSchema, {
            error: "Examples are required",
        })
        .min(
            1,
            "At least one example is required"
        ),

    testCases: z
        .array(testCaseSchema, {
            error: "Visible test cases are required",
        })
        .min(
            2,
            "At least 2 visible test cases are required"
        )
        .max(
            5,
            "Maximum 5 visible test cases are allowed"
        ),

    hiddenCases: z
        .array(testCaseSchema, {
            error: "Hidden test cases are required",
        })
        .min(
            5,
            "At least 5 hidden test cases are required"
        )
        .max(
            20,
            "Maximum 20 hidden test cases are allowed"
        ),

    tags: z
        .array(z.string().trim())
        .optional(),

    referenceSolution: z
        .string()
        .trim()
        .optional(),

    timeLimit: z
        .number({
            error: "Time limit is required",
        })
        .int("Time limit must be an integer")
        .min(
            1,
            "Time limit must be at least 1 ms"
        )
        .max(
            10000,
            "Time limit cannot exceed 10000 ms"
        ),

    memoryLimit: z
        .number({
            error: "Memory limit is required",
        })
        .int("Memory limit must be an integer")
        .min(
            1,
            "Memory limit must be at least 1 MB"
        )
        .max(
            2048,
            "Memory limit cannot exceed 2048 MB"
        ),

    isPremium: z.boolean().optional(),
});