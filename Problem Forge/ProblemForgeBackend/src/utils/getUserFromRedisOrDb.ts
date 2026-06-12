import redis from "../config/redis";
import { User } from "../models/user.model";
import cacheUser from "./cacheUser";

const getUserFromCacheOrDB =
    async (userId: string) => {
        const cachedUser =
            await redis.get(
                `session:user:${userId}`
            );

        if (cachedUser) {
            return JSON.parse(cachedUser);
        }

        const user =
            await User.findById(userId);

        if (!user) {
            return null;
        }

        await cacheUser(user);

        return user;
    };

export default getUserFromCacheOrDB