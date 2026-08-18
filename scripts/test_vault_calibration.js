// Archivo: scripts/test_vault_calibration.js
// Suite de Certificación Automatizada: Calibración Integral de La Bóveda

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { app } = require('../backend/server');

const TEST_PORT = 5080;

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🩺 SUITE DE CERTIFICACIÓN: CALIBRACIÓN INTEGRAL DE LA BÓVEDA');
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

    // 1. Validar listado de archivos en la raíz del satélite (project=root)
    await checkAsync('Explorador de Archivos: GET /api/files?project=root', async () => {
        const res = await getJson('/api/files?project=root&dir=');
        if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
            throw new Error(`Respuesta inválida: status ${res.status}`);
        }
        const names = res.data.map(i => i.name);
        const hasSrc = names.includes('src');
        const hasBackend = names.includes('backend');
        const hasPublic = names.includes('public');
        const hasData = names.includes('data');

        if (!hasSrc || !hasBackend || !hasPublic || !hasData) {
            throw new Error(`Carpetas esperadas no encontradas: ${names.join(', ')}`);
        }
        return `${res.data.length} elementos en raíz (src, backend, public, data)`;
    });

    // 2. Validar lectura de archivos en raíz (GET /api/files/read?project=root&path=package.json)
    await checkAsync('Lectura de Archivo: GET /api/files/read?project=root&path=package.json', async () => {
        const res = await getJson('/api/files/read?project=root&path=package.json');
        if (res.status !== 200 || !res.data.success || !res.data.content) {
            throw new Error(`Status ${res.status} o contenido vacío`);
        }
        if (!res.data.content.includes('tucured-engine')) {
            throw new Error('Contenido no coincide con package.json');
        }
        return 'Lectura verificada de package.json';
    });

    // 3. Validar listado de activos de clientes (GET /api/nexus/assets/list?projectId=tucu-red)
    await checkAsync('Activos de Marca: GET /api/nexus/assets/list?projectId=tucu-red', async () => {
        const res = await getJson('/api/nexus/assets/list?projectId=tucu-red');
        if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
            throw new Error(`Status ${res.status} o activos vacíos`);
        }
        return `${res.data.length} activos listados para Tucu Red`;
    });

    // 4. Validar desacople de Firestore en useVaultBackup.js
    check('Desacople de Firestore en useVaultBackup.js', () => {
        const c = fs.readFileSync(path.resolve(__dirname, '../src/hooks/useVaultBackup.js'), 'utf-8');
        if (c.includes('firebase/firestore') || c.includes('getDocs(') || c.includes('collection(db')) {
            throw new Error('Firestore aún presente en useVaultBackup.js');
        }
        if (!c.includes('LOCAL_FIRST_SSOT')) {
            throw new Error('Falta metadato LOCAL_FIRST_SSOT en backup payload');
        }
        return 'useVaultBackup 100% Local-First verificado';
    });

    // 5. Validar TabMapping.jsx pasando rootPath="root"
    check('Paso de rootPath="root" en TabMapping.jsx', () => {
        const c = fs.readFileSync(path.resolve(__dirname, '../src/components/core/tabcontent/TabMapping.jsx'), 'utf-8');
        if (!c.includes('rootPath="root"')) {
            throw new Error('TabMapping no pasa rootPath="root" a TheVault');
        }
        return 'TabMapping enlazado a root';
    });

    // 6. Ley de 200 líneas en todos los archivos modificados
    const targetFiles = [
        'src/components/core/tabcontent/TabMapping.jsx',
        'src/components/tabs/TheVault.jsx',
        'src/components/AssetVault.jsx',
        'src/components/tabs/vault/DataCoreBackup.jsx',
        'src/hooks/useVaultBackup.js',
        'backend/routes/files.js'
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
