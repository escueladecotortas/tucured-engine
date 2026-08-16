const express = require("express");
const router = express.Router();
const StitchPromptService = require("../../services/StitchPromptService");
const OrionValidator = require("../../services/OrionValidator");
const PhotoCuratorService = require("../../services/PhotoCuratorService");
const StitchMcpClient = require("../../services/StitchMcpClient");
const WidgetManifestService = require("../../services/WidgetManifestService");
const { db } = require("../../firebase-admin");
const path = require("path");
const fs = require("fs");
const TerminalService = require("../../services/TerminalService");
const slugify = require("../../utils/slugify");
const CloudDeployOrchestrator = require("../../services/CloudDeployOrchestrator");

router.post("/stitch-mcp", async (req, res) => {
  try {
    req.setTimeout(0); // Eliminar timeout límite para permitir la forja completa de Stitch.
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Campo requerido: name" });

    let data = { ...req.body };
    const pId = req.body.prospectId || req.body.id;

    if (pId) {
      try {
        const doc = await db.collection("prospects").doc(pId).get();
        if (doc.exists) data = { ...doc.data(), ...req.body };
      } catch (e) {}
    }

    const validation = OrionValidator.validate(data);
    if (!validation.passed)
      return res.status(422).json({
        success: false,
        error: "Datos insuficientes",
        orionReport: validation,
      });

    const vibeNum = parseInt(data.vibe) || 6;

    const clientId = data.clientId || slugify(name);
    data.clientId = clientId;
    const assetsDir = path.resolve(
      __dirname,
      `../../../nexus_archives/tucu-red/clients/${clientId}/assets`,
    );
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

    data.curatedPhotos = PhotoCuratorService.curate(
      data.photos || [],
      (data.instagramData || {}).captions || [],
      assetsDir,
    );
    const widgetManifest = WidgetManifestService.generate(data);

    const seedPrompt = StitchPromptService.assembleSeed(data);
    const fallbackPrompt = StitchPromptService.assemble(data);

    await db
      .collection("prospects")
      .doc(pId || clientId)
      .set(
        {
          stitchSeedPrompt: seedPrompt,
          stitchFallbackPrompt: fallbackPrompt,
          stitchPhotos: data.curatedPhotos,
          stitchWidgets: widgetManifest.selectedWidgets.map((w) => w.name),
          stitchWidgetManifest: widgetManifest,
          status: "stitch_ready",
          engine: "stitch-mcp-v4",
          clientPath: `nexus_archives/tucu-red/clients/${clientId}`,
        },
        { merge: true },
      );

    const mcpResult = await CloudDeployOrchestrator.executeCloudPipeline(
      data,
      clientId
    );
    if (mcpResult?.status === 'success') {
      await db
        .collection("prospects")
        .doc(pId || clientId)
        .update({
          status: "generated",
          engine: "stitch-cloud-native",
          widgetsInjected: widgetManifest.totalWidgets,
          deployUrl: mcpResult.url,
          customDomain: mcpResult.domain,
          netlifySiteId: mcpResult.siteId
        });
    }
    res.json({ success: true, clientId, widgetManifest, mcpResult, deployUrl: mcpResult.url });
  } catch (error) {
    console.error('NEXUS DEBUG:', error);
    res
      .status(500)
      .json({ error: "Falló el pipeline", details: error.message, stack: error.stack });
  }
});

module.exports = router;
