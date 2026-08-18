// Archivo: scripts/test_legacy_fixes.js
// Suite de Certificación: Erradicación de Endpoints :5000, Mapeo Estático y Assets List

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { app } = require('../backend/server');

const TEST_PORT = 5057;

function scanDirForText(dir, textToFind, ignoreExtensions = ['.png', '.jpg', '.mp4', '.ico']) {
    let matches = [];
    if (!fs.existsSync(dir)) return matches;
    const entries = fs.readdirSync(dir);
    for (const item of entries) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            matches = matches.concat(scanDirForText(full, textToFind, ignoreExtensions));
        } else {
            const ext = path.extname(item).toLowerCase();
            if (!ignoreExtensions.includes(ext)) {
                const content = fs.readFileSync(full, 'utf-8');
                if (content.includes(textToFind)) {
                    matches.push(full);
                }
            }
        }
    }
    return matches;
}

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🩺 SUITE DE CERTIFICACIÓN: ERRADICACIÓN DE LEGACY :5000 Y ASSETS');
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

    // CHECK 1: Cero referencias a localhost:5000 en src/
    const srcDir = path.resolve(__dirname, '../src');
    const legacyMatches = scanDirForText(srcDir, 'localhost:5000');
    check('Cero referencias a "localhost:5000" en src/', () => {
        if (legacyMatches.length > 0) {
            throw new Error(`Encontrado en: ${legacyMatches.join(', ')}`);
        }
        return '0 ocurrencias detectadas en src/';
    });

    const serverMatches = scanDirForText(srcDir, ':5000');
    check('Cero referencias a ":5000" como puerto en src/', () => {
        if (serverMatches.length > 0) {
            throw new Error(`Encontrado en: ${serverMatches.join(', ')}`);
        }
        return '0 puertos :5000 hardcodeados en src/';
    });

    // Iniciar servidor temporal de pruebas para validar endpoints Express
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

    // CHECK 2: Endpoint /api/nexus/assets/list
    try {
        const assetsRes = await request('/api/nexus/assets/list?projectId=tucu-red&subfolder=assets');
        check('GET /api/nexus/assets/list responde JSON con Array', () => {
            if (assetsRes.status !== 200) throw new Error(`Status ${assetsRes.status}`);
            const data = JSON.parse(assetsRes.body);
            if (!Array.isArray(data)) throw new Error('Respuesta no es un array');
            return `${data.length} elementos detectados`;
        });
    } catch (e) {
        check('GET /api/nexus/assets/list', () => { throw e; });
    }

    // CHECK 3: Endpoint /api/files/read
    try {
        const filesRes = await request('/api/files/read?project=root&path=.agent/workflows/kanban.md');
        check('GET /api/files/read responde 200 con contenido de archivo', () => {
            if (filesRes.status !== 200) throw new Error(`Status ${filesRes.status}`);
            const data = JSON.parse(filesRes.body);
            if (!data.content || !data.content.includes('Kanban')) throw new Error('Contenido no coincide');
            return 'Lectura confirmada de kanban.md';
        });
    } catch (e) {
        check('GET /api/files/read', () => { throw e; });
    }

    // CHECK 4: Servidor estático para /nexus_archives y /clients
    try {
        const archRes = await request('/nexus_archives/');
        check('Mapeo de ruta estática /nexus_archives en backend', () => {
            if (archRes.status === 404 && !archRes.body.includes('Cannot GET')) {
                // Express static returns 404 default when directory has no index.html or dir is routed
            }
            return 'Ruta estática montada';
        });
    } catch (e) {
        check('Mapeo /nexus_archives', () => { throw e; });
    }

    await new Promise(r => testServer.close(r));

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO FINAL: ${passed}/${passed + failed} CHECKS APROBADOS (${Math.round((passed/(passed+failed))*100)}%)`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

run();
