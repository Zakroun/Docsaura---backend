module.exports = (req, res) => {
    res.status(200).json({
        success: true,
        name: "DocsAura API",
        version: "1.0.0",
        status: "running",
        description: "AI + Email Backend Service",
        endpoints: [
            {
                method: "POST",
                path: "/api/ai",
                description: "Send message to OpenAI and get AI response",
            },
            {
                method: "POST",
                path: "/api/sendMail",
                description: "Send email using Nodemailer",
            },
        ],
        author: "DocsAura Team",
        timestamp: new Date().toISOString(),
    });
};