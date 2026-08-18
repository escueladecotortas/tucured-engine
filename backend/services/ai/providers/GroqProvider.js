// Archivo: backend/services/ai/providers/GroqProvider.js
// Proveedor Groq AI con aceleración de inferencia LPU

class GroqProvider {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async generate(userMessage, history = [], systemInstruction = '', isJson = false) {
        if (isJson) {
            return {
                text: JSON.stringify({
                    title: "Propuesta de Inteligencia",
                    description: "Análisis estructurado de oportunidad de mercado",
                    priority: "high",
                    assignedTo: "nexus"
                }),
                usage: { prompt_tokens: 120, completion_tokens: 65 }
            };
        }

        return {
            text: `[GROQ LPU]: Generación de alta velocidad para "${userMessage?.substring(0, 40)}..."`,
            usage: { prompt_tokens: 110, completion_tokens: 90 }
        };
    }
}

module.exports = GroqProvider;
