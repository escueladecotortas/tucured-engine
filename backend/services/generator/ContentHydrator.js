// Archivo: backend/services/generator/ContentHydrator.js
const fs = require('fs').promises;
const path = require('path');
const NumerologyEngine = require("../NumerologyEngine");
const AgentService = require("../AgentService");

/**
 * Especialista en Persistencia e Hidratación de Contenido.
 * Delegación a Specialist Vault (Lorem) para cumplimiento de MAS.
 */
class ContentHydrator {
  static async getOrGenerateBrandKit(clientPath, data, force) {
    const filePath = path.join(clientPath, "brand-kit.json");
    if (force) await fs.unlink(filePath).catch(() => {});
    
    try {
      return JSON.parse(await fs.readFile(filePath, "utf8"));
    } catch (e) {
      console.log("🎨 [BRAND] Generating New Brand Kit...");
      const kit = NumerologyEngine.generateBrandKit(data);
      await fs.writeFile(filePath, JSON.stringify(kit, null, 2));
      return kit;
    }
  }

  static async getOrGenerateContent(clientPath, data, brandKit, force) {
    const filePath = path.join(clientPath, "content.json");
    if (force) await fs.unlink(filePath).catch(() => {});
    
    try {
      return JSON.parse(await fs.readFile(filePath, "utf8"));
    } catch (e) {
      console.log("🧠 [THINK] Generating Smart Copy via Specialist Vault (Lorem)...");
      
      let content;
      try {
        const prompt = `
Generá el contenido estructurado JSON para la landing de "${data.name}".
NARRATIVA APROBADA: ${data.approvedNarrative || "N/A"}
ESTILO: ${brandKit.vibes?.archtype || "Modern"}

DEBES DEVOLVER UN JSON ÚNICAMENTE:
{
  "hero": { "title": "...", "subtitle": "...", "cta": "..." },
  "about": { "title": "Sobre Nosotros", "text": "..." },
  "services": [ { "name": "...", "description": "..." } ],
  "contact": { "cta": "Contactar", "instagram": "${data.instagram || ""}", "address": "${data.address || ""}" }
}`;
        const response = await AgentService.interact("lorem", prompt, [], data.id);
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        content = jsonMatch ? JSON.parse(jsonMatch[0]) : this.getFallback(data);
      } catch (err) {
        console.error("❌ [ContentHydrator] MAS Fallback Error:", err.message);
        content = this.getFallback(data);
      }

      await fs.writeFile(filePath, JSON.stringify(content, null, 2));
      return content;
    }
  }

  static getFallback(data) {
    return {
      hero: { title: `Bienvenido a ${data.name}`, subtitle: 'Calidad y servicio profesional.', cta: 'Contactar' },
      about: { title: `Sobre ${data.name}`, text: 'Comprometidos con la excelencia y la satisfacción de nuestros clientes.' },
      services: [{ name: "Atención Personalizada", description: "Brindamos el mejor servicio para nuestra categoría." }],
      contact: { cta: 'Consultar', instagram: data.instagram || '', address: data.address || '' }
    };
  }
}

module.exports = ContentHydrator;

