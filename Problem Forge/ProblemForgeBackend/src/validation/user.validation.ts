import { ZodType } from "zod";
import apiError from "../utils/apiError";

import { emailSchema } from "./emailSchema";
import { usernameSchema } from "./usernameSchema";
import { passwordSchema } from "./passwordSchema";
import { bioSchema } from "./bioSchema";
import { nameSchema } from "./nameSchema";

const createValidator = <T>(schema: ZodType<T>) => ({
    parse: (value: unknown): T => {
        const result = schema.safeParse(value);

        if (!result.success) {
            throw new apiError(
                400,
                result.error.issues[0]?.message || "Validation failed"
            );
        }

        return result.data;
    },
});

export const userValidation = {
    email: createValidator(emailSchema),
    username: createValidator(usernameSchema),
    password: createValidator(passwordSchema),
    bio: createValidator(bioSchema),
    name: createValidator(nameSchema),
};