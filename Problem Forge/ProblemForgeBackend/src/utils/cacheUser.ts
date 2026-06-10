import redis from "../config/redis"
import { IUser } from "../models/user.model"

const SESSION_TTL =
    14 * 24 * 60 * 60

const cacheUser = async (
    user: IUser
) => {
    await redis.set(
        `session:user:${user._id}`,
        JSON.stringify({
            _id: user._id,
            name: user.name || "",
            username: user.username,
            profilePicture: user.profilePicture,
            bio: user.bio,
            totalPoints: user.totalPoints,
            experiencePoints: user.experiencePoints,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
            role: user.role,
            subscription: user.subscription,

            //extra
            preferredLanguage: user.preferredLanguage,
            timer: user.enableProblemTimer,

            // Github
            githubUsername: user.gitUsername || "",

        }),
        "EX",
        SESSION_TTL
    )
}

export default cacheUser