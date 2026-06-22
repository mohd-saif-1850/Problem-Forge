import axios from "axios";
import { JUDGE0_CONFIG } from "../config/judge0";
import { languageType } from "../models/submission.model";
import { LANGUAGE_IDS } from "../config/languages";

export interface Judge0Result {
    success: boolean;
    status: string;
    output: string | null;
    error: string | null;
    executionTime: number;
    memoryUsed: number;
}

interface Judge0Response {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message: string | null;
    status: {
        id: number;
        description: string;
    };
    time: string | null;
    memory: number | null;
}

export class Judge0Service {
    static async executeCode(
        sourceCode: string,
        language: languageType,
        stdin = ""
    ): Promise<Judge0Result> {
        try {
            const languageId = LANGUAGE_IDS[language];

            const { data } = await axios.post<Judge0Response>(
                `${JUDGE0_CONFIG.baseUrl}/submissions?base64_encoded=false&wait=true`,
                {
                    source_code: sourceCode,
                    language_id: languageId,
                    stdin
                }
            );

            const output =
                data.stdout ??
                data.stderr ??
                data.compile_output ??
                data.message ??
                null;

            return {
                success: data.status.id === 3,
                status: data.status.description,
                output,
                error:
                    data.stderr ||
                    data.compile_output ||
                    data.message ||
                    null,
                executionTime: Number(data.time ?? 0),
                memoryUsed: data.memory ?? 0
            };
        } catch (error) {
            console.error("Judge0 Execution Error:", error);

            throw new Error("Failed to execute code");
        }
    }
}