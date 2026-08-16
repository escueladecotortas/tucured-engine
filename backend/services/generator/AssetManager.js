// Archivo: backend/services/generator/AssetManager.js
const fs = require('fs').promises;
const path = require('path');

/**
 * Especialista en Gestión de Estructura y Assets Locales.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class AssetManager {
  static async ensureStructure(clientPath) {
    await fs.mkdir(clientPath, { recursive: true });
    await fs.mkdir(path.join(clientPath, "assets"), { recursive: true });
  }

  static async scanLocalAssets(clientPath, fallbackPhotos = []) {
    try {
      const files = await fs.readdir(path.join(clientPath, "assets"));
      const images = files
        .filter((f) => /\.(jpg|png|webp|jpeg)$/i.test(f))
        .map((f) => `assets/${f}`);

      const validRemote = fallbackPhotos.filter((p) => p && p.startsWith("http"));
      return [...images, ...validRemote];
    } catch {
      return fallbackPhotos;
    }
  }

  static async writeNetlifyConfig(clientPath) {
    const config = `[build]\npublish = "."\n[[redirects]]\nfrom = "/*"\nto = "/index.html"\nstatus = 200`;
    await fs.writeFile(path.join(clientPath, "netlify.toml"), config);
  }
}

module.exports = AssetManager;
