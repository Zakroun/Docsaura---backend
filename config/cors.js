const allowedOrigins = [
    'http://localhost:5173',
    'https://docsauraapi.vercel.app',
    'https://docsauraa.vercel.app',
];

function setCors(req, res) {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

export default function handler(req, res) {
    setCors(req, res);

    // 🚨 HANDLE PREFLIGHT FIRST
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    try {
        return res.status(200).json({
            success: true,
            message: "API working"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}