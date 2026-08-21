// Archivo: scripts/test_floreria_crosswalk.cjs
const AiEnricher = require('../backend/services/enrichment/AiEnricher');
const StitchPromptBuilder = require('../backend/services/stitch/StitchPromptBuilder');

// Simulamos el mock de aiService para que no falle ni llame a la API
const aiService = require('../backend/services/aiService');
aiService.generateJSON = async () => ({
    vibe: 4,
    toneVoice: "Elegante, fresco",
    tagline: "Flores para cada momento",
    description: "Diseño floral",
    benefits: ["Frescura", "Envío rápido", "Atención"],
    suggested_features: ["Ramos", "Eventos", "Regalos"],
    canonicalCategory: "professional" // Simulamos el error del AI
});

async function runTest() {
    const lead = { name: "Florería Independencia" };
    const enrichedData = { category: "professional", instagramData: { bio: "Florería y botánica" }, enrichmentLog: [] };
    
    await AiEnricher.enrich(lead, enrichedData);
    
    console.log(`\n[CROSSWALK TEST]`);
    console.log(`Lead: ${lead.name}`);
    console.log(`Categoría final asignada: ${enrichedData.category} (Esperado: retail)`);
    
    if (enrichedData.category === 'retail') {
        console.log(`✅ OK: El crosswalk interceptó "floreria" y lo reasignó correctamente a "retail".`);
    } else {
        console.log(`❌ FAIL: La categoría sigue siendo "${enrichedData.category}".`);
        process.exit(1);
    }
    
    console.log(`\n[PROMPT BUILDER TEST]`);
    const prompt = StitchPromptBuilder.buildPrompt(enrichedData);
    if (prompt.includes('Outfit/Inter') && prompt.includes('paletas dinámicas') && prompt.includes('data-nexus-slot=')) {
        console.log(`✅ OK: El prompt contiene "Outfit/Inter", "paletas dinámicas" y las directivas de inyección (data-nexus-slot).`);
    } else {
        console.log(`❌ FAIL: Faltan las directivas obligatorias en el prompt.`);
        process.exit(1);
    }
    
    process.exit(0);
}

runTest();
