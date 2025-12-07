const https = require('https');

module.exports = async (req, res) => {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { username } = req.query;
    
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    return new Promise((resolve) => {
        const apiUrl = `https://api.mojang.com/users/profiles/minecraft/${username}`;
        
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
