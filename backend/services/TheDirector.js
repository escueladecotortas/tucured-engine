/**
 * SERVICE: The Director (Workflow Orchestrator)
 * Purpose: Orchestrates the "Sovereign Circuit" (Ingest -> Enrich -> Factory -> Deploy).
 * Protocol: Multi-Agent Adversarial Orchestration (MAS)
 * Version: 2026.04 (Stitch + Lorem + Argus)
 */

const { db } = require("../firebase-admin");
const EnricherService = require("./EnricherService");
const AutoSiteGenerator = require("./AutoSiteGenerator");
const StitchMcpClient = require("./StitchMcpClient");
const WidgetManifestService = require("./WidgetManifestService");
const StitchPromptService = require("./StitchPromptService");
const AgentService = require("./AgentService");
const VIBES = require("./prompts/vibeDefinitions");

class TheDirector {
  /**
   * Triggers the full Sovereign Circuit for a new lead.
   * Fire-and-forget style (Async).
   */
  static async action(leadId, options = {}) {
    console.log(
      `\n🎬 [DIRECTOR] Action! Scene: ${leadId} (Options: ${JSON.stringify(options)})`,
    );

    // Ejecutar async sin bloquear la respuesta de la API
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
    
    // Persistir narrativa aprobada
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
      // Inyectamos la narrativa aprobada en los datos para el prompt de Stitch
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
   * Implementa el protocolo MissionIgniter para inyección de contexto.
   */
  static async generateNarrativeMAS(leadId, fullData) {
    const MAX_ATTEMPTS = 2;
    let attempts = 0;
    let approved = false;
    let currentNarrative = "";
    let feedback = "";

    // [MISSION_IGNITER] Payload estructurado para evitar saturación de memoria
    const missionIgniter = {
      factual_core: {
        name: fullData.name,
        category: fullData.category,
        address: fullData.address,
        hours: fullData.hours || "Consultar",
        services: fullData.services || [],
        top_reviews: (fullData.topReviews || []).slice(0, 3).map(r => r.text)
      },
      instagram_dna: {
        handle: fullData.instagram || "N/A",
        bio: fullData.instagramData?.bio || "",
        stylometry: (fullData.instagramData?.captions || []).slice(0, 5)
      },
      vibe: fullData.vibeNum || 7
    };

    const sourceData = `
<MISSION_IGNITER>
  <FACTUAL_CORE>
    Name: ${missionIgniter.factual_core.name}
    Category: ${missionIgniter.factual_core.category}
    Services: ${missionIgniter.factual_core.services.join(", ")}
    Hours: ${JSON.stringify(missionIgniter.factual_core.hours)}
    Top Reviews: ${missionIgniter.factual_core.top_reviews.join(" | ")}
  </FACTUAL_CORE>
  <INSTAGRAM_DNA>
    Handle: ${missionIgniter.instagram_dna.handle}
    Bio: ${missionIgniter.instagram_dna.bio}
    Stylometry: ${missionIgniter.instagram_dna.stylometry.join(" || ")}
  </INSTAGRAM_DNA>
  <VIBE_CONTEXT>
    VibeNumber: ${missionIgniter.vibe}
    Style: ${VIBES[missionIgniter.vibe]?.style || "Premium"}
    Keywords: ${VIBES[missionIgniter.vibe]?.keywords || "Quality, Professional"}
    Directive: ${VIBES[missionIgniter.vibe]?.tone || "Maintain a professional and upscale tone."}
  </VIBE_CONTEXT>
</MISSION_IGNITER>`;

    while (attempts < MAX_ATTEMPTS && !approved) {
      attempts++;
      this.emitStatus(leadId, `[LOREM] Redactando narrativa (Intento ${attempts}/2)...`, "working");

      const loremPrompt = `
[MISSION]: Redactar la narrativa comercial de alta gama para "${fullData.name}".
${sourceData}

[CONSTRAINTS]:
1. TRUTH DOCUMENTED: No inventar servicios, platos o beneficios que no estén en <FACTUAL_CORE>.
2. PURGA SEMÁNTICA: Prohibido usar "Santuario", "Mágico", "Laboratorio", "Inolvidable", "Sueño".
3. ADAPTACIÓN: Usar la estilometría de <INSTAGRAM_DNA> para el tono, pero priorizar la claridad de <FACTUAL_CORE>.
4. ESTRUCTURA: Hero (H1 persuasivo + Subtext), Servicios (3 puntos clave), Historia (Corta y auténtica).

${feedback ? `\n[FEEDBACK_ARGUS]: ${feedback}\n¡CORRIGE LOS ERRORES MENCIONADOS!` : ""}
`;

      const loremRes = await AgentService.interact("lorem", loremPrompt, [], leadId);
      currentNarrative = loremRes.content;

      this.emitStatus(leadId, `[ARGUS] Auditando veracidad y coherencia...`, "working");
      
      const argusPrompt = `
[AUDIT_MISSION]: Validar la veracidad y calidad de la narrativa contra los datos fuente.

[NARRATIVE_TO_AUDIT]:
${currentNarrative}

[SOURCE_DATA]:
${sourceData}

[CRITERIA]:
1. ¿Hay alucinaciones? (Datos no presentes en FACTUAL_CORE).
2. ¿Hay palabras prohibidas? (Santuario, Mágico, etc).
3. ¿Coinciden los horarios y servicios?

[OUTPUT_RULES]:
- Si cumple todo: "APPROVED"
- Si falla: "REJECTED: [Motivo específico y qué cambiar]"
`;

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

  /**
   * Emite estados vía Socket.io a través del AgentService
   */
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
