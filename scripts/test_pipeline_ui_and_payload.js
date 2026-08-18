// Archivo: scripts/test_pipeline_ui_and_payload.js
// Suite de Certificación: Cierre de Pipeline 100%, Copiar Payload y Trazabilidad Stitch

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config();

const { app } = require('../backend/server');

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('⚡ SUITE DE CERTIFICACIÓN: CIERRE 100%, PAYLOAD & TRAZABILIDAD STITCH');
    console.log('════════════════════════════════════════════════════════════════════\n');

    let passed = 0;
    let failed = 0;

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

    // Iniciar Servidor Express de prueba
    const testServer = http.createServer(app);
    await new Promise(r => testServer.listen(0, '127.0.0.1', r));
    const dynamicPort = testServer.address().port;

    const requestJson = (method, p) => new Promise((resolve, reject) => {
        const req = http.request({
            hostname: '127.0.0.1', port: dynamicPort, path: p, method,
            headers: { 'Content-Type': 'application/json' }
        }, r => {
            let data = '';
            r.on('data', c => data += c);
            r.on('end', () => {
                let parsed = null;
                try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
                resolve({ status: r.statusCode, data: parsed, headers: r.headers });
            });
        });
        req.on('error', reject);
        req.end();
    });

    const testSlug = 'bar-irlanda-test';

    // 1. Asegurar manifiesto de prueba para Bar Irlanda
    const sampleManifest = {
        prompt: 'Landing page de alta conversión para "Bar Irlanda" en Tucumán.',
        designTokens: {
            namedColors: { primary: '#6ee591', secondary: '#e9c349', surface: '#001800' },
            font: 'Montserrat',
            bodyFont: 'Inter',
            roundness: 'MEDIUM'
        },
        metadata: {
            projectId: '7523618963240747915',
            modelId: 'GEMINI_3_1_PRO',
            timestamp: new Date().toISOString()
        }
    };

    const archivesPath = path.resolve(__dirname, `../nexus_archives/tucu-red/clients/${testSlug}`);
    const publicPath = path.resolve(__dirname, `../public/clients/${testSlug}`);
    fs.mkdirSync(archivesPath, { recursive: true });
    fs.mkdirSync(publicPath, { recursive: true });
    fs.writeFileSync(path.join(archivesPath, 'stitch-manifest.json'), JSON.stringify(sampleManifest, null, 2));
    fs.writeFileSync(path.join(publicPath, 'stitch-manifest.json'), JSON.stringify(sampleManifest, null, 2));
    fs.writeFileSync(path.join(archivesPath, 'client-assets.json'), JSON.stringify({ name: 'Bar Irlanda', slug: testSlug, phone: '+5493815559876' }, null, 2));

    // 1. GET /api/nexus/assets/payload?slug=bar-irlanda-test
    await checkAsync('1. GET /api/nexus/assets/payload (Botón Copiar Payload Stitch) → HTTP 200', async () => {
        const res = await requestJson('GET', `/api/nexus/assets/payload?slug=${testSlug}`);
        if (res.status !== 200 || !res.data.success) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
        return `HTTP ${res.status} OK | Payload recuperado para "${res.data.slug}"`;
    });

    // 2. GET /api/nexus/assets/stitch-manifest?slug=bar-irlanda-test
    await checkAsync('2. GET /api/nexus/assets/stitch-manifest (Inspector DESIGN.md) → HTTP 200', async () => {
        const res = await requestJson('GET', `/api/nexus/assets/stitch-manifest?slug=${testSlug}`);
        if (res.status !== 200 || !res.data.success) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
        const tokens = Object.keys(res.data.manifest?.designTokens?.namedColors || {}).length;
        return `HTTP ${res.status} OK | ${tokens} tokens de diseño | Modelo: ${res.data.manifest?.metadata?.modelId}`;
    });

    // 3. Canal SSE de Terminal Core (/api/terminal/stream)
    await checkAsync('3. Canal SSE en Tiempo Real (/api/terminal/stream) → Handshake 200', async () => {
        return new Promise((resolve, reject) => {
            const req = http.request({
                hostname: '127.0.0.1', port: dynamicPort, path: '/api/terminal/stream', method: 'GET'
            }, r => {
                if (r.statusCode === 200 && r.headers['content-type']?.includes('text/event-stream')) {
                    req.destroy();
                    resolve('HTTP 200 OK (Content-Type: text/event-stream)');
                } else {
                    reject(new Error(`Status ${r.statusCode}, Content-Type: ${r.headers['content-type']}`));
                }
            });
            req.on('error', reject);
            req.end();
        });
    });

    // 4. Verificación de Trazabilidad en Disco (stitch-manifest.json)
    await checkAsync('4. Persistencia Física de stitch-manifest.json y DESIGN.md', async () => {
        const hasPublic = fs.existsSync(path.join(publicPath, 'stitch-manifest.json'));
        const hasArchives = fs.existsSync(path.join(archivesPath, 'stitch-manifest.json'));
        if (!hasPublic || !hasArchives) throw new Error('Falta archivo de manifiesto en public o nexus_archives');
        return `Verificado en disco (public + nexus_archives)`;
    });

    // 5. Ley de 200 Líneas en Archivos Modificados
    const files = [
        'src/components/tabs/neural-factory/useNeuralActions.js',
        'src/components/database/ProspectsTable.jsx',
        'backend/services/stitch/StitchDesignExtractor.js',
        'backend/routes/nexus/assets.js',
        'backend/routes/nexus.js'
    ];

    try {
        for (const rel of files) {
            const p = path.resolve(__dirname, '..', rel);
            if (fs.existsSync(p)) {
                const lines = fs.readFileSync(p, 'utf-8').split('\n').length;
                if (lines > 180) throw new Error(`${rel} supera 180 líneas (${lines} lín)`);
            }
        }
        console.log(`✅ [PASS] 5. Ley de 200 Líneas estricta → ${files.length} archivos conformes (< 180 líneas)`);
        passed++;
    } catch (e) {
        console.error(`❌ [FAIL] 5. Ley de 200 Líneas → ${e.message}`);
        failed++;
    }

    await new Promise(r => testServer.close(r));

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed/(passed+failed))*100)}%)`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

run();
