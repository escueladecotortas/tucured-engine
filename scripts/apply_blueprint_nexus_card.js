// Archivo: scripts/apply_blueprint_nexus_card.js
// Calibración de Tarjeta Master BLUEPRINT-NEXUS: Logs de Telemetría y Reinicio

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLUEPRINT_DIR = path.resolve(__dirname, '../../blueprint-nexus');

// 1. system_core/dashboard/fleet_manager.js (< 160 líneas)
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
            ? spawn('cmd.exe', ['/c', \`set PORT=\${port}& set BACKEND_PORT=5006& npm run \${scriptName}\`], { cwd: p.path, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
            : spawn('npm', ['run', scriptName], { cwd: p.path, env: { ...process.env, PORT: String(port), BACKEND_PORT: '5006' }, stdio: ['ignore', 'pipe', 'pipe'] });
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

function subscribeFleetLogs(baseDir, projectId, res) {
    if (Object.keys(fleetState).length === 0) initFleetState(baseDir);
    const p = fleetState[projectId];
    if (!p) { res.writeHead(404, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'Proyecto ausente' })); }
    
    let logsToSend = p.logs;
    if (projectId === 'blueprint-nexus') {
        const logFile = path.resolve(baseDir, 'system_core/storage/telemetry/live_execution.log');
        if (fs.existsSync(logFile)) {
            try {
                logsToSend = fs.readFileSync(logFile, 'utf-8').trim().split('\\n').filter(Boolean).slice(-60).map(l => {
                    try {
                        const parsed = JSON.parse(l);
                        return { timestamp: parsed.timestamp || 'ART', type: (parsed.level || 'INFO').toLowerCase() === 'error' ? 'stderr' : 'stdout', message: parsed.message || l };
                    } catch(e) { return { timestamp: 'ART', type: 'stdout', message: l }; }
                });
            } catch(e) {}
        }
    }

    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' });
    res.write(\`data: \${JSON.stringify({ type: 'init', logs: logsToSend, projectId })}\\n\\n\`);
    p.sseClients.add(res);
    res.on('close', () => { p.sseClients.delete(res); });
}

module.exports = {
    initFleetState, startProjectProcess, stopProjectProcess,
    restartProjectProcess, getFleetProcessesStatus, subscribeFleetLogs, appendFleetLog
};
`;

// 2. system_core/dashboard/fleet_ui.js (< 160 líneas)
const fleetUiCode = `// Archivo: system_core/dashboard/fleet_ui.js
// Interfaz del Administrador de Servidores de Flota, Sanitización ANSI y Copiado

let activeLogsEventSource = null;
let currentViewingProjectId = null;

function stripAnsi(text) {
    if (!text) return '';
    return String(text).replace(/\\x1B\\[[0-?]*[ -/]*[@-~]/g, '').trim();
}

async function loadFleetProcesses() {
    try {
        const res = await fetch('/api/fleet/processes');
        const data = await res.json();
        if (data.success) renderFleetGrid(data.processes || []);
    } catch (e) {
        console.warn('Error cargando servidores de flota:', e);
    }
}

function renderFleetGrid(processes) {
    const grid = document.getElementById('fleetServersGrid');
    if (!grid) return;

    grid.innerHTML = processes.map(p => {
        const isOnline = p.status === 'ONLINE';
        const isStarting = p.status === 'STARTING';
        const isCore = p.id === 'blueprint-nexus';

        const badgeClass = isOnline
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : (isStarting ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700');

        const cleanPreview = p.lastLog ? stripAnsi(p.lastLog.message) : (isCore ? 'Núcleo Master Hub activo' : 'Esperando logs de proceso...');

        return \`
        <div class="glass-card p-4 rounded-2xl border \${isOnline ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-slate-800'} flex flex-col justify-between space-y-3 font-mono">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="h-2.5 w-2.5 rounded-full \${isOnline ? 'bg-emerald-400 animate-pulse' : (isStarting ? 'bg-amber-400' : 'bg-slate-600')}"></span>
                    <h3 class="font-bold text-white text-xs uppercase tracking-wide">\${p.name}</h3>
                </div>
                <span class="text-[9px] px-2 py-0.5 rounded-full font-bold border \${badgeClass}">\${p.status}</span>
            </div>

            <div class="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 text-[10px]">
                <div><span class="text-slate-500 block text-[8.5px]">PUERTO</span><b class="text-amber-400">:\${p.port || '--'}</b></div>
                <div><span class="text-slate-500 block text-[8.5px]">PID</span><b class="text-cyan-400">\${p.pid || '--'}</b></div>
                <div><span class="text-slate-500 block text-[8.5px]">RAM HOST</span><b class="text-purple-300">\${p.memoryMb ? p.memoryMb + ' MB' : '--'}</b></div>
            </div>

            <div class="text-[9.5px] text-slate-400 truncate bg-black/40 px-2 py-1 rounded border border-slate-900" title="\${cleanPreview.replace(/"/g, '&quot;')}">
                <span class="text-slate-600 mr-1">></span>\${cleanPreview}
            </div>

            <div class="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800/80">
                <div class="flex items-center gap-1">
                    <button onclick="startFleetServer('\${p.id}')" \${isOnline ? 'disabled' : ''} class="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-30 disabled:cursor-not-allowed text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold transition-all cursor-pointer">▶️ Start</button>
                    <button onclick="stopFleetServer('\${p.id}')" \${!isOnline || isCore ? 'disabled' : ''} class="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 disabled:opacity-30 disabled:cursor-not-allowed text-rose-300 border border-rose-500/40 rounded-lg text-[10px] font-bold transition-all cursor-pointer">⏹️ Stop</button>
                    <button onclick="restartFleetServer('\${p.id}')" class="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-bold transition-all cursor-pointer" title="Reiniciar \${p.name}">🔄</button>
                </div>
                <div class="flex items-center gap-1">
                    <button onclick="openFleetLogs('\${p.id}')" class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 rounded-lg text-[10px] font-bold transition-all cursor-pointer">📋 Logs</button>
                    \${p.localUrl && isOnline ? \`<a href="\${p.localUrl}" target="_blank" class="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-[10px] font-bold transition-all">🌐 Web</a>\` : ''}
                </div>
            </div>
        </div>
        \`;
    }).join('');
}

async function startFleetServer(id) {
    showToast(\`Lanzando servidor: \${id}...\`, '▶️');
    try {
        const res = await fetch(\`/api/fleet/start/\${encodeURIComponent(id)}\`, { method: 'POST' });
        const d = await res.json();
        showToast(d.message || \`\${id} iniciado\`, d.success ? '✅' : '❌');
        setTimeout(loadFleetProcesses, 1500);
    } catch (e) { showToast(e.message, '❌'); }
}

async function stopFleetServer(id) {
    showToast(\`Deteniendo servidor: \${id}...\`, '⏹️');
    try {
        const res = await fetch(\`/api/fleet/stop/\${encodeURIComponent(id)}\`, { method: 'POST' });
        const d = await res.json();
        showToast(d.message || \`\${id} detenido\`, d.success ? '✅' : '❌');
        setTimeout(loadFleetProcesses, 800);
    } catch (e) { showToast(e.message, '❌'); }
}

async function restartFleetServer(id) {
    showToast(\`Reiniciando servidor: \${id}...\`, '🔄');
    try {
        const endpoint = id === 'blueprint-nexus' ? '/api/action/restart-server' : \`/api/fleet/restart/\${encodeURIComponent(id)}\`;
        const res = await fetch(endpoint, { method: 'POST' });
        const d = await res.json();
        showToast(d.message || \`\${id} reiniciado\`, d.success ? '✅' : '❌');
        setTimeout(loadFleetProcesses, 2000);
    } catch (e) { showToast(e.message, '❌'); }
}

function openFleetLogs(projectId) {
    currentViewingProjectId = projectId;
    const titleEl = document.getElementById('fleetLogsModalTitle');
    if (titleEl) titleEl.innerText = \`LIVE STREAM // \${projectId.toUpperCase()}\`;
    const out = document.getElementById('fleetLogsModalContent');
    if (out) out.innerHTML = '<div class="text-slate-500 text-center py-4">Conectando con SSE Stream...</div>';
    toggleModal('fleetLogsModal', true);

    if (activeLogsEventSource) activeLogsEventSource.close();
    activeLogsEventSource = new EventSource(\`/api/fleet/logs/\${encodeURIComponent(projectId)}\`);

    activeLogsEventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'init') {
                if (out) {
                    out.innerHTML = (data.logs || []).map(l => formatFleetLogLine(l)).join('');
                    out.scrollTop = out.scrollHeight;
                }
            } else {
                if (out) {
                    out.innerHTML += formatFleetLogLine(data);
                    out.scrollTop = out.scrollHeight;
                }
            }
        } catch (e) {}
    };
}

function formatFleetLogLine(log) {
    const isErr = log.type === 'stderr';
    const isSys = log.type === 'system';
    const color = isErr ? 'text-rose-400' : (isSys ? 'text-amber-300 font-bold' : 'text-emerald-400');
    const cleanMsg = stripAnsi(log.message);
    return \`<div class="font-mono text-[10.5px] leading-relaxed \${color}"><span class="text-slate-500 mr-2">[\${log.timestamp}]</span>\${cleanMsg}</div>\`;
}

async function copyFleetLogs() {
    const out = document.getElementById('fleetLogsModalContent');
    if (!out) return;
    const textToCopy = out.innerText || '';
    try {
        await navigator.clipboard.writeText(textToCopy);
        showToast('¡Logs copiados al portapapeles!', '📋');
        const btn = document.getElementById('btnCopyFleetLogs');
        if (btn) {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '✅ ¡Copiado!';
            setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
        }
    } catch (e) {
        showToast('Fallo al copiar logs', '❌');
    }
}

function closeFleetLogs() {
    if (activeLogsEventSource) {
        activeLogsEventSource.close();
        activeLogsEventSource = null;
    }
    toggleModal('fleetLogsModal', false);
}
`;

// 3. system_core/dashboard/server.js: llamar a subscribeFleetLogs(BASE_DIR, projectId, res)
const serverJsPath = path.join(BLUEPRINT_DIR, 'system_core/dashboard/server.js');
let serverJsContent = fs.readFileSync(serverJsPath, 'utf-8');
serverJsContent = serverJsContent.replace(
    'if (fleetLogsMatch) return subscribeFleetLogs(decodeURIComponent(fleetLogsMatch[1]), res);',
    'if (fleetLogsMatch) return subscribeFleetLogs(BASE_DIR, decodeURIComponent(fleetLogsMatch[1]), res);'
);

// Escribir los archivos
fs.writeFileSync(path.join(BLUEPRINT_DIR, 'system_core/dashboard/fleet_manager.js'), fleetManagerCode, 'utf-8');
console.log('✅ fleet_manager.js actualizado con soporte para live_execution.log en blueprint-nexus.');

fs.writeFileSync(path.join(BLUEPRINT_DIR, 'system_core/dashboard/fleet_ui.js'), fleetUiCode, 'utf-8');
console.log('✅ fleet_ui.js actualizado con [🔄 Restart] habilitado para blueprint-nexus.');

fs.writeFileSync(serverJsPath, serverJsContent, 'utf-8');
console.log('✅ server.js actualizado.');
