// Archivo: backend/services/ArgusVisionService.js
// Clasificación visual de imágenes con Gemini Vision (VertexAI)
// Detecta: fotos limpias, texto overlay, gráficos, baja calidad

const fs = require("fs");
const path = require("path");
const { VertexAI } = require("@google-cloud/vertexai");

// Categorías de clasificación
const PHOTO_CLASSES = {
  CLEAN_PHOTO: "clean_photo", // Foto real sin texto
  TEXT_OVERLAY: "text_overlay", // Foto con texto superpuesto
  GRAPHIC: "graphic", // Flyer, arte digital, no foto
  LOW_QUALITY: "low_quality", // Borrosa, oscura, inutilizable
  SCREENSHOT: "screenshot", // Captura de pantalla
};

class ArgusVisionService {
  constructor() {
    this.logPrefix = "🔮 [ARGUS VISION]";
    this.model = null;
    this._initModel();
  }

  _initModel() {
    try {
      const saPath = path.resolve(__dirname, "../serviceAccountKey.json");
      if (!fs.existsSync(saPath)) return;
      const sa = require(saPath);
      process.env.GOOGLE_APPLICATION_CREDENTIALS = saPath;
      const vertexAI = new VertexAI({
        project: sa.project_id,
        location: "us-central1",
      });
      // Flash para clasificación rápida y económica
      this.model = vertexAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });
      console.log(`${this.logPrefix} Online (Gemini Flash Vision)`);
    } catch (e) {
      console.warn(`${this.logPrefix} ⚠️ Init failed: ${e.message}`);
    }
  }

  /**
   * Clasifica una imagen local.
   * @param {string} imagePath - Ruta absoluta a la imagen
   * @returns {Promise<Object>} { class, confidence, reason }
   */
  async classify(imagePath) {
    if (!this.model) {
      console.warn(`${this.logPrefix} No model — fallback: clean_photo`);
      return {
        class: PHOTO_CLASSES.CLEAN_PHOTO,
        confidence: 0.5,
        reason: "No vision model",
      };
    }

    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64 = imageBuffer.toString("base64");
      const ext = path.extname(imagePath).toLowerCase();
      const mimeType =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
            ? "image/webp"
            : "image/jpeg";

      const prompt = `Analyze this image for a business landing page. Classify it into exactly ONE category:

1. "clean_photo" — Real photograph of a place, product, food, person, or environment. No visible text overlay.
2. "text_overlay" — Photo or image with promotional text, prices, phone numbers, or watermarks overlaid on it.
3. "graphic" — Digital flyer, poster, infographic, or designed artwork (not a real photograph).
4. "low_quality" — Very blurry, extremely dark, pixelated, or unusable for a professional website.
5. "screenshot" — Screenshot of a phone, app, or website.

Respond ONLY with a JSON object like: {"class": "clean_photo", "confidence": 0.95, "reason": "Natural photo of food plating"}`;

      const result = await this.model.generateContent([
        { text: prompt },
        { inlineData: { mimeType, data: base64 } },
      ]);

      const text = result.response.candidates[0].content.parts[0].text;
      const clean = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsed = JSON.parse(clean);

      console.log(
        `${this.logPrefix} ${path.basename(imagePath)} → ${parsed.class} (${(parsed.confidence * 100).toFixed(0)}%)`,
      );
      return parsed;
    } catch (e) {
      console.warn(`${this.logPrefix} Classification failed: ${e.message}`);
      return {
        class: PHOTO_CLASSES.CLEAN_PHOTO,
        confidence: 0.3,
        reason: `Error: ${e.message}`,
      };
    }
  }

  /**
   * Filtra un array de rutas de imágenes locales.
   * Solo pasa las fotos limpias (clean_photo).
   * @param {string[]} imagePaths - Rutas absolutas
   * @returns {Promise<Object>} { accepted, rejected, report }
   */
  async filterBatch(imagePaths) {
    const accepted = [];
    const rejected = [];
    const report = [];

    for (const imgPath of imagePaths) {
      const result = await this.classify(imgPath);
      const entry = { path: imgPath, ...result };
      report.push(entry);

      if (result.class === PHOTO_CLASSES.CLEAN_PHOTO) {
        accepted.push(imgPath);
      } else {
        rejected.push(entry);
        console.log(
          `${this.logPrefix} ❌ Filtrada: ${path.basename(imgPath)} (${result.class}: ${result.reason})`,
        );
      }
    }

    console.log(
      `${this.logPrefix} Resultado: ${accepted.length} aceptadas, ${rejected.length} filtradas de ${imagePaths.length} totales`,
    );
    return { accepted, rejected, report };
  }
}

module.exports = new ArgusVisionService();
