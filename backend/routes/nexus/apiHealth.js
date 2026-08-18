// Archivo: backend/routes/nexus/apiHealth.js
// Diagnóstico y Probes Vivos de Conectividad Multicloud con Detección Dinámica de Modelos — Ley de 200 líneas

const express = require('express');
const router = express.Router();
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db } = require('../../config/db');

function fetchHttps(url, options = {}, postData = null, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const reqOpts = {
            hostname: u.hostname,
            port: u.port || 443,
            path: u.pathname + u.search,
            method: options.method || 'GET',
            headers: options.headers || {},
            timeout: timeoutMs
        };
        const req = https.request(reqOpts, res => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                let parsed = null;
                try { parsed = JSON.parse(body); } catch (e) { parsed = body; }
                resolve({ status: res.statusCode, data: parsed });
            });
        });
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout excedido (8s)')); });
        req.on('error', reject);
        if (postData) req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
        req.end();
    });
}

const PREFERRED_CHAT_MODELS = [
    process.env.GROQ_MODEL,
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'groq/compound',
    'qwen/qwen3.6-27b'
].filter(Boolean);

const Probes = {
    async gemini() {
        const t0 = Date.now();
        const key = (process.env.GEMINI_API_KEY || '').trim();
        if (!key) throw new Error('GEMINI_API_KEY no configurada');
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const res = await model.generateContent('ping');
        return { status: 'connected', latencyMs: Date.now() - t0, response: res.response.text().trim(), model: 'gemini-2.5-flash' };
    },
    async groq() {
        const t0 = Date.now();
        const key = (process.env.GROQ_API_KEY || '').trim();
        if (!key) throw new Error('GROQ_API_KEY no configurada');

        let lastError = null;
        for (const model of PREFERRED_CHAT_MODELS) {
            try {
                const payload = { messages: [{ role: 'user', content: 'ping' }], model, max_tokens: 10 };
                const res = await fetchHttps('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` }
                }, payload);

                if (res.status === 200) {
                    return {
                        status: 'connected',
                        latencyMs: Date.now() - t0,
                        response: res.data?.choices?.[0]?.message?.content?.trim() || 'OK',
                        model
                    };
                }
                lastError = `Status ${res.status}: ${JSON.stringify(res.data?.error?.message || res.data)}`;
            } catch (e) {
                lastError = e.message;
            }
        }
        throw new Error(lastError || 'Fallo de conexión con Groq');
    },
    async stitch() {
        const t0 = Date.now();
        const key = (process.env.GOOGLE_STITCH_API_KEY || process.env.STITCH_API_KEY || '').replace(/["']/g, '').trim();
        if (!key) throw new Error('GOOGLE_STITCH_API_KEY no configurada');
        const payload = { jsonrpc: '2.0', id: Date.now(), method: 'tools/list', params: {} };
        const res = await fetchHttps('https://stitch.googleapis.com/mcp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}`, 'x-goog-user-project': 'nexus-v2-native' }
        }, payload);
        if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.data)}`);
        const toolsCount = res.data?.result?.tools?.length || 0;
        return { status: 'connected', latencyMs: Date.now() - t0, toolsCount, endpoint: 'stitch.googleapis.com/mcp' };
    },
    async apify() {
        const t0 = Date.now();
        const token = (process.env.APIFY_TOKEN || '').replace(/[><"']/g, '').trim();
        if (!token) throw new Error('APIFY_TOKEN no configurada');
        const res = await fetchHttps('https://api.apify.com/v2/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        const user = res.data?.data;
        return { status: 'connected', latencyMs: Date.now() - t0, username: user?.username, email: user?.email, plan: user?.plan?.name || 'Personal' };
    },
    async firebase() {
        const t0 = Date.now();
        if (!db) throw new Error('Firebase Admin SDK no inicializado');
        const snap = await db.collection('prospects').limit(1).get();
        return { status: 'connected', latencyMs: Date.now() - t0, projectId: 'nexus-v2-native', liveDocs: snap.size };
    },
    async netlify() {
        const t0 = Date.now();
        const token = (process.env.NETLIFY_AUTH_TOKEN || '').trim();
        if (!token) throw new Error('NETLIFY_AUTH_TOKEN no configurada');
        const res = await fetchHttps('https://api.netlify.com/api/v1/user', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        return { status: 'connected', latencyMs: Date.now() - t0, name: res.data?.full_name || res.data?.email, email: res.data?.email };
    }
};

router.get('/apis', async (req, res) => {
    const keys = Object.keys(Probes);
    const results = {};
    await Promise.all(keys.map(async (key) => {
        try {
            results[key] = await Probes[key]();
        } catch (e) {
            results[key] = { status: 'error', error: e.message, latencyMs: null };
        }
    }));
    const allOk = Object.values(results).every(r => r.status === 'connected');
    res.json({ success: true, timestamp: new Date().toISOString(), allConnected: allOk, providers: results });
});

router.post('/test-api', async (req, res) => {
    const { provider } = req.body;
    if (!provider || !Probes[provider.toLowerCase()]) {
        return res.status(400).json({ error: `Proveedor '${provider}' no reconocido. Opciones: ${Object.keys(Probes).join(', ')}` });
    }
    const key = provider.toLowerCase();
    try {
        const probeResult = await Probes[key]();
        res.json({ success: true, provider: key, ...probeResult });
    } catch (e) {
        res.json({ success: false, provider: key, status: 'error', error: e.message, latencyMs: null });
    }
});

module.exports = router;
