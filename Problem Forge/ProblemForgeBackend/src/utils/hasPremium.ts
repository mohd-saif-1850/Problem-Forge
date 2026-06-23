import { IUser } from "../models/user.model";

export const hasPremiumAccess = (
user: IUser
) => {

return (
    user.subscription.plan ===
        "premium" &&
    user.subscription.expiresAt !==
        null &&
    user.subscription.expiresAt >
        new Date()
);

};
