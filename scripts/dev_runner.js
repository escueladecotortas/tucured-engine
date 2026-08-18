// Archivo: scripts/dev_runner.js
// Orquestador Dual Desacoplado: Backend Express (:5006) + Frontend Vite (:5005)

import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

// Limpieza preventiva de puertos 5005 y 5006 para erradicar EADDRINUSE
killPort(5005);
killPort(5006);

console.log('🚀 [TUCURED-ENGINE] Iniciando Orquestador Dual...');
console.log('   📡 Backend Express -> http://localhost:5006');
console.log('   ✨ Frontend Vite SPA -> http://localhost:5005 (Proxy /api -> :5006)\n');

// 1. Iniciar Backend Express en :5006
const backendProcess = isWin
    ? spawn('cmd.exe', ['/c', 'set PORT=5006& set BACKEND_PORT=5006& node backend/server.js'], {
        cwd: ROOT_DIR, windowsHide: true, stdio: 'inherit'
    })
    : spawn(process.execPath, [path.join(ROOT_DIR, 'backend/server.js')], {
        cwd: ROOT_DIR, env: { ...process.env, PORT: '5006', BACKEND_PORT: '5006' }, stdio: 'inherit'
    });

// 2. Iniciar Frontend Vite en :5005
const frontendProcess = isWin
    ? spawn('cmd.exe', ['/c', 'npx vite --port 5005 --host'], {
        cwd: ROOT_DIR, windowsHide: true, stdio: 'inherit'
    })
    : spawn('npx', ['vite', '--port', '5005', '--host'], {
        cwd: ROOT_DIR, stdio: 'inherit'
    });

function cleanup() {
    console.log('\n🛑 [TUCURED-ENGINE] Deteniendo servicios...');
    try { backendProcess.kill('SIGTERM'); } catch (e) {}
    try { frontendProcess.kill('SIGTERM'); } catch (e) {}
    killPort(5005);
    killPort(5006);
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
