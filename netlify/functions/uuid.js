const https = require('https');

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

    // 쿼리 파라미터에서 username 추출
    const username = event.queryStringParameters?.username;

    if (!username) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Username is required' }),
        };
    }

    return new Promise((resolve, reject) => {
        const apiUrl = `https://api.mojang.com/users/profiles/minecraft/${username}`;
        
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
