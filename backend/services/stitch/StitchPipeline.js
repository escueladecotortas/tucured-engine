// Archivo: backend/services/stitch/StitchPipeline.js
// Orquestador del Pipeline Iterativo con Selector Inteligente de Pantalla y Polling Resiliente (Ley de 200 líneas)

const fs = require("fs");
const path = require("path");
const NexusInjectorService = require("../NexusInjectorService");
const StitchPromptService = require("../StitchPromptService");
const StitchPromptBuilder = require("./StitchPromptBuilder");
const WidgetManifestService = require("../WidgetManifestService");
const StitchRpcHandler = require("./StitchRpcHandler");
const StitchIndexer = require("./StitchIndexer");
const StitchParser = require("./StitchParser");
const StitchDesignExtractor = require("./StitchDesignExtractor");

const TerminalService = require("../telemetry/TerminalService");

class StitchPipeline {
  static async generate(title, prompt, clientId, prospectData, client) {
    try {
      console.log(`\n[Stitch MCP v5.2] 🚀 Iniciando Pipeline Iterativo para "${title}"...`);
      TerminalService.broadcast(`🚀 Pipeline Stitch v5.2 activado para "${title}"`, "info", 10, "ORION");

      const widgetManifest = WidgetManifestService.generate(prospectData);
      const projectId = await client._createProject(title);

      // PASO 1: SEMILLA NARRATIVA POR ARQUETIPO SEMÁNTICO
      TerminalService.broadcast(`🌱 Paso 1/3: Ensamblando Semilla Narrativa por Arquetipo...`, "info", 25, "ATENEA");
      const seedPrompt = StitchPromptBuilder.buildPrompt(prospectData);
      const seedResponse = await client._generateScreen(projectId, seedPrompt);
      const seedScreenId = StitchParser.extractScreenId(seedResponse);

      if (!seedScreenId) {
        console.warn(`[Stitch MCP] ⚠️ No se detectó seedScreenId. Intentando fallback...`);
        return this.fallback(title, prompt, clientId, prospectData, projectId, widgetManifest, client);
      }

      // PASO 2: DIRECTOR DE ARTE & ESTILO
      TerminalService.broadcast(`🎨 Paso 2/3: Director de Arte & ADN Visual...`, "info", 50, "LOREM");
      const vibeNum = parseInt(prospectData.vibe) || 6;
      const styleKeyword = StitchPromptService.getStyleKeyword(vibeNum);
      const directorPrompt = StitchPromptService.assembleDirector(prospectData, styleKeyword);
      const slotPrompt = StitchPromptService.assembleSlotInstructions(widgetManifest);
      const editResponse = await client._editScreen(projectId, seedScreenId, directorPrompt + (slotPrompt ? "\n\n" + slotPrompt : ""));

      // PASO 3: POLLING Y DESCARGA RESILIENTE CON SELECTOR INTELIGENTE
      TerminalService.broadcast(`⬇️ Paso 3/3: Descarga, Inyección & Persistencia...`, "info", 75, "CODI");
      const editedScreenId = StitchParser.extractScreenId(editResponse);
      const targetScreenId = editedScreenId || seedScreenId;
      
      let downloadUrl = null;
      for (let attempt = 1; attempt <= 4; attempt++) {
        try {
          const rawScreenText = await client._getScreen(projectId, targetScreenId);
          downloadUrl = StitchParser.extractDownloadUrlFromScreen(rawScreenText) || StitchParser.extractDownloadUrl(rawScreenText);
          if (downloadUrl) break;
        } catch (e) {
          console.warn(`   ⚠️ [Paso 3] Intento ${attempt}/4: ${e.message}`);
        }
        if (attempt < 4) await new Promise(r => setTimeout(r, 2000));
      }

      if (!downloadUrl) {
        downloadUrl = StitchParser.extractDownloadUrl(editResponse) || StitchParser.extractDownloadUrl(seedResponse);
      }

      if (!downloadUrl) {
        console.error(`[Stitch MCP] ❌ Error en Paso 3: No se pudo obtener la URL de descarga del HTML.`);
        TerminalService.broadcast(`❌ Error al obtener URL de descarga de HTML`, "error", null, "CODI");
        return { success: false, projectId, error: "NO_HTML_URL_AFTER_POLLING" };
      }

      return await this.processHtml(downloadUrl, clientId, prospectData, projectId, widgetManifest);
    } catch (error) {
      console.error("[Stitch MCP] ❌ Error crítico en generación:", error.message, error.stack);
      TerminalService.broadcast(`❌ Error crítico en forja: ${error.message}`, "error", null, "NEXUS");
      throw error;
    }
  }

  static async processHtml(downloadUrl, clientId, prospectData, projectId, widgetManifest) {
    const destPath = path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${clientId}`);
    const publicDestPath = path.resolve(process.cwd(), `public/clients/${clientId}`);
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
    if (!fs.existsSync(publicDestPath)) fs.mkdirSync(publicDestPath, { recursive: true });

    if (projectId) {
      try {
        const designTokens = await StitchDesignExtractor.extractAndPersist(projectId, clientId, destPath);
        if (designTokens) prospectData = { ...prospectData, namedColors: designTokens.namedColors, designMd: designTokens.designMd };
      } catch (de) {}
    }

    try { await StitchIndexer.forceIndexation(downloadUrl); } catch (ie) {}

    TerminalService.broadcast(`📥 Descargando artefacto HTML...`, "info", 85, "CODI");
    const rawHtml = await StitchRpcHandler.downloadHtml(downloadUrl);

    TerminalService.broadcast(`🧬 Inyectando Arsenal de Widgets & Sanitizando Navbar...`, "info", 92, "ARGUS");
    const finalHtml = NexusInjectorService.process(rawHtml, prospectData, widgetManifest);

    fs.writeFileSync(path.join(destPath, "index.html"), finalHtml, "utf-8");
    fs.writeFileSync(path.join(destPath, "widget-manifest.json"), JSON.stringify(widgetManifest, null, 2));
    fs.writeFileSync(path.join(publicDestPath, "index.html"), finalHtml, "utf-8");
    fs.writeFileSync(path.join(publicDestPath, "widget-manifest.json"), JSON.stringify(widgetManifest, null, 2));

    const localUrl = `/clients/${clientId}/index.html`;
    console.log(`✅ [Stitch MCP] Artefactos persistidos exitosamente en: ${localUrl}`);
    TerminalService.broadcast(`✅ Forja completada exitosamente. Preview listo.`, "success", 100, "NEXUS");

    return { success: true, projectId, widgetManifest, designExtracted: true, localUrl };
  }

  static async fallback(title, prompt, clientId, prospectData, projectId, widgetManifest, client) {
    const genRes = await client._generateScreen(projectId, prompt);
    const downloadUrl = StitchParser.extractDownloadUrl(genRes);
    if (downloadUrl) return this.processHtml(downloadUrl, clientId, prospectData, projectId, widgetManifest);
    return { success: false, projectId, error: "NO_HTML_URL_FALLBACK" };
  }
}

module.exports = StitchPipeline;
