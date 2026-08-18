// Archivo: backend/services/SmartCopyEngine.js
// SERVICE: SmartCopyEngine (Generación de Copy Estructurado con UnifiedAI - Ley de 200 líneas)

const UnifiedAIService = require('./UnifiedAIService');

class SmartCopyEngine {
    static async generate(prospectData, brandKit) {
        const { name, category, subcategory, instagram, address, aiContext } = prospectData;
        console.log(`🧠 [SmartCopy] Generando copy inteligente para: ${name} (${category})`);

        const prompt = `
            Actúa como un Copywriter profesional para una agencia web de alta gama.
            Escribe el contenido para la landing page de:
            - Nombre: "${name}"
            - Rubro: "${category}"
            - Contexto: "${subcategory || ''}, ${aiContext || ''}"
            - Vibe: "${brandKit.vibes?.archtype || 'Modern'}"

            REGLAS:
            1. Escribe en ESPAÑOL natural (Argentina/Latinoamérica).
            2. Devuelve un JSON estructurado con: hero, about, services (array de objetos {name, description}), contact.
        `;

        try {
            const { data } = await UnifiedAIService.generateJSON(prompt, {
                systemPrompt: "Eres un copywriter profesional de alta conversión.",
                prefer: 'groq'
            });

            return {
                hero: data.hero || { title: `Bienvenido a ${name}`, subtitle: 'Calidad y compromiso', cta: 'Contactar' },
                about: data.about || { title: 'Sobre Nosotros', text: `En ${name} brindamos una experiencia única en ${category}.` },
                services: Array.isArray(data.services) ? data.services : [{ name: 'Atención Personalizada', description: 'Servicio de primera calidad' }],
                contact: data.contact || { cta: 'Escribinos por WhatsApp', instagram: instagram || '', address: address || '' },
                category,
                features: prospectData.aiFeatures || []
            };
        } catch (error) {
            console.warn(`⚠️ [SmartCopy] Fallback Heurístico activado: ${error.message}`);
            return {
                hero: { title: `Bienvenido a ${name}`, subtitle: `Lo mejor en ${category} para vos.`, cta: 'Pedir Ahora' },
                about: { title: 'Sobre Nosotros', text: `Nos dedicamos a brindar la mejor experiencia a nuestros clientes.` },
                services: [{ name: 'Calidad Garantizada', description: 'Atención personalizada y productos de primera línea.' }],
                contact: { cta: 'Contactanos', instagram: instagram || '', address: address || '' },
                category,
                features: []
            };
        }
    }
}

module.exports = SmartCopyEngine;
