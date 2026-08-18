// Archivo: backend/services/GeminiService.js
// Servicio oficial de Google Gemini Generative AI (Gemini 2.5 Flash - Ley de 200 líneas)

const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

class GeminiService {
    constructor() {
        this.genAI = null;
        this._apiKey = null;
    }

    getClient() {
        const apiKey = (process.env.GEMINI_API_KEY || '').trim();
        if (!this.genAI || this._apiKey !== apiKey) {
            this._apiKey = apiKey;
            this.genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
        }
        return this.genAI;
    }

    async generate(prompt, systemInstruction = '', modelName = 'gemini-2.5-flash') {
        const client = this.getClient();
        if (!client) throw new Error('GEMINI_API_KEY no configurada');

        const startTime = Date.now();
        console.log(`🔹 [GeminiService] Generating with ${modelName}...`);

        const model = client.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const latencyMs = Date.now() - startTime;

        console.log(`✅ [GeminiService] Success! (${text.length} chars, ${latencyMs}ms)`);
        return { text, latencyMs, provider: 'gemini', model: modelName };
    }

    async generateCopy(prompt) {
        const res = await this.generate(prompt);
        return res.text;
    }
}

module.exports = new GeminiService();
