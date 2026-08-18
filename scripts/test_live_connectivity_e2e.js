// Archivo: scripts/test_live_connectivity_e2e.js
// Suite de Certificación: Conectividad Multicloud Real (Firebase, Apify, Groq, Gemini, Netlify) & E2E Leads

import http from 'http';
import https from 'https';
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
const GroqService = require('../backend/services/GroqService');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const TEST_PORT = 5098;

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🔥 SUITE DE CERTIFICACIÓN: CONECTIVIDAD REAL MULTICLOUD & E2E LEADS');
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

    // 1. Firebase Admin & Cloud Firestore
    await checkAsync('1. Cloud Firestore (Firebase Admin SDK)', async () => {
        if (!db) throw new Error('Firebase Admin no está inicializado (db es null)');
        const snap = await db.collection('prospects').limit(1).get();
        return `Conectado a nexus-v2-native (Docs en Cloud: ${snap.size})`;
    });

    // 2. Apify API Auth
    await checkAsync('2. Apify API (Scraping Cloud)', async () => {
        const token = (process.env.APIFY_TOKEN || '').replace(/[><"']/g, '').trim();
        if (!token) throw new Error('APIFY_TOKEN ausente');
        const res = await new Promise((resolve, reject) => {
            const req = https.get('https://api.apify.com/v2/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            }, (r) => {
                let data = '';
                r.on('data', c => data += c);
                r.on('end', () => resolve({ status: r.statusCode, data: JSON.parse(data || '{}') }));
            });
            req.on('error', reject);
        });
        if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
        return `Autenticado: @${res.data?.data?.username} (${res.data?.data?.email})`;
    });

    // 3. Groq API (Llama 3.3 70B)
    await checkAsync('3. Groq API (Copywriting & Vibrational Cortex)', async () => {
        const answer = await GroqService.generate('Responde exactamente una palabra: CONECTADO');
        if (!answer || !answer.trim()) throw new Error('Respuesta vacía de Groq');
        return `Llama-3.3-70b Response: "${answer.trim().substring(0, 40)}"`;
    });

    // 4. Google Gemini API (Gemini 2.5 Flash)
    await checkAsync('4. Google Gemini API (Visión & Multimodal)', async () => {
        const key = (process.env.GEMINI_API_KEY || '').trim();
        if (!key) throw new Error('GEMINI_API_KEY ausente');
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent('Responde en una palabra: ACTIVO');
        const text = result.response.text().trim();
        return `Gemini 2.5 Flash Response: "${text}"`;
    });

    // 5. Netlify API (Deploy Orchestration)
    await checkAsync('5. Netlify API (Deploy Cloud)', async () => {
        const token = (process.env.NETLIFY_AUTH_TOKEN || '').trim();
        if (!token) throw new Error('NETLIFY_AUTH_TOKEN ausente');
        const res = await new Promise((resolve, reject) => {
            const req = https.get('https://api.netlify.com/api/v1/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            }, (r) => {
                let data = '';
                r.on('data', c => data += c);
                r.on('end', () => resolve({ status: r.statusCode, data: JSON.parse(data || '{}') }));
            });
            req.on('error', reject);
        });
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        return `Autenticado: ${res.data?.full_name || res.data?.email}`;
    });

    // Iniciar servidor Express de prueba para E2E
    const testServer = http.createServer(app);
    await new Promise(r => testServer.listen(TEST_PORT, '127.0.0.1', r));

    // 6. E2E Ingesta de Lead & Auto-Forja
    await checkAsync('6. Circuito E2E: Ingesta de Lead & Auto-Forja Landing', async () => {
        const leadPayload = {
            name: 'Café San Martín Test',
            phone: '3815998877',
            category: 'cafe',
            tagline: 'El mejor café de especialidad',
            description: 'Cafetería de especialidad y pastelería artesanal en San Miguel de Tucumán.',
            instagram: 'cafesanmartin',
            photos: [
                'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
                'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
                'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800'
            ],
            benefits: ['Café 100% Arábica Tostado en Casa', 'Pastelería Artesanal del Día', 'Ambiente Climatizado y Wi-Fi Veloz'],
            hours: [{ day: 'Lunes a Viernes', hours: '08:00 - 21:00' }],
            topReviews: [{ author: 'Lucas Gómez', rating: 5, text: 'Excelente café y atención impecable.' }],
            mapsUrl: 'https://maps.app.goo.gl/test',
            address: 'San Martín 650, San Miguel de Tucumán',
            city: 'San Miguel de Tucumán',
            goal: 'leads',
            audience: 'local',
            vibe: '6'
        };

        const postJson = (reqPath, body) => new Promise((resolve, reject) => {
            const req = http.request({
                hostname: '127.0.0.1',
                port: TEST_PORT,
                path: reqPath,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, res => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data || '{}') }));
            });
            req.on('error', reject);
            req.write(JSON.stringify(body));
            req.end();
        });

        const saveRes = await postJson('/api/leads', leadPayload);
        if (!saveRes.data.success || !saveRes.data.id) throw new Error(`Fallo al guardar lead: ${JSON.stringify(saveRes.data)}`);

        const leadId = saveRes.data.id;
        const forgeRes = await postJson('/api/forge/nexus-builder', { ...leadPayload, id: leadId, dryRun: true, forceRegenerate: true });
        if (!forgeRes.data.success) throw new Error(`Fallo en auto-forja: ${forgeRes.data.error || 'Error'}`);

        return `Lead [${leadId}] forjado con éxito (Client: ${forgeRes.data.clientId} → ${forgeRes.data.deployUrl})`;
    });

    // 7. Ley de 200 Líneas estricta (< 180 lín)
    const targetFiles = [
        'src/components/leads/useManualProspect.js',
        'src/components/tabs/neural-factory/useNeuralActions.js',
        'backend/routes/leads/core.js',
        'backend/routes/leads/bulk.js',
        'backend/config/db.js',
        'backend/services/ApifyService.js'
    ];

    try {
        for (const rel of targetFiles) {
            const full = path.resolve(__dirname, '..', rel);
            const lines = fs.readFileSync(full, 'utf-8').split('\n').length;
            if (lines > 180) throw new Error(`${rel} supera 180 líneas (${lines} lín)`);
        }
        console.log(`✅ [PASS] 7. Ley de 200 Líneas estricta → ${targetFiles.length} archivos conformes (< 180 líneas)`);
        passed++;
    } catch (e) {
        console.error(`❌ [FAIL] 7. Ley de 200 Líneas → ${e.message}`);
        failed++;
    }

    await new Promise(r => testServer.close(r));

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed/(passed+failed))*100)}%)`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

run();
