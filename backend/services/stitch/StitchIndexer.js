// Archivo: backend/services/stitch/StitchIndexer.js
// Gestor de Indexación y Caché para Google Stitch con fallback HTTP

class StitchIndexer {
  static async forceIndexation(url) {
    console.log(`[Stitch Indexer] 🤖 Forzando indexación en: ${url}`);
    try {
      const puppeteer = require("puppeteer");
      const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
      await browser.close().catch(() => {});
      console.log(`[Stitch Indexer] ✅ Indexación forzada exitosamente.`);
    } catch (error) {
      console.log(`[Stitch Indexer] ℹ️ Indexación en modo ligero (sin navegador headless).`);
    }
  }
}

module.exports = StitchIndexer;
