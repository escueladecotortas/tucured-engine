// Archivo: scripts/apply_blueprint_modal_cleanup.js
// Actualización de UX en Modal de Logs de Flota en blueprint-nexus

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLUEPRINT_DIR = path.resolve(__dirname, '../../blueprint-nexus');

// 1. fleet_ui.js (< 175 líneas)
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
    if (out) out.innerHTML = '<div class="text-slate-500 text-center py-4 font-mono text-[10px]">Conectando con SSE Stream...</div>';
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

function clearFleetLogsScreen() {
    const out = document.getElementById('fleetLogsModalContent');
    if (out) {
        out.innerHTML = '<div class="text-slate-600 italic text-center py-4 font-mono text-[10px]">-- Pantalla de logs despejada --</div>';
    }
    showToast('Pantalla de logs despejada', '🧹');
}

function closeFleetLogs() {
    if (activeLogsEventSource) {
        activeLogsEventSource.close();
        activeLogsEventSource = null;
    }
    toggleModal('fleetLogsModal', false);
}
`;

// 2. index.html: actualizar modal de logs
const indexPath = path.join(BLUEPRINT_DIR, 'system_core/dashboard/index.html');
let indexContent = fs.readFileSync(indexPath, 'utf-8');

const updatedLogsModal = `    <!-- MODAL LOGS EN VIVO DE FLOTA -->
    <div id="fleetLogsModal" class="fixed inset-0 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4 z-50 font-mono text-xs">
        <div class="bg-slate-900 border border-cyan-500/40 max-w-3xl w-full rounded-2xl p-5 space-y-3 shadow-2xl shadow-cyan-900/20">
            <div class="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <div class="flex items-center gap-2">
                    <span class="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <h3 id="fleetLogsModalTitle" class="text-xs font-bold text-cyan-300 uppercase tracking-wider">LIVE STREAM</h3>
                </div>
                <div class="flex items-center gap-2">
                    <button id="btnCopyFleetLogs" onclick="copyFleetLogs()" class="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5">📋 Copiar Log</button>
                    <button onclick="closeFleetLogs()" class="text-slate-400 hover:text-white font-bold text-base cursor-pointer">&times;</button>
                </div>
            </div>
            <div id="fleetLogsModalContent" class="bg-black/95 p-4 rounded-xl border border-slate-800 text-[11px] h-96 overflow-y-auto space-y-1 text-slate-200 font-mono"></div>
            <div class="flex justify-between items-center pt-2 border-t border-slate-800">
                <span class="text-[9px] text-slate-500">Transmisión en tiempo real vía Server-Sent Events (SSE)</span>
                <div class="flex items-center gap-2">
                    <button onclick="clearFleetLogsScreen()" class="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-amber-300 border border-slate-700/60 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1">🧹 Limpiar Pantalla</button>
                    <button onclick="closeFleetLogs()" class="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer">Cerrar Visor</button>
                </div>
            </div>
        </div>
    </div>`;

indexContent = indexContent.replace(/<!-- MODAL LOGS EN VIVO DE FLOTA -->[\s\S]*?<\/div>\s*<\/div>/, updatedLogsModal);

fs.writeFileSync(path.join(BLUEPRINT_DIR, 'system_core/dashboard/fleet_ui.js'), fleetUiCode, 'utf-8');
console.log('✅ fleet_ui.js actualizado con clearFleetLogsScreen.');

fs.writeFileSync(indexPath, indexContent, 'utf-8');
console.log('✅ index.html actualizado con nueva botonera.');
