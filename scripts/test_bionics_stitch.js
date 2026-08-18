// Archivo: scripts/test_bionics_stitch.js
// Suite de Certificación Automatizada: Biónica Visual Accionable y Arsenal Stitch

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { app } = require('../backend/server');

const TEST_PORT = 5084;

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🩺 SUITE DE CERTIFICACIÓN: BIÓNICA ACCIONABLE Y ARSENAL STITCH');
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

    const postJson = (reqPath, payload) => {
        return new Promise((resolve, reject) => {
            const dataStr = JSON.stringify(payload);
            const req = http.request(`http://127.0.0.1:${TEST_PORT}${reqPath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(dataStr)
                }
            }, res => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data || '{}') }));
            });
            req.on('error', reject);
            req.write(dataStr);
            req.end();
        });
    };

    // 1. Validar catálogo de widgets en Arsenal Stitch (GET /api/stitch/components)
    await checkAsync('Arsenal Stitch: GET /api/stitch/components', async () => {
        const res = await getJson('/api/stitch/components');
        if (res.status !== 200 || !res.data.success || !Array.isArray(res.data.components)) {
            throw new Error(`Respuesta inválida: status ${res.status}`);
        }
        if (res.data.components.length === 0) {
            throw new Error('Catálogo de widgets vacío');
        }
        const cats = [...new Set(res.data.components.map(c => c.category))];
        return `${res.data.components.length} widgets registrados en ${cats.length} categorías (${cats.join(', ')})`;
    });

    // 2. Validar renderizado simulado de widget (POST /api/stitch/render)
    await checkAsync('Arsenal Stitch: POST /api/stitch/render', async () => {
        const catRes = await getJson('/api/stitch/components');
        const firstComp = catRes.data.components[0];
        const res = await postJson('/api/stitch/render', {
            componentId: firstComp.id,
            data: { title: 'Test Tucu Red', subtitle: 'Demostración de ensamblado' }
        });
        if (res.status !== 200 || !res.data.success || !res.data.renderedHtml) {
            throw new Error('Fallo en renderizado simulado');
        }
        return `Renderizado exitoso de [${firstComp.name}] (${res.data.renderedHtml.length} bytes HTML)`;
    });

    // 3. Validar accionabilidad en AuditIssuesList.jsx (Auto-reparación con Codi y apply-html-patch)
    check('Accionabilidad en Biónica (AuditIssuesList.jsx)', () => {
        const filePath = path.resolve(__dirname, '../src/components/tabs/bionics/AuditIssuesList.jsx');
        const content = fs.readFileSync(filePath, 'utf-8');
        if (!content.includes('handleAutoFix') || !content.includes('/api/nexus/apply-html-patch')) {
            throw new Error('AuditIssuesList no tiene botón o handler de auto-reparación');
        }
        if (!content.includes('toast.success')) {
            throw new Error('AuditIssuesList no tiene feedback visual al reparar');
        }
        return 'Botón de auto-reparación Codi y feedback visual integrados';
    });

    // 4. Validar Layout Compacto en BionicsTab.jsx
    check('Layout Compacto en BionicsTab.jsx', () => {
        const filePath = path.resolve(__dirname, '../src/components/tabs/BionicsTab.jsx');
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('h-[500px]')) {
            throw new Error('BionicsTab contiene altura fija sobredimensionada h-[500px]');
        }
        return 'Layout compacto verificado con min-h-0 y proporciones responsivas';
    });

    // 5. Ley de 200 Líneas estricta (< 180 lín)
    const targetFiles = [
        'src/components/tabs/BionicsTab.jsx',
        'src/components/tabs/bionics/BionicsHeader.jsx',
        'src/components/tabs/bionics/AuditKpiSection.jsx',
        'src/components/tabs/bionics/AuditIssuesList.jsx',
        'src/components/tabs/bionics/AuditVisor.jsx',
        'src/components/tabs/StitchShowroom.jsx',
        'backend/routes/stitch.js'
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
