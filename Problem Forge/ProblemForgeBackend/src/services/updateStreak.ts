import { IUser } from "../models/user.model";

export const updateStreak = (user: IUser) => {
    const today = new Date();

    const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    if (!user.lastSolvedDate) {
        user.streaks = 1;
        user.lastSolvedDate = today;
        return;
    }

    const lastSolvedStart = new Date(
        user.lastSolvedDate.getFullYear(),
        user.lastSolvedDate.getMonth(),
        user.lastSolvedDate.getDate()
    );

    const diffInDays = Math.floor(
        (todayStart.getTime() - lastSolvedStart.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
        // Already solved today
        return;
    }

    if (diffInDays === 1) {
        user.streaks += 1;
    } else {
        user.streaks = 1;
    }

    user.lastSolvedDate = today;
};