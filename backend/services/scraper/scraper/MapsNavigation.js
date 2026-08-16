// Archivo: backend/services/scraper/MapsNavigation.js

/**
 * Utilidades de Navegación y Scroll para Google Maps Puppeteer.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class MapsNavigation {
  /**
   * Maneja el popup de consentimiento de cookies de Google.
   */
  static async handleConsent(page) {
    try {
      const consentSelectors = [
        'button[aria-label="Aceptar todo"]',
        'button[aria-label="Accept all"]',
        'form[action*="/consent"] button'
      ];
      for (const sel of consentSelectors) {
        const btn = await page.$(sel);
        if (btn) {
          await btn.click();
          await new Promise(r => setTimeout(r, 2000));
          console.log('🍪 Consent aceptado');
          break;
        }
      }
    } catch (e) { /* ignore */ }
  }

  /**
   * Espera a que aparezca el feed de resultados.
   */
  static async waitForFeed(page) {
    try {
      await page.waitForSelector('div.Nv2PK, div[role="feed"]', { timeout: 15000 });
      console.log('📋 Feed de resultados detectado');
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.warn('⚠️ Feed no detectado, intentando con fallback...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  /**
   * Scrollea el panel lateral de resultados para cargar más items.
   */
  static async scrollFeed(page, targetCount) {
    try {
      const feedSelector = 'div[role="feed"], div.m6QErb.DxyBCb';
      const feed = await page.$(feedSelector);
      if (!feed) {
        console.warn('⚠️ No se encontró contenedor scrollable');
        return;
      }

      let previousCount = 0;
      let scrollAttempts = 0;
      const maxScrollAttempts = 8;

      while (scrollAttempts < maxScrollAttempts) {
        const currentCount = await page.evaluate(() => {
          return document.querySelectorAll('div.Nv2PK').length;
        });

        if (currentCount >= targetCount) {
          console.log(`📜 Scroll completo: ${currentCount} items cargados`);
          break;
        }

        if (currentCount === previousCount) {
          scrollAttempts++;
        } else {
          scrollAttempts = 0;
        }
        previousCount = currentCount;

        await page.evaluate((sel) => {
          const container = document.querySelector(sel);
          if (container) container.scrollTop += 800;
        }, feedSelector);

        await new Promise(r => setTimeout(r, 1500));
      }
    } catch (e) {
      console.warn('⚠️ Error al scrollear:', e.message);
    }
  }
}

module.exports = MapsNavigation;
