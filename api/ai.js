import Groq from "groq-sdk";
import cors from "../config/cors.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
    // CORS
    if (cors(req, res)) return;

    // Method check
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        const { query } = req.body || {};

        // Validation
        if (!query || typeof query !== "string") {
            return res.status(400).json({
                success: false,
                message: "Query is required and must be a string",
            });
        }

        // Call Groq API
        const response = await groq.chat.completions.create({
            model: "llama-3.1-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant.",
                },
                {
                    role: "user",
                    content: query,
                },
            ],
            temperature: 0.7,
        });

        const answer = response.choices?.[0]?.message?.content;

        return res.status(200).json({
            success: true,
            data: answer,
        });

    } catch (error) {
        console.error("GROQ ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}