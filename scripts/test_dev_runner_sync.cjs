// Archivo: scripts/test_dev_runner_sync.cjs
// Test de certificación para arranque sincronizado y erradicación de race condition ECONNREFUSED

const { spawn, execSync } = require('child_process');
const http = require('http');
const net = require('net');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';

function killPort(port) {
    if (!isWin) return;
    try {
        const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8', timeout: 2000 });
        for (const line of out.trim().split('\n')) {
            if (line.includes('LISTENING')) {
                const pid = line.trim().split(/\s+/).pop();
                if (pid && pid !== '0' && pid !== String(process.pid)) {
                    execSync(`taskkill /F /PID ${pid} /T`, { stdio: 'ignore', timeout: 2000 });
                }
            }
        }
    } catch (e) {}
}

function probePort(port, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
            const socket = net.createConnection({ port, host: '127.0.0.1' });
            socket.on('connect', () => {
                socket.destroy();
                resolve(true);
            });
            socket.on('error', () => {
                socket.destroy();
                if (Date.now() - start > timeoutMs) {
                    reject(new Error(`Timeout de ${timeoutMs}ms esperando puerto ${port}`));
                } else {
                    setTimeout(check, 100);
                }
            });
        };
        check();
    });
}

function fetchHttp(url, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, { timeout: timeoutMs }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('HTTP timeout')); });
    });
}

async function runTest() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🧪 TEST: CERTIFICACIÓN DE ARRANQUE SINCRONIZADO DUAL (:5006 -> :5005)');
    console.log('════════════════════════════════════════════════════════════════════\n');

    killPort(5005);
    killPort(5006);

    let outputLog = '';
    let hasProxyError = false;

    console.log('1. Lanzando Orquestador Dual (node scripts/dev_runner.js)...');
    const runner = spawn('node', ['scripts/dev_runner.js'], {
        cwd: ROOT_DIR,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    runner.stdout.on('data', (data) => {
        const str = data.toString();
        outputLog += str;
        process.stdout.write(`   [Runner STDOUT] ${str}`);
    });

    runner.stderr.on('data', (data) => {
        const str = data.toString();
        outputLog += str;
        if (str.includes('ECONNREFUSED') || str.includes('http proxy error')) {
            hasProxyError = true;
        }
        process.stderr.write(`   [Runner STDERR] ${str}`);
    });

    try {
        console.log('\n2. Esperando que el Backend levante en :5006...');
        await probePort(5006, 12000);
        console.log('   ✅ Backend activo en puerto 5006.');

        console.log('\n3. Esperando que Vite SPA levante en :5005...');
        await probePort(5005, 12000);
        console.log('   ✅ Vite SPA activo en puerto 5005.');

        console.log('\n4. Verificando endpoint /api/health a través del proxy de Vite (:5005 -> :5006)...');
        const resViteProxy = await fetchHttp('http://localhost:5005/api/health');
        console.log(`   📡 Código HTTP vía Proxy :5005: ${resViteProxy.statusCode}`);
        const parsed = JSON.parse(resViteProxy.body);
        console.log(`   🩺 Estado reportado por Backend: ${parsed.status} (${parsed.engine})`);

        if (resViteProxy.statusCode === 200 && parsed.status === 'HEALTHY') {
            console.log('   ✅ [PASS] Proxy Vite respondió 200 OK inmediatamente sin race condition.');
        } else {
            throw new Error(`Respuesta inesperada: ${resViteProxy.statusCode} - ${resViteProxy.body}`);
        }

        if (hasProxyError) {
            throw new Error('❌ Fallo: Se detectaron errores ECONNREFUSED en la salida de consola de Vite.');
        } else {
            console.log('   ✅ [PASS] 0 errores ECONNREFUSED o [vite] http proxy error detectados.');
        }

        console.log('\n════════════════════════════════════════════════════════════════════');
        console.log('🎯 RESULTADO: ARRANQUE DUAL 100% SINCRONIZADO Y EN VERDE ABSOLUTO');
        console.log('════════════════════════════════════════════════════════════════════\n');
    } finally {
        console.log('5. Deteniendo servicios de prueba...');
        try { runner.kill('SIGTERM'); } catch (e) {}
        killPort(5005);
        killPort(5006);
    }
}

runTest().catch((err) => {
    console.error('\n❌ ERROR EN TEST:', err.message);
    killPort(5005);
    killPort(5006);
    process.exit(1);
});
