const https = require('https');

const HYPIXEL_API_KEY = '42c346cf-6060-4ddd-beec-b0cad56d6e95';

exports.handler = async (event, context) => {
    // CORS 헤더 설정
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    // OPTIONS 요청 처리
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // 쿼리 파라미터에서 UUID 추출
    const uuid = event.queryStringParameters?.uuid;

    if (!uuid) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'UUID is required' }),
        };
    }

    return new Promise((resolve, reject) => {
        const apiUrl = `https://api.hypixel.net/player?key=${HYPIXEL_API_KEY}&uuid=${uuid}`;
        
        https.get(apiUrl, (apiRes) => {
            let data = '';
            
            apiRes.on('data', (chunk) => {
                data += chunk;
            });
            
            apiRes.on('end', () => {
                resolve({
                    statusCode: apiRes.statusCode,
                    headers,
                    body: data,
                });
            });
        }).on('error', (err) => {
            resolve({
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: err.message }),
            });
        });
    });
};
