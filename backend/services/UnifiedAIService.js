// Archivo: backend/services/UnifiedAIService.js
// Orquestador de Inteligencia Híbrida con Auto-Switch Transparente (Gemini <-> Groq)
// Ley de 200 líneas

const GeminiService = require('./GeminiService');
const GroqService = require('./GroqService');
const fs = require('fs');

class UnifiedAIService {
    /**
     * Generación de texto con auto-switch transparente.
     * @param {string} prompt - Prompt de usuario
     * @param {object} options - { systemPrompt, prefer: 'gemini'|'groq', maxTokens }
     */
    static async generateText(prompt, options = {}) {
        const prefer = options.prefer || 'gemini';
        const primary = prefer === 'groq' ? 'groq' : 'gemini';
        const secondary = primary === 'gemini' ? 'groq' : 'gemini';

        const startTime = Date.now();

        // 1. Intento con Proveedor Primario
        try {
            if (primary === 'gemini') {
                const res = await GeminiService.generate(prompt, options.systemPrompt);
                return { text: res.text, provider: 'gemini', failover: false, latencyMs: res.latencyMs };
            } else {
                const content = await GroqService.generate(prompt, options.systemPrompt);
                if (!content) throw new Error('Respuesta vacía de Groq');
                return { text: content, provider: 'groq', failover: false, latencyMs: Date.now() - startTime };
            }
        } catch (primaryError) {
            console.warn(`⚠️ [UnifiedAI] Primario (${primary.toUpperCase()}) falló: ${primaryError.message}. Activando Auto-Switch a ${secondary.toUpperCase()}...`);
            
            // 2. Failover Automático a Proveedor Secundario
            try {
                if (secondary === 'groq') {
                    const fallbackContent = await GroqService.generate(prompt, options.systemPrompt);
                    if (!fallbackContent) throw new Error('Respuesta vacía de Groq en Fallover');
                    return { text: fallbackContent, provider: 'groq', failover: true, failoverReason: primaryError.message, latencyMs: Date.now() - startTime };
                } else {
                    const fallbackRes = await GeminiService.generate(prompt, options.systemPrompt);
                    return { text: fallbackRes.text, provider: 'gemini', failover: true, failoverReason: primaryError.message, latencyMs: Date.now() - startTime };
                }
            } catch (secondaryError) {
                console.error(`❌ [UnifiedAI] Ambos proveedores fallaron: ${secondaryError.message}`);
                throw new Error(`Fallo total de IA (Primario: ${primaryError.message}, Secundario: ${secondaryError.message})`);
            }
        }
    }

    /**
     * Generación garantizada de JSON estructurado.
     */
    static async generateJSON(prompt, options = {}) {
        const jsonPrompt = `${prompt}\n\nIMPORTANTE: Devuelve ÚNICAMENTE un objeto JSON válido, sin delimitadores Markdown ni texto adicional.`;
        const result = await this.generateText(jsonPrompt, options);
        try {
            const raw = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
            const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            const parsed = JSON.parse(match ? match[0] : raw);
            return { data: parsed, provider: result.provider, failover: result.failover, latencyMs: result.latencyMs };
        } catch (e) {
            return { data: { raw: result.text }, provider: result.provider, failover: result.failover, parseError: e.message };
        }
    }

    /**
     * Análisis multimodal / Visión con fallback estructurado.
     */
    static async analyzeVision(filePath, mimeType, prompt) {
        try {
            const client = GeminiService.getClient();
            if (!client) throw new Error('GEMINI_API_KEY no configurada');

            const fileBuffer = fs.readFileSync(filePath);
            const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const result = await model.generateContent([
                prompt,
                { inlineData: { data: fileBuffer.toString('base64'), mimeType } }
            ]);
            return { text: result.response.text(), provider: 'gemini_vision', failover: false };
        } catch (err) {
            console.warn(`⚠️ [UnifiedAI/Vision] Gemini Vision falló: ${err.message}. Intentando fallback textual con Groq...`);
            const fallbackPrompt = `Se solicitó analizar un archivo (${mimeType}) para la siguiente tarea:\n${prompt}\nGenera una propuesta estructurada de catálogo comercial.`;
            const groqRes = await GroqService.generate(fallbackPrompt);
            return { text: groqRes || '', provider: 'groq_fallback', failover: true, failoverReason: err.message };
        }
    }
}

module.exports = UnifiedAIService;
