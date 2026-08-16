// Archivo: backend/services/aiService.js
// SERVICE: AIService v5.0 (Ollama Hybrid - Genesis Boot)
// Fachada Unificada de Inteligencia Híbrida (Ollama + Groq + Vertex AI)

const metricsService = require("./MetricsService");
const VertexProvider = require("./ai/providers/VertexProvider");
const GroqProvider = require("./ai/providers/GroqProvider");
const OllamaProvider = require("./ai/providers/OllamaProvider");
const MemoryService = require("./ai/MemoryService");

const serviceAccount = require("../serviceAccountKey.json");
const { db } = require("../config/db");

class AIService {
  constructor() {
    this.db = db;
    this.memory = new MemoryService(db);
    this.vertex = new VertexProvider(serviceAccount);
    this.groq = new GroqProvider(process.env.GROQ_API_KEY);
    this.ollama = new OllamaProvider(); // Nivel 1: Local Core (Gemma 2B)
    this.memory.loadAgents();
  }

  /**
   * Generación unificada con lógica L1/L2 (Híbrida Estricta).
   * L1: Local Core (Ollama) | L2: Cloud Fallback (Groq/Vertex)
   */
  async generateResponse(agentId, userMessage, history, systemInstruction) {
    const wisdom = await this.memory.getWisdom(userMessage);
    const fullPrompt = `${systemInstruction}\n${wisdom}\n\nCRITICAL: OUTPUT MUST BE CLEAN.`.trim();

    // --- TIER 1: ESTRATEGIA LOCAL CORE (Nexus Hub / Diagnósticos / Routing) ---
    const isL1Task = ['nexus', 'vitalis', 'codi'].includes(agentId);
    
    if (isL1Task) {
      try {
        console.log(`🛡️ [AI/Ollama] Procesando tarea L1 para agente: ${agentId}`);
        const res = await this.ollama.generate(userMessage, history, fullPrompt);
        if (res.usage) {
          // Log de telemetría local (ms en lugar de tokens)
          console.log(`✅ [AI/Ollama] Inferencia completada en ${res.usage.total_duration / 1000000}ms`);
        }
        return res.text;
      } catch (e) {
        console.warn(`⚠️ [AI/Ollama] Local Core failed (${e.message}), falling back to L2 Cloud...`);
      }
    }

    // --- TIER 2: FAILOVER CLOUD (Groq/Vertex) ---
    // 1. Intento con GROQ (Secondary Cortex)
    try {
      const res = await this.groq.generate(userMessage, history, fullPrompt);
      if (res.usage) metricsService.logTokenUsage('groq', res.usage.prompt_tokens, res.usage.completion_tokens);
      return res.text;
    } catch (e) {
      console.warn("🛡️ [AI/Cloud] Groq failed, falling back to Vertex AI...", e.message);
    }

    // 2. Intento con VERTEX (Primary Cloud Cortex)
    try {
      const res = await this.vertex.generate(userMessage, "primary", history, fullPrompt);
      if (res.usage) metricsService.logTokenUsage('gemini', res.usage.promptTokenCount, res.usage.candidatesTokenCount);
      return res.text;
    } catch (e) {
      console.error("❌ [AI/Cloud] All providers failed:", e.message);
      throw e;
    }
  }

  /**
   * Generación de JSON con Multi-Tier Failover (Local-First).
   */
  async generateJSON(prompt, timeoutMs = 25000) {
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No Markdown.`.trim();

    // Intentar primero con Ollama (Gemma 2B es excelente en JSON estructurado)
    try {
      console.log("🛡️ [AI/Ollama] Intentando extracción de esquema JSON local...");
      const res = await this.ollama.generate(jsonPrompt, [], "");
      return this._extractJSON(res.text);
    } catch (e) {
      console.warn(`⚠️ [AI/JSON] Ollama failed (${e.message}), trying Cloud Tier...`);
    }

    // Failover a Cloud (restante de la lógica v4.0)
    try {
      const res = await this.groq.generate(jsonPrompt, [], "", true);
      metricsService.logTokenUsage('groq', res.usage.prompt_tokens, res.usage.completion_tokens);
      return JSON.parse(res.text);
    } catch (e) {
      // Vertex fallback...
      const res = await this.vertex.generate(jsonPrompt, "flash");
      return this._extractJSON(res.text);
    }
  }

  /**
   * Escudo de Extracción JSON: Extrae el primer objeto JSON válido de una cadena.
   */
  _extractJSON(text) {
    try {
      // Intento rápido: Limpieza de markdown
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (e) {
      // Intento profundo: Regex para encontrar { ... }
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch (innerError) {
          throw new Error("Found JSON-like block but it is not valid JSON.");
        }
      }
      throw new Error("No JSON block found in response.");
    }
  }

  startChat(history, systemInstruction) {
    return {
      sendMessage: async (msg) => this.generateResponse('nexus', msg, history, systemInstruction)
    };
  }
}

module.exports = new AIService();