const https = require('https');
require("dotenv").config();

const GroqService = {
    async generate(prompt, systemPrompt = "You are a helpful assistant.") {
        console.log("🔹 [GroqService] Generating via Llama 3 (Groq API)...");
        
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("❌ GROQ_API_KEY missing.");
            return null;
        }

        const data = JSON.stringify({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile", // Updated for 2026 availability
            temperature: 0.7,
            max_tokens: 2048,
            top_p: 1,
            stream: false,
            stop: null
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
                        console.error(`❌ [GroqService] API Error: ${res.statusCode} - ${body}`);
                        resolve(null);
                        return;
                    }
                    try {
                        const json = JSON.parse(body);
                        const content = json.choices[0]?.message?.content;
                        console.log(`✅ [GroqService] Success! (${content.length} chars)`);
                        resolve(content);
                    } catch (e) {
                        console.error("❌ Parse Error", e);
                        resolve(null);
                    }
                });
            });

            req.on('error', (e) => {
                console.error("❌ Network Error", e);
                resolve(null);
            });

            req.write(data);
            req.end();
        });
    }
};

module.exports = GroqService;
