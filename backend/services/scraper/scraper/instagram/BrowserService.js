// Archivo: backend/services/scraper/instagram/BrowserService.js
const puppeteer = require('puppeteer');

/**
 * Especialista en Puppeteer y Sigilo.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class BrowserService {
  static async launch() {
    return puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--disable-blink-features=AutomationControlled', '--lang=en-US,en']
    });
  }

  static async preparePage(browser) {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    return page;
  }
}

module.exports = BrowserService;
