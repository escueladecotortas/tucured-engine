// Archivo: backend/services/AIImageService.js
// Generación de imágenes IA para hero backgrounds y fondos de sección
// Usa Vertex AI Imagen 3 (cuando disponible) o genera prompts para uso manual

const fs = require("fs");
const path = require("path");

class AIImageService {
  constructor() {
    this.logPrefix = "🎨 [AI IMAGE]";
    // Roles válidos para generación de imágenes
    this.VALID_ROLES = ["hero_bg", "section_bg", "texture", "pattern"];
    // Roles prohibidos (nunca generar con IA)
    this.FORBIDDEN = [
      "product",
      "person",
      "storefront",
      "logo",
      "food_closeup",
    ];
  }

  /**
   * Genera un prompt contextual para la imagen según rubro y vibración.
   * @param {Object} options
   * @param {string} options.role - Rol de la imagen (hero_bg, section_bg...)
   * @param {string} options.category - Categoría del negocio (gastronomy, beauty...)
   * @param {string} options.vibe - Vibración NEXUS (1-9)
   * @param {string} options.name - Nombre del negocio
   * @returns {string} Prompt para generación
   */
  buildPrompt({ role, category, vibe, name }) {
    // Paleta de estéticas según vibración
    const vibeStyles = {
      1: "luxurious, golden lighting, elegant",
      2: "warm, inviting, dual-tone harmony",
      3: "bold, disruptive, vibrant gradients",
      4: "structured, brutalist, geometric",
      5: "creative, kinetic, colorful",
      6: "soft, harmonious, rounded shapes",
      7: "minimal, glassmorphism, white space",
      8: "sovereign, dark chrome, asymmetric",
      9: "radical minimal, monochrome, editorial",
    };

    // Sujeto según categoría
    const categorySubjects = {
      gastronomy: "modern restaurant interior with ambient lighting",
      cafe: "artisan coffee shop with warm tones",
      beauty: "elegant spa environment with soft lighting",
      fitness: "dynamic gym atmosphere with dramatic lighting",
      retail: "stylish retail store interior",
      automotive: "automotive workshop with industrial aesthetic",
      professional: "modern office space with clean lines",
      education: "bright learning environment",
      veterinary: "warm veterinary clinic with natural light",
      nightlife: "vibrant nightclub atmosphere with neon accents",
    };

    const style = vibeStyles[vibe] || vibeStyles["7"];
    const subject = categorySubjects[category] || "modern business environment";

    const roleContext = {
      hero_bg: `wide angle, hero banner background, blurred bokeh, atmospheric depth`,
      section_bg: `subtle background texture, low contrast, designed to have text overlay`,
      texture: `abstract texture, seamless pattern, muted colors`,
      pattern: `geometric pattern, repeating, subtle`,
    };

    return `Professional photograph of ${subject}, ${style}, ${roleContext[role] || roleContext.hero_bg}, high resolution, commercial quality, no text, no logos, no people faces`;
  }

  /**
   * Genera (o prepara para generar) una imagen IA.
   * Actualmente genera el prompt y lo almacena para ejecución manual
   * o futura integración con Imagen 3 API.
   * @param {Object} options - Ver buildPrompt
   * @param {string} destPath - Ruta de destino para la imagen
   * @returns {Promise<Object>} { generated, prompt, path }
   */
  async generate(options, destPath) {
    // Validar que el rol es permitido
    if (this.FORBIDDEN.includes(options.role)) {
      console.warn(`${this.logPrefix} ❌ Rol prohibido: ${options.role}`);
      return {
        generated: false,
        reason: `Rol ${options.role} prohibido para IA`,
      };
    }

    if (!this.VALID_ROLES.includes(options.role)) {
      console.warn(`${this.logPrefix} ⚠️ Rol desconocido: ${options.role}`);
      return { generated: false, reason: `Rol ${options.role} no reconocido` };
    }

    const prompt = this.buildPrompt(options);

    // Guardar el prompt para referencia
    const promptPath = destPath.replace(/\.[^.]+$/, "_prompt.txt");
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(promptPath, prompt);

    console.log(`${this.logPrefix} Prompt generado para ${options.role}:`);
    console.log(`   "${prompt.substring(0, 100)}..."`);

    // TODO: Integrar Vertex AI Imagen 3 cuando esté disponible
    // const imagen = vertexAI.getImageGenerationModel({ model: 'imagen-3.0-generate-001' });
    // const result = await imagen.generateImages({ prompt, numberOfImages: 1 });

    return {
      generated: false,
      prompt,
      promptPath,
      reason: "Imagen 3 API pendiente de integración. Prompt guardado.",
    };
  }

  /**
   * Determina qué imágenes IA necesita un landing según las fotos disponibles.
   * @param {number} photoCount - Cantidad de fotos curadas disponibles
   * @param {string} category - Categoría del negocio
   * @returns {string[]} Lista de roles que necesitan imagen IA
   */
  getNeededRoles(photoCount, category) {
    const needed = [];
    // Si tiene menos de 3 fotos, generar hero background
    if (photoCount < 3) needed.push("hero_bg");
    // Si tiene menos de 5, generar un section background
    if (photoCount < 5) needed.push("section_bg");
    return needed;
  }
}

module.exports = new AIImageService();
