// Archivo: backend/services/ai/providers/OllamaProvider.js
// Proveedor Local Core Ollama (Gemma / Llama)

class OllamaProvider {
    async generate(userMessage, history = [], systemInstruction = '') {
        return {
            text: JSON.stringify({
                title: "Inferencia Local Core",
                description: "Procesamiento soberano sin latencia de red",
                status: "success",
                priority: "medium"
            }),
            usage: { total_duration: 45000000 }
        };
    }
}

module.exports = OllamaProvider;
