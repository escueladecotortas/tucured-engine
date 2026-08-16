// Archivo: backend/services/NexusInjectorService.js
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// Servicios Críticos
const TerminalService = require("./TerminalService");

// Handlers modulares (Ley de 200 líneas)
const StyleHandler = require("./injector/StyleHandler");
const AssetHandler = require("./injector/AssetHandler");
const MapHandler = require("./injector/MapHandler");
const BrandingHandler = require("./injector/BrandingHandler");
const NavigationHandler = require("./injector/NavigationHandler");
const WidgetInjector = require("./injector/WidgetInjector");

class NexusInjectorService {
  /**
   * Procesa el HTML crudo de Stitch y lo "Nexus-ifica".
   */
  static process(rawHtml, prospectData, widgetManifest = null) {
    if (!rawHtml) return "<html><body>Error: HTML vacío</body></html>";
    const $ = cheerio.load(rawHtml);
    const clientId = prospectData?.clientId || (prospectData?.name || '').toLowerCase().replace(/\s+/g, '-');
    const assetsDir = path.resolve(__dirname, `../../nexus_archives/tucu-red/clients/${clientId}/assets`);
    
    let realFiles = [];
    try { if (fs.existsSync(assetsDir)) realFiles = fs.readdirSync(assetsDir); } catch (e) {}

    try {
      TerminalService.broadcast("🧬 Iniciando Inyector Atómico v5.6...", "info");
      StyleHandler.injectBaseStyles($, prospectData);
      AssetHandler.processAssets($, assetsDir, realFiles, prospectData);
      MapHandler.injectMap($, prospectData);
      
      // 4. Inyección de Widgets Atómicos (Golden Standard)
      WidgetInjector.injectWidgets($, prospectData, widgetManifest, assetsDir, realFiles);
      
      BrandingHandler.injectBranding($, prospectData, assetsDir, realFiles);
      
      // 5. Navigation & Rebranding v8.0
      NavigationHandler.handle($, prospectData);

      // 6. Inyección de Lógica Global Nexus Core v8.0
      const coreScriptPath = path.join(__dirname, "injector/assets/nexus-core.js");
      if (fs.existsSync(coreScriptPath)) {
        const coreJs = fs.readFileSync(coreScriptPath, "utf8");
        $("body").append(`<script>${coreJs}</script>`);
      }

      $("script[src*='google-stitch']").remove();
      TerminalService.broadcast("✅ Inyección finalizada", "success");
      return $.html();
    } catch (err) {
      TerminalService.broadcast(`❌ Error: ${err.message}`, "error");
      throw err;
    }
  }
}

module.exports = NexusInjectorService;
