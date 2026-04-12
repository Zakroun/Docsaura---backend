// api/home.js
module.exports = (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DocsAura API</title>
</head>
<body>
    <h1>DocsAura API</h1>
    <p>Welcome to the DocsAura API!</p>
    <h2>Available Endpoints:</h2>
    <ul>
        <li><strong>POST /api/ai</strong> - Send message to OpenAI and get AI response</li>
        <li><strong>POST /api/sendMail</strong> - Send email using Nodemailer</li>
    </ul>
    <p>Author: DocsAura Team</p>
    <p>Status: Running</p>
    <p>Version: 1.0.0</p>
    <p>Timestamp: ${new Date().toISOString()}</p>
</body>
</html>
    `);
};