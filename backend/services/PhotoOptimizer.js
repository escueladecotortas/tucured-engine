// Archivo: backend/services/PhotoOptimizer.js
// Compresión y conversión de imágenes a WebP antes de deploy
// Reduce peso ~80% sin pérdida de calidad visible

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class PhotoOptimizer {
  constructor() {
    this.logPrefix = "📦 [OPTIMIZER]";
    // Configuración de calidad WebP
    this.webpQuality = 80;
    this.maxWidth = 1920;
    this.maxHeight = 1080;
    this.thumbWidth = 400;
  }

  /**
   * Convierte una imagen a WebP optimizado.
   * @param {string} inputPath - Ruta de la imagen original
   * @param {string} outputPath - Ruta de destino (con extensión .webp)
   * @param {Object} opts - Opciones de conversión
   * @returns {Promise<Object>} { success, originalSize, optimizedSize, savings }
   */
  async convertToWebP(inputPath, outputPath = null, opts = {}) {
    try {
      if (!fs.existsSync(inputPath)) {
        console.warn(`${this.logPrefix} Archivo no encontrado: ${inputPath}`);
        return { success: false, reason: "File not found" };
      }

      const originalSize = fs.statSync(inputPath).size;
      const destPath =
        outputPath || inputPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      const quality = opts.quality || this.webpQuality;
      const maxW = opts.maxWidth || this.maxWidth;
      const maxH = opts.maxHeight || this.maxHeight;

      await sharp(inputPath)
        .resize(maxW, maxH, { fit: "inside", withoutEnlargement: true })
        .webp({ quality })
        .toFile(destPath);

      const optimizedSize = fs.statSync(destPath).size;
      const savings = Math.round((1 - optimizedSize / originalSize) * 100);

      console.log(
        `${this.logPrefix} ${path.basename(inputPath)} → ${path.basename(destPath)} (${savings}% reducción)`,
      );

      return {
        success: true,
        originalSize,
        optimizedSize,
        savings: `${savings}%`,
        path: destPath,
      };
    } catch (e) {
      console.error(`${this.logPrefix} Error: ${e.message}`);
      return { success: false, reason: e.message };
    }
  }

  /**
   * Genera un thumbnail WebP para lazy loading blur-up.
   * @param {string} inputPath - Ruta de la imagen original
   * @param {string} outputPath - Ruta del thumbnail
   * @returns {Promise<Object>} { success, path }
   */
  async generateThumbnail(inputPath, outputPath = null) {
    try {
      const destPath =
        outputPath ||
        inputPath.replace(/\.(jpg|jpeg|png|webp)$/i, "_thumb.webp");
      await sharp(inputPath)
        .resize(this.thumbWidth, null, { fit: "inside" })
        .webp({ quality: 60 })
        .toFile(destPath);

      console.log(`${this.logPrefix} Thumbnail: ${path.basename(destPath)}`);
      return { success: true, path: destPath };
    } catch (e) {
      return { success: false, reason: e.message };
    }
  }

  /**
   * Optimiza todas las imágenes en un directorio.
   * @param {string} dirPath - Directorio de imágenes
   * @param {Object} opts - Opciones de conversión
   * @returns {Promise<Object>} { total, optimized, totalSavings }
   */
  async optimizeDirectory(dirPath, opts = {}) {
    if (!fs.existsSync(dirPath)) {
      return { total: 0, optimized: 0, totalSavings: "0%" };
    }

    const files = fs
      .readdirSync(dirPath)
      .filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
    let totalOriginal = 0;
    let totalOptimized = 0;
    let optimizedCount = 0;

    for (const file of files) {
      const inputPath = path.join(dirPath, file);
      const result = await this.convertToWebP(inputPath);
      if (result.success) {
        totalOriginal += result.originalSize;
        totalOptimized += result.optimizedSize;
        optimizedCount++;
      }
    }

    const totalSavings =
      totalOriginal > 0
        ? Math.round((1 - totalOptimized / totalOriginal) * 100)
        : 0;

    console.log(
      `${this.logPrefix} Directorio: ${optimizedCount}/${files.length} optimizadas (${totalSavings}% reducción total)`,
    );

    return {
      total: files.length,
      optimized: optimizedCount,
      totalSavings: `${totalSavings}%`,
      originalBytes: totalOriginal,
      optimizedBytes: totalOptimized,
    };
  }
}

module.exports = new PhotoOptimizer();
