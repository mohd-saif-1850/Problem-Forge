import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(25, "Username cannot exceed 20 characters")
  .regex(
    /^(?!.*__)[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]$/,
    "Invalid username format"
  );