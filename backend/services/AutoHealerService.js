// Archivo: backend/services/AutoHealerService.js
// SERVICE: AutoHealerService (Cirugía DOM y QA de Precisión - Ley de 200 líneas)

const cheerio = require("cheerio");

class AutoHealerService {
  /**
   * Aplica cirugías DOM de precisión sobre el HTML post-generación.
   */
  static heal(html, prospectData = {}) {
    if (!html) return '';
    console.log("[AutoHealer] 🩺 Iniciando QA y cirugías DOM...");

    let processedHtml = html;

    // 1. Normalizar links de WhatsApp
    if (prospectData.phone) {
      const cleanPhone = prospectData.phone.replace(/[^0-9]/g, '');
      processedHtml = processedHtml.replace(/https?:\/\/wa\.me\/[0-9]+/g, `https://wa.me/${cleanPhone}`);
    }

    // 2. Normalizar Dirección y Ciudad
    if (prospectData.address) {
      processedHtml = processedHtml.replace(/\{\{ADDRESS\}\}/g, prospectData.address);
    }
    if (prospectData.city) {
      processedHtml = processedHtml.replace(/\{\{CITY\}\}/g, prospectData.city);
    }

    try {
      const $ = cheerio.load(processedHtml, { decodeEntities: false });

      // 3. Reparar navbar y títulos vacíos
      if ($('title').length === 0 && prospectData.name) {
        $('head').prepend(`<title>${prospectData.name} • Tucu Red</title>`);
      }

      // 4. Asegurar meta viewport para responsive design
      if ($('meta[name="viewport"]').length === 0) {
        $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
      }

      // 5. Inyectar Tailwind CDN si no está cargado
      if (!$('script[src*="tailwindcss"]').length && !$('link[href*="tailwind"]').length) {
        $('head').append('<script src="https://cdn.tailwindcss.com"></script>');
      }

      // 6. Reparar imágenes rotas o sin alt
      $('img').each((_, el) => {
        const alt = $(el).attr('alt');
        if (!alt || alt.trim() === '') {
          $(el).attr('alt', `${prospectData.name || 'Negocio'} - Foto`);
        }
      });

      console.log("[AutoHealer] ✅ QA Clínico finalizado con éxito.");
      return $.html();
    } catch (e) {
      console.warn("[AutoHealer] ⚠️ Fallback en parseo Cheerio:", e.message);
      return processedHtml;
    }
  }
}

module.exports = AutoHealerService;
