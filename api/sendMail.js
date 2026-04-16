import { transporter } from "../config/mailer.js";
import { getUserTemplate, getAdminTemplate } from "../utils/emailTemplates.js";

const cors = require('../config/cors');

export default async function handler(req, res) {
    if (cors(req, res)) return;

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { name, email, message, lang } = req.body;

        // 1️⃣ Email to USER
        const userEmail = getUserTemplate({
            name,
            message,
            lang,
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: userEmail.subject,
            html: userEmail.html,
        });

        // 2️⃣ Email to ADMIN
        const adminEmail = getAdminTemplate({
            name,
            email,
            message,
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.CONTACT_EMAIL, // put your email here
            subject: adminEmail.subject,
            html: adminEmail.html,
        });

        return res.status(200).json({ message: "Emails sent successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}