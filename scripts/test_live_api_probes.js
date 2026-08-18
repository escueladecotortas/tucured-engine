// Archivo: scripts/test_live_api_probes.js
// Suite de Certificación: Probes Vivos de APIs en Red, Auto-Switch Gemini->Groq & Handshake Google Stitch

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
const UnifiedAIService = require('../backend/services/UnifiedAIService');
const GeminiService = require('../backend/services/GeminiService');
const GroqService = require('../backend/services/GroqService');
const StitchRpcHandler = require('../backend/services/stitch/StitchRpcHandler');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const TEST_PORT = 5099;

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('⚡ SUITE DE CERTIFICACIÓN: PROBES VIVOS Y AUTO-SWITCH GEMINI ↔ GROQ');
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

    // 1. Google Gemini Probe
    await checkAsync('1. Probe Google Gemini 2.5 Flash', async () => {
        const key = (process.env.GEMINI_API_KEY || '').trim();
        if (!key) throw new Error('GEMINI_API_KEY ausente');
        const t0 = Date.now();
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent('ping');
        const latency = Date.now() - t0;
        const text = result.response.text().trim();
        return `Latency: ${latency}ms | Response: "${text}"`;
    });

    // 2. Groq Llama 3.3 Probe
    await checkAsync('2. Probe Groq Llama 3.3 70B', async () => {
        const key = (process.env.GROQ_API_KEY || '').trim();
        if (!key) throw new Error('GROQ_API_KEY ausente');
        const t0 = Date.now();
        const res = await GroqService.generate('ping');
        if (!res) throw new Error('Sin respuesta de Groq');
        const latency = Date.now() - t0;
        return `Latency: ${latency}ms | Response: "${res.trim()}"`;
    });

    // 3. Google Stitch MCP Probe
    await checkAsync('3. Probe Google Stitch MCP (tools/list)', async () => {
        const key = (process.env.GOOGLE_STITCH_API_KEY || process.env.STITCH_API_KEY || '').replace(/["']/g, '').trim();
        if (!key) throw new Error('GOOGLE_STITCH_API_KEY ausente');
        const t0 = Date.now();
        const payload = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} });
        const res = await new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'stitch.googleapis.com',
                port: 443,
                path: '/mcp',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`,
                    'x-goog-user-project': 'nexus-v2-native',
                    'Content-Length': Buffer.byteLength(payload)
                }
            }, r => {
                let data = '';
                r.on('data', c => data += c);
                r.on('end', () => resolve({ status: r.statusCode, data: JSON.parse(data || '{}') }));
            });
            req.on('error', reject);
            req.write(payload);
            req.end();
        });
        if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
        const latency = Date.now() - t0;
        const toolsCount = res.data?.result?.tools?.length || 0;
        return `Latency: ${latency}ms | Tools Disponibles: ${toolsCount} tools`;
    });

    // 4. Apify API Probe
    await checkAsync('4. Probe Apify Actor Cloud', async () => {
        const token = (process.env.APIFY_TOKEN || '').replace(/[><"']/g, '').trim();
        if (!token) throw new Error('APIFY_TOKEN ausente');
        const t0 = Date.now();
        const res = await new Promise((resolve, reject) => {
            const req = https.get('https://api.apify.com/v2/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            }, r => {
                let data = '';
                r.on('data', c => data += c);
                r.on('end', () => resolve({ status: r.statusCode, data: JSON.parse(data || '{}') }));
            });
            req.on('error', reject);
        });
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        const latency = Date.now() - t0;
        return `Latency: ${latency}ms | Usuario: @${res.data?.data?.username} (${res.data?.data?.plan?.name || 'Personal'})`;
    });

    // 5. Cloud Firestore Probe
    await checkAsync('5. Probe Cloud Firestore (Firebase Admin)', async () => {
        if (!db) throw new Error('db is null');
        const t0 = Date.now();
        const snap = await db.collection('prospects').limit(1).get();
        const latency = Date.now() - t0;
        return `Latency: ${latency}ms | Colección prospects online (Docs: ${snap.size})`;
    });

    // 6. Netlify API Probe
    await checkAsync('6. Probe Netlify Deploy API', async () => {
        const token = (process.env.NETLIFY_AUTH_TOKEN || '').trim();
        if (!token) throw new Error('NETLIFY_AUTH_TOKEN ausente');
        const t0 = Date.now();
        const res = await new Promise((resolve, reject) => {
            const req = https.get('https://api.netlify.com/api/v1/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            }, r => {
                let data = '';
                r.on('data', c => data += c);
                r.on('end', () => resolve({ status: r.statusCode, data: JSON.parse(data || '{}') }));
            });
            req.on('error', reject);
        });
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        const latency = Date.now() - t0;
        return `Latency: ${latency}ms | Usuario: ${res.data?.full_name || res.data?.email}`;
    });

    // 7. Auto-Switch Failover: Simulación de fallo en Gemini -> Relevo inmediato con Groq
    await checkAsync('7. Auto-Switch Transparente (Simulación de Fallo Gemini -> Groq)', async () => {
        const originalKey = process.env.GEMINI_API_KEY;
        try {
            // Inyectamos key inválida para forzar error 400/403 en Gemini
            process.env.GEMINI_API_KEY = 'AIzaSy_INVALID_KEY_FOR_TESTING_FAILOVER';
            GeminiService._apiKey = null; // Forzar reinicio de cliente

            const res = await UnifiedAIService.generateText('Genera un eslogan breve de 3 palabras para una cafetería');
            if (!res.failover) throw new Error('No se activó el flag failover');
            if (res.provider !== 'groq') throw new Error(`El relevo lo tomó ${res.provider} en lugar de Groq`);
            if (!res.text || res.text.length < 5) throw new Error('Respuesta de failover vacía');

            return `Auto-Switch Exitoso! Proveedor Relevo: ${res.provider.toUpperCase()} | Texto: "${res.text.trim().substring(0, 40)}"`;
        } finally {
            process.env.GEMINI_API_KEY = originalKey;
            GeminiService._apiKey = null;
        }
    });

    // 8. Endpoints Express de Health
    const testServer = http.createServer(app);
    await new Promise(r => testServer.listen(TEST_PORT, '127.0.0.1', r));

    await checkAsync('8. Endpoint Express GET /api/nexus/health/apis & POST /test-api', async () => {
        const getJson = (p) => new Promise((resolve, reject) => {
            http.get(`http://127.0.0.1:${TEST_PORT}${p}`, r => {
                let data = '';
                r.on('data', c => data += c);
                r.on('end', () => resolve({ status: r.statusCode, data: JSON.parse(data || '{}') }));
            }).on('error', reject);
        });

        const postJson = (p, body) => new Promise((resolve, reject) => {
            const req = http.request({
                hostname: '127.0.0.1',
                port: TEST_PORT,
                path: p,
                method: 'POST',
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

        const allRes = await getJson('/api/nexus/health/apis');
        if (!allRes.data.success || !allRes.data.providers) throw new Error('GET /apis falló');

        const singleRes = await postJson('/api/nexus/health/test-api', { provider: 'stitch' });
        if (!singleRes.data.success || singleRes.data.status !== 'connected') throw new Error('POST /test-api stitch falló');

        return `Endpoints OK (All Providers: ${Object.keys(allRes.data.providers).length}, Single Stitch: ${singleRes.data.latencyMs}ms)`;
    });

    // 9. Ley de 200 Líneas estricta (< 180 lín)
    const targetFiles = [
        'backend/services/UnifiedAIService.js',
        'backend/services/GeminiService.js',
        'backend/services/SmartCopyEngine.js',
        'backend/services/CatalogVisionService.js',
        'backend/routes/nexus/apiHealth.js',
        'src/components/modals/ApiHealthModal.jsx'
    ];

    try {
        for (const rel of targetFiles) {
            const full = path.resolve(__dirname, '..', rel);
            const lines = fs.readFileSync(full, 'utf-8').split('\n').length;
            if (lines > 180) throw new Error(`${rel} supera 180 líneas (${lines} lín)`);
        }
        console.log(`✅ [PASS] 9. Ley de 200 Líneas estricta → ${targetFiles.length} archivos conformes (< 180 líneas)`);
        passed++;
    } catch (e) {
        console.error(`❌ [FAIL] 9. Ley de 200 Líneas → ${e.message}`);
        failed++;
    }

    await new Promise(r => testServer.close(r));

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed/(passed+failed))*100)}%)`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

run();
