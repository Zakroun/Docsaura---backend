import { openai } from "../config/openai.js";
const cors = require("../config/cors.js");
export default async function handler(req, res) {
    if (cors(req, res)) return;
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    try {
        const { message } = req.body || {};
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: message,
        });
        return res.status(200).json({
            reply: response.output[0].content[0].text,
        });
    } catch (error) {
        console.error("AI ERROR:", error);
        return res.status(500).json({
            error: "Something went wrong",
            details: error.message,
        });
    }
}