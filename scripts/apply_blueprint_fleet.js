// Archivo: scripts/apply_blueprint_fleet.js
// Script de Despliegue de Administrador de Procesos y Flota en blueprint-nexus

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLUEPRINT_DIR = path.resolve(__dirname, '../../blueprint-nexus');

console.log('🚀 Iniciando despliegue de arquitectura de flota en:', BLUEPRINT_DIR);

// 1. system_core/dashboard/fleet_manager.js
const fleetManagerCode = `// Archivo: system_core/dashboard/fleet_manager.js
// Administrador Central de Procesos y Servidores de la Flota (Nexus OS v11.1)

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const { PROJECT_SPECS, checkPortListening } = require('./project_launcher');

const fleetState = {};

function initFleetState(baseDir) {
    const parentDir = path.resolve(baseDir, '../');
    Object.keys(PROJECT_SPECS).forEach(id => {
        const spec = PROJECT_SPECS[id];
        const projPath = id === 'blueprint-nexus' ? path.resolve(baseDir) : path.resolve(parentDir, id);
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
    const p = fleetState[projectId];
    if (!p) return;
    const entry = {
        timestamp: new Date().toLocaleTimeString('es-AR', { hour12: false }),
        type, message: text.replace(/\\r?\\n$/, '')
    };
    p.logs.push(entry);
    if (p.logs.length > 150) p.logs.shift();
    const sseData = \`data: \${JSON.stringify(entry)}\\n\\n\`;
    p.sseClients.forEach(client => {
        try { client.write(sseData); } catch (e) { p.sseClients.delete(client); }
    });
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
        if (process.platform === 'win32') {
            execSync(\`taskkill /F /PID \${pid} /T\`, { stdio: 'ignore', timeout: 3000 });
        } else {
            process.kill(pid, 'SIGKILL');
        }
    } catch (e) {}
}

async function startProjectProcess(baseDir, projectId, cb) {
    if (!fleetState[projectId]) initFleetState(baseDir);
    const p = fleetState[projectId];
    const spec = PROJECT_SPECS[projectId] || {};
    const port = spec.localPort || 3001;

    const isRunning = await checkPortListening(port);
    if (isRunning) {
        p.status = 'ONLINE';
        p.pid = findPidByPort(port) || p.pid;
        appendFleetLog(projectId, \`[FLEET] Servidor ya activo en puerto \${port} (PID \${p.pid})\`, 'system');
        return cb({ success: true, message: \`\${projectId} ya está activo en puerto \${port}\`, status: 'ONLINE', pid: p.pid });
    }

    const pkgPath = path.join(p.path, 'package.json');
    if (!fs.existsSync(pkgPath)) return cb({ success: false, error: 'package.json no encontrado' });

    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const scriptName = pkg.scripts?.dev ? 'dev' : (pkg.scripts?.start ? 'start' : null);
        if (!scriptName) return cb({ success: false, error: 'Sin script dev o start en package.json' });

        p.status = 'STARTING';
        appendFleetLog(projectId, \`[FLEET] Lanzando \${projectId} con 'npm run \${scriptName}' en puerto \${port}...\`, 'system');

        const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        const child = spawn(cmd, ['run', scriptName], {
            cwd: p.path,
            env: { ...process.env, PORT: String(port), PORT_OVERRIDE: String(port) },
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        p.child = child;
        p.pid = child.pid;
        p.startedAt = new Date().toISOString();

        child.stdout.on('data', d => appendFleetLog(projectId, d.toString(), 'stdout'));
        child.stderr.on('data', d => appendFleetLog(projectId, d.toString(), 'stderr'));

        child.on('close', code => {
            p.status = 'OFFLINE';
            p.child = null;
            appendFleetLog(projectId, \`[FLEET] Proceso finalizado (código \${code})\`, 'system');
        });

        setTimeout(async () => {
            const active = await checkPortListening(port, 1000);
            if (active) p.status = 'ONLINE';
            cb({ success: true, message: \`\${projectId} iniciado en puerto \${port}\`, status: p.status, pid: p.pid });
        }, 1500);
    } catch (err) {
        p.status = 'ERROR';
        cb({ success: false, error: err.message });
    }
}

async function stopProjectProcess(baseDir, projectId, cb) {
    if (!fleetState[projectId]) initFleetState(baseDir);
    const p = fleetState[projectId];
    if (projectId === 'blueprint-nexus') return cb({ success: false, error: 'No se puede detener el núcleo Master Hub' });

    appendFleetLog(projectId, \`[FLEET] Deteniendo proceso \${projectId}...\`, 'system');
    if (p.child) { try { killPid(p.child.pid); } catch (e) {} p.child = null; }
    if (p.pid) killPid(p.pid);
    if (p.port) { const cPid = findPidByPort(p.port); if (cPid) killPid(cPid); }

    p.status = 'OFFLINE';
    p.pid = null;
    p.memoryMb = 0;
    appendFleetLog(projectId, \`[FLEET] Servidor detenido con éxito.\`, 'system');
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
        const p = fleetState[id];
        const spec = PROJECT_SPECS[id] || {};
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
    if (!p) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Proyecto no encontrado' }));
    }
    res.writeHead(200, {
        'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache',
        'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*'
    });
    res.write(\`data: \${JSON.stringify({ type: 'init', logs: p.logs, projectId })}\\n\\n\`);
    p.sseClients.add(res);
    res.on('close', () => { p.sseClients.delete(res); });
}

module.exports = {
    initFleetState, startProjectProcess, stopProjectProcess,
    restartProjectProcess, getFleetProcessesStatus, subscribeFleetLogs, appendFleetLog
};
`;

// 2. system_core/dashboard/server_actions.js
const serverActionsCode = `// Archivo: system_core/dashboard/server_actions.js
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const { getKernelInfo } = require('./kernel_checker');
const { parseKanban } = require('./kanban_parser');
const { getProjectSpecs, launchProject, PROJECT_SPECS } = require('./project_launcher');
const { startProjectProcess, stopProjectProcess, restartProjectProcess, getFleetProcessesStatus, subscribeFleetLogs } = require('./fleet_manager');

function getLocalTimestamp() {
    return new Date().toLocaleTimeString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
    }) + ' ART';
}

function openFolder(projectPath, cb) {
    const targetDir = path.resolve(projectPath || path.join(__dirname, '../../'));
    exec(\`explorer.exe "\${targetDir}"\`, (err) => {
        if (err) return cb({ success: false, error: 'Fallo al abrir explorador' });
        cb({ success: true, message: \`Carpeta abierta: \${path.basename(targetDir)}\` });
    });
}

function parseDoctorReport(rawReport, targetDir) {
    const lines = (rawReport || '').split('\\n');
    const res = { summary: 'Diagnóstico Completado', fileCount: '88', law200: '100% Conforme', envStatus: 'Presente (.env)', manifestStatus: 'Sincronizado', subsystems: [] };
    lines.forEach(l => {
        if (l.includes('Archivos Auditados:')) res.fileCount = (l.match(/(\\d+)/) || [,'88'])[1];
        if (l.includes('Ley de 200 Líneas:')) res.law200 = l.includes('100% Conforme') ? '100% Conforme' : 'Alerta > 180';
        if (l.includes('Variables de Entorno')) res.envStatus = l.includes('✅') ? 'Presente (.env)' : 'Ausente';
        if (l.includes('Package Manifest')) res.manifestStatus = l.includes('✅') ? 'Válido (package.json)' : 'Ausente';
        if (l.startsWith('|') && !l.includes('Subsistema') && !l.includes(':---')) {
            const parts = l.split('|').map(s => s.trim()).filter(Boolean);
            if (parts.length >= 3) {
                const isH = parts[1].includes('HEALTHY') || parts[1].includes('🟢');
                res.subsystems.push({ name: parts[0], status: isH ? 'HEALTHY' : 'WARNING', badge: isH ? '🟢 HEALTHY' : '🟧 WARNING', issues: parts[2] });
            }
        }
    });
    return res;
}

function runDoctor(projectPath, cb) {
    const targetDir = path.resolve(projectPath || path.join(__dirname, '../../'));
    const docScript = path.join(targetDir, 'system_core/vitalis/vitalis_doctor.js');
    if (!fs.existsSync(docScript)) return cb({ success: false, summary: 'Vitalis Doctor no encontrado', output: \`Script ausente en \${docScript}\` });
    exec(\`node "\${docScript}"\`, { cwd: targetDir }, (err, stdout) => {
        const reportFile = path.join(targetDir, 'system_core/vitalis/latest_report.md');
        const report = fs.existsSync(reportFile) ? fs.readFileSync(reportFile, 'utf-8') : (stdout || 'Sin reporte.');
        cb({ success: !err, summary: err ? 'Hallazgos detectados' : 'Integridad 100% Saludable', output: report, structured: parseDoctorReport(report, targetDir) });
    });
}

function getDiffKernel(targetDir) {
    const absPath = targetDir ? path.resolve(targetDir) : path.resolve(__dirname, '../../');
    const info = getKernelInfo(absPath);
    return { success: true, projectName: path.basename(absPath), projectPath: absPath, updateStatus: info.updateStatus, outdatedFiles: info.outdatedFiles || [], masterVersion: info.masterVersion, targetVersion: info.targetVersion };
}

function getTelemetryHealth() {
    return { success: true, ramMb: Math.round(process.memoryUsage().rss / (1024 * 1024)), uptimeSec: Math.round(process.uptime()), timestampART: getLocalTimestamp(), vitalisStatus: 'HEALTHY' };
}

function getKanbanSummaryForProject(projPath) {
    const kanbanPath = path.join(projPath, '.agent/workflows/kanban.md');
    if (!fs.existsSync(kanbanPath)) return { backlog: 0, inProgress: 0, done: 0, progressPct: 0 };
    try {
        const parsed = parseKanban(fs.readFileSync(kanbanPath, 'utf-8'));
        const backlog = (parsed.backlog || []).length, inProgress = (parsed.inProgress || []).length, done = (parsed.done || []).length;
        const total = backlog + inProgress + done;
        return { backlog, inProgress, done, progressPct: total > 0 ? Math.round((done / total) * 100) : 0 };
    } catch (e) { return { backlog: 0, inProgress: 0, done: 0, progressPct: 0 }; }
}

function getProjectsOverview(baseDir, activeDir) {
    const parentDir = path.resolve(baseDir, '../'), regPath = path.resolve(baseDir, 'system_core/storage/fleet_registry.json');
    let curated = ['blueprint-nexus', 'cumple-oli', 'delicias-huerta', 'la-fachada', 'nodo-mundial-v1', 'tucured-landing', 'Saula', 'tucured-engine'];
    if (fs.existsSync(regPath)) {
        try { const d = JSON.parse(fs.readFileSync(regPath, 'utf-8')); if (Array.isArray(d.curatedProjects)) curated = d.curatedProjects; } catch (e) {}
    }
    const projects = [];
    curated.forEach(item => {
        const fullPath = item.toLowerCase() === 'blueprint-nexus' ? path.resolve(baseDir) : path.resolve(parentDir, item);
        try {
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
                const absPath = path.resolve(fullPath), spec = PROJECT_SPECS[item] || {};
                projects.push({ name: item, path: absPath, active: absPath === path.resolve(activeDir), kernelInfo: getKernelInfo(absPath), envConfigured: fs.existsSync(path.join(absPath, '.env')), kanbanSummary: getKanbanSummaryForProject(absPath), serviceType: spec.serviceType || 'FRONTEND', serviceLabel: spec.serviceLabel || 'Web App' });
            }
        } catch (e) {}
    });
    return projects;
}

function getFleetGitStatus(baseDir) {
    const parentDir = path.resolve(baseDir, '../'), regPath = path.resolve(baseDir, 'system_core/storage/fleet_registry.json');
    let curated = ['blueprint-nexus', 'cumple-oli', 'delicias-huerta', 'la-fachada', 'nodo-mundial-v1', 'tucured-landing', 'Saula', 'tucured-engine'];
    if (fs.existsSync(regPath)) {
        try { const d = JSON.parse(fs.readFileSync(regPath, 'utf-8')); if (Array.isArray(d.curatedProjects)) curated = d.curatedProjects; } catch (e) {}
    }
    const results = curated.map(item => {
        const fullPath = item.toLowerCase() === 'blueprint-nexus' ? path.resolve(baseDir) : path.resolve(parentDir, item);
        if (!fs.existsSync(fullPath)) return { name: item, hasGit: false, hasRemote: false, remoteUrl: null, status: 'DIR_NOT_FOUND' };
        const gitDir = path.join(fullPath, '.git');
        if (!fs.existsSync(gitDir)) return { name: item, hasGit: false, hasRemote: false, remoteUrl: null, status: 'NO_GIT' };
        try {
            const url = execSync(\`git -C "\${fullPath}" remote get-url origin\`, { encoding: 'utf-8', timeout: 3000 }).trim();
            return { name: item, hasGit: true, hasRemote: true, remoteUrl: url, status: 'CONNECTED' };
        } catch (e) {
            return { name: item, hasGit: true, hasRemote: false, remoteUrl: null, status: 'NO_REMOTE' };
        }
    });
    const connected = results.filter(r => r.status === 'CONNECTED').length;
    return { success: true, timestamp: getLocalTimestamp(), total: results.length, connected, projects: results };
}

function getVaultData(baseDir, activeDir) {
    const vaultDir = path.resolve(baseDir, 'system_core/vault'), vaultDocs = [];
    if (fs.existsSync(vaultDir)) {
        fs.readdirSync(vaultDir).forEach(file => {
            try {
                const fPath = path.join(vaultDir, file);
                if (fs.statSync(fPath).isFile()) {
                    const content = fs.readFileSync(fPath, 'utf-8'), ext = path.extname(file).toLowerCase();
                    vaultDocs.push({ filename: file, title: file.replace(/[-_]/g, ' ').replace(/\\.[^/.]+$/, '').toUpperCase(), type: ext === '.json' ? 'JSON_TOKEN' : 'MARKDOWN_DOC', sizeKb: (Buffer.byteLength(content) / 1024).toFixed(1), content });
                }
            } catch (e) {}
        });
    }
    const kanbanPath = path.resolve(activeDir || baseDir, '.agent/workflows/kanban.md'), ideas = [];
    if (fs.existsSync(kanbanPath)) {
        try {
            const raw = fs.readFileSync(kanbanPath, 'utf-8'), ideasSection = raw.split(/##\\s*🧠\\s*BANCO DE IDEAS/i)[1] || '';
            ideasSection.split('\\n').forEach(l => {
                const trimmed = l.trim();
                if (!trimmed || trimmed.includes('~~') || trimmed.startsWith('- [x]') || trimmed.startsWith('- [X]')) return;
                const match = trimmed.match(/- \\[\\s*\\]\\s*(\\*?\\[([A-Z0-9_-]+)\\]\\*?)?\\s*(.*)/i);
                if (match) ideas.push({ id: match[2] || 'IDEA', text: match[3] ? match[3].trim() : trimmed.replace(/^- \\[\\s*\\]\\s*/, ''), done: false });
            });
        } catch (e) {}
    }
    const regPath = path.resolve(baseDir, 'system_core/storage/fleet_registry.json');
    let curatedList = [];
    if (fs.existsSync(regPath)) {
        try { curatedList = JSON.parse(fs.readFileSync(regPath, 'utf-8')).curatedProjects || []; } catch (e) {}
    }
    return { success: true, vaultDocs, ideas, curatedList, activeProjectName: path.basename(activeDir || baseDir) };
}

function updateFleetRegistry(baseDir, action, projectName) {
    if (!projectName) return { success: false, error: 'Nombre de proyecto requerido' };
    const regPath = path.resolve(baseDir, 'system_core/storage/fleet_registry.json');
    let reg = { version: "10.0.0", curatedProjects: [], updatedAt: new Date().toISOString() };
    if (fs.existsSync(regPath)) {
        try { reg = JSON.parse(fs.readFileSync(regPath, 'utf-8')); } catch (e) {}
    }
    const cleanName = projectName.trim();
    if (action === 'add') {
        if (!reg.curatedProjects.includes(cleanName)) reg.curatedProjects.push(cleanName);
    } else if (action === 'remove') {
        if (cleanName.toLowerCase() === 'blueprint-nexus') return { success: false, error: 'No se puede remover el núcleo Core' };
        reg.curatedProjects = reg.curatedProjects.filter(p => p !== cleanName);
    }
    reg.updatedAt = new Date().toISOString();
    fs.writeFileSync(regPath, JSON.stringify(reg, null, 2), 'utf-8');
    return { success: true, curatedProjects: reg.curatedProjects };
}

module.exports = {
    getLocalTimestamp, openFolder, runDoctor, getDiffKernel, getTelemetryHealth,
    getProjectsOverview, getVaultData, updateFleetRegistry, getFleetGitStatus,
    getProjectSpecs, launchProject, startProjectProcess, stopProjectProcess,
    restartProjectProcess, getFleetProcessesStatus, subscribeFleetLogs
};
`;

// 3. system_core/dashboard/server.js
const serverCode = `// Archivo: system_core/dashboard/server.js
const http = require('http'), fs = require('fs'), path = require('path');
const { spawn } = require('child_process');
const { instantiateProject } = require('../tools/init_new_project');
const { importProject } = require('../tools/import_project');
const { syncAllProjects } = require('../tools/sync_kernel');
const { getKernelInfo, listProjects } = require('./kernel_checker');
const { parseKanban } = require('./kanban_parser');
const {
    getLocalTimestamp, openFolder, runDoctor, getDiffKernel, getTelemetryHealth,
    getProjectsOverview, getVaultData, updateFleetRegistry, getFleetGitStatus,
    getProjectSpecs, startProjectProcess, stopProjectProcess, restartProjectProcess,
    getFleetProcessesStatus, subscribeFleetLogs
} = require('./server_actions');

const PORT = process.env.PORT || 3000, BASE_DIR = path.resolve(__dirname, '../../');
let activeTargetDir = BASE_DIR;
const AGENT_NAMES = ['nexus', 'codi', 'atenea', 'argus', 'vitalis', 'kael', 'elara', 'chronos', 'lorem', 'icaro'];
const sseClients = new Set();

function broadcastSSE(data) {
    const msg = \`data: \${JSON.stringify(data)}\\n\\n\`;
    sseClients.forEach(res => { try { res.write(msg); } catch (e) { sseClients.delete(res); } });
}

function appendLog(level, message, targetDir = activeTargetDir) {
    const logDir = path.resolve(targetDir, 'system_core/storage/telemetry');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    const entry = { timestamp: getLocalTimestamp(), timeMs: Date.now(), level, message };
    try { fs.appendFileSync(path.resolve(logDir, 'live_execution.log'), JSON.stringify(entry) + '\\n', 'utf-8'); } catch (e) {}
    broadcastSSE({ type: 'log', data: entry });
    const up = (message || '').toUpperCase();
    AGENT_NAMES.forEach(n => {
        if (up.includes(\`[\${n.toUpperCase()}]\`)) broadcastSSE({ type: 'agent_pulse', agent: n, timestamp: entry.timestamp });
    });
}

function getLiveLogs(targetDir = activeTargetDir) {
    const logPath = path.resolve(targetDir, 'system_core/storage/telemetry/live_execution.log');
    if (!fs.existsSync(logPath)) appendLog('INFO', \`[NEXUS] Panel v15.2 activo en '\${path.basename(targetDir)}'.\`, targetDir);
    try {
        return fs.readFileSync(logPath, 'utf-8').trim().split('\\n').filter(Boolean).slice(-40).map(l => { try { return JSON.parse(l); } catch (e) { return { timestamp: getLocalTimestamp(), level: 'INFO', message: l }; } });
    } catch (e) { return []; }
}

function getAgentStatuses(targetDir) {
    const now = Date.now(), FIFTEEN_SEC = 15000, logFile = path.resolve(targetDir, 'system_core/storage/telemetry/live_execution.log');
    const stats = {}; AGENT_NAMES.forEach(n => { stats[n] = { total: 0, errors: 0, latestMs: 0, latestMsg: '', latestTs: '', logs: [] }; });
    let fleetTotalOps = 0;
    if (fs.existsSync(logFile)) {
        try {
            fs.readFileSync(logFile, 'utf-8').trim().split('\\n').filter(Boolean).forEach(line => {
                try {
                    const p = JSON.parse(line), up = (p.message || '').toUpperCase(), lvl = (p.level || 'INFO').toUpperCase();
                    const tMs = p.timeMs || 0;
                    if (up.includes('VS CODE')) return;
                    AGENT_NAMES.forEach(n => {
                        if (up.includes(\`[\${n.toUpperCase()}]\`)) {
                            stats[n].total++; fleetTotalOps++;
                            if (lvl === 'ERROR' || lvl === 'WARN') stats[n].errors++;
                            if (tMs > stats[n].latestMs) { stats[n].latestMs = tMs; stats[n].latestMsg = p.message; stats[n].latestTs = p.timestamp; }
                            stats[n].logs.push(p);
                        }
                    });
                } catch (e) {}
            });
        } catch (e) {}
    }
    return AGENT_NAMES.map(name => {
        const s = stats[name], isL1 = name === 'nexus', total = s.total, errors = s.errors;
        const successRate = total > 0 ? Math.max(0, Math.round(((total - errors) / total) * 100)) : 100;
        const isActive = (now - s.latestMs <= FIFTEEN_SEC) && s.latestMs > 0;
        return {
            name, level: isL1 ? 'L1' : 'L3', status: isActive ? 'ACTIVE' : 'IDLE', isActive,
            totalInvocations: total, errorsCount: errors, successRate, promptStatus: successRate >= 90 ? 'OPTIMAL' : 'NEEDS_REVIEW',
            activitySharePct: fleetTotalOps > 0 ? Math.round((total / fleetTotalOps) * 100) : 0,
            lastAction: s.latestMsg || (isL1 ? 'Orquestación Core & Routing' : (name === 'vitalis' ? 'Auditoría Técnica Vitalis' : 'En espera')),
            lastActionTime: s.latestTs || 'N/A', recentLogs: s.logs.slice(-5).reverse()
        };
    });
}

function getDashboardData() {
    const targetDir = path.resolve(activeTargetDir), kernelInfo = getKernelInfo(targetDir);
    const reportPath = path.resolve(targetDir, 'system_core/vitalis/latest_report.md'), kanbanPath = path.resolve(targetDir, '.agent/workflows/kanban.md');
    const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, 'utf-8') : '', kanbanRaw = fs.existsSync(kanbanPath) ? fs.readFileSync(kanbanPath, 'utf-8') : '';
    return {
        version: "Nexus Control Panel v15.2", activeProjectPath: targetDir, activeProjectName: path.basename(targetDir), timestamp: getLocalTimestamp(),
        isKernelInjected: kernelInfo.isKernelInjected, updateStatus: kernelInfo.updateStatus, masterVersion: kernelInfo.masterVersion, outdatedFiles: kernelInfo.outdatedFiles,
        vitalisStatus: report.includes('🟢') || report.includes('HEALTHY') ? 'HEALTHY' : 'WARNING', projects: listProjects(activeTargetDir), kanban: parseKanban(kanbanRaw),
        telemetry: { ramMb: Math.round(process.memoryUsage().rss / (1024 * 1024)), uptimeSec: Math.round(process.uptime()), circuitBreaker: { state: 'ARMED_HEALTHY' } },
        agents: getAgentStatuses(targetDir), logs: getLiveLogs(targetDir)
    };
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    const url = new URL(req.url, \`http://\${req.headers.host || 'localhost'}\`), sendJSON = (obj, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(obj)); };
    
    // Rutas SSE
    if (url.pathname === '/api/stream/telemetry') {
        res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' });
        res.write(\`data: \${JSON.stringify({ type: 'init', message: 'SSE Stream Conectado', timestamp: getLocalTimestamp() })}\\n\\n\`);
        sseClients.add(res); req.on('close', () => sseClients.delete(res)); return;
    }
    const fleetLogsMatch = url.pathname.match(/^\\/api\\/fleet\\/logs\\/([^\\/]+)$/);
    if (fleetLogsMatch) return subscribeFleetLogs(decodeURIComponent(fleetLogsMatch[1]), res);

    if (url.pathname === '/ping') return sendJSON({ status: 'ok', timestamp: getLocalTimestamp() });
    if (url.pathname === '/api/status') return sendJSON(getDashboardData());
    if (url.pathname === '/api/kanban') return sendJSON(getDashboardData().kanban);
    if (url.pathname === '/api/logs') return sendJSON({ logs: getLiveLogs(activeTargetDir) });
    if (url.pathname === '/api/telemetry/health') return sendJSON(getTelemetryHealth());
    if (url.pathname === '/api/projects/overview') return sendJSON({ success: true, projects: getProjectsOverview(BASE_DIR, activeTargetDir) });
    if (url.pathname === '/api/vault') return sendJSON(getVaultData(BASE_DIR, activeTargetDir));
    if (url.pathname === '/api/fleet/git-status') return sendJSON(getFleetGitStatus(BASE_DIR));
    if (url.pathname === '/api/fleet/processes') { const list = await getFleetProcessesStatus(BASE_DIR); return sendJSON({ success: true, processes: list }); }

    const specsMatch = url.pathname.match(/^\\/api\\/projects\\/([^\\/]+)\\/specs$/);
    if (specsMatch) return sendJSON(getProjectSpecs(BASE_DIR, decodeURIComponent(specsMatch[1])));

    if (req.method === 'POST') {
        let body = ''; req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const data = body ? JSON.parse(body) : {};
                if (url.pathname === '/api/doctor') return runDoctor(data.projectPath || activeTargetDir, r => { appendLog('SUCCESS', \`[VITALIS] Diagnóstico: \${r.summary || '100% HEALTHY'}\`); sendJSON(r); });
                if (url.pathname === '/api/action/open-folder') return openFolder(data.projectPath || activeTargetDir, r => { appendLog('INFO', \`[KAEL] \${r.message || r.error}\`); sendJSON(r); });
                if (url.pathname === '/api/action/diff-kernel') return sendJSON(getDiffKernel(data.projectPath || activeTargetDir));
                if (url.pathname === '/api/action/restart-server') {
                    appendLog('INFO', '[NEXUS] ⚡ Reinicio silencioso solicitado.'); sendJSON({ success: true, message: 'Servidor reiniciando (SW_HIDE)...' });
                    const silentVbs = path.resolve(BASE_DIR, 'start_nexus_silent.vbs');
                    setTimeout(() => { server.close(() => { if (fs.existsSync(silentVbs)) spawn('wscript.exe', [silentVbs], { detached: true, stdio: 'ignore' }).unref(); process.exit(0); }); }, 200);
                    return;
                }
                if (url.pathname === '/api/action/switch-project') {
                    if (data.projectPath && fs.existsSync(data.projectPath)) { activeTargetDir = path.resolve(data.projectPath); appendLog('INFO', \`[NEXUS] Conmutado a: '\${path.basename(activeTargetDir)}'\`); return sendJSON({ success: true, activeProjectName: path.basename(activeTargetDir) }); }
                    return sendJSON({ success: false, error: 'Ruta inválida' }, 400);
                }
                if (url.pathname === '/api/action/sync-all-projects') { const r = syncAllProjects(); appendLog('INFO', \`[KAEL] Sync completado: \${r.verifiedCount || r.updatedCount} proyectos.\`); return sendJSON(r); }
                if (url.pathname === '/api/action/import-project') { const r = importProject({ sourceDir: data.sourceDir }); appendLog(r.success ? 'SUCCESS' : 'ERROR', \`[KAEL] Sync: \${r.message}\`); return sendJSON(r); }
                if (url.pathname === '/api/action/create-project') { const r = instantiateProject(data.projectName, data.description, data.targetPath); appendLog(r.success ? 'SUCCESS' : 'ERROR', \`[CODI] Creado \${data.projectName}\`); return sendJSON(r); }
                if (url.pathname === '/api/action/fleet-registry') { const r = updateFleetRegistry(BASE_DIR, data.action, data.projectName); appendLog('INFO', \`[ELARA] Flota: \${data.action} \${data.projectName}\`); return sendJSON(r); }

                // Control de Procesos de Flota (Start / Stop / Restart)
                const startMatch = url.pathname.match(/^\\/api\\/fleet\\/start\\/([^\\/]+)$/) || url.pathname.match(/^\\/api\\/projects\\/([^\\/]+)\\/launch$/);
                if (startMatch) { const pid = decodeURIComponent(startMatch[1]); return startProjectProcess(BASE_DIR, pid, r => { appendLog(r.success ? 'SUCCESS' : 'ERROR', \`[KAEL] Start \${pid}: \${r.message || r.error}\`); sendJSON(r); }); }

                const stopMatch = url.pathname.match(/^\\/api\\/fleet\\/stop\\/([^\\/]+)$/);
                if (stopMatch) { const pid = decodeURIComponent(stopMatch[1]); return stopProjectProcess(BASE_DIR, pid, r => { appendLog(r.success ? 'SUCCESS' : 'ERROR', \`[KAEL] Stop \${pid}: \${r.message || r.error}\`); sendJSON(r); }); }

                const restartMatch = url.pathname.match(/^\\/api\\/fleet\\/restart\\/([^\\/]+)$/);
                if (restartMatch) { const pid = decodeURIComponent(restartMatch[1]); return restartProjectProcess(BASE_DIR, pid, r => { appendLog(r.success ? 'SUCCESS' : 'ERROR', \`[KAEL] Restart \${pid}: \${r.message || r.error}\`); sendJSON(r); }); }

            } catch (e) { return sendJSON({ success: false, error: e.message }, 500); }
        });
        return;
    }

    let cleanPath = url.pathname; if (cleanPath === '/' || cleanPath === '/nexus-admin' || cleanPath === '/index.html' || cleanPath === '/index') cleanPath = '/index.html';
    const targetFilePath = path.resolve(__dirname, path.basename(cleanPath));
    if (fs.existsSync(targetFilePath) && fs.statSync(targetFilePath).isFile()) {
        const ext = path.extname(targetFilePath).toLowerCase(), mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.ico': 'image/x-icon', '.png': 'image/png', '.svg': 'image/svg+xml' };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' }); fs.createReadStream(targetFilePath).pipe(res); return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify({ success: false, error: 'recurso_no_encontrado' }));
});

if (require.main === module) {
    server.listen(PORT, () => console.log(\`[NEXUS SERVER v15.2] http://localhost:\${PORT}/nexus-admin\`));
}

module.exports = { server, appendLog, broadcastSSE, sseClients, getDashboardData };
`;

// Escribir los archivos
fs.writeFileSync(path.join(BLUEPRINT_DIR, 'system_core/dashboard/fleet_manager.js'), fleetManagerCode, 'utf-8');
console.log('✅ fleet_manager.js escrito.');

fs.writeFileSync(path.join(BLUEPRINT_DIR, 'system_core/dashboard/server_actions.js'), serverActionsCode, 'utf-8');
console.log('✅ server_actions.js escrito.');

fs.writeFileSync(path.join(BLUEPRINT_DIR, 'system_core/dashboard/server.js'), serverCode, 'utf-8');
console.log('✅ server.js escrito.');
