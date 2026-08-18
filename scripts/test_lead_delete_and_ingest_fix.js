// Archivo: scripts/test_lead_delete_and_ingest_fix.js
// Suite de Certificación: Ingesta Manual 200, Enriquecimiento 200, Borrado Atómico y Cero Zombis

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
const { db } = require('../backend/config/db');
const LOCAL_DUMP_PATH = path.resolve(__dirname, '../data/db_dump.json');

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('⚡ SUITE DE CERTIFICACIÓN: PURGA ATÓMICA Y ENDPOINTS CANÓNICOS 200');
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

    // Iniciar Servidor Express de prueba en puerto dinámico
    const testServer = http.createServer(app);
    await new Promise(r => testServer.listen(0, '127.0.0.1', r));
    const dynamicPort = testServer.address().port;

    const requestJson = (method, p, body) => new Promise((resolve, reject) => {
        const req = http.request({
            hostname: '127.0.0.1', port: dynamicPort, path: p, method,
            headers: { 'Content-Type': 'application/json' }
        }, r => {
            let data = '';
            r.on('data', c => data += c);
            r.on('end', () => resolve({ status: r.statusCode, data: JSON.parse(data || '{}') }));
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });

    // 1. Verificación de Cero Zombis de "Café San Martín Test"
    await checkAsync('1. Certificación de Purga de Zombis ("Café San Martín Test")', async () => {
        if (db) {
            const snap = await db.collection('prospects').get();
            const zombiesInFirestore = snap.docs.filter(d => (d.data().name || '').toLowerCase().includes('san martín test') || (d.data().name || '').toLowerCase().includes('san martin test'));
            if (zombiesInFirestore.length > 0) throw new Error(`${zombiesInFirestore.length} zombis aún presentes en Firestore`);
        }
        if (fs.existsSync(LOCAL_DUMP_PATH)) {
            const dump = JSON.parse(fs.readFileSync(LOCAL_DUMP_PATH, 'utf-8'));
            const dumpItems = Array.isArray(dump.prospects) ? dump.prospects : Object.values(dump.prospects || {});
            const zombiesInDump = dumpItems.filter(p => (p.name || '').toLowerCase().includes('san martín test') || (p.name || '').toLowerCase().includes('san martin test'));
            if (zombiesInDump.length > 0) throw new Error(`${zombiesInDump.length} zombis aún presentes en db_dump.json`);
        }
        return '0 zombis en Firestore y 0 zombis en db_dump.json';
    });

    // 2. Ingesta Manual vía POST /api/prospects (200 OK)
    const testLeadId = `manual_cert_${Date.now()}`;
    const manualPayload = {
        prospects: [{
            id: testLeadId,
            name: 'Pizzería La Imperial Tucumán',
            whatsapp: '+5493815554321',
            phone: '+5493815554321',
            instagram: 'pizzerialaimperial',
            mapsUrl: 'https://maps.app.goo.gl/sampleImperialPlace',
            address: '24 de Septiembre 300, San Miguel de Tucumán',
            city: 'San Miguel de Tucumán',
            category: 'Gastronomía & Pizzería',
            rubro: 'Gastronomía & Pizzería',
            goal: 'leads',
            audience: 'local',
            vibe: '4'
        }]
    };

    await checkAsync('2. POST /api/prospects (Formulario Manual) → HTTP 200', async () => {
        const res = await requestJson('POST', '/api/prospects', manualPayload);
        if (res.status !== 200 || !res.data.success) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
        return `HTTP ${res.status} OK | Lead ID: ${res.data.id} | Slug: ${res.data.slug}`;
    });

    // 3. Enriquecimiento Canónico vía POST /api/leads/enrich (200 OK - No 404)
    await checkAsync('3. POST /api/leads/enrich (C.Y.B.O.R.G.) → HTTP 200 (No 404)', async () => {
        const res = await requestJson('POST', '/api/leads/enrich', { leadId: testLeadId });
        if (res.status !== 200 || !res.data.success) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
        return `HTTP ${res.status} OK | Enriquecido con éxito: "${res.data.lead?.name}"`;
    });

    // 4. Borrado Atómico vía DELETE /api/prospects/:id (200 OK)
    await checkAsync('4. DELETE /api/prospects/:id (Purga Atómica Bidireccional)', async () => {
        const res = await requestJson('DELETE', `/api/prospects/${testLeadId}`);
        if (res.status !== 200 || !res.data.success) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);

        // Verificar que ya no exista en Firestore
        if (db) {
            const checkDoc = await db.collection('prospects').doc(testLeadId).get();
            if (checkDoc.exists) throw new Error('El documento aún existe en Firestore');
        }

        // Verificar que ya no exista en db_dump.json
        if (fs.existsSync(LOCAL_DUMP_PATH)) {
            const dump = JSON.parse(fs.readFileSync(LOCAL_DUMP_PATH, 'utf-8'));
            const dumpItems = Array.isArray(dump.prospects) ? dump.prospects : Object.values(dump.prospects || {});
            const foundInDump = dumpItems.some(p => p.id === testLeadId);
            if (foundInDump) throw new Error('El prospecto aún existe en db_dump.json');
        }

        return `HTTP 200 OK | Purgado de Firestore y db_dump.json (ID: ${testLeadId})`;
    });

    // 5. Ley de 200 Líneas estricta (< 180 líneas)
    const auditedFiles = [
        'backend/routes/leads/core.js',
        'backend/routes/leads/manage.js',
        'backend/server.js',
        'src/components/tabs/neural-factory/useNeuralActions.js'
    ];

    try {
        for (const rel of auditedFiles) {
            const full = path.resolve(__dirname, '..', rel);
            const lines = fs.readFileSync(full, 'utf-8').split('\n').length;
            if (lines > 180) throw new Error(`${rel} supera 180 líneas (${lines} lín)`);
        }
        console.log(`✅ [PASS] 5. Ley de 200 Líneas estricta → ${auditedFiles.length} archivos conformes (< 180 líneas)`);
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
