const getContestSchedule = () => {
    const now = new Date();

    const currentDay = now.getDay();

    const daysUntilFriday =
        currentDay <= 5
            ? 5 - currentDay
            : 5;

    const startTime = new Date(now);
    startTime.setDate(
        now.getDate() + daysUntilFriday
    );
    startTime.setHours(8, 0, 0, 0);

    const registrationDeadline = new Date(startTime);
    registrationDeadline.setMinutes(
        registrationDeadline.getMinutes() - 15
    );

    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + 2);
    endTime.setHours(23, 59, 59, 999);

    const rewardDistributionTime = new Date(endTime);
    rewardDistributionTime.setDate(
        rewardDistributionTime.getDate() + 1
    );
    rewardDistributionTime.setHours(8, 0, 0, 0);

    return {
        registrationDeadline,
        startTime,
        endTime,
        rewardDistributionTime
    };
};

export default getContestSchedule;