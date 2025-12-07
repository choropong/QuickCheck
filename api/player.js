const https = require('https');

const HYPIXEL_API_KEY = '42c346cf-6060-4ddd-beec-b0cad56d6e95';

module.exports = async (req, res) => {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { uuid } = req.query;
    
    if (!uuid) {
        return res.status(400).json({ error: 'UUID is required' });
    }

    return new Promise((resolve) => {
        const apiUrl = `https://api.hypixel.net/player?key=${HYPIXEL_API_KEY}&uuid=${uuid}`;
        
        https.get(apiUrl, (apiRes) => {
            let data = '';
            
            apiRes.on('data', (chunk) => {
                data += chunk;
            });
            
            apiRes.on('end', () => {
                res.status(apiRes.statusCode).json(JSON.parse(data));
                resolve();
            });
        }).on('error', (err) => {
            res.status(500).json({ error: err.message });
            resolve();
        });
    });
};
