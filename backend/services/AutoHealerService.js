// Archivo: backend/services/AutoHealerService.js
// SERVICE: AutoHealerService v3.0 (Modularized - Ley de 200 líneas)
// Orquesta las 10 cirugías DOM de precisión sobre el HTML post-Stitch.

const cheerio = require("cheerio");
const TerminalService = require("./TerminalService");
const LayoutHealer = require("./healer/LayoutHealer");
const StyleHealer = require("./healer/StyleHealer");
const AssetHealer = require("./healer/AssetHealer");
const LinkHealer = require("./healer/LinkHealer");
const TextHealer = require("./healer/TextHealer");

class AutoHealerService {
  /**
   * Aplica cirugías DOM de precisión sobre el HTML.
   */
  static heal(html, prospectData) {
    console.log("[AutoHealer v3] 🩺 Iniciando orquestación de cirugías...");
    TerminalService.broadcast("🩺 AutoHealer v3: Iniciando QA clínico...", "info");

    let processedHtml = html;

    // 1. Cirugías de Texto y WhatsApp (Operan sobre String bruto)
    processedHtml = LinkHealer.normalizeWhatsApp(processedHtml, prospectData);
    processedHtml = TextHealer.fixAddress(processedHtml, prospectData);

    // 2. Carga de DOM para cirugías estructurales
    const $ = cheerio.load(processedHtml, { decodeEntities: false });

    // 3. Ejecución de Cirujanos Especializados
    LayoutHealer.fixNavbar($, prospectData);
    LayoutHealer.removeDuplicateMaps($);
    
    StyleHealer.fixBrightness($, prospectData);
    StyleHealer.fixDecorativeCities($);
    
    AssetHealer.fixMaterialIcons($);
    AssetHealer.fixFooterLogo($, prospectData);
    AssetHealer.fixCssMaps($, prospectData);
    
    LinkHealer.fixBrokenLinks($, prospectData);

    // 4. Finalización y Encoding
    let finalHtml = $.html();
    finalHtml = TextHealer.fixEncoding(finalHtml);

    TerminalService.broadcast("✅ AutoHealer v3: Cirugías completadas con éxito", "success");
    console.log("[AutoHealer v3] ✅ QA Clínico finalizado.");
    
    return finalHtml;
  }
}

module.exports = AutoHealerService;
