// Archivo: backend/services/StitchPromptService.js
// SERVICE: StitchPromptService v4.0 (Modularized - Ley de 200 líneas)
// Genera el Prompt Maestro para Google Stitch MCP (generate_screen_from_text)

const ColorPaletteService = require("./ColorPaletteService");
const NumerologyEngine = require("./NumerologyEngine");
const slugify = require("../utils/slugify");

// Módulos extraídos para cumplimiento de la Doctrina de Hierro
const VIBES = require("./prompts/vibeDefinitions");
const BaseTemplates = require("./prompts/templates/BaseTemplates");
const StructureTemplate = require("./prompts/templates/StructureTemplate");
const PipelineTemplates = require("./prompts/templates/PipelineTemplates");

class StitchPromptService {
  /**
   * Ensambla el prompt maestro completo para Google Stitch MCP.
   * @param {Object} data - enrichedData desde Firestore
   */
  static assemble(data) {
    if (!data || !data.name) throw new Error("[StitchPromptService] enrichedData sin nombre.");

    const nameForNumerology = data.originalName || data.name.split('|')[0].split('-')[0].split('·')[0].trim();
    const masterNumber = NumerologyEngine.calculateMasterNumber(nameForNumerology);
    const vibeNum = masterNumber; 
    const aesthetic = VIBES[vibeNum] || VIBES[6];
    const palette = this._resolveFullPalette(data, masterNumber);

    const ig = data.instagramData || {};
    const gp = data.googlePlace || {};
    const curatedPhotos = data.curatedPhotos || { hero: null, products: [], gallery: [] };
    const logoUrl = curatedPhotos.logo || data.logoUrl || data.imageUrl || (data.photos?.length > 0 ? data.photos[0] : null);

    const sections = [
      `Diseñá una Landing Page profesional y moderna en ESPAÑOL para "${data.name}".`,
      BaseTemplates.identity(data.category || "General", data.tagline || data.name, data.approvedNarrative || data.description || "", ig.bio || "", aesthetic),
      BaseTemplates.tone(aesthetic, vibeNum)
    ];

    if (data.approvedNarrative) {
      sections.push(`═══ ESTRATEGIA NARRATIVA (APROBADA POR MAS) ═══\n${data.approvedNarrative}\n\nREGLA: Utilizá este copy como base fundamental para las secciones de la Landing.`);
    }

    const captions = (ig.captions || []).filter((c) => c && c.length > 10);
    if (captions.length > 0) sections.push(BaseTemplates.captions(captions, ig.handle || data.instagram || "", ig.followers || 0));

    const reviews = (data.topReviews || []).filter((r) => r && r.text);
    if (reviews.length > 0) sections.push(BaseTemplates.reviews(reviews, data.rating || 0, data.reviews || 0));

    sections.push(StructureTemplate.render(
      data.name, data.tagline || data.name, data.description || "", data.benefits || [], 
      curatedPhotos, logoUrl, reviews, data.hours || [], gp.phone || data.phone || "", 
      gp.address || data.address || "", ig.handle || data.instagram || "", gp.mapsLink || "", 
      data.clientId || slugify(data.name)
    ));

    if ((data.hours || []).length > 0) sections.push(BaseTemplates.hours(data.hours));
    sections.push(BaseTemplates.palette(palette));
    if ((data.aiFeatures || []).length > 0) sections.push(BaseTemplates.features(data.aiFeatures));
    
    // Inyectar instrucciones de slots (widgets) si existen
    if (data.stitchWidgetManifest) {
      sections.push(this.assembleSlotInstructions(data.stitchWidgetManifest));
    }

    sections.push(BaseTemplates.rules(aesthetic, gp.phone || data.phone || "", ig.handle || data.instagram || "", gp.mapsLink || "", vibeNum));

    return sections.join("\n\n");
  }

  static _resolveFullPalette(data, masterNumber) {
    // El Primary color y la Vibración nacen exclusivamente de la Numerología (Nombre del Cliente)
    const nameForNumerology = data.originalName || data.name.split('|')[0].split('-')[0].split('·')[0].trim();
    const brandKit = NumerologyEngine.generateBrandKit({
      name: nameForNumerology,
      category: data.category || 'general'
    });

    const primaryHex = brandKit.brand.primaryColor;
    
    // Generamos la armonía completa de 6 colores usando el motor de Atenea (ColorHarmonizer)
    return ColorPaletteService.generate(primaryHex, masterNumber);
  }

  static assembleSeed(data) {
    return PipelineTemplates.assembleSeed(data);
  }

  static assembleDirector(data, styleKeyword = "Editorial") {
    const nameForNumerology = data.originalName || data.name.split('|')[0].split('-')[0].split('·')[0].trim();
    const masterNumber = NumerologyEngine.calculateMasterNumber(nameForNumerology);
    const vibeNum = masterNumber;
    const aesthetic = VIBES[vibeNum] || VIBES[6];
    const palette = this._resolveFullPalette(data, masterNumber);
    return PipelineTemplates.assembleDirector(data, aesthetic, palette, styleKeyword);
  }

  static assembleSlotInstructions(widgetManifest) {
    return PipelineTemplates.assembleSlotInstructions(widgetManifest);
  }

  static getStyleKeyword(vibeNum) {
    const map = { 1: "Editorial", 2: "Organic", 3: "Bento Grid", 4: "Swiss Style", 5: "Neon", 6: "Editorial", 7: "Zen Focus", 8: "Dark Mode", 9: "Etéreo" };
    return map[vibeNum] || "Editorial";
  }

  static assembleQuick(data) {
    const nameForNumerology = data.originalName || data.name.split('|')[0].split('-')[0].split('·')[0].trim();
    const masterNumber = NumerologyEngine.calculateMasterNumber(nameForNumerology);
    const a = VIBES[masterNumber] || VIBES[6];
    return `Landing page para "${data.name}" (${data.category || "General"}). Tagline: "${data.tagline || data.name}". Estilo: ${a.style}. Tono: ${a.tone}. CTA: WhatsApp ${data.googlePlace?.phone || data.phone || ""}. ${data.benefits ? `Benefits: ${data.benefits.join(", ")}.` : ""} Textos en ESPAÑOL.`;
  }
}

module.exports = StitchPromptService;
