// Archivo: backend/services/enrichment/AiEnricher.js
const aiService = require("../aiService");

/**
 * Gestor de Análisis Vibracional e Identidad Visual (Hybrid Cortex).
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class AiEnricher {
  /**
   * Genera el copy y la identidad del negocio usando IA.
   */
  static async enrich(lead, enrichedData) {
    console.log(`⚙️ [PROCESS] AI Vibrational Analysis (Hybrid Cortex)`);

    const igBio = enrichedData.instagramData?.bio || "";
    const igCaptions = (enrichedData.instagramData?.captions || []).slice(0, 8);
    const igFollowers = enrichedData.instagramData?.followers || 0;
    const mapCategory = enrichedData.category || lead.category || "General";
    const mapAddress = enrichedData.googlePlace?.address || lead.address || "";
    const mapReviews = enrichedData.reviews || 0;
    const mapRating = enrichedData.rating || 0;
    const reviewTexts = (enrichedData.topReviews || []).map((r) => `${r.author}: "${r.text}"`).slice(0, 5);
    const hoursData = (enrichedData.hours || []).map((h) => `${h.day}: ${h.hours}`).join(", ");

    const prompt = `Sos un copywriter experto en negocios locales. Tu trabajo es crear la identidad verbal de un negocio para su Landing Page.

VAS A LEER los datos reales del negocio y USAR SUS PROPIAS PALABRAS para generar el copy. Prohibido inventar frases genéricas.

══ DATOS REALES DEL NEGOCIO ══
Nombre: ${lead.name}
Rubro: ${mapCategory}
Dirección: ${mapAddress}
Rating: ${mapRating}⭐ (${mapReviews} reviews)
Instagram: @${lead.instagram || "N/A"} (${igFollowers} seguidores)
Bio IG: "${igBio}"
${hoursData ? `Horarios: ${hoursData}` : ""}

══ QUÉ PUBLICA EN INSTAGRAM (sus propias palabras) ══
${igCaptions.length > 0 ? igCaptions.map((c, i) => `Post ${i + 1}: "${c.substring(0, 300)}"`).join("\n") : "Sin datos de posts"}

══ QUÉ DICEN SUS CLIENTES (reseñas reales de Google) ══
${reviewTexts.length > 0 ? reviewTexts.join("\n") : "Sin reseñas"}

══ INSTRUCCIONES ESTRICTAS ══
Genera un JSON con estos campos:

1. "vibe": Número 1-9 según la personalidad del negocio.
2. "tagline": Slogan de máximo 6 palabras. REGLA: debe contener al menos UNA palabra o concepto que aparezca en los posts de Instagram o en las reseñas.
3. "description": Descripción comercial de 1-2 oraciones (max 200 chars).
4. "benefits": Array de EXACTAMENTE 3 beneficios.
5. "suggested_features": Array de features para la Landing.
6. "canonicalCategory": Elige una: ['burger', 'pizza', 'cafe', 'heladeria', 'sushi', 'gastronomy', 'fast_food', 'beauty', 'nail_salon', 'fitness', 'professional', 'automotive', 'retail', 'pet_shop', 'veterinary'].

RESPONDER EXCLUSIVAMENTE EN JSON VÁLIDO. Sin markdown.`.trim();

    try {
      const aiResult = await aiService.generateJSON(prompt);

      enrichedData.vibe = String(aiResult.vibe || "1");
      enrichedData.tagline = aiResult.tagline || "";
      enrichedData.description = aiResult.description || "";
      enrichedData.benefits = aiResult.benefits || [];
      enrichedData.aiFeatures = aiResult.suggested_features || [];

      // Semantic Crosswalk (Mapeo CATEGORIA)
      const allowedCats = ['burger', 'pizza', 'cafe', 'heladeria', 'sushi', 'gastronomy', 'fast_food', 'beauty', 'nail_salon', 'fitness', 'professional', 'automotive', 'retail', 'pet_shop', 'veterinary'];
      const rawCanonical = (aiResult.canonicalCategory || "").toLowerCase().trim();
      
      if (allowedCats.includes(rawCanonical)) {
        enrichedData.category = rawCanonical;
        console.log(`   🔀 [Semantic Crosswalk] Mapped "${mapCategory}" -> "${rawCanonical}"`);
      } else {
        console.log(`   ⚠️ [Semantic Crosswalk] Failed boundary on "${rawCanonical}". Fallback: retail`);
        enrichedData.category = "retail";
      }

      console.log(`   🧠 Vibe: ${enrichedData.vibe} — "${enrichedData.tagline}"`);
      enrichedData.enrichmentLog.push(`AI: Vibe ${enrichedData.vibe} via Hybrid Cortex`);

    } catch (err) {
      console.error(`   ❌ AI failed: ${err.message}`);
      enrichedData.enrichmentLog.push(`AI: Failed (${err.message}). Defaults.`);
      enrichedData.vibe = lead.vibe || "1";
    }
  }
}

module.exports = AiEnricher;
