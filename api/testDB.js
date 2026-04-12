import { connectDB } from "../config/db.js";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        await connectDB();

        return res.status(200).json({
            success: true,
            message: "Database connected successfully ✅",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("DB ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Database connection failed ❌",
            error: error.message,
        });
    }
}