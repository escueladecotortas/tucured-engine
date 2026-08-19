// Archivo: backend/services/TheDirector.js
/**
 * SERVICE: The Director (Workflow Orchestrator)
 * Purpose: Orchestrates the "Sovereign Circuit" (Ingest -> Enrich -> Factory -> Deploy).
 * Protocol: Multi-Agent Adversarial Orchestration (MAS)
 * Version: 2026.04 (Stitch + Lorem + Argus) — Ley de 200 líneas
 */

const { db } = require("../firebase-admin");
const EnricherService = require("./EnricherService");
const AutoSiteGenerator = require("./AutoSiteGenerator");
const StitchMcpClient = require("./StitchMcpClient");
const WidgetManifestService = require("./WidgetManifestService");
const StitchPromptService = require("./StitchPromptService");
const AgentService = require("./AgentService");
const PromptArchitect = require("./director/PromptArchitect");

class TheDirector {
  /**
   * Triggers the full Sovereign Circuit for a new lead.
   * Fire-and-forget style (Async).
   */
  static async action(leadId, options = {}) {
    console.log(`\n🎬 [DIRECTOR] Action! Scene: ${leadId} (Options: ${JSON.stringify(options)})`);

    this.runScenario(leadId, options).catch((err) => {
      console.error(`❌ [DIRECTOR] Cut! Error in scenario: ${err.message}`);
      this.emitStatus(leadId, `[ERROR] Fallo crítico: ${err.message}`, "error");
    });
  }

  static async runScenario(leadId, options) {
    const leadDoc = await db.collection("prospects").doc(leadId).get();
    if (!leadDoc.exists) return console.error(`   - Lead not found: ${leadId}`);

    const leadData = leadDoc.data();
    let enrichedData = {};

    // [SCENE 1] Enrichment
    this.emitStatus(leadId, "[NEXUS] Iniciando Extracción Neural...", "info");
    
    if (!options.skipEnrichment) {
      console.log(`   - [Director] Running Full Enrichment`);
      enrichedData = await EnricherService.enrich(leadData);

      await db.collection("prospects").doc(leadId).update({
        ...enrichedData,
        status: "enriched",
        enrichedAt: new Date(),
      });
    } else {
      enrichedData = { ...leadData, status: "raw_processed" };
    }

    const fullData = { ...leadData, ...enrichedData };

    // [SCENE 2] MAS Narrative Engine (Lorem + Argus)
    this.emitStatus(leadId, "[MAS] Iniciando Bucle Adversario (Narrativa)...", "info");
    const approvedNarrative = await this.generateNarrativeMAS(leadId, fullData);
    
    await db.collection("prospects").doc(leadId).update({
      approvedNarrative,
      status: "narrative_ready"
    });

    // [SCENE 3] Widget Manifest
    this.emitStatus(leadId, "[NEXUS] Generando Manifiesto de Componentes...", "info");
    const widgetManifest = WidgetManifestService.generate({ ...fullData, approvedNarrative });

    // [SCENE 4] The Factory — Stitch MCP
    this.emitStatus(leadId, "[STITCH] Construyendo Boutique Digital...", "working");
    
    let generationResult;
    try {
      const stitchData = { ...fullData, approvedNarrative, stitchWidgetManifest: widgetManifest };
      const prompt = StitchPromptService.assemble(stitchData);
      
      generationResult = await StitchMcpClient.generate(
        fullData.name,
        prompt,
        fullData.slug || leadId,
        stitchData
      );
      
      this.emitStatus(leadId, "✅ Sitio generado exitosamente.", "success");
    } catch (stitchErr) {
      this.emitStatus(leadId, `⚠️ Stitch falló: ${stitchErr.message}. Usando Fallback...`, "warning");
      generationResult = await AutoSiteGenerator.generateSite(fullData, {
        forceRegenerate: true,
        dryRun: false,
      });
    }

    // Finalize DB
    await db.collection("prospects").doc(leadId).update({
      status: generationResult.deployUrl ? "deployed" : "generated",
      clientPath: generationResult.path || generationResult.clientPath,
      brandKit: generationResult.brandKit,
      deployUrl: generationResult.deployUrl,
      siteUrl: generationResult.deployUrl,
      generatedAt: new Date(),
    });

    // [SCENE 5] Wrap (Logging)
    await db.collection("nexus_activity").add({
      type: "circuit_complete",
      agent: "the_director",
      message: `Circuito Soberano completado para: ${leadData.name}`,
      metadata: { leadId, url: generationResult.deployUrl },
      timestamp: new Date(),
    });

    this.emitStatus(leadId, "🎬 Circuito Finalizado. Soberanía Digital establecida.", "complete");
    console.log(`🎬 [DIRECTOR] Cut! URL: ${generationResult.deployUrl}\n`);
  }

  /**
   * Bucle MAS: Lorem (Narrativa) vs Argus (Auditoría)
   */
  static async generateNarrativeMAS(leadId, fullData) {
    const MAX_ATTEMPTS = 2;
    let attempts = 0;
    let approved = false;
    let currentNarrative = "";
    let feedback = "";

    const { sourceData } = PromptArchitect.buildMissionIgniter(fullData);

    while (attempts < MAX_ATTEMPTS && !approved) {
      attempts++;
      this.emitStatus(leadId, `[LOREM] Redactando narrativa (Intento ${attempts}/2)...`, "working");

      const loremPrompt = PromptArchitect.buildLoremPrompt(fullData.name, sourceData, feedback);
      const loremRes = await AgentService.interact("lorem", loremPrompt, [], leadId);
      currentNarrative = loremRes.content;

      this.emitStatus(leadId, `[ARGUS] Auditando veracidad y coherencia...`, "working");
      
      const argusPrompt = PromptArchitect.buildArgusPrompt(currentNarrative, sourceData);
      const argusRes = await AgentService.interact("argus", argusPrompt, [], leadId);
      const auditResult = argusRes.content.toUpperCase();

      if (auditResult.includes("APPROVED")) {
        approved = true;
        this.emitStatus(leadId, "[ARGUS] Narrativa aprobada.", "success");
      } else {
        feedback = argusRes.content;
        this.emitStatus(leadId, `[ARGUS] Rechazado: Feedback enviado a Lorem.`, "warning");
      }
    }

    if (!approved) {
      this.emitStatus(leadId, "[DIRECTOR] Bucle MAS cerrado por límite de intentos. Procediendo con última versión.", "warning");
    }

    return currentNarrative;
  }

  static emitStatus(leadId, message, type = "info") {
    console.log(`📡 [LiveState] ${leadId}: ${message}`);
    if (AgentService.io) {
      AgentService.io.emit("agent:status", {
        leadId,
        message,
        type,
        timestamp: new Date()
      });
    }
  }
}

module.exports = TheDirector;
