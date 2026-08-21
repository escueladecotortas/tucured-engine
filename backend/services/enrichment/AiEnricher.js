// Archivo: backend/services/enrichment/AiEnricher.js
// Gestor de Análisis Vibracional, Tono de Voz y Rubro Real (Hybrid Cortex) - Ley de 200 líneas

const aiService = require("../aiService");

class AiEnricher {
  static async enrich(lead, enrichedData) {
    console.log(`⚙️ [PROCESS] AI Vibrational Analysis (Hybrid Cortex)`);

    const igBio = enrichedData.instagramData?.bio || "";
    const igCaptions = (enrichedData.instagramData?.captions || []).slice(0, 8);
    const igFollowers = enrichedData.instagramData?.followers || 0;
    const mapCategory = enrichedData.category || lead.category || "General";
    const mapAddress = enrichedData.googlePlace?.address || lead.address || "";
    const mapReviews = enrichedData.reviewsCount || enrichedData.reviews || 0;
    const mapRating = enrichedData.rating || 0;
    const reviewTexts = (enrichedData.topReviews || []).map((r) => `${r.author}: "${r.text}"`).slice(0, 5);
    const hoursData = (enrichedData.openingHours || enrichedData.hours || []).map((h) => typeof h === 'string' ? h : `${h.day}: ${h.hours}`).join(", ");

    const prompt = `Sos un copywriter y estratega de marca experto en negocios locales de Argentina.
Analizá los datos reales y generá la identidad verbal para su Landing Page de alta conversión.

══ DATOS REALES DEL NEGOCIO ══
Nombre: ${lead.name}
Rubro inicial: ${mapCategory}
Dirección: ${mapAddress}
Rating: ${mapRating}⭐ (${mapReviews} reviews)
Instagram: @${lead.instagram || "N/A"} (${igFollowers} seguidores)
Bio IG: "${igBio}"
${hoursData ? `Horarios: ${hoursData}` : ""}

══ PUBLICACIONES EN INSTAGRAM ══
${igCaptions.length > 0 ? igCaptions.map((c, i) => `Post ${i + 1}: "${c.substring(0, 250)}"`).join("\n") : "Sin posts"}

══ RESEÑAS REALES DE GOOGLE MAPS ══
${reviewTexts.length > 0 ? reviewTexts.join("\n") : "Sin reseñas"}

══ REGLAS DE GENERACIÓN ══
Genera un JSON estrictamente válido con estos campos:
1. "vibe": Número 1-9 según la personalidad estética y energética.
2. "toneVoice": Descripción del tono de voz en 3 a 6 adjetivos (ej: "Nocturno, juvenil, cervecero, enérgico" o "Elegante, cálido, profesional").
3. "tagline": Slogan de máximo 6 palabras que capture la esencia del negocio.
4. "description": Descripción persuasiva de 1-2 oraciones (máx 180 caracteres).
5. "benefits": Array de EXACTAMENTE 3 beneficios comerciales clave.
6. "suggested_features": Array de 4 servicios o platos destacados.
7. "canonicalCategory": Asignar el rubro real específico entre: ['gastronomia_bar', 'cerveceria', 'pub', 'restaurante', 'pizzeria', 'burger', 'cafe', 'heladeria', 'sushi', 'estetica', 'barberia', 'peluqueria', 'gimnasio', 'salud_clinica', 'veterinaria', 'automotive', 'retail', 'professional'].

RESPONDE EXCLUSIVAMENTE EN JSON VÁLIDO.`.trim();

    try {
      const aiResult = await aiService.generateJSON(prompt);

      enrichedData.vibe = String(aiResult.vibe || "2");
      enrichedData.toneVoice = aiResult.toneVoice || "Profesional, cercano, moderno";
      enrichedData.tagline = aiResult.tagline || "";
      enrichedData.description = aiResult.description || "";
      enrichedData.benefits = aiResult.benefits || [];
      enrichedData.aiFeatures = aiResult.suggested_features || [];

      // Semantic Crosswalk con detección heurística de contexto
      const allowedCats = [
        'gastronomia_bar', 'cerveceria', 'pub', 'restaurante', 'pizzeria', 'burger',
        'cafe', 'heladeria', 'sushi', 'estetica', 'barberia', 'peluqueria',
        'gimnasio', 'salud_clinica', 'veterinaria', 'automotive', 'retail', 'professional'
      ];
      
      let finalCategory = (aiResult.canonicalCategory || "").toLowerCase().trim();
      const combinedText = `${lead.name} ${mapCategory} ${igBio}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (combinedText.includes('bar') || combinedText.includes('pub') || combinedText.includes('cervez') || combinedText.includes('birra') || combinedText.includes('irlanda')) {
        finalCategory = 'gastronomia_bar';
      } else if (combinedText.includes('floreria') || combinedText.includes('florist') || combinedText.includes('flower') || combinedText.includes('flores')) {
        finalCategory = 'retail';
      }

      if (allowedCats.includes(finalCategory)) {
        enrichedData.category = finalCategory;
        console.log(`   🔀 [Semantic Crosswalk] Mapped "${mapCategory}" -> "${finalCategory}"`);
      } else {
        enrichedData.category = mapCategory || "gastronomia_bar";
      }

      console.log(`   🧠 Vibe: ${enrichedData.vibe} | Tono: "${enrichedData.toneVoice}" | Tagline: "${enrichedData.tagline}"`);
      enrichedData.enrichmentLog.push(`AI: Vibe ${enrichedData.vibe}, Tono: ${enrichedData.toneVoice} via Hybrid Cortex`);

    } catch (err) {
      console.error(`   ❌ AI failed: ${err.message}`);
      enrichedData.vibe = lead.vibe || "2";
      enrichedData.toneVoice = "Cercano, moderno, profesional";
      enrichedData.enrichmentLog.push(`AI: Fallback por error (${err.message})`);
    }
  }
}

module.exports = AiEnricher;
