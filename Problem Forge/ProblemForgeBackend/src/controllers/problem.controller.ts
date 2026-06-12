import { Request,Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { problemValidationSchema } from "../validation/problem/problemValidation";
import apiError from "../utils/apiError";
import apiResponse from "../utils/apiResponse";
import { User } from "../models/user.model";
import redis from "../config/redis";
import cacheUser from "../utils/cacheUser";
import getUserFromCacheOrDB from "../utils/getUserFromRedisOrDb";
import { Problem } from "../models/problem.model";
import slugify from "slugify";

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

    if(!validationResult.success){
        throw new apiError(400,validationResult.error.issues[0].message)
    }

    const createdBeforeTtl = await redis.ttl(
        `created:problem:${createdBy}`
    )

    if(createdBeforeTtl > 0){
        const minutes = Math.floor(createdBeforeTtl / 60);
        const seconds = createdBeforeTtl % 60;
        throw new apiError(
            429,
            `You can only create one problem within 60 minutes. Try again in ${minutes}m ${seconds}s.`
        );
    }

    const user = await getUserFromCacheOrDB(createdBy)

    if(!user){
        throw new apiError(404,"User not found")
    }
    if(!user.subscription){
        throw new apiError(403,"Subscription required to create a problem.")
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

const getProblem = async (
    req: Request,
    res: Response
) => {

    const problem = await Problem
        .findOne({ title: "Two Sum" })
        .select("-hiddenCases -referenceSolution");

    if (!problem) {
        throw new apiError(
            404,
            "Problem not found"
        );
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Problem fetched successfully",
            problem
        )
    );
};

export {
    createProblem,
    getProblem
}