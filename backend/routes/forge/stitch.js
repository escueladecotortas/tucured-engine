// Archivo: backend/routes/forge/stitch.js
// Rutas de Forja Stitch (Gate 2) y Despliegue Netlify (Gate 3) — Ley de 200 líneas

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { db } = require("../../firebase-admin");
const slugify = require("../../utils/slugify");
const StitchPromptService = require("../../services/StitchPromptService");
const OrionValidator = require("../../services/OrionValidator");
const PhotoCuratorService = require("../../services/PhotoCuratorService");
const WidgetManifestService = require("../../services/WidgetManifestService");
const CloudDeployOrchestrator = require("../../services/CloudDeployOrchestrator");

// ── GATE 2: FORJA LOCAL CON STITCH MCP ────────────────────────────────────
router.post("/stitch-mcp", async (req, res) => {
  try {
    req.setTimeout(0);
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Campo requerido: name" });

    let data = { ...req.body };
    const pId = req.body.prospectId || req.body.id;

    if (pId && db) {
      try {
        const doc = await db.collection("prospects").doc(pId).get();
        if (doc.exists) data = { ...doc.data(), ...req.body };
      } catch (e) {}
    }

    const validation = OrionValidator.validate(data);
    if (!validation.passed) {
      return res.status(422).json({ success: false, error: "Datos insuficientes", orionReport: validation });
    }

    const clientId = data.clientId || slugify(name);
    data.clientId = clientId;
    const assetsDir = path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${clientId}/assets`);
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

    data.curatedPhotos = PhotoCuratorService.curate(data.photos || [], (data.instagramData || {}).captions || [], assetsDir);
    const widgetManifest = WidgetManifestService.generate(data);
    const seedPrompt = StitchPromptService.assembleSeed(data);

    if (db) {
      try {
        await db.collection("prospects").doc(pId || clientId).set({
          stitchSeedPrompt: seedPrompt,
          status: "stitch_ready",
          clientPath: `nexus_archives/tucu-red/clients/${clientId}`
        }, { merge: true });
      } catch (e) {}
    }

    // Ejecución de Forja Local (Gate 2 Exclusivo — Cero Auto-Deploy)
    const mcpResult = await CloudDeployOrchestrator.executeCloudPipeline(data, clientId);
    const localUrl = `/clients/${clientId}/index.html`;

    if (db) {
      try {
        await db.collection("prospects").doc(pId || clientId).update({
          status: "generated",
          siteUrl: localUrl,
          localUrl,
          widgetsInjected: widgetManifest.totalWidgets
        });
      } catch (e) {}
    }

    res.json({
      success: true,
      clientId,
      status: "generated",
      widgetManifest,
      mcpResult,
      localUrl,
      siteUrl: localUrl
    });
  } catch (error) {
    console.error("NEXUS DEBUG:", error);
    res.status(500).json({ error: "Falló el pipeline de forja", details: error.message });
  }
});

// ── GATE 3: DESPLIEGUE MANUAL A NETLIFY ───────────────────────────────────
router.post("/deploy", async (req, res) => {
  try {
    const slug = req.body.slug || slugify(req.body.name || req.body.leadId || '');
    if (!slug) return res.status(400).json({ error: "Slug requerido para despliegue" });

    const deployRes = await CloudDeployOrchestrator.deployToNetlifyCloud(slug, req.body);
    const deployedUrl = deployRes.url;

    if (db) {
      try {
        await db.collection("prospects").doc(slug).update({
          status: "deployed",
          deployUrl: deployedUrl,
          deployedAt: new Date().toISOString(),
          customDomain: deployRes.domain
        });
      } catch (e) {}
    }

    res.json({ success: true, slug, deployUrl: deployedUrl, deployedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: "Fallo en deploy Netlify", details: error.message });
  }
});

module.exports = router;
