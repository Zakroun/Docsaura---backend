import { openai } from "../config/openai.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { message } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: message }],
        });

        return res.status(200).json({
            reply: response.choices[0].message.content,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}