import { Request, Response } from "express"
import { AuthenticatedRequest } from "../middlewares/auth.middleware"
import { contestValidationSchema } from "../validation/contest/contest.validation";
import apiError from "../utils/apiError";
import { Contest } from "../models/contest.model";
import redis from "../config/redis";
import { User } from "../models/user.model";
import { hasPremiumAccess } from "../utils/hasPremium";
import slugify from "slugify";
import getContestSchedule from "../utils/getContestSchedule";
import apiResponse from "../utils/apiResponse";
import { PointsHistory } from "../models/points.model";
import { Follow } from "../models/follow.model";
import { Notification } from "../models/notification.model";
import mongoose from "mongoose";
import { Registration } from "../models/registration.model";
import { ContestSubmission, ContestSubmissionStatus } from "../models/contestSubmission.model";
import { Judge0Service } from "../services/judge0.service";

const createContest = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id

    if (!userId) {
        throw new apiError(404, "User Id not found")
    }

    const validationResult = contestValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
        throw new apiError(
            400,
            validationResult.error.issues[0].message
        );
    }

    const {
        title,
        problemStatement,
        description,

        difficulty,

        tags,

        examples,

        constraints,

        visibleTestCases,

        hiddenTestCases,

        visibility
    } = validationResult.data;

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(400, "User not found")
    }

    if (!hasPremiumAccess(user)) {
        throw new apiError(403, "Subscription required to create a contest.")
    }

    const day = new Date().getDay();
    const hour = new Date().getHours();

    if (
        day === 5 && hour >= 8 || // Friday after 8 AM
        day === 6 ||              // Saturday
        day === 0 ||              // Sunday
        (day === 1 && hour < 8)   // Monday before 8 AM
    ) {
        throw new apiError(
            400,
            "Contest creation is unavailable while the weekly contest is active."
        );
    }

    const dayTTL = await redis.ttl(
        `contest:day:limit:${userId}`
    )

    if (dayTTL > 0) {
        const hoursLeft = Math.ceil(dayTTL / 3600);
        throw new apiError(
            400,
            `You can create another contest in ${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}.`
        );
    }

    const cacheContestKey = `contest:creator:${userId}:active`;

    let activeContests = await redis.get(cacheContestKey) || 0;

    if (!activeContests) {
        activeContests = await Contest.countDocuments({
            createdBy: userId,
            status: {
                $in: ["upcoming", "running"]
            }
        });
    }

    if (Number(activeContests) >= 3) {
        throw new apiError(
            400,
            "You can only create 3 contests per week."
        );
    }


    const {
        registrationDeadline,
        startTime,
        endTime,
        rewardDistributionTime
    } = getContestSchedule();

    const existedTitle = await Contest.findOne({
        title,
        startTime
    })

    if (existedTitle) {
        throw new apiError(409, "A contest with this title already exists")
    }

    const slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
    });

    const contestEconomy = {
        easy: {
            creatorEntryCost: 600,
            creatorReward: 300,
            participantEntryCost: 30
        },

        medium: {
            creatorEntryCost: 1000,
            creatorReward: 500,
            participantEntryCost: 50
        },

        hard: {
            creatorEntryCost: 1400,
            creatorReward: 700,
            participantEntryCost: 70
        }
    } as const;

    const economy = contestEconomy[difficulty as keyof typeof contestEconomy];

    if (!economy) {
        throw new apiError(
            400,
            "Invalid contest difficulty."
        );
    }

    const {
        creatorEntryCost,
        creatorReward,
        participantEntryCost
    } = economy;

    if (user.totalPoints < creatorEntryCost) {
        throw new apiError(
            400,
            "You do not have enough points to create this contest."
        );
    }

    // Now transaction property of the MongoDb
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const [contest] = await Contest.create([{
            title,
            slug,
            problemStatement,
            description,
            difficulty,
            tags,
            constraints,
            examples,
            visibleTestCases,
            hiddenTestCases,
            createdBy: userId,
            creatorEntryCost,
            creatorReward,
            participantEntryCost,
            registrationDeadline,
            startTime,
            endTime,
            rewardDistributionTime,
            visibility
        }], { session })

        if (!contest) {
            throw new apiError(500, "Server failed to create contest")
        }

        // User part
        user.totalPoints -= creatorEntryCost;

        await user.save({ session });

        // History and notification
        await PointsHistory.create([{
            user: user._id,
            type: "contest",
            points: -creatorEntryCost,
            reason: "Contest Created",
            metadata: {
                contestId: contest._id
            }
        }], { session });

        const followers = await Follow.find({
            following: userId
        }).select("follower");

        if (followers.length > 0) {
            const notifications = followers.map((follow) => ({
                recipient: follow.follower,
                title: "New Contest Available",
                message: `${user.username} has created a new contest "${contest.title}".`,
                type: "contest",
                metadata: {
                    userId: user._id,
                    contestId: contest._id
                }
            }));

            await Notification.insertMany(notifications, { session });
        }

        await session.commitTransaction();

        // Redis set part

        const midnight = new Date();

        midnight.setDate(midnight.getDate() + 1);
        midnight.setHours(0, 0, 0, 0);

        await redis.set(
            `contest:day:limit:${userId}`,
            "true",
            "EXAT",
            Math.floor(midnight.getTime() / 1000)
        );

        const activeContestCount = await redis.incr(cacheContestKey);

        if (activeContestCount === 1) {
            const now = new Date();

            const monday8AM = new Date(now);

            // Days until next Monday
            const daysUntilMonday = (8 - now.getDay()) % 7 || 7;

            monday8AM.setDate(now.getDate() + daysUntilMonday);
            monday8AM.setHours(8, 0, 0, 0);

            await redis.expireat(
                cacheContestKey,
                Math.floor(monday8AM.getTime() / 1000)
            );
        }

        return res.status(201).json(
            new apiResponse(201, "Contest created successfully", contest)
        )
    } catch (error) {
        await session.abortTransaction();

        throw error;
    } finally {
        session.endSession();
    }
}

const registerContest = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id

    const { contestId } = req.params

    if (!userId) {
        throw new apiError(404, "User Id not found")
    }
    if (!contestId) {
        throw new apiError(400, "Contest Id is required")
    }

    const alreadyRegistered = await Registration.findOne({
        contest: contestId,
        participant: userId
    })

    if (alreadyRegistered) {
        throw new apiError(
            409,
            "You have already registered for this contest."
        );
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(404, "User not found")
    }

    const contest = await Contest.findById(contestId)

    if (!contest) {
        throw new apiError(404, "Contest not found")
    }

    if (contest.status !== "upcoming") {
        throw new apiError(
            400,
            "Registration for this contest is closed."
        );
    }

    if (new Date() > contest.registrationDeadline) {
        throw new apiError(
            400,
            "Registration deadline has passed."
        );
    }

    if (contest.totalParticipants >= contest.maxParticipants) {
        throw new apiError(
            400,
            "Contest is full."
        );
    }

    if (contest.createdBy.equals(user._id)) {
        throw new apiError(
            400,
            "You cannot register for your own contest."
        );
    }

    if (user.totalPoints < contest.participantEntryCost) {
        throw new apiError(400, "User don't have enough points to register the contest.")
    }

    if (contest.visibility === "followers") {
        const isFollower = await Follow.findOne({
            follower: userId,
            following: contest.createdBy
        });

        if (!isFollower) {
            throw new apiError(
                403,
                "You must follow the contest creator to register for this contest."
            );
        }
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const [register] = await Registration.create([{
            contest: contest._id,
            participant: user._id,
            entryFee: contest.participantEntryCost
        }], { session })

        user.totalPoints -= contest.participantEntryCost
        await user.save({ session })

        contest.totalParticipants++;

        await contest.save({ session });

        await PointsHistory.create([{
            user: user._id,
            type: "contest",
            points: -contest.participantEntryCost,
            reason: "Contest Registered",
            metadata: {
                contestId: contest._id
            }
        }], { session });

        await session.commitTransaction()

        return res.status(201).json(
            new apiResponse(201, "Registered successfully", register)
        )
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

const submitContest = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id

    const { contestId } = req.params

    const {
        sourceCode,
        language,
        timeTaken
    } = req.body;

    if (!userId) {
        throw new apiError(404, "User Id not found")
    }
    if (!contestId) {
        throw new apiError(400, "Contest Id is required")
    }

    if (!sourceCode) {
        throw new apiError(400, "Source Code is required")
    }
    if (!language) {
        throw new apiError(400, "Programming language is required")
    }

    const isRegistered = await Registration.findOne({
        contest: contestId,
        participant: userId
    })

    if (!isRegistered) {
        throw new apiError(400, "You are not registered for this contest")
    }

    const contest = await Contest.findById(contestId)

    if (!contest) {
        throw new apiError(400, "Contest not found")
    }
    if (contest.status === "upcoming") {
        throw new apiError(400, "This contest has not started yet")
    }
    if (contest.status === "ended") {
        throw new apiError(400, "This contest has already ended")
    }

    const submission = await ContestSubmission.findOne({
        contest: contestId,
        participant: userId
    });

    if (
        submission &&
        submission.attemptsLeft <= 0
    ) {
        throw new apiError(
            400,
            "You have no attempts remaining."
        );
    }
    if (submission?.status === "accepted") {
        throw new apiError(
            400,
            "You have already solved this contest."
        );
    }

    if (isRegistered.status === "disqualified") {
        throw new apiError(
            403,
            "You have been disqualified from this contest."
        );
    }

    if (contest.status === "cancelled") {
        throw new apiError(
            400,
            "This contest has been cancelled."
        );
    }

    // Judge 0 execution

    let passedTestCases = 0;

    let status: ContestSubmissionStatus = "accepted";

    let executionTime = 0;
    let memoryUsed = 0;

    const allTestCases = [
        ...contest.visibleTestCases,
        ...contest.hiddenTestCases
    ];

    for (const testCase of allTestCases) {

        const result = await Judge0Service.executeCode(
            sourceCode,
            language,
            testCase.input
        );

        executionTime = Math.max(
            executionTime,
            result.executionTime
        );

        memoryUsed = Math.max(
            memoryUsed,
            result.memoryUsed
        );

        if (!result.success) {

            switch (result.status) {

                case "Compilation Error":
                    throw new apiError(
                        400,
                        result.error || "Compilation Error"
                    );

                case "Time Limit Exceeded":
                    status = "time_limit_exceeded";
                    break;

                case "Runtime Error":
                    status = "runtime_error";
                    break;

                case "Memory Limit Exceeded":
                    status = "memory_limit_exceeded";
                    break;

                default:
                    status = "internal_error";
            }

            break;
        }

        const expectedOutput =
            testCase.expectedOutput.trim();

        const actualOutput =
            result.output?.trim() || "";

        if (actualOutput !== expectedOutput) {

            status = "wrong_answer";

            break;
        }

        passedTestCases++;
    }

    // XP Part

    const baseXp = {
        easy: 300,
        medium: 600,
        hard: 900
    } as const;

    const difficultyXp = baseXp[contest.difficulty];

    const attemptBonus = {
        2: 50,
        1: 25,
        0: 0
    } as const;

    let xp = 0;

    if (status === "accepted") {

        const timePenalty = Math.floor(timeTaken);

        xp = Math.max(
            100,
            difficultyXp -
            timePenalty +
            attemptBonus[
            (submission
                ? submission.attemptsLeft - 1
                : contest.maxAttempts - 1
            ) as keyof typeof attemptBonus
            ]
        );
    }

    if (!submission) {
        const submit = await ContestSubmission.create({
            contest: contest._id,
            participant: userId,

            sourceCode,
            language,

            status,

            attemptsLeft: contest.maxAttempts - 1,

            points: 0,
            xp,

            executionTime,
            memoryUsed,

            acceptedAt:
                status === "accepted"
                    ? new Date()
                    : undefined
        });
    } else {
        submission.sourceCode = sourceCode;
        submission.language = language;
        submission.status = status;
        submission.executionTime = executionTime;
        submission.memoryUsed = memoryUsed;
        submission.attemptsLeft -= 1;
        submission.xp = xp;

        if (
            status === "accepted" &&
            !submission.acceptedAt
        ) {
            submission.acceptedAt = new Date();
        }

        await submission.save();
    }

    return res.status(200).json(
        new apiResponse(200, "Contest submitted successfully")
    )

}

const getContestLeaderboard = async (
    req: Request,
    res: Response
) => {
    const { contestId } = req.params;

    if (!contestId) {
        throw new apiError(
            400,
            "Contest Id is required"
        );
    }

    const contest = await Contest.findById(contestId);

    if (!contest) {
        throw new apiError(
            404,
            "Contest not found"
        );
    }

    const leaderboard = await ContestSubmission.find({
        contest: contestId,
        status: "accepted"
    })
        .populate({
            path: "participant",
            select: "username profilePicture totalPoints experiencePoints"
        })
        .sort({
            xp: -1,
            acceptedAt: 1
        });

    const rankedLeaderboard = leaderboard.map(
        (submission, index) => ({
            rank: index + 1,
            participant: submission.participant,
            xp: submission.xp,
            points: submission.points,
            executionTime: submission.executionTime,
            memoryUsed: submission.memoryUsed,
            acceptedAt: submission.acceptedAt
        })
    );

    return res.status(200).json(
        new apiResponse(
            200,
            "Contest leaderboard fetched successfully",
            rankedLeaderboard
        )
    );
};



export {
    createContest,
    registerContest,
    submitContest,
    getContestLeaderboard
}