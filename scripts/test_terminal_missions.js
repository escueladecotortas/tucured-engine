// Archivo: scripts/test_terminal_missions.js
// Suite de Certificación Automatizada: Terminal Core, Streaming SSE y Misiones

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { app } = require('../backend/server');

const TEST_PORT = 5065;

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🩺 SUITE DE CERTIFICACIÓN: TERMINAL CORE, SSE Y TAB DE MISIONES');
    console.log('════════════════════════════════════════════════════════════════════\n');

    let passed = 0;
    let failed = 0;

    function check(label, fn) {
        try {
            const res = fn();
            console.log(`✅ [PASS] ${label}${res ? ' → ' + res : ''}`);
            passed++;
        } catch (e) {
            console.error(`❌ [FAIL] ${label} → ${e.message}`);
            failed++;
        }
    }

    async function checkAsync(label, fn) {
        try {
            const res = await fn();
            console.log(`✅ [PASS] ${label}${res ? ' → ' + res : ''}`);
            passed++;
        } catch (e) {
            console.error(`❌ [FAIL] ${label} → ${e.message}`);
            failed++;
        }
    }

    // Iniciar servidor Express de prueba
    const testServer = http.createServer(app);
    await new Promise(r => testServer.listen(TEST_PORT, '127.0.0.1', r));

    const postJson = (reqPath, body) => {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(body);
            const req = http.request({
                hostname: '127.0.0.1',
                port: TEST_PORT,
                path: reqPath,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                }
            }, res => {
                let resData = '';
                res.on('data', c => resData += c);
                res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(resData || '{}') }));
            });
            req.on('error', reject);
            req.write(data);
            req.end();
        });
    };

    // 1. Validar eliminación de TerminalService.js
    check('Eliminación de archivo obsoleto TerminalService.js', () => {
        const deadFile = path.resolve(__dirname, '../backend/services/TerminalService.js');
        if (fs.existsSync(deadFile)) throw new Error('TerminalService.js aún existe');
        return 'Archivo purgado exitosamente';
    });

    // 2. Validar ejecución de comandos en Terminal Core
    await checkAsync('Terminal Core: Ejecución de comando "health"', async () => {
        const res = await postJson('/api/terminal/execute', { command: 'health', agent: 'USER' });
        if (res.status !== 200 || !res.data.success) throw new Error(`Status ${res.status}`);
        return 'HTTP 200 success';
    });

    await checkAsync('Terminal Core: Ejecución de comando "services"', async () => {
        const res = await postJson('/api/terminal/execute', { command: 'services', agent: 'USER' });
        if (res.status !== 200 || !res.data.success) throw new Error(`Status ${res.status}`);
        return 'HTTP 200 success';
    });

    await checkAsync('Terminal Core: Ejecución de comando shell "git status"', async () => {
        const res = await postJson('/api/terminal/execute', { command: 'git status', agent: 'USER' });
        if (res.status !== 200 || !res.data.success) throw new Error(`Status ${res.status}`);
        return 'HTTP 200 shell spawn';
    });

    // 3. Validar canal SSE de Terminal
    await checkAsync('Terminal Core: Canal SSE /api/terminal/stream', async () => {
        return new Promise((resolve, reject) => {
            const req = http.get(`http://127.0.0.1:${TEST_PORT}/api/terminal/stream`, res => {
                if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
                if (!res.headers['content-type']?.includes('text/event-stream')) {
                    return reject(new Error('Content-Type no es text/event-stream'));
                }
                res.on('data', chunk => {
                    const str = chunk.toString();
                    if (str.includes('Enlace neural SSE establecido')) {
                        req.destroy();
                        resolve('Canal SSE activo con handshake');
                    }
                });
            });
            req.on('error', reject);
            setTimeout(() => { req.destroy(); reject(new Error('Timeout SSE')); }, 3000);
        });
    });

    // 4. Validar purga de tareas fósiles en db_dump.json
    check('Misiones: Purga de tareas fósiles en data/db_dump.json', () => {
        const dumpPath = path.resolve(__dirname, '../data/db_dump.json');
        const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));
        const tasks = Object.values(dump.tasks || {});
        
        const invalidAgents = ['deco', 'lumina'];
        const fossilFound = tasks.find(t => invalidAgents.includes((t.assignedTo || '').toLowerCase()));
        if (fossilFound) throw new Error(`Tarea asignada a agente fósil encontrada: ${fossilFound.assignedTo}`);

        const tucuTasks = tasks.filter(t => t.projectId === 'tucu-red');
        if (tucuTasks.length < 4) throw new Error(`Se esperaban al menos 4 misiones para tucu-red, se encontraron ${tucuTasks.length}`);

        return `4 misiones activas de embudo sin agentes fósiles`;
    });

    // 5. Validar endpoint canónico de ignición de misiones
    await checkAsync('Misiones: Ignición canónica POST /api/nexus/ignite-mission', async () => {
        const res = await postJson('/api/nexus/ignite-mission', {
            projectId: 'tucu-red',
            missionId: 'tucu-m01-scraping',
            agentId: 'icaro'
        });
        if (res.status !== 200 || res.data.status !== 'ignited') {
            throw new Error(`Respuesta inesperada: ${JSON.stringify(res.data)}`);
        }
        return `HTTP 200 status ignited`;
    });

    // 6. Ley de 200 líneas
    const targetFiles = [
        'src/components/AgentTerminal.jsx',
        'src/components/tabs/MissionsTab.jsx',
        'src/components/tabs/QuickAddMission.jsx',
        'src/components/tabs/MissionCard.jsx',
        'src/components/tabs/missions-config.js',
        'backend/routes/terminal.js'
    ];

    check('Ley de 200 Líneas estricta (< 180 lín)', () => {
        for (const rel of targetFiles) {
            const full = path.resolve(__dirname, '..', rel);
            const lines = fs.readFileSync(full, 'utf-8').split('\n').length;
            if (lines > 180) throw new Error(`${rel} supera 180 líneas (${lines} lín)`);
        }
        return `${targetFiles.length} archivos conformes (< 180 líneas)`;
    });

    await new Promise(r => testServer.close(r));

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed/(passed+failed))*100)}%)`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

run();
