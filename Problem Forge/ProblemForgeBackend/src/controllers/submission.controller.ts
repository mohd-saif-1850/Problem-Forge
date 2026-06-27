import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Judge0Service } from "../services/judge0.service";
import apiResponse from "../utils/apiResponse";
import apiError from "../utils/apiError";
import { Problem } from "../models/problem.model";
import redis from "../config/redis";
import { statusType, Submission } from "../models/submission.model";
import { IUser, User } from "../models/user.model";
import { PointsHistory } from "../models/points.model";
import { updateStreak } from "../services/updateStreak";
import { hasPremiumAccess } from "../utils/hasPremium";

const submitProblem = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id;

    const {
        sourceCode,
        problemId,
        language,
        timeTaken
    } = req.body;

    if (!problemId) {
        throw new apiError(
            400,
            "Problem ID is required"
        );
    }

    if (!sourceCode) {
        throw new apiError(
            400,
            "Source code is required"
        );
    }

    if (!language) {
        throw new apiError(
            400,
            "Programming language is required"
        );
    }

    const problem = await Problem.findById(
        problemId
    )

    if (!problem) {
        throw new apiError(
            404,
            "Problem not found"
        );
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(400, "User not found")
    }

    if (!problem.isPublished) {
        throw new apiError(404, "Problem is not published yet")
    }
    if (problem.isPremium && !hasPremiumAccess(user)) {
        throw new apiError(401, "You need subscription to solve the premium problems")
    }

    const cooldownKey =
        `submission:${userId}:${problemId}`;

    const ttl = await redis.ttl(
        cooldownKey
    );

    if (ttl > 0) {
        throw new apiError(
            429,
            `Please wait ${ttl} seconds before submitting again.`
        );
    }

    let passedTestCases = 0;

    let status: statusType = "Accepted";

    let executionTime = 0;
    let memoryUsed = 0;

    let failureDetails = null;

    const allTestCases = [
        ...problem.testCases,
        ...problem.hiddenCases
    ];

    for (const testCase of allTestCases) {

        const result =
            await Judge0Service.executeCode(
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

            if (
                result.status ===
                "Compilation Error"
            ) {
                throw new apiError(
                    400,
                    result.error ||
                    "Compilation Error"
                );
            }

            status =
                result.status as statusType;

            failureDetails = {
                failedTestCase:
                    passedTestCases + 1,
                input: testCase.input,
                error: result.error
            };

            break;
        }

        const expectedOutput =
            testCase.expectedOutput.trim();

        const actualOutput =
            result.output?.trim() || "";

        if (
            actualOutput !==
            expectedOutput
        ) {
            status = "Wrong Answer";

            failureDetails = {
                failedTestCase:
                    passedTestCases + 1,
                input: testCase.input,
                expectedOutput,
                actualOutput
            };

            break;
        }

        passedTestCases++;
    }

    const alreadySubmitted = await Submission.findOne({
        submittedBy: userId,
        problem: problem._id,
        status: "Accepted"
    })

    if (status === "Accepted" && !alreadySubmitted && !problem.createdBy.equals(userId)) {
        const xpMap = {
            easy: 10,
            medium: 25,
            hard: 50
        };

        user.experiencePoints += xpMap[problem.difficulty];
        user.totalPoints += problem.points
        updateStreak(user)

        await user.save()

        await PointsHistory.create({
            user: user._id,
            type: "problem",
            points: problem.points,
            reason: "Problem Solved",
            metadata: {
                problemId: problem._id
            }
        });


        // Now to give the admin some bonus points
        const admin = await User.findById(problem.createdBy) as IUser

        admin.totalPoints += 10
        await admin.save()

        await PointsHistory.create({
            user: admin._id,
            type: "problem",
            points: 10,
            reason: "Problem Creation Reward",
            metadata: {
                problemId: problem._id
            }
        });

        // Now to set the problem submissions
        problem.totalSolvedUsers += 1
    }

    const submission =
        await Submission.create({
            submittedBy: userId,
            problem: problemId,

            code: sourceCode,
            language,

            status,

            testCasesPassed:
                passedTestCases,

            totalTestCases:
                allTestCases.length,

            executionTime,
            memoryUsed,

            timeTaken
        });

    await redis.set(
        cooldownKey,
        "submitted",
        "EX",
        60
    );

    // Now set the problem details
    problem.totalSubmissions += 1;
    if (status === "Accepted") {
        problem.totalAcceptedSubmissions += 1;
    }
    await problem.save()

    if (failureDetails) {
        return res.status(200).json(
            new apiResponse(
                200,
                status,
                {
                    submission,
                    ...failureDetails
                }
            )
        );
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Accepted",
            submission
        )
    );
};

const runProblem = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;

    const {
        sourceCode,
        problemId,
        language
    } = req.body;

    if (!problemId) {
        throw new apiError(
            400,
            "Problem ID is required"
        );
    }

    if (!sourceCode) {
        throw new apiError(
            400,
            "Source code is required"
        );
    }

    if (!language) {
        throw new apiError(
            400,
            "Programming language is required"
        );
    }

    const problem = await Problem.findById(
        problemId
    )

    if (!problem) {
        throw new apiError(
            404,
            "Problem not found"
        );
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(400, "User not found")
    }

    if (!problem.isPublished) {
        throw new apiError(404, "Problem is not published yet")
    }
    if (problem.isPremium && !hasPremiumAccess(user)) {
        throw new apiError(401, "You need subscription to solve the premium problems")
    }

    const results = [];

    for (const testCase of problem.testCases) {

        const result =
            await Judge0Service.executeCode(
                sourceCode,
                language,
                testCase.input
            );

        results.push({
            input: testCase.input,
            expectedOutput:
                testCase.expectedOutput,
            actualOutput:
                result.output || "",
            status: result.success
                ? (
                    result.output?.trim() ===
                    testCase.expectedOutput.trim()
                )
                    ? "Passed"
                    : "Failed"
                : result.status,
            executionTime:
                result.executionTime,
            memoryUsed:
                result.memoryUsed
        });
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Code executed successfully",
            {
                results
            }
        )
    );
}

const getMySubmissions = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id;

    if (!userId) {
        throw new apiError(404, "User Id not found.");
    }

    const currentPage = Math.max(Number(req.query.page) || 1, 1);
    const limit = 20;
    const skip = (currentPage - 1) * limit;

    const [submissions, totalSubmissions] = await Promise.all([
        Submission.find({
            submittedBy: userId
        })
            .populate("problem", "title slug difficulty")
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit),

        Submission.countDocuments({
            submittedBy: userId
        })
    ]);

    return res.status(200).json(
        new apiResponse(
            200,
            "Submissions fetched successfully.",
            {
                submissions,
                currentPage,
                totalPages: Math.ceil(totalSubmissions / limit),
                totalSubmissions,
                hasNextPage: currentPage * limit < totalSubmissions,
                hasPreviousPage: currentPage > 1
            }
        )
    );
};

const getSubmission = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id;

    const { submissionId } = req.params;

    if (!userId) {
        throw new apiError(404, "User Id not found.");
    }

    const submission = await Submission.findOne({
        _id: submissionId,
        submittedBy: userId
    }).populate(
        "problem",
        "title slug difficulty"
    );

    if (!submission) {
        throw new apiError(
            404,
            "Submission not found."
        );
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Submission fetched successfully.",
            submission
        )
    );
};

export {
    submitProblem,
    runProblem,
    getMySubmissions,
    getSubmission
}