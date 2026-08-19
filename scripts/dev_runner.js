// Archivo: scripts/dev_runner.js
// Orquestador Dual Sincronizado y Resiliente: Backend Express (:5006) -> Frontend Vite (:5005)

import { spawn, execSync } from 'child_process';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';

let backendProcess = null;
let frontendProcess = null;
let isShuttingDown = false;
let restartTimeout = null;
let frontendRestartTimeout = null;

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

function waitForPort(port, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
            const socket = net.createConnection({ port, host: '127.0.0.1' });
            socket.on('connect', () => {
                socket.destroy();
                resolve();
            });
            socket.on('error', () => {
                socket.destroy();
                if (Date.now() - start > timeoutMs) {
                    reject(new Error(`Timeout de ${timeoutMs}ms esperando el puerto ${port}`));
                } else {
                    setTimeout(check, 100);
                }
            });
        };
        check();
    });
}

function cleanup() {
    if (isShuttingDown) return;
    isShuttingDown = true;
    clearTimeout(restartTimeout);
    clearTimeout(frontendRestartTimeout);
    console.log('\n🛑 [TUCURED-ENGINE] Deteniendo servicios...');
    try { if (backendProcess) backendProcess.kill('SIGTERM'); } catch (e) {}
    try { if (frontendProcess) frontendProcess.kill('SIGTERM'); } catch (e) {}
    killPort(5005);
    killPort(5006);
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

function spawnBackend() {
    if (isShuttingDown) return;

    backendProcess = isWin
        ? spawn('cmd.exe', ['/c', 'set PORT=5006& set BACKEND_PORT=5006& node backend/server.js'], {
            cwd: ROOT_DIR, windowsHide: true, stdio: 'inherit'
        })
        : spawn(process.execPath, [path.join(ROOT_DIR, 'backend/server.js')], {
            cwd: ROOT_DIR, env: { ...process.env, PORT: '5006', BACKEND_PORT: '5006' }, stdio: 'inherit'
        });

    backendProcess.on('exit', (code, signal) => {
        if (isShuttingDown) return;
        console.warn(`\n🔄 [TUCURED-ENGINE] Backend Express finalizó/reinició (código: ${code}, señal: ${signal}). Reconexión resiliente activa...`);
        clearTimeout(restartTimeout);
        restartTimeout = setTimeout(async () => {
            killPort(5006);
            spawnBackend();
            try {
                await waitForPort(5006, 15000);
                console.log('   ✅ [TUCURED-ENGINE] Backend Express reconectado y respondiendo en :5006.');
            } catch (e) {
                console.warn('   ⏳ [TUCURED-ENGINE] Esperando estabilización del backend en :5006...');
            }
        }, 800);
    });
}

function spawnFrontend() {
    if (isShuttingDown) return;

    frontendProcess = isWin
        ? spawn('cmd.exe', ['/c', 'npx vite --port 5005 --host'], {
            cwd: ROOT_DIR, windowsHide: true, stdio: 'inherit'
        })
        : spawn('npx', ['vite', '--port', '5005', '--host'], {
            cwd: ROOT_DIR, stdio: 'inherit'
        });

    frontendProcess.on('exit', (code, signal) => {
        if (isShuttingDown) return;
        console.warn(`\n🔄 [TUCURED-ENGINE] Frontend Vite finalizó/caído (código: ${code}, señal: ${signal}). Auto-Respawn activo...`);
        clearTimeout(frontendRestartTimeout);
        frontendRestartTimeout = setTimeout(() => {
            killPort(5005);
            spawnFrontend();
            console.log('   ✅ [TUCURED-ENGINE] Frontend Vite reconectado en :5005.');
        }, 800);
    });
}

async function start() {
    killPort(5005);
    killPort(5006);

    console.log('🚀 [TUCURED-ENGINE] Iniciando Orquestador Dual Sincronizado y Resiliente...');
    console.log('   📡 1/2 Levantando Backend Express en http://localhost:5006...');

    spawnBackend();

    try {
        await waitForPort(5006, 15000);
        console.log('   ✅ Backend listo y respondiendo en :5006.');
    } catch (err) {
        console.error('❌ [TUCURED-ENGINE] Fallo inicial esperando backend:', err.message);
        cleanup();
        return;
    }

    console.log('   ✨ 2/2 Levantando Frontend Vite SPA en http://localhost:5005 (Proxy /api -> :5006)\n');
    spawnFrontend();
}

start();
