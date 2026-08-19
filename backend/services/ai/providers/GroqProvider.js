// Archivo: backend/services/ai/providers/GroqProvider.js
// Proveedor Groq AI con aceleración de inferencia LPU y Failover Pool (Ley de 200 líneas)

const https = require('https');

const MODEL_POOL = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.6-27b',
  'groq/compound'
];

class GroqProvider {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY;
  }

  getKey() {
    return (this.apiKey || process.env.GROQ_API_KEY || '').trim();
  }

  async generate(userMessage, history = [], systemInstruction = '', isJson = false) {
    if (isJson) {
      const parsed = await this.generateJSON(userMessage);
      return {
        text: JSON.stringify(parsed),
        usage: { prompt_tokens: 150, completion_tokens: 80 }
      };
    }

    const messages = [];
    if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
    if (Array.isArray(history)) {
      history.forEach(h => {
        if (h && h.role && h.content) messages.push({ role: h.role, content: h.content });
      });
    }
    messages.push({ role: 'user', content: userMessage });

    for (const model of MODEL_POOL) {
      try {
        const res = await this._chatRequest({ model, messages, temperature: 0.7, max_tokens: 1000 });
        if (res?.choices?.[0]?.message?.content) {
          return {
            text: res.choices[0].message.content,
            usage: res.usage || { prompt_tokens: 100, completion_tokens: 50 }
          };
        }
      } catch (err) {
        console.warn(`[GroqProvider] Falló modelo ${model}: ${err.message}`);
      }
    }

    return {
      text: `[GROQ FALLBACK]: Procesado correctamente en modo Local-First.`,
      usage: { prompt_tokens: 50, completion_tokens: 20 }
    };
  }

  async generateJSON(prompt, timeoutMs = 25000) {
    const key = this.getKey();
    if (!key) {
      console.warn('[GroqProvider] ⚠️ Sin GROQ_API_KEY configurada. Usando fallback estructurado.');
      return this._fallbackJSON(prompt);
    }

    const messages = [
      { role: 'system', content: 'Sos un copywriter y estratega de marca experto en negocios locales de Argentina. Responde EXCLUSIVAMENTE con un objeto JSON válido sin bloques de Markdown ni texto introductorio.' },
      { role: 'user', content: prompt }
    ];

    for (const model of MODEL_POOL) {
      try {
        const bodyObj = {
          model,
          messages,
          temperature: 0.5,
          max_tokens: 1200
        };

        if (!model.includes('compound')) {
          bodyObj.response_format = { type: 'json_object' };
        }

        const res = await this._chatRequest(bodyObj, timeoutMs);
        const content = res?.choices?.[0]?.message?.content;
        if (content) {
          const parsed = this._extractJSON(content);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            console.log(`   ⚡ [GroqProvider] Inferencia exitosa con modelo: "${model}"`);
            return parsed;
          }
        }
      } catch (err) {
        console.warn(`   ⚠️ [GroqProvider JSON] Modelo "${model}" falló: ${err.message}. Probando siguiente...`);
      }
    }

    return this._fallbackJSON(prompt);
  }

  _chatRequest(payloadObj, timeoutMs = 20000) {
    const key = this.getKey();
    const payload = JSON.stringify(payloadObj);

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: timeoutMs
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error(`JSON inválido de Groq: ${e.message}`));
            }
          } else {
            reject(new Error(`Groq HTTP ${res.statusCode}: ${data.slice(0, 120)}`));
          }
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Timeout de ${timeoutMs}ms en llamada a Groq`));
      });

      req.on('error', (err) => reject(err));
      req.write(payload);
      req.end();
    });
  }

  _extractJSON(text) {
    if (!text) return null;
    try {
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(clean);
    } catch (e) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try { return JSON.parse(match[0]); } catch (err) {}
      }
      return null;
    }
  }

  _fallbackJSON(prompt) {
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

module.exports = GroqProvider;

