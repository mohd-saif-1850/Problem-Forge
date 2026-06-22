import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Judge0Service } from "../services/judge0.service";
import apiResponse from "../utils/apiResponse";
import apiError from "../utils/apiError";
import { Problem } from "../models/problem.model";
import redis from "../config/redis";
import { statusType, Submission } from "../models/submission.model";

const submitProblem = async (
    req: AuthenticatedRequest,
    res: Response
) => {
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
    ).select(
        "testCases hiddenCases timeLimit memoryLimit"
    );

    if (!problem) {
        throw new apiError(
            404,
            "Problem not found"
        );
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
            memoryUsed
        });

    await redis.set(
        cooldownKey,
        "submitted",
        "EX",
        60
    );

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



// const testJudge0 = async (
//     req: Request,
//     res: Response
// ) => {
//     try {
//         const {
//             sourceCode,
//             language,
//             stdin
//         } = req.body;

//         if (!sourceCode || !language) {
//             res.status(400).json({
//                 success: false,
//                 message: "Source code and language are required"
//             });
//             return;
//         }

//         const result = await Judge0Service.executeCode(
//             sourceCode,
//             language,
//             stdin ?? ""
//         );

//         res.status(200).json({
//             success: true,
//             data: result
//         });

//     } catch (error: any) {
//         console.error("Judge0 Execution Error:", error);

//         if (error.response?.data?.error) {
//             res.status(400).json(
//                 new apiResponse(
//                     400,
//                     error.response.data.error,
//                     null
//                 )
//             );
//             return;
//         }

//         res.status(500).json(
//             new apiResponse(
//                 500,
//                 "Failed to execute code",
//                 null
//             )
//         );
//         return;
//     }
// };

export {
    submitProblem
}