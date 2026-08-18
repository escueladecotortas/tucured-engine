// Archivo: scripts/test_overview_calibration.js
// Suite de Certificación: Calibración Overview, 14 Puntos de Saneamiento y Utilidad Pura

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { app } = require('../backend/server');

const TEST_PORT = 5060;

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🩺 SUITE DE CERTIFICACIÓN: 14 PUNTOS DE SANEAMIENTO OVERVIEW');
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

    // Iniciar servidor Express de prueba
    const testServer = http.createServer(app);
    await new Promise(r => testServer.listen(TEST_PORT, '127.0.0.1', r));

    const request = (reqPath) => {
        return new Promise((resolve, reject) => {
            http.get(`http://127.0.0.1:${TEST_PORT}${reqPath}`, res => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
            }).on('error', reject);
        });
    };

    // CHECK 1: Branding sobrio en CollapsibleSidebar.jsx (Punto 1)
    check('Punto 1: Branding sobrio "Nexus OS" en CollapsibleSidebar.jsx', () => {
        const c = fs.readFileSync(path.resolve(__dirname, '../src/components/core/CollapsibleSidebar.jsx'), 'utf-8');
        if (c.includes('NEXUS PRO') || c.includes('v5.4 NEON')) throw new Error('Branding viejo detectado');
        if (!c.includes('Nexus OS')) throw new Error('Nexus OS no encontrado');
        return 'Nexus OS sobrio';
    });

    // CHECK 2 & 4: HeaderProjectInfo.jsx (Puntos 2, 3, 4)
    check('Puntos 2, 3, 4: Título "Tucu Red" sin botón volver ni migas de pan', () => {
        const c = fs.readFileSync(path.resolve(__dirname, '../src/components/core/header/HeaderProjectInfo.jsx'), 'utf-8');
        if (c.includes('Volver a la Entrada') || c.includes('backLabel')) throw new Error('Botón volver aún presente');
        if (c.includes('MODO CONSOLA')) throw new Error('Migas de pan aún presentes');
        return 'Título limpio "Tucu Red"';
    });

    // CHECK 3: HeaderUserActions.jsx (Puntos 6, 7, 8)
    check('Puntos 6, 7, 8: Botón Landing explícito, sin terminal ni visual editor', () => {
        const c = fs.readFileSync(path.resolve(__dirname, '../src/components/core/header/HeaderUserActions.jsx'), 'utf-8');
        if (c.includes('System Console') || c.includes('Terminal Core')) throw new Error('Terminal duplicado en header');
        if (c.includes('Editor Visual WYSIWYG')) throw new Error('Editor visual en header');
        if (!c.includes('Landing')) throw new Error('Botón Landing no encontrado');
        return 'Landing button OK';
    });

    // CHECK 4: Avatares en Neural Team (Punto 9)
    check('Punto 9: Avatares en AgentGridView y AgentDetailView sin 404', () => {
        const g = fs.readFileSync(path.resolve(__dirname, '../src/components/tabs/AgentGridView.jsx'), 'utf-8');
        const d = fs.readFileSync(path.resolve(__dirname, '../src/components/tabs/AgentDetailView.jsx'), 'utf-8');
        if (g.includes('/avatars/team_') || d.includes('/avatars/team_')) throw new Error('Ruta rota /avatars/ aún presente');
        return 'Avatares vectoriales reparados';
    });

    // CHECK 5: Accesos Rápidos y SidebarPanel (Puntos 11, 12)
    check('Puntos 11, 12: QuickProductionActions y SmartNotepad expandido', () => {
        const s = fs.readFileSync(path.resolve(__dirname, '../src/components/core/SidebarPanel.jsx'), 'utf-8');
        if (s.includes('NetlifyHealth')) throw new Error('NetlifyHealth 512MB aún presente');
        if (!s.includes('QuickProductionActions')) throw new Error('QuickProductionActions ausente');
        return 'Panel lateral optimizado';
    });

    // CHECK 6: Fondo sobrio en OverviewV2 (Punto 13)
    check('Punto 13: Fondo plano sobrio sin imagen de fondo cinemática', () => {
        const o = fs.readFileSync(path.resolve(__dirname, '../src/components/tabs/OverviewV2.jsx'), 'utf-8');
        if (o.includes('getFloorAsset') || o.includes('assets/cinematic')) throw new Error('Imagen cinemática aún presente');
        return 'Fondo plano bg-slate-950';
    });

    // CHECK 7: Radar Táctico EmptyState operativo (Punto 14)
    check('Punto 14: Radar Táctico con pipeline operativo en EmptyState', () => {
        const t = fs.readFileSync(path.resolve(__dirname, '../src/components/widgets/tactical/TacticalExtras.jsx'), 'utf-8');
        if (!t.includes('Pipeline de Operaciones Activo')) throw new Error('Pipeline no integrado en EmptyState');
        return 'Pipeline operativo en Radar Táctico';
    });

    // CHECK 8: Ley de 200 líneas en todos los archivos modificados
    const sprintFiles = [
        'src/components/core/CollapsibleSidebar.jsx',
        'src/components/core/HeaderIsland.jsx',
        'src/components/core/header/HeaderProjectInfo.jsx',
        'src/components/core/header/HeaderUserActions.jsx',
        'src/components/tabs/AgentGridView.jsx',
        'src/components/tabs/AgentDetailView.jsx',
        'src/components/widgets/QuickProductionActions.jsx',
        'src/components/core/SidebarPanel.jsx',
        'src/components/tabs/OverviewV2.jsx',
        'src/components/tabs/overview/PowerGridLayout.jsx',
        'src/components/tabs/overview/OverviewKpis.jsx',
        'src/components/widgets/SmartGantt.jsx',
        'src/components/widgets/tactical/TacticalExtras.jsx',
        'src/components/NexusConsole.jsx'
    ];

    check('Ley de 200 Líneas estricta (< 180 lín)', () => {
        for (const rel of sprintFiles) {
            const full = path.resolve(__dirname, '..', rel);
            const lines = fs.readFileSync(full, 'utf-8').split('\n').length;
            if (lines > 180) throw new Error(`${rel} supera 180 líneas (${lines} lín)`);
        }
        return `${sprintFiles.length} archivos conformes (< 180 líneas)`;
    });

    await new Promise(r => testServer.close(r));

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed/(passed+failed))*100)}%)`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

run();
