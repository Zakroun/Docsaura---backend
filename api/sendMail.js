import { transporter } from "../config/mailer.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { to, subject, text } = req.body;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });

        return res.status(200).json({ message: "Email sent" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}