// Archivo: scripts/test_kanban_sync.js
// Suite de Certificación: Sincronización Local-First de Kanban y Tooltips en Terminal

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { app } = require('../backend/server');

const TEST_PORT = 5070;

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🩺 SUITE DE CERTIFICACIÓN: KANBAN LOCAL-FIRST Y TOOLTIPS TERMINAL');
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

    const getJson = (reqPath) => {
        return new Promise((resolve, reject) => {
            http.get(`http://127.0.0.1:${TEST_PORT}${reqPath}`, res => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data || '{}') }));
            }).on('error', reject);
        });
    };

    // 1. Validar endpoint GET /api/kanban/tasks
    await checkAsync('Endpoint GET /api/kanban/tasks activo y parseando', async () => {
        const res = await getJson('/api/kanban/tasks');
        if (res.status !== 200 || !res.data.success) throw new Error(`Status ${res.status}`);
        if (!Array.isArray(res.data.tasks) || res.data.tasks.length === 0) throw new Error('No se retornaron tareas');
        
        const ids = res.data.tasks.map(t => t.id);
        const hasTask010 = ids.includes('TASK-010');
        const hasTask001 = ids.includes('TASK-001');

        if (!hasTask010 || !hasTask001) {
            throw new Error(`Faltan tareas esperadas. Tareas encontradas: ${ids.join(', ')}`);
        }

        return `${res.data.tasks.length} tareas parseadas correctamente desde kanban.md`;
    });

    // 2. Validar estructura de tarea parseada
    await checkAsync('Estructura de tareas en formato SSOT', async () => {
        const res = await getJson('/api/kanban/tasks');
        const sample = res.data.tasks[0];
        if (!sample.id || !sample.title || !sample.status) {
            throw new Error('Estructura inválida en tarea: ' + JSON.stringify(sample));
        }
        return `ID: ${sample.id} | Status: ${sample.status} | Agente: @${sample.assignedTo}`;
    });

    // 3. Validar tooltips en AgentTerminal.jsx
    check('Tooltips descriptivos presentes en AgentTerminal.jsx', () => {
        const c = fs.readFileSync(path.resolve(__dirname, '../src/components/AgentTerminal.jsx'), 'utf-8');
        const requiredTooltips = [
            'Diagnóstico clínico VITALIS',
            'Auditoría del Enjambre',
            'Control de Versiones',
            'Explorador de Archivos',
            'Mantenimiento Visual'
        ];
        for (const tip of requiredTooltips) {
            if (!c.includes(tip)) throw new Error(`Tooltip faltante: "${tip}"`);
        }
        return '5 tooltips interactivos verificados';
    });

    // 4. Validar desacople de Firestore en MissionsTab.jsx
    check('Desacople de Firestore en MissionsTab.jsx', () => {
        const c = fs.readFileSync(path.resolve(__dirname, '../src/components/tabs/MissionsTab.jsx'), 'utf-8');
        if (c.includes("collection(db, 'tasks')") || c.includes('firebase/firestore')) {
            throw new Error('Suscripción Firestore aún presente en MissionsTab.jsx');
        }
        if (!c.includes('/api/kanban/tasks')) {
            throw new Error('MissionsTab.jsx no consume /api/kanban/tasks');
        }
        return 'Desacoplado de Firestore y conectado a /api/kanban/tasks';
    });

    // 5. Ley de 200 líneas
    const targetFiles = [
        'src/components/AgentTerminal.jsx',
        'src/components/tabs/MissionsTab.jsx',
        'backend/routes/kanban.js'
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
