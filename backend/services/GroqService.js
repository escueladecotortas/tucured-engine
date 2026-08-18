// Archivo: backend/services/GroqService.js
// Servicio Unificado de Inferencia en Groq Cloud con Auto-Fallback de Modelos — Ley de 200 líneas

const https = require('https');
require("dotenv").config();

const CANDIDATE_MODELS = [
    process.env.GROQ_MODEL,
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'groq/compound',
    'qwen/qwen3.6-27b'
].filter(Boolean);

const GroqService = {
    async generate(prompt, systemPrompt = "You are a helpful assistant.") {
        const apiKey = (process.env.GROQ_API_KEY || '').trim();
        if (!apiKey) {
            console.error("❌ GROQ_API_KEY missing.");
            return null;
        }

        for (const model of CANDIDATE_MODELS) {
            console.log(`🔹 [GroqService] Generating via model: "${model}"...`);
            try {
                const res = await this._callGroq(apiKey, model, prompt, systemPrompt);
                if (res) return res;
            } catch (err) {
                console.warn(`   ⚠️ [GroqService] Model ${model} failed (${err.message}). Intentando siguiente fallback...`);
            }
        }

        console.error("❌ [GroqService] Todos los modelos de Groq fallaron.");
        return null;
    },

    _callGroq(apiKey, model, prompt, systemPrompt) {
        const data = JSON.stringify({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            model,
            temperature: 0.7,
            max_tokens: 2048,
            top_p: 1,
            stream: false
        });

        const options = {
            hostname: 'api.groq.com',
            path: '/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': Buffer.byteLength(data)
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    if (res.statusCode !== 200) {
                        return reject(new Error(`Status ${res.statusCode}: ${body.slice(0, 100)}`));
                    }
                    try {
                        const json = JSON.parse(body);
                        const content = json.choices[0]?.message?.content;
                        resolve(content);
                    } catch (e) {
                        reject(new Error(`JSON parse error: ${e.message}`));
                    }
                });
            });

            req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
            req.on('error', (e) => reject(e));
            req.setTimeout(10000);
            req.write(data);
            req.end();
        });
    }
};

module.exports = GroqService;
