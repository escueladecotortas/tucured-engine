/**
 * SERVICE: SmartCopyEngine
 * Purpose: Generate copy and content based on business category.
 * Extracted from AutoSiteGenerator.js for Argus Compliance.
 */

const GeminiService = require('./GeminiService');
const GroqService = require('./GroqService');

class SmartCopyEngine {

    static async generate(prospectData, brandKit) {
        const { name, category, subcategory, instagram, address, aiContext } = prospectData;
        
        console.log(`🧠 [SmartCopy] Generating REAL AI copy for: ${name} (${category})`);

        // Prompt Engineering for Gemini
        const prompt = `
            You are a professional Copywriter for a high-end web agency.
            Write the content for a landing page for a client with these details:
            - Name: "${name}"
            - Category: "${category}"
            - Features/Context: "${subcategory || ''}, ${aiContext || ''}"
            - Vibe: "${brandKit.vibes?.archtype || 'Modern'}"

            IMPORTANT: Write all content in SPANISH (Argentina/Latin American).
            Tone: Professional, engaging, and aligned with the Vibe.

            CRITICAL ANTI-HALLUCINATION RULES:
            1. ONLY list services or benefits explicitly found in the data source.
            2. DO NOT invent professional titles or credentials.
            3. If a service is not mentioned in the source, OMIT IT entirely.
            4. Accuracy is the highest design priority.
            5. ONLY list services explicitly mentioned in the "Features/Context".
            6. DO NOT invent or assume services.
            7. If context provides only 1 service, return ONLY 1 in the array. Do not force 3 items.
            8. If no services are found, describe the general value of the business category.

            Return a JSON object (strictly JSON, no markdown) with this structure:
            {
                "hero": {
                    "title": "A short, punchy 3-5 word headline",
                    "subtitle": "A persuasive 10-15 word subheadline focusing on value",
                    "cta": "Call to action text (e.g., 'Book Now')"
                },
                "about": {
                    "title": "About Us",
                    "text": "A warm, professional 30-word description of the business."
                },
                "services": [
                    { "name": "Service 1", "description": "Short desc" },
                    { "name": "Service 2", "description": "Short desc" },
                    { "name": "Service 3", "description": "Short desc" }
                ],
                "contact": {
                    "cta": "Final CTA",
                    "instagram": "${instagram || ''}",
                    "address": "${address || ''}"
                }
            }
        `;

        try {
            // [GROQ] Primary Engine (Llama 3.3)
            let rawText = await GroqService.generate(prompt, "You are a professional UX Copywriter.");
            
            // [GEMINI] Backup Engine (Flash Lite 2.0)
            if (!rawText) {
                 console.warn("⚠️ [SmartCopy] Groq failed. Switching to Gemini Backup...");
                 rawText = await GeminiService.generateCopy(prompt);
            }
            
            if (!rawText) throw new Error("AI Engines returned NULL response.");

            console.log(`🧠 [SmartCopy] Gemini Raw Response (Preview): ${rawText.substring(0, 100)}...`);
            
            // Robust JSON Extraction
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No JSON found in response");
            
            const jsonStr = jsonMatch[0];
            const content = JSON.parse(jsonStr);

            return {
                ...content,
                category: category,
                features: prospectData.aiFeatures || []
            };

        } catch (error) {
            console.error(`❌ [SmartCopy] AI Generation Failed: ${error.message}`);
            // console.error(error); // Keep clean logs
            return this.getFallback(prospectData);
        }
    }

    static getFallback(prospectData) {
        return {
            hero: { title: `Bienvenido a ${prospectData.name}`, subtitle: 'Calidad y servicio profesional.', cta: 'Contactar' },
            about: { title: `Sobre ${prospectData.name}`, text: 'Comprometidos con la excelencia y la satisfacción de nuestros clientes.' },
            services: [{ name: "Atención Personalizada", description: "Brindamos el mejor servicio para nuestra categoría." }],
            contact: { cta: 'Consultar', instagram: '', address: '' },
            category: 'general'
        };
    }
}

module.exports = SmartCopyEngine;
