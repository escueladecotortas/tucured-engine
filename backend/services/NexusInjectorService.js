// Archivo: backend/services/NexusInjectorService.js
// Orquestador de Inyección y Post-Procesamiento de Stitch — Ley de 200 líneas

const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const StitchPostProcessor = require("./stitch/StitchPostProcessor");
const StyleHandler = require("./injector/StyleHandler");
const AssetHandler = require("./injector/AssetHandler");
const MapHandler = require("./injector/MapHandler");
const BrandingHandler = require("./injector/BrandingHandler");
const NavigationHandler = require("./injector/NavigationHandler");

const TerminalService = {
  broadcast: (msg) => console.log("[LOG]", msg),
  emitCompletion: (msg) => console.log("[DONE]", msg),
  emitError: (msg) => console.error("[ERR]", msg)
};

class NexusInjectorService {
  static process(rawHtml, prospectData, widgetManifest = null) {
    if (!rawHtml) return "<html><body>Error: HTML vacío</body></html>";
    const clientId = prospectData?.slug || prospectData?.clientId || (prospectData?.name || '').toLowerCase().replace(/\s+/g, '-');
    const assetsDir = path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${clientId}/assets`);
    
    let realFiles = [];
    try { if (fs.existsSync(assetsDir)) realFiles = fs.readdirSync(assetsDir); } catch (e) {}

    try {
      TerminalService.broadcast("🧬 Iniciando Post-Procesador & Inyector Atómico...", "info");

      // 1. Post-procesamiento central (Logo Real + 7 Slots + Purga)
      let processedHtml = StitchPostProcessor.process(rawHtml, prospectData, widgetManifest);
      const $ = cheerio.load(processedHtml);

      // 2. Handlers complementarios
      StyleHandler.injectBaseStyles($, prospectData);
      AssetHandler.processAssets($, assetsDir, realFiles, prospectData);
      MapHandler.injectMap($, prospectData);
      BrandingHandler.injectBranding($, prospectData, assetsDir, realFiles);
      NavigationHandler.handle($, prospectData);

      // 3. Inyección de script global si existe
      const coreScriptPath = path.join(__dirname, "injector/assets/nexus-core.js");
      if (fs.existsSync(coreScriptPath)) {
        const coreJs = fs.readFileSync(coreScriptPath, "utf8");
        $("body").append(`<script>${coreJs}</script>`);
      }

      $("script[src*='google-stitch']").remove();
      TerminalService.broadcast("✅ Inyección finalizada", "success");
      return $.html();
    } catch (err) {
      TerminalService.broadcast(`❌ Error en inyección: ${err.message}`, "error");
      throw err;
    }
  }
}

module.exports = NexusInjectorService;
