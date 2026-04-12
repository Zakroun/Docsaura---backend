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

export default async function handler(req, res) {

    // 🚨 MUST BE FIRST
    setCors(req, res);

    // 🚨 HANDLE PRE-FLIGHT
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    // rest of your logic...
    return res.status(200).json({ ok: true });
}