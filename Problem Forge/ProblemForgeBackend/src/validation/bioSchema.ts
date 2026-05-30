import { z } from "zod";

export const bioSchema = z
  .string()
  .trim()
  .max(300, "Bio cannot exceed 300 characters")
  .optional();