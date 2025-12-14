// Script untuk memeriksa status backend server
const http = require('http');

const checkServer = (host, port) => {
    return new Promise((resolve) => {
        const req = http.request({
            host: host,
            port: port,
            path: '/api/health',
            method: 'GET',
            timeout: 5000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`✅ Backend server berjalan di ${host}:${port}`);
                console.log(`Status: ${res.statusCode}`);
                console.log(`Response: ${data}`);
                resolve(true);
            });
        });

        req.on('error', (err) => {
            console.log(`❌ Backend server tidak dapat diakses di ${host}:${port}`);
            console.log(`Error: ${err.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`⏰ Timeout saat mengakses ${host}:${port}`);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
};

const main = async () => {
    console.log('Memeriksa status backend server...\n');
    
    const isRunning = await checkServer('localhost', 8000);
    
    if (!isRunning) {
        console.log('\n📋 Langkah-langkah untuk menjalankan backend:');
        console.log('1. Buka terminal di folder backend');
        console.log('2. Jalankan: php artisan serve');
        console.log('3. Pastikan server berjalan di http://localhost:8000');
    }
};

main();