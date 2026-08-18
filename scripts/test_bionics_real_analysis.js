// Archivo: scripts/test_bionics_real_analysis.js
// Suite de Certificación: Motor Heurístico Real y Reporte Comercial en Biónica Visual

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { app } = require('../backend/server');

const TEST_PORT = 5088;

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🩺 SUITE DE CERTIFICACIÓN: ANÁLISIS HEURÍSTICO REAL & REPORTE COMERCIAL');
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

    let audit1, audit2;

    // 1. Auditar URL 1 (http://rent-imagen.com.ar/)
    await checkAsync('Auditoría URL 1 (http://rent-imagen.com.ar/)', async () => {
        const res = await postJson('/api/vision/capture', { url: 'http://rent-imagen.com.ar/', projectId: 'rent-imagen' });
        if (res.status !== 200 || !res.data.success || !res.data.audit) {
            throw new Error(`Fallo en captura URL 1: status ${res.status}`);
        }
        audit1 = res.data.audit;
        return `Score: ${audit1.score}/100 [${audit1.health}] | SSL: ${audit1.metrics.isHttps ? 'HTTPS' : 'HTTP'} | TTFB: ${audit1.metrics.ttfb}ms | DOM: ${audit1.metrics.domNodes} nodos`;
    });

    // 2. Auditar URL 2 (https://tucured.ar)
    await checkAsync('Auditoría URL 2 (https://tucured.ar)', async () => {
        const res = await postJson('/api/vision/capture', { url: 'https://tucured.ar', projectId: 'tucu-red' });
        if (res.status !== 200 || !res.data.success || !res.data.audit) {
            throw new Error(`Fallo en captura URL 2: status ${res.status}`);
        }
        audit2 = res.data.audit;
        return `Score: ${audit2.score}/100 [${audit2.health}] | SSL: ${audit2.metrics.isHttps ? 'HTTPS' : 'HTTP'} | TTFB: ${audit2.metrics.ttfb}ms | DOM: ${audit2.metrics.domNodes} nodos`;
    });

    // 3. Certificar variabilidad heurística real entre URL 1 y URL 2 (Cero mocks fijos)
    check('Variabilidad Heurística Real (Cero Datos Hardcodeados)', () => {
        if (!audit1 || !audit2) throw new Error('No se completaron ambas auditorías');
        if (audit1.score === audit2.score && audit1.metrics.isHttps === audit2.metrics.isHttps) {
            throw new Error('Los resultados de ambas URLs son idénticos (sospecha de mock fijo)');
        }
        if (audit1.metrics.isHttps !== false || audit2.metrics.isHttps !== true) {
            throw new Error('Detección de SSL errónea');
        }
        const titles1 = audit1.issues.map(i => i.title).join(', ');
        const titles2 = audit2.issues.map(i => i.title).join(', ');
        if (titles1 === titles2) {
            throw new Error('La lista de issues es idéntica entre sitios diferentes');
        }
        return `Diferenciación estricta confirmada: rent-imagen(${audit1.score}pts, HTTP, ${audit1.metrics.domNodes} nodos) vs tucured(${audit2.score}pts, HTTPS, ${audit2.metrics.domNodes} nodos)`;
    });

    // 4. Validar Ficha Comercial y Exportación (CommercialReportModal.jsx)
    check('Componente de Reporte Comercial (CommercialReportModal.jsx)', () => {
        const filePath = path.resolve(__dirname, '../src/components/tabs/bionics/CommercialReportModal.jsx');
        if (!fs.existsSync(filePath)) throw new Error('CommercialReportModal.jsx no existe');
        const content = fs.readFileSync(filePath, 'utf-8');
        if (!content.includes('window.print()') || !content.includes('handleCopyMarkdown')) {
            throw new Error('Faltan acciones de impresión o copia en CommercialReportModal');
        }
        return 'Modal de Ficha Comercial con Print y Copia Markdown activo';
    });

    // 5. Ley de 200 Líneas estricta (< 180 lín)
    const targetFiles = [
        'backend/services/VisualBionicsService.js',
        'src/components/tabs/BionicsTab.jsx',
        'src/components/tabs/bionics/BionicsHeader.jsx',
        'src/components/tabs/bionics/AuditKpiSection.jsx',
        'src/components/tabs/bionics/AuditIssuesList.jsx',
        'src/components/tabs/bionics/AuditVisor.jsx',
        'src/components/tabs/bionics/CommercialReportModal.jsx'
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
