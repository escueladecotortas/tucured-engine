// Archivo: scripts/test_leads_factory_audit.js
// Suite de Certificación Automatizada: Fábrica de Leads, Print de Vitalis y Saneamiento Stitch

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { app } = require('../backend/server');

const TEST_PORT = 5092;

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🩺 SUITE DE CERTIFICACIÓN: AUDITORÍA DE LEADS, PRINT & STITCH');
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

    // 1. Validar endpoint de prospectos GET /api/prospects
    let prospectsList = [];
    await checkAsync('Fábrica de Leads: GET /api/prospects', async () => {
        const res = await getJson('/api/prospects');
        if (res.status !== 200 || !res.data.success || !Array.isArray(res.data.prospects)) {
            throw new Error(`Respuesta inválida: status ${res.status}`);
        }
        prospectsList = res.data.prospects;
        return `${prospectsList.length} prospectos activos listados desde Local-First / Firestore`;
    });

    // 2. Validar estructura de campos de los prospectos
    check('Estructura de Datos de Leads (Campos Requeridos)', () => {
        if (prospectsList.length === 0) throw new Error('Lista de prospectos vacía');
        const first = prospectsList[0];
        if (!first.name || !first.category) {
            throw new Error('Estructura de lead incompleta (falta name o category)');
        }
        return `Lead validado: [${first.name}] | Rubro: ${first.category} | Teléfono: ${first.phone || 'N/A'} | Status: ${first.status || 'new'}`;
    });

    // 3. Validar regla @media print reparada en src/index.css
    check('Regla @media print de Vitalis (Visibility Control)', () => {
        const cssPath = path.resolve(__dirname, '../src/index.css');
        const css = fs.readFileSync(cssPath, 'utf-8');
        if (!css.includes('body *') || !css.includes('visibility: hidden !important')) {
            throw new Error('Falta ocultamiento seguro body * en @media print');
        }
        if (!css.includes('#vitalisPrintReport') || !css.includes('visibility: visible !important')) {
            throw new Error('Falta regla de visibilidad para #vitalisPrintReport');
        }
        return 'Aislamiento de impresión certificado con visibility: hidden/visible';
    });

    // 4. Validar saneamiento en StitchShowroom.jsx (Cero Live Hub roto)
    check('Saneamiento de Arsenal Stitch (StitchShowroom.jsx)', () => {
        const showroomPath = path.resolve(__dirname, '../src/components/tabs/StitchShowroom.jsx');
        const content = fs.readFileSync(showroomPath, 'utf-8');
        if (content.includes('Live Hub') || content.includes('SHOWROOM_URL')) {
            throw new Error('StitchShowroom aún contiene el enlace Live Hub huérfano');
        }
        if (!content.includes('handleCopyCode') || !content.includes('Copiar Código')) {
            throw new Error('Falta botón funcional de Copiar Código');
        }
        return 'StitchShowroom saneado con foco en catálogo y copia de código';
    });

    // 5. Ley de 200 Líneas estricta (< 180 lín)
    const targetFiles = [
        'src/components/tabs/StitchShowroom.jsx',
        'src/components/tabs/bionics/CommercialReportModal.jsx',
        'src/components/tabs/bionics/AuditVisor.jsx',
        'backend/routes/leads/core.js',
        'backend/routes/leads/bulk.js'
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
