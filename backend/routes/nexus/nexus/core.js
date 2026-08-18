const express = require('express');
const router = express.Router();
const aiService = require('../../services/aiService');
const metricsService = require("../../services/MetricsService");

// Nexus System Core Prompt (Base Architect Persona)
const NEXUS_CORE_PROMPT = `
Eres NEXUS, el Sistema Operativo Inteligente. Tu rol es ser el Arquitecto Estratégico.
Tu personalidad es: Analítico, directo, exigente pero justo. Hablas con autoridad pero sin arrogancia.
Tu misión: Ayudar al usuario a validar ideas de negocio antes de crear proyectos.

REGLAS:
1. No dices "Sí" a todo. Cuestionas la viabilidad.
2. Aplicas pensamiento Lean Startup: MVP, Riesgos, Diferenciación.
3. Cuando la idea es sólida, generas un "Project Manifesto" (resumen estructurado).
4. Tu tono es profesional, con toques de sabiduría. Puedes usar metáforas de ingeniería o arquitectura.
5. Siempre firmas con tu nombre: — NEXUS

Contexto del Sistema:
- El usuario está usando Nexus OS para gestionar proyectos con agentes de IA.
- Eres el primer punto de contacto antes de crear un nuevo proyecto.
`;

// --- DIAGNOSTICS: PING ENDPOINT ---
router.get('/ping', (req, res) => {
    res.json({ 
        status: 'online', 
        time: new Date().toISOString(),
        server: 'NEXUS-CORE-V2.6' 
    });
});

// Metrics Endpoint for Token Observability Widget
router.get('/metrics', async (req, res) => {
    try {
        const metrics = await metricsService.getMetrics();
        res.json(metrics);
    } catch (error) {
        console.error("❌ Metrics Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch metrics" });
    }
});

// Chat Endpoint
router.post('/chat', async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const chatSession = aiService.startChat(
            history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })),
            NEXUS_CORE_PROMPT
        );

        const result = await chatSession.sendMessage(message);
        
        if (!result) {
             return res.status(502).json({ 
                 error: 'AI Provider Error', 
                 response: 'Error de proveedor. Reintentando enlace...' 
             });
        }

        let responseText = typeof result === 'string' ? result : 
                          (result.response?.text?.() || result.response?.text || JSON.stringify(result));

        let usage = (typeof result !== 'string' && result.response?.usageMetadata) || { promptTokenCount: 0, candidatesTokenCount: 0 };

        res.json({ 
            response: responseText,
            usage: {
                promptTokens: usage.promptTokenCount || 0,
                candidatesTokens: usage.candidatesTokenCount || 0,
                cost: 0,
                model: process.env.GROQ_MODEL || "openai/gpt-oss-120b"
            },
            history: [
                ...history,
                { role: 'user', content: message },
                { role: 'model', content: responseText }
            ]
        });
    } catch (error) {
        console.error("Nexus Chat Error:", error);
        res.status(500).json({
            error: "Error en la transmisión neural.",
            details: error.message
        });
    }
});

module.exports = router;
