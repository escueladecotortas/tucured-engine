// Archivo: scripts/test_bionics_vault.js
// Suite de Certificación Automatizada: Bóveda Sin Prompt, Preview Seguro y Biónica Visual

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { app } = require('../backend/server');

const TEST_PORT = 5082;

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🩺 SUITE DE CERTIFICACIÓN: BIÓNICA VISUAL Y SANEAMIENTO DE BÓVEDA');
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

    const getRaw = (reqPath) => {
        return new Promise((resolve, reject) => {
            http.get(`http://127.0.0.1:${TEST_PORT}${reqPath}`, res => {
                let chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => resolve({ status: res.statusCode, buffer: Buffer.concat(chunks), headers: res.headers }));
            }).on('error', reject);
        });
    };

    // 1. Validar que no existan llamadas a prompt() en src/
    check('Erradicación de window.prompt() en src/', () => {
        function scanDir(dir) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    scanDir(full);
                } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
                    const content = fs.readFileSync(full, 'utf-8');
                    if (/(^|[^\w])prompt\s*\(/.test(content)) {
                        throw new Error(`Encontrada llamada a prompt() en ${full}`);
                    }
                }
            }
        }
        scanDir(path.resolve(__dirname, '../src'));
        return 'Cero llamadas a prompt() en toda la base de frontend';
    });

    // 2. Validar que CreateFolderModal.jsx exista y sea válido
    check('Modal de Creación de Carpetas (CreateFolderModal.jsx)', () => {
        const modalPath = path.resolve(__dirname, '../src/components/modals/CreateFolderModal.jsx');
        if (!fs.existsSync(modalPath)) throw new Error('CreateFolderModal.jsx no existe');
        const content = fs.readFileSync(modalPath, 'utf-8');
        if (!content.includes('FolderPlus') || !content.includes('onSubmit=')) {
            throw new Error('CreateFolderModal no tiene la estructura esperada');
        }
        return 'CreateFolderModal.jsx implementado y verificado';
    });

    // 3. Validar /api/vision/capture para URL local
    await checkAsync('Biónica Visual: POST /api/vision/capture', async () => {
        const res = await postJson('/api/vision/capture', { url: 'http://localhost:5005', projectId: 'tucu-red' });
        if (res.status !== 200 || !res.data.success || !res.data.audit) {
            throw new Error(`Status ${res.status} o respuesta fallida`);
        }
        const audit = res.data.audit;
        if (typeof audit.score !== 'number' || !audit.health || !audit.metrics || !res.data.screenshot) {
            throw new Error('Faltan campos obligatorios en el reporte biónico');
        }
        return `Score: ${audit.score}/100 (${audit.health}) | TTFB: ${audit.metrics.ttfb}ms | ${audit.issues?.length || 0} issues`;
    });

    // 4. Validar endpoint de lectura cruda /api/files/raw (Zero Freeze en imágenes)
    await checkAsync('Servidor de Archivos Crudos: GET /api/files/raw', async () => {
        const res = await getRaw('/api/files/raw?project=root&path=package.json');
        if (res.status !== 200 || res.buffer.length === 0) {
            throw new Error(`Status ${res.status} al solicitar package.json crudo`);
        }
        return `Servicio de streaming binario /raw activo (${res.buffer.length} bytes)`;
    });

    // 5. Ley de 200 Líneas estricta (< 180 lín)
    const targetFiles = [
        'src/components/modals/CreateFolderModal.jsx',
        'src/components/FileExplorer.jsx',
        'src/components/explorer/FileExplorerComponents.jsx',
        'src/components/AssetVault.jsx',
        'src/components/vault/AssetCard.jsx',
        'src/components/vault/AssetPreviewModal.jsx',
        'src/components/tabs/BionicsTab.jsx',
        'src/components/tabs/bionics/AuditIssuesList.jsx',
        'src/components/tabs/bionics/AuditVisor.jsx',
        'src/hooks/useFileExplorer.js',
        'src/hooks/useBionics.js',
        'backend/routes/files.js',
        'backend/services/VisualBionicsService.js'
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
