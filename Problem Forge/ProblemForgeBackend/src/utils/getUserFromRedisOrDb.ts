import redis from "../config/redis";
import { User } from "../models/user.model";

const getUserFromCacheOrDB =
    async (userId: string) => {

        const user =
            await User.findById(userId);

        if (!user) {
            return null;
        }

        return user;
    };

export default getUserFromCacheOrDB