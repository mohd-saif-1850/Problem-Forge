import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { problemValidationSchema, updateProblemSchema } from "../validation/problem/problemValidation";
import apiError from "../utils/apiError";
import apiResponse from "../utils/apiResponse";
import { User } from "../models/user.model";
import redis from "../config/redis";
import getUserFromCacheOrDB from "../utils/getUserFromRedisOrDb";
import { Problem } from "../models/problem.model";
import slugify from "slugify";
import { hasPremiumAccess } from "../utils/hasPremium";
import { Submission } from "../models/submission.model";
import { createNotification } from "../services/notification.service";

const createProblem = async (req: AuthenticatedRequest, res: Response) => {
    const createdBy = req.user._id;

    const {
        title,
        problemStatement,
        description,
        difficulty,
        constraints,
        examples,
        testCases,
        hiddenCases,
        tags,
        referenceSolution,
        timeLimit,
        memoryLimit,
        isPremium,
    } = req.body;

    const validationResult = problemValidationSchema.safeParse(req.body)

    if (!validationResult.success) {
        throw new apiError(400, validationResult.error.issues[0].message)
    }

    const createdBeforeTtl = await redis.ttl(
        `created:problem:${createdBy}`
    )

    if (createdBeforeTtl > 0) {
        const minutes = Math.floor(createdBeforeTtl / 60);
        const seconds = createdBeforeTtl % 60;
        throw new apiError(
            429,
            `You can only create one problem within 60 minutes. Try again in ${minutes}m ${seconds}s.`
        );
    }

    const user = await getUserFromCacheOrDB(createdBy)

    if (!user) {
        throw new apiError(404, "User not found")
    }
    if (!hasPremiumAccess(user)) {
        throw new apiError(403, "Subscription required to create a problem.")
    }

    const existingProblem = await Problem.findOne({
        title
    });

    if (existingProblem) {
        throw new apiError(
            409,
            "A problem with this title already exists."
        );
    }

    const slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
    });

    const lastProblem = await Problem
        .findOne()
        .sort({ problemNumber: -1 })
        .select("problemNumber");

    const problemNumber =
        (lastProblem?.problemNumber || 0) + 1;

    const pointsMap = {
        easy: 50,
        medium: 70,
        hard: 100,
    };

    const points = pointsMap[difficulty as keyof typeof pointsMap] + (isPremium ? 10 : 0);

    const isMain = user.role === "admin";

    const problem = await Problem.create({
        problemNumber,

        title,
        slug,
        problemStatement,
        description,
        difficulty,
        points,
        constraints,
        examples,
        testCases,
        hiddenCases,
        tags,
        referenceSolution,
        timeLimit,
        memoryLimit,
        isPremium,
        createdBy,
        isMain
    });

    await redis.set(
        `created:problem:${createdBy}`,
        "yes",
        "EX",
        60 * 60
    );

    return res.status(201).json(
        new apiResponse(
            201,
            "Problem created successfully",
            problem
        )
    );

}

const updateProblem = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const { problemId } = req.params

    const {
        title,
        problemStatement,
        description,
        constraints,
        examples,
        tags,
        timeLimit,
        memoryLimit
    } = req.body;

    if (!problemId) {
        throw new apiError(400, "Problem id is required")
    }

    const validationResult = updateProblemSchema.safeParse(req.body)

    if (!validationResult.success) {
        throw new apiError(400, validationResult.error.issues[0].message)
    }

    const existingProblem = await Problem.findOne({
        title,
        _id: { $ne: problemId }
    });

    if (existingProblem) {
        throw new apiError(
            409,
            "A problem with this title already exists"
        );
    }

    const problem = await Problem.findById(problemId)

    if (!problem) {
        throw new apiError(404, "Problem not found")
    }
    if (!problem.createdBy.equals(userId) && req.user.role !== "admin") {
        throw new apiError(403, "You are not the creator. You can't update the problem details.")
    }

    const slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
    });

    // Update

    problem.title = title;
    problem.slug = slug;

    problem.problemStatement = problemStatement;
    problem.description = description;

    problem.constraints = constraints;
    problem.examples = examples;

    problem.tags = tags;

    problem.timeLimit = timeLimit;
    problem.memoryLimit = memoryLimit;

    await problem.save()

    return res.status(200).json(
        new apiResponse(200, "Problem updated successfully")
    )

}

const getCurrentProblem = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id

    const { slug } = req.params

    if (!slug) {
        throw new apiError(400, "Problem slug is required")
    }

    if (!userId) {
        throw new apiError(404, "User Id required")
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new apiError(400, "User not found")
    }

    const problem = await Problem
        .findOne({ slug })
        .select("-hiddenCases -referenceSolution")
        .lean();

    if (!problem) {
        throw new apiError(
            404,
            "Problem not found"
        );
    }
    if (problem.isPremium && !hasPremiumAccess(user)) {
        throw new apiError(403, "You need subscription for this problem.")
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Problem fetched successfully",
            problem
        )
    );
};

const searchProblems = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const { query } = req.query;

    if (!query) {
        throw new apiError(
            400,
            "Search query is required"
        );
    }

    const searchTerm = query.toString();

    const problems = await Problem.find({
        $or: [
            {
                title: {
                    $regex: searchTerm,
                    $options: "i",
                },
            },
            {
                slug: {
                    $regex: searchTerm,
                    $options: "i",
                },
            },
            {
                tags: {
                    $regex: searchTerm,
                    $options: "i",
                },
            },
            {
                difficulty: {
                    $regex: searchTerm,
                    $options: "i",
                },
            },
            {
                problemNumber: Number(searchTerm) || -1,
            },
        ],
    })
        .select("-hiddenCases -referenceSolution")
        .lean();

    return res.status(200).json(
        new apiResponse(
            200,
            "Problems fetched successfully",
            problems
        )
    );
};

const getAllProblems = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalProblems = await Problem.countDocuments();

    const problems = await Problem
        .find()
        .select("-hiddenCases -referenceSolution")
        .skip(skip)
        .limit(limit)
        .lean();

    return res.status(200).json(
        new apiResponse(
            200,
            "Problems fetched successfully",
            {
                page,
                totalPages: Math.ceil(
                    totalProblems / limit
                ),
                totalProblems,
                problems,
            }
        )
    );
};

const getMainProblems = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalProblems = await Problem.countDocuments({
        isMain: true,
    });

    const problems = await Problem
        .find({
            isMain: true,
        })
        .select("-hiddenCases -referenceSolution")
        .skip(skip)
        .limit(limit)
        .lean();

    return res.status(200).json(
        new apiResponse(
            200,
            "Main problems fetched successfully",
            {
                page,
                totalPages: Math.ceil(
                    totalProblems / limit
                ),
                totalProblems,
                problems,
            }
        )
    );
};

const getMyProblems = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalProblems = await Problem.countDocuments({
        createdBy: userId,
    });

    const problems = await Problem
        .find({
            createdBy: userId,
        })
        .select("-hiddenCases -referenceSolution")
        .skip(skip)
        .limit(limit)
        .lean();

    return res.status(200).json(
        new apiResponse(
            200,
            "Problems fetched successfully",
            {
                page,
                totalPages: Math.ceil(
                    totalProblems / limit
                ),
                totalProblems,
                problems,
            }
        )
    );
};

const deleteProblem = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user._id;

    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);

    if (!problem) {
        throw new apiError(404, "Problem not found.");
    }

    const isCreator = problem.createdBy.toString() === userId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
        throw new apiError(
            403,
            "You are not authorized to delete this problem."
        );
    }

    const participants = await Submission.distinct("submittedBy", {
        problem: problem._id
    });

    await Promise.all([
        ...participants.map(participant =>
            createNotification({
                recipient: participant,
                title: "Problem Removed",
                message: `The problem "${problem.title}" has been removed and is no longer available. Thank you for your participation.`,
                type: "problem",
                metadata: {}
            })
        ),

        Submission.deleteMany({
            problem: problem._id
        }),

        problem.deleteOne()
    ]);

    return res.status(200).json(
        new apiResponse(
            200,
            "Problem deleted successfully."
        )
    );
};

export {
    createProblem,
    updateProblem,
    getCurrentProblem,
    searchProblems,
    getAllProblems,
    getMainProblems,
    getMyProblems,
    deleteProblem
}