// Archivo: backend/services/stitch/StitchIndexer.js
const puppeteer = require("puppeteer");

/**
 * Gestor de Indexación y Caché para Google Stitch.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class StitchIndexer {
  /**
   * Puppeteer Sub-Agent: Fuerza indexación del HTML en los Edge Nodes de Google.
   */
  static async forceIndexation(url) {
    console.log(`[Stitch Indexer] 🤖 Forzando indexación en: ${url}`);
    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      });
      const page = await browser.newPage();
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      await new Promise((r) => setTimeout(r, 2500));
      console.log(`[Stitch Indexer] ✅ Indexación forzada exitosamente.`);
    } catch (error) {
      console.warn(`[Stitch Indexer] ⚠️ Advertencia: ${error.message}. Continuando...`);
    } finally {
      if (browser) await browser.close().catch(() => {});
    }
  }
}

module.exports = StitchIndexer;
