const http = require('http');
const https = require('https');
const url = require('url');

const HYPIXEL_API_KEY = '52f52e6a-d53b-4d80-8730-ab96d3d8a34d';
const PORT = 3000;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // UUID endpoint
    if (pathname.startsWith('/api/uuid/')) {
        const username = pathname.split('/api/uuid/')[1];
        const apiUrl = `https://api.mojang.com/users/profiles/minecraft/${username}`;
        
        console.log(`Fetching UUID for: ${username}`);
        
        https.get(apiUrl, (apiRes) => {
            let data = '';
            
            apiRes.on('data', (chunk) => {
                data += chunk;
            });
            
            apiRes.on('end', () => {
                res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
                res.end(data);
                console.log(`UUID response for ${username}:`, apiRes.statusCode);
            });
        }).on('error', (err) => {
            console.error('UUID fetch error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        });
    }
    // Hypixel stats endpoint
    else if (pathname.startsWith('/api/player/')) {
        const uuid = pathname.split('/api/player/')[1];
        const apiUrl = `https://api.hypixel.net/player?key=${HYPIXEL_API_KEY}&uuid=${uuid}`;
        
        console.log(`Fetching Hypixel stats for UUID: ${uuid}`);
        
        https.get(apiUrl, (apiRes) => {
            let data = '';
            
            apiRes.on('data', (chunk) => {
                data += chunk;
            });
            
            apiRes.on('end', () => {
                res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
                res.end(data);
                console.log(`Hypixel response for ${uuid}:`, apiRes.statusCode);
            });
        }).on('error', (err) => {
            console.error('Hypixel fetch error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        });
    }
    // Serve index.html
    else if (pathname === '/' || pathname === '/index.html') {
        const fs = require('fs');
        fs.readFile('./index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 Proxy server running at http://localhost:${PORT}/`);
    console.log(`📊 Open your browser to view the stats checker`);
    console.log(`\nPress CTRL+C to stop\n`);
});
