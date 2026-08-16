// Archivo: backend/services/stitch/StitchParser.js

/**
 * Parsers y Extractores de Datos para Google Stitch.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class StitchParser {
  /**
   * Extrae la download URL del HTML desde la respuesta de Stitch.
   */
  static extractDownloadUrl(responseText) {
    if (!responseText) return null;
    
    // Intento 1: Parseo JSON limpio
    try {
      const cleanText = responseText.replace(/\\"/g, '"').replace(/\\n/g, "");
      const parsed = JSON.parse(cleanText);
      const url = parsed.outputComponents?.[0]?.design?.screens?.[0]?.htmlCode?.downloadUrl;
      if (url) return url;
    } catch (err) { /* ignore */ }

    // Intento 2: Regex para URLs de contribution.usercontent
    const patterns = [
      /https:\\\/\\\/contribution\.usercontent\.google\.com\\\/download\?[^\s"'\\]+/,
      /https:\/\/contribution\.usercontent\.google\.com\/schema\/[^\s"'\\]+/,
    ];
    for (const pattern of patterns) {
      const match = responseText.match(pattern);
      if (match) return match[0].replace(/\\\//g, "/");
    }

    // Intento 3: Ultra-limpieza de escapes
    const ultraClean = responseText.replace(/\\/g, "").match(/https:\/\/contribution\.usercontent\.google\.com\/[^\s"']+/);
    return ultraClean ? ultraClean[0] : null;
  }

  /**
   * Extrae el Screen ID de la respuesta de generación.
   */
  static extractScreenId(responseText) {
    if (!responseText) return null;
    const match = responseText.match(/screens\/([a-f0-9]{32})/);
    return match ? match[1] : null;
  }

  /**
   * Extrae la URL de descarga del HTML desde get_screen.
   */
  static extractDownloadUrlFromScreen(screenText) {
    if (!screenText) return null;
    try {
      const parsed = JSON.parse(screenText);
      return parsed.htmlCode?.downloadUrl || null;
    } catch (e) {
      const match = screenText.match(/https:\/\/[^\s"'\\]+\.com\/[^\s"'\\]+/);
      return match ? match[0] : null;
    }
  }
}

module.exports = StitchParser;
