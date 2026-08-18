// Archivo: backend/services/stitch/StitchPipeline.js
const fs = require("fs");
const path = require("path");
const NexusInjectorService = require("../NexusInjectorService");
const TerminalService = { broadcast: (msg) => console.log("[LOG]", msg), emitCompletion: (msg) => console.log("[DONE]", msg), emitError: (msg) => console.error("[ERR]", msg) };
const StitchPromptService = require("../StitchPromptService");
const WidgetManifestService = require("../WidgetManifestService");
const StitchRpcHandler = require("./StitchRpcHandler");
const StitchIndexer = require("./StitchIndexer");
const StitchParser = require("./StitchParser");
const StitchDesignExtractor = require("./StitchDesignExtractor");

/**
 * Orquestador del Pipeline Iterativo de 3 Tiempos de Google Stitch.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class StitchPipeline {
  /**
   * Genera un sitio completo usando el Pipeline Iterativo.
   */
  static async generate(title, prompt, clientId, prospectData, client) {
    try {
      console.log("\n[Stitch MCP v4] 🚀 Iniciando Pipeline Iterativo...");
      TerminalService.broadcast(`🚀 Pipeline Stitch v4.0 activado para "${title}"`, "info");

      const widgetManifest = WidgetManifestService.generate(prospectData);
      const projectId = await client._createProject(title);

      // PASO 1: SEMILLA
      TerminalService.broadcast(`🌱 Paso 1/3: La Semilla...`, "info");
      const seedPrompt = StitchPromptService.assembleSeed(prospectData);
      const seedResponse = await client._generateScreen(projectId, seedPrompt);
      const seedScreenId = StitchParser.extractScreenId(seedResponse);

      if (!seedScreenId) {
        return this.fallback(title, prompt, clientId, prospectData, projectId, widgetManifest, client);
      }

      // PASO 2: DIRECTOR DE ARTE
      TerminalService.broadcast(`🎨 Paso 2/3: Director de Arte...`, "info");
      const vibeNum = parseInt(prospectData.vibe) || 6;
      const styleKeyword = StitchPromptService.getStyleKeyword(vibeNum);
      const directorPrompt = StitchPromptService.assembleDirector(prospectData, styleKeyword);
      const slotPrompt = StitchPromptService.assembleSlotInstructions(widgetManifest);
      const editResponse = await client._editScreen(projectId, seedScreenId, directorPrompt + (slotPrompt ? "\n\n" + slotPrompt : ""));

      // PASO 3: DESCARGA + INYECCIÓN
      TerminalService.broadcast(`⬇️ Paso 3/3: Descarga + Inyección...`, "info");
      
      const editedScreenId = StitchParser.extractScreenId(editResponse) || seedScreenId;
      const finalScreen = await client._getScreen(projectId, editedScreenId);
      let downloadUrl = StitchParser.extractDownloadUrlFromScreen(finalScreen) || StitchParser.extractDownloadUrl(editResponse);

      if (!downloadUrl) return { success: false, projectId, error: "NO_HTML_URL" };

      return this.processHtml(downloadUrl, clientId, prospectData, projectId, widgetManifest);
    } catch (error) {
      console.error("[Stitch MCP] ❌ Error crítico:", error);
      throw error;
    }
  }

  static async processHtml(downloadUrl, clientId, prospectData, projectId, widgetManifest) {
    const destPath = path.resolve(__dirname, `../../../nexus_archives/tucu-red/clients/${clientId}`);
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });

    // 🎨 SOBERANÍA DE DISEÑO: Extraer DESIGN.md de Stitch automáticamente
    // Enriquece prospectData con los tokens reales del sistema de diseño
    if (projectId) {
      const designTokens = await StitchDesignExtractor.extractAndPersist(projectId, clientId, destPath);
      if (designTokens) {
        // Los tokens se fusionan con prospectData para que el inyector los use
        prospectData = {
          ...prospectData,
          namedColors: designTokens.namedColors,
          designMd: designTokens.designMd,
          device: prospectData.device || 'DESKTOP',
        };
        TerminalService.broadcast(`🎨 DNA Visual fusionado: ${Object.keys(designTokens.namedColors || {}).length} tokens`, "success");
      }
    }

    TerminalService.broadcast(`🛡️ Anti-Amnesia...`, "info");
    await StitchIndexer.forceIndexation(downloadUrl);

    TerminalService.broadcast(`📥 Descargando...`, "info");
    const rawHtml = await StitchRpcHandler.downloadHtml(downloadUrl);

    TerminalService.broadcast(`🧬 Inyectando con DNA Visual...`, "info");
    const finalHtml = NexusInjectorService.process(rawHtml, prospectData, widgetManifest);

    fs.writeFileSync(path.join(destPath, "index.html"), finalHtml);
    fs.writeFileSync(path.join(destPath, "widget-manifest.json"), JSON.stringify(widgetManifest, null, 2));

    return { success: true, projectId, widgetManifest, designExtracted: true };
  }

  static async fallback(title, prompt, clientId, prospectData, projectId, widgetManifest, client) {
    console.log("[Stitch MCP] 🔄 Fallback: Usando generación clásica...");
    const genRes = await client._generateScreen(projectId, prompt);
    const downloadUrl = StitchParser.extractDownloadUrl(genRes);
    if (downloadUrl) return this.processHtml(downloadUrl, clientId, prospectData, projectId, widgetManifest);
    return { success: false, projectId, error: "NO_HTML_URL_FALLBACK" };
  }
}

module.exports = StitchPipeline;
