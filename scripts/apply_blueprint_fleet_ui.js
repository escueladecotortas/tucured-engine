// Archivo: scripts/apply_blueprint_fleet_ui.js
// Despliegue de Frontend y Suite de Pruebas en blueprint-nexus

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLUEPRINT_DIR = path.resolve(__dirname, '../../blueprint-nexus');

// 1. Optimizar fleet_manager.js (< 160 líneas)
const fleetManagerCode = `// Archivo: system_core/dashboard/fleet_manager.js
// Administrador Central de Procesos y Servidores de la Flota (Nexus OS v11.1)

const fs = require('fs'), path = require('path');
const { spawn, execSync } = require('child_process');
const { PROJECT_SPECS, checkPortListening } = require('./project_launcher');

const fleetState = {};

function initFleetState(baseDir) {
    const parentDir = path.resolve(baseDir, '../');
    Object.keys(PROJECT_SPECS).forEach(id => {
        const spec = PROJECT_SPECS[id], projPath = id === 'blueprint-nexus' ? path.resolve(baseDir) : path.resolve(parentDir, id);
        fleetState[id] = {
            id, name: id, port: spec.localPort, path: projPath,
            status: id === 'blueprint-nexus' ? 'ONLINE' : 'OFFLINE',
            pid: id === 'blueprint-nexus' ? process.pid : null,
            child: null, logs: [], sseClients: new Set(),
            memoryMb: id === 'blueprint-nexus' ? Math.round(process.memoryUsage().rss / 1024 / 1024) : 0,
            startedAt: id === 'blueprint-nexus' ? new Date().toISOString() : null
        };
    });
}

function appendFleetLog(projectId, text, type = 'stdout') {
    const p = fleetState[projectId]; if (!p) return;
    const entry = { timestamp: new Date().toLocaleTimeString('es-AR', { hour12: false }), type, message: text.replace(/\\r?\\n$/, '') };
    p.logs.push(entry); if (p.logs.length > 150) p.logs.shift();
    const sseData = \`data: \${JSON.stringify(entry)}\\n\\n\`;
    p.sseClients.forEach(c => { try { c.write(sseData); } catch (e) { p.sseClients.delete(c); } });
}

function findPidByPort(port) {
    if (process.platform !== 'win32') return null;
    try {
        const out = execSync(\`netstat -ano | findstr :\${port}\`, { encoding: 'utf-8', timeout: 2000 });
        for (const line of out.trim().split('\\n')) {
            if (line.includes('LISTENING')) {
                const pid = line.trim().split(/\\s+/).pop();
                if (pid && pid !== '0') return parseInt(pid, 10);
            }
        }
    } catch (e) {}
    return null;
}

function killPid(pid) {
    if (!pid || pid === process.pid) return;
    try {
        if (process.platform === 'win32') execSync(\`taskkill /F /PID \${pid} /T\`, { stdio: 'ignore', timeout: 3000 });
        else process.kill(pid, 'SIGKILL');
    } catch (e) {}
}

async function startProjectProcess(baseDir, projectId, cb) {
    if (!fleetState[projectId]) initFleetState(baseDir);
    const p = fleetState[projectId], spec = PROJECT_SPECS[projectId] || {}, port = spec.localPort || 3001;
    const isRunning = await checkPortListening(port);
    if (isRunning) {
        p.status = 'ONLINE'; p.pid = findPidByPort(port) || p.pid;
        appendFleetLog(projectId, \`[FLEET] Activo en puerto \${port} (PID \${p.pid})\`, 'system');
        return cb({ success: true, message: \`\${projectId} ya activo en puerto \${port}\`, status: 'ONLINE', pid: p.pid });
    }
    const pkgPath = path.join(p.path, 'package.json');
    if (!fs.existsSync(pkgPath)) return cb({ success: false, error: 'package.json ausente' });
    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const scriptName = pkg.scripts?.dev ? 'dev' : (pkg.scripts?.start ? 'start' : null);
        if (!scriptName) return cb({ success: false, error: 'Sin script dev/start' });
        p.status = 'STARTING';
        appendFleetLog(projectId, \`[FLEET] Iniciando npm run \${scriptName} (Puerto \${port})...\`, 'system');
        const child = process.platform === 'win32'
            ? spawn('cmd.exe', ['/c', \`set PORT=\${port}& set PORT_OVERRIDE=\${port}& npm run \${scriptName}\`], { cwd: p.path, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
            : spawn('npm', ['run', scriptName], { cwd: p.path, env: { ...process.env, PORT: String(port), PORT_OVERRIDE: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
        p.child = child; p.pid = child.pid; p.startedAt = new Date().toISOString();
        if (child.stdout) child.stdout.on('data', d => appendFleetLog(projectId, d.toString(), 'stdout'));
        if (child.stderr) child.stderr.on('data', d => appendFleetLog(projectId, d.toString(), 'stderr'));
        child.on('close', code => { p.status = 'OFFLINE'; p.child = null; appendFleetLog(projectId, \`[FLEET] Finalizado (\${code})\`, 'system'); });
        setTimeout(async () => {
            const active = await checkPortListening(port, 1500);
            if (active) { p.status = 'ONLINE'; p.pid = findPidByPort(port) || p.pid; }
            cb({ success: true, message: \`\${projectId} iniciado\`, status: p.status, pid: p.pid });
        }, 2000);
    } catch (err) { p.status = 'ERROR'; cb({ success: false, error: err.message }); }
}

async function stopProjectProcess(baseDir, projectId, cb) {
    if (!fleetState[projectId]) initFleetState(baseDir);
    const p = fleetState[projectId];
    if (projectId === 'blueprint-nexus') return cb({ success: false, error: 'No se puede detener Master Hub' });
    appendFleetLog(projectId, \`[FLEET] Deteniendo \${projectId}...\`, 'system');
    if (p.child) { try { killPid(p.child.pid); } catch (e) {} p.child = null; }
    if (p.pid) killPid(p.pid);
    if (p.port) { const cPid = findPidByPort(p.port); if (cPid) killPid(cPid); }
    p.status = 'OFFLINE'; p.pid = null; p.memoryMb = 0;
    appendFleetLog(projectId, \`[FLEET] Servidor detenido.\`, 'system');
    cb({ success: true, message: \`\${projectId} detenido\`, status: 'OFFLINE' });
}

async function restartProjectProcess(baseDir, projectId, cb) {
    await stopProjectProcess(baseDir, projectId, () => {});
    setTimeout(() => { startProjectProcess(baseDir, projectId, cb); }, 1200);
}

async function getFleetProcessesStatus(baseDir) {
    if (Object.keys(fleetState).length === 0) initFleetState(baseDir);
    const results = [];
    for (const id of Object.keys(fleetState)) {
        const p = fleetState[id], spec = PROJECT_SPECS[id] || {};
        if (id === 'blueprint-nexus') {
            p.status = 'ONLINE'; p.pid = process.pid; p.memoryMb = Math.round(process.memoryUsage().rss / 1024 / 1024);
        } else if (p.port) {
            const isListening = await checkPortListening(p.port, 250);
            p.status = isListening ? 'ONLINE' : (p.status === 'STARTING' ? 'STARTING' : 'OFFLINE');
            if (isListening && !p.pid) p.pid = findPidByPort(p.port);
        }
        results.push({
            id: p.id, name: p.name, port: p.port, localUrl: p.port ? \`http://localhost:\${p.port}\` : null,
            status: p.status, pid: p.pid, memoryMb: p.memoryMb || (p.status === 'ONLINE' ? 45 : 0),
            serviceType: spec.serviceType || 'FRONTEND', serviceLabel: spec.serviceLabel || 'Web App',
            category: spec.category || 'Satélite', lastLog: p.logs.length > 0 ? p.logs[p.logs.length - 1] : null
        });
    }
    return results;
}

function subscribeFleetLogs(projectId, res) {
    const p = fleetState[projectId];
    if (!p) { res.writeHead(404, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'Proyecto ausente' })); }
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' });
    res.write(\`data: \${JSON.stringify({ type: 'init', logs: p.logs, projectId })}\\n\\n\`);
    p.sseClients.add(res);
    res.on('close', () => { p.sseClients.delete(res); });
}

module.exports = {
    initFleetState, startProjectProcess, stopProjectProcess,
    restartProjectProcess, getFleetProcessesStatus, subscribeFleetLogs, appendFleetLog
};
`;

// Escribir fleet_manager.js
fs.writeFileSync(path.join(BLUEPRINT_DIR, 'system_core/dashboard/fleet_manager.js'), fleetManagerCode, 'utf-8');
console.log('✅ fleet_manager.js actualizado con spawn cmd.exe.');
