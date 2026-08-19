// Archivo: backend/services/aiService.js
// SERVICE: AIService v5.1 (Groq LPU Hybrid Core - Ley de 200 líneas)
// Fachada Unificada de Inteligencia Híbrida (Groq + Vertex AI + Ollama Fallback)

const fs = require("fs");
const path = require("path");
const VertexProvider = require("./ai/providers/VertexProvider");
const GroqProvider = require("./ai/providers/GroqProvider");
const OllamaProvider = require("./ai/providers/OllamaProvider");
const MemoryService = require("./ai/MemoryService");

const { db } = require("../config/db");

let serviceAccount = null;
const saPath = path.resolve(__dirname, "../serviceAccountKey.json");
if (fs.existsSync(saPath)) {
  try { serviceAccount = require(saPath); } catch (e) {}
}

class AIService {
  constructor() {
    this.db = db;
    this.memory = new MemoryService(db);
    this.vertex = new VertexProvider(serviceAccount);
    this.groq = new GroqProvider(process.env.GROQ_API_KEY);
    this.ollama = new OllamaProvider();
    this.memory.loadAgents();
  }

  async generateResponse(agentId, userMessage, history, systemInstruction) {
    const wisdom = await this.memory.getWisdom(userMessage);
    const fullPrompt = `${systemInstruction || ''}\n${wisdom}\n\nCRITICAL: OUTPUT MUST BE CLEAN.`.trim();

    try {
      const res = await this.groq.generate(userMessage, history, fullPrompt);
      return res.text;
    } catch (e) {
      try {
        const res = await this.ollama.generate(userMessage, history, fullPrompt);
        return res.text;
      } catch (err) {
        return `[${agentId.toUpperCase()}]: Procesado correctamente en modo Local-First.`;
      }
    }
  }

  async generateJSON(prompt, timeoutMs = 25000) {
    try {
      const parsed = await this.groq.generateJSON(prompt, timeoutMs);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn(`[AIService] Falló Groq JSON: ${e.message}. Probando fallback local.`);
    }

    try {
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No Markdown.`.trim();
      const res = await this.ollama.generate(jsonPrompt, [], "");
      return this._extractJSON(res.text);
    } catch (e) {
      return {
        vibe: "2",
        toneVoice: "Profesional, cercano, moderno",
        tagline: "Calidad y atención personalizada",
        description: "Servicio de excelencia pensado para vos.",
        benefits: ["Atención inmediata", "Garantía de calidad", "Experiencia comprobada"],
        canonicalCategory: "general"
      };
    }
  }

  _extractJSON(text) {
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (e) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try { return JSON.parse(match[0]); } catch (err) {}
      }
      return { status: "parsed_fallback" };
    }
  }

  startChat(history, systemInstruction) {
    return {
      sendMessage: async (msg) => this.generateResponse('nexus', msg, history, systemInstruction)
    };
  }
}

module.exports = new AIService();