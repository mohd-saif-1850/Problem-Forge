import { languageType } from "../models/submission.model";
import { Judge0Service } from "./judge0.service";

interface TestCase {
    input: string;
    expectedOutput: string;
}

interface TestCaseResult {
    success: boolean;
    status: string;
    passedTestCases: number;
    totalTestCases: number;
    executionTime: number;
    memoryUsed: number;
}

export const evaluateTestCases = async (
    sourceCode: string,
    language: languageType,
    testCases: TestCase[]
): Promise<TestCaseResult> => {

    let passedTestCases = 0;

    let executionTime = 0;
    let memoryUsed = 0;

    for (const testCase of testCases) {

        const result = await Judge0Service.executeCode(
            sourceCode,
            language,
            testCase.input
        );

        if (!result.success) {
            return {
                success: false,
                status: result.status,
                passedTestCases,
                totalTestCases: testCases.length,
                executionTime: result.executionTime,
                memoryUsed: result.memoryUsed
            };
        }

        const expectedOutput =
            testCase.expectedOutput.trim();

        const actualOutput =
            result.output?.trim() || "";

        if (expectedOutput !== actualOutput) {
            return {
                success: false,
                status: "Wrong Answer",
                passedTestCases,
                totalTestCases: testCases.length,
                executionTime: result.executionTime,
                memoryUsed: result.memoryUsed
            };
        }

        passedTestCases++;

        executionTime = Math.max(
            executionTime,
            result.executionTime
        );

        memoryUsed = Math.max(
            memoryUsed,
            result.memoryUsed
        );
    }

    return {
        success: true,
        status: "Accepted",
        passedTestCases,
        totalTestCases: testCases.length,
        executionTime,
        memoryUsed
    };
};