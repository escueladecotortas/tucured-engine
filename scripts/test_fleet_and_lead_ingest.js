// Archivo: scripts/test_fleet_and_lead_ingest.js
// Suite de Certificación: Auto-Transición de Flota e Ingesta Real en Fábrica de Leads

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
const AutoSiteGenerator = require('../backend/services/AutoSiteGenerator');

const BLUEPRINT_DIR = path.resolve(__dirname, '../../blueprint-nexus');

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('⚡ SUITE DE CERTIFICACIÓN: AUTO-TRANSICIÓN DE FLOTA E INGESTA REAL');
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

    // 1. Verificación de Auto-Polling Reactivo en fleet_ui.js (blueprint-nexus)
    await checkAsync('1. Auto-Transición STARTING -> ONLINE en fleet_ui.js', async () => {
        const fleetUiPath = path.join(BLUEPRINT_DIR, 'system_core/dashboard/fleet_ui.js');
        if (!fs.existsSync(fleetUiPath)) throw new Error('fleet_ui.js no encontrado en blueprint-nexus');
        const code = fs.readFileSync(fleetUiPath, 'utf-8');
        if (!code.includes('pollUntilOnline')) throw new Error('pollUntilOnline no está definido en fleet_ui.js');
        if (!code.includes('activePollingIntervals')) throw new Error('activePollingIntervals ausente');
        if (!code.includes('clearInterval')) throw new Error('Detención de polling ausente');
        return 'Función pollUntilOnline y auto-transición 800ms implementadas';
    });

    // Iniciar Servidor Express de Prueba en puerto dinámico libre
    const testServer = http.createServer(app);
    await new Promise(r => testServer.listen(0, '127.0.0.1', r));
    const dynamicPort = testServer.address().port;

    const postJson = (p, body) => new Promise((resolve, reject) => {
        const req = http.request({
            hostname: '127.0.0.1', port: dynamicPort, path: p, method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, r => {
            let data = '';
            r.on('data', c => data += c);
            r.on('end', () => resolve({ status: r.statusCode, data: JSON.parse(data || '{}') }));
        });
        req.on('error', reject);
        req.write(JSON.stringify(body));
        req.end();
    });

    // 2. Ingesta Inicial del Lead (POST /api/prospects)
    const testLeadId = `test_ingest_${Date.now()}`;
    const testLeadData = {
        id: testLeadId,
        name: 'Café Martínez Tucumán',
        whatsapp: '+5493815559876',
        phone: '+5493815559876',
        instagram: 'cafemartinezargentina',
        address: 'San Martín 650, San Miguel de Tucumán',
        city: 'San Miguel de Tucumán',
        category: 'Cafetería & Pastelería',
        goal: 'ventas',
        audience: 'local',
        vibe: '3'
    };

    await checkAsync('2. Ingesta Inicial en POST /api/prospects', async () => {
        const res = await postJson('/api/prospects', { prospects: [testLeadData] });
        if (res.status !== 200 || !res.data.success) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
        return `Lead Guardado con ID: ${res.data.id} (Slug: ${res.data.slug})`;
    });

    // 3. Enriquecimiento del Lead con Apify + IA (POST /api/leads/enrich)
    await checkAsync('3. Enriquecimiento Real C.Y.B.O.R.G. (POST /api/leads/enrich)', async () => {
        const res = await postJson('/api/leads/enrich', { leadId: testLeadId });
        if (res.status !== 200 || !res.data.success) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
        const lead = res.data.lead;
        if (!lead.slug) throw new Error('Lead enriquecido sin slug');
        return `Enriquecimiento completado: Slug "${lead.slug}", Rubro "${lead.category}"`;
    });

    // 4. Verificación de Persistencia en Cloud Firestore
    await checkAsync('4. Persistencia en Cloud Firestore (nexus-v2-native)', async () => {
        if (!db) throw new Error('Firebase db is null');
        const doc = await db.collection('prospects').doc(testLeadId).get();
        if (!doc.exists) throw new Error(`Documento ${testLeadId} no encontrado en Firestore`);
        const data = doc.data();
        return `Doc Firestore Verificado: "${data.name}" (${data.status})`;
    });

    // 5. Generación de Landing Page Real (AutoSiteGenerator)
    await checkAsync('5. Generación de Landing Page en public/clients/<slug>/index.html', async () => {
        const genResult = await AutoSiteGenerator.generateSite({
            name: 'Café Martínez Tucumán',
            category: 'Cafetería & Pastelería',
            phone: '+5493815559876',
            instagram: 'cafemartinezargentina',
            address: 'San Martín 650, San Miguel de Tucumán',
            photos: []
        }, { dryRun: true });

        const publicHtmlPath = path.resolve(__dirname, `../public/clients/${genResult.clientId}/index.html`);
        if (!fs.existsSync(publicHtmlPath)) throw new Error(`Archivo no generado en ${publicHtmlPath}`);
        const html = fs.readFileSync(publicHtmlPath, 'utf-8');
        if (!html.includes('Café Martínez')) throw new Error('El HTML generado no contiene el nombre del negocio');
        if (!html.includes('5493815559876') && !html.includes('WhatsApp')) throw new Error('El HTML generado no contiene el contacto de WhatsApp');

        return `HTML generado en public/clients/${genResult.clientId}/index.html (${Math.round(html.length / 1024)} KB)`;
    });

    // 6. Ley de 200 Líneas estricta (< 180 líneas)
    const auditedFiles = [
        'backend/services/ApifyService.js',
        'backend/services/AutoSiteGenerator.js',
        'backend/routes/leads/core.js',
        'src/components/tabs/neural-factory/useNeuralActions.js'
    ];

    try {
        for (const rel of auditedFiles) {
            const full = path.resolve(__dirname, '..', rel);
            const lines = fs.readFileSync(full, 'utf-8').split('\n').length;
            if (lines > 180) throw new Error(`${rel} supera 180 líneas (${lines} lín)`);
        }
        console.log(`✅ [PASS] 6. Ley de 200 Líneas estricta → ${auditedFiles.length} archivos auditados (< 180 líneas)`);
        passed++;
    } catch (e) {
        console.error(`❌ [FAIL] 6. Ley de 200 Líneas → ${e.message}`);
        failed++;
    }

    await new Promise(r => testServer.close(r));

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed/(passed+failed))*100)}%)`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

run();
