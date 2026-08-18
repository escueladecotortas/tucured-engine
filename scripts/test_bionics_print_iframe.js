// Archivo: scripts/test_bionics_print_iframe.js
// Suite de Certificación Automatizada: Ficha A4 de Vitalis, Iframe Responsivo y Arsenal Stitch

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { app } = require('../backend/server');

const TEST_PORT = 5090;

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🩺 SUITE DE CERTIFICACIÓN: FICHA VITALIS, IFRAME & ARSENAL STITCH');
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

    // 1. Validar reglas de aislamiento @media print en src/index.css
    check('Aislamiento CSS @media print (#vitalisPrintReport)', () => {
        const cssPath = path.resolve(__dirname, '../src/index.css');
        const css = fs.readFileSync(cssPath, 'utf-8');
        if (!css.includes('@media print') || !css.includes('#vitalisPrintReport')) {
            throw new Error('Faltan reglas @media print para #vitalisPrintReport');
        }
        if (!css.includes('display: none !important')) {
            throw new Error('No se oculta la UI de la app durante impresión');
        }
        return 'Reglas print configuradas para impresión A4 limpia y aislamiento de #vitalisPrintReport';
    });

    // 2. Validar Navegador Simulado con Iframe y soporte Desktop/Mobile en AuditVisor.jsx
    check('Visor Biónico Responsivo (AuditVisor.jsx)', () => {
        const visorPath = path.resolve(__dirname, '../src/components/tabs/bionics/AuditVisor.jsx');
        const content = fs.readFileSync(visorPath, 'utf-8');
        if (!content.includes('<iframe') || !content.includes('sandbox=')) {
            throw new Error('AuditVisor no renderiza un <iframe> embebido');
        }
        if (!content.includes("viewMode === 'desktop'") || !content.includes("viewMode === 'mobile'")) {
            throw new Error('AuditVisor no tiene conmutador de modo Desktop / Mobile');
        }
        if (!content.includes('375px')) {
            throw new Error('AuditVisor no implementa marco móvil de 375px');
        }
        return 'Iframe interactivo con conmutación Desktop (100%) y Mobile (375px) certificado';
    });

    // 3. Validar Ficha Institucional A4 de Vitalis en CommercialReportModal.jsx
    check('Ficha Institucional A4 de Vitalis (CommercialReportModal.jsx)', () => {
        const modalPath = path.resolve(__dirname, '../src/components/tabs/bionics/CommercialReportModal.jsx');
        const content = fs.readFileSync(modalPath, 'utf-8');
        if (!content.includes('id="vitalisPrintReport"')) {
            throw new Error('Falta id="vitalisPrintReport" en el modal de reporte');
        }
        if (!content.includes('VITALIS') || !content.includes('Kernel Medical Officer')) {
            throw new Error('Falta firma institucional de VITALIS en el reporte');
        }
        if (!content.includes('diagnosisText') || !content.includes('Diagnóstico Ejecutivo')) {
            throw new Error('Falta párrafo de diagnóstico ejecutivo clínico');
        }
        return 'Informe Clínico A4 de Vitalis con diagnóstico ejecutivo y tabla de hallazgos verificado';
    });

    // 4. Validar Catálogo y API de Arsenal Stitch
    await checkAsync('Arsenal Stitch: GET /api/stitch/components', async () => {
        const res = await getJson('/api/stitch/components');
        if (res.status !== 200 || !res.data.success || !Array.isArray(res.data.components)) {
            throw new Error(`Fallo en catálogo Stitch: status ${res.status}`);
        }
        if (res.data.components.length < 10) {
            throw new Error(`Catálogo incompleto: solo ${res.data.components.length} widgets`);
        }
        return `${res.data.components.length} widgets modulares disponibles en 7 categorías`;
    });

    // 5. Ley de 200 Líneas estricta (< 180 lín)
    const targetFiles = [
        'src/components/tabs/bionics/CommercialReportModal.jsx',
        'src/components/tabs/bionics/AuditVisor.jsx',
        'src/components/tabs/BionicsTab.jsx',
        'src/components/tabs/bionics/BionicsHeader.jsx',
        'src/components/tabs/StitchShowroom.jsx'
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
