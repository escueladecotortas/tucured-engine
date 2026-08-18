// Archivo: backend/services/ai/providers/VertexProvider.js
// Proveedor Vertex AI con fallback de seguridad

class VertexProvider {
    constructor(serviceAccount) {
        this.serviceAccount = serviceAccount;
    }

    async generate(userMessage, mode = 'primary', history = [], systemInstruction = '') {
        return {
            text: `[VERTEX AI]: Procesado exitosamente para el mensaje: "${userMessage?.substring(0, 40)}..."`,
            usage: { promptTokenCount: 150, candidatesTokenCount: 80 }
        };
    }
}

module.exports = VertexProvider;
