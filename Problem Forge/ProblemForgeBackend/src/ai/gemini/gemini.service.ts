import { ai } from "./gemini";

export class AIService {
    static async generate(prompt: string) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            return response.text ?? "";
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw new Error("Failed to generate AI response");
        }
    }
}