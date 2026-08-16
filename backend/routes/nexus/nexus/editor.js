const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const aiService = require("../../services/aiService");
const ToolRegistry = require("../../../system_core/ToolRegistry");
const { admin, db } = require("../../firebase-admin");

// Protocol: Smart Notepad Conversion (Notes -> Mission)
router.post("/convert-notes", async (req, res) => {
  const { notes, projectId, context } = req.body;
  if (!notes)
    return res.status(400).json({ error: "Contexto (notas) requerido." });

  if (!db) {
    return res.status(503).json({ error: "Base de datos desconectada (Modo Offline)" });
  }

  const CONVERT_PROMPT = `Eres el Analista Táctico de NEXUS. Convierte notas en una MISIÓN ESTRUCTURADA. NOTAS: "${notes}" CONTEXTO: "${context}"
    DEBES DEVOLVER UN JSON: { "title": "...", "description": "...", "priority": "...", "assignedTo": "..." }`;

  try {
    const missionParams = await aiService.generateJSON(CONVERT_PROMPT);
    const taskData = {
      ...missionParams,
      projectId: projectId || "general",
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: "smart_notepad",
    };
    const docRef = await db.collection("tasks").add(taskData);

    await db.collection("nexus_activity").add({
      type: "creation",
      agent: "nexus",
      description: `Misión creada desde notas: ${missionParams.title}`,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      projectId: projectId || "general",
    });
    res.json({ success: true, taskId: docRef.id, mission: missionParams });
  } catch (error) {
    res.status(500).json({ error: "Fallo en interpretación." });
  }
});

// Patching Endpoints
router.post("/apply-patch", async (req, res) => {
  const { projectId, patchData, targetPath } = req.body;
  try {
    const result = await ToolRegistry.execute(
      "apply_css_patch",
      { patch: patchData, targetPath },
      { projectId },
    );
    if (db) {
      await db
        .collection("nexus_activity")
        .add({
          type: "system",
          agent: "nexus",
          description: `Visual patch applied to ${projectId}`,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          projectId,
        });
    }
    res.json({ success: true, message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/apply-html-patch", async (req, res) => {
  let { projectId, patchData, targetPath } = req.body;
  try {
    if (targetPath && targetPath.includes("nexus_archives")) {
      const parts = targetPath.split("nexus_archives/");
      if (parts.length > 1)
        targetPath = path.join(__dirname, "../../../nexus_archives", parts[1]);
    }
    const result = await ToolRegistry.execute(
      "apply_html_patch",
      { projectId, patch: patchData, targetPath },
      { projectId },
    );
    res.json({ success: true, message: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/update_content_json", async (req, res) => {
  const { projectId, updates } = req.body;
  try {
    const result = await ToolRegistry.execute(
      "update_content_json",
      { projectId, updates },
      { projectId },
    );
    res.json({ success: true, message: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/update_html_attrs", async (req, res) => {
  const { projectId, attrPatches, targetPath } = req.body;
  try {
    const result = await ToolRegistry.execute(
      "update_html_attrs",
      { projectId, attrPatches, targetPath },
      { projectId },
    );
    res.json({ success: true, message: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/update_widget", async (req, res) => {
  try {
    let { projectId, widgets, targetPath } = req.body;
    if (!widgets || Object.keys(widgets).length === 0)
      return res.json({ success: true, message: "No widget changes" });

    let htmlFilePath = targetPath?.includes("nexus_archives")
      ? path.join(
          __dirname,
          "../../../nexus_archives",
          targetPath.split("nexus_archives/")[1],
        )
      : path.join(
          __dirname,
          "../../../nexus_archives",
          projectId,
          "index.html",
        );

    htmlFilePath = htmlFilePath.split("?")[0];
    if (!fs.existsSync(htmlFilePath))
      return res.status(404).json({ error: `HTML file not found` });

    const $ = cheerio.load(fs.readFileSync(htmlFilePath, "utf8"), {
      decodeEntities: false,
    });
    Object.values(widgets).forEach((w) => {
      if (w.nexusId && w.type === "carousel" && w.images) {
        const sCont = $(`[data-nexus-id="${w.nexusId}"]`).find(
          ".carousel-container",
        );
        if (sCont.length > 0) {
          sCont.empty();
          w.images.forEach((img, i) =>
            sCont.append(
              `<div class="carousel-slide" data-nexus-id="sl_${Date.now()}_${i}"><img src="${img.src}" alt="${img.alt || `Slide ${i + 1}`}" data-nexus-id="img_sl_${Date.now()}_${i}"></div>`,
            ),
          );
        }
      }
    });
    fs.writeFileSync(htmlFilePath, $.html());
    res.json({
      success: true,
      message: `Updated ${Object.keys(widgets).length} widgets`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
