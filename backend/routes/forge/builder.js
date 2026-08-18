// Archivo: backend/routes/forge/builder.js
// Rutas de Generación Nexus Builder y Deploy a Netlify — Ley de 200 líneas

const express = require('express');
const router = express.Router();
const AutoSiteGenerator = require('../../services/AutoSiteGenerator');
const CloudDeployOrchestrator = require('../../services/CloudDeployOrchestrator');
const StitchPromptService = require('../../services/StitchPromptService');
const { db } = require('../../firebase-admin');
const slugify = require('../../utils/slugify');

router.post('/nexus-builder', async (req, res) => {
  try {
    const { name, category, phone, instagram, address, photos, forceRegenerate, goal, audience, vibe, usp } = req.body;
    if (!name) return res.status(400).json({ error: 'Campo requerido: name' });

    let enrichedData = req.body;
    const pId = req.body.prospectId || req.body.id;
    if (pId && db) {
      try {
        const doc = await db.collection('prospects').doc(pId).get();
        if (doc.exists) enrichedData = { ...doc.data(), ...req.body };
      } catch (e) {}
    }

    const result = await AutoSiteGenerator.generateSite({
      name, category, phone, instagram, address,
      photos: photos || [], goal: goal || 'leads',
      audience: audience || 'local', vibe: vibe || '2',
      usp: usp || '', stitchPrompt: StitchPromptService.assemble(enrichedData)
    }, { forceRegenerate: !!forceRegenerate, dryRun: !!req.body.dryRun });

    res.json({ success: true, clientId: result.clientId, path: result.path, localUrl: `/clients/${result.clientId}/index.html` });
  } catch (error) { res.status(500).json({ error: 'Falló la generación', details: error.message }); }
});

router.post('/deploy', async (req, res) => {
  try {
    const slug = req.body.slug || slugify(req.body.name || req.body.leadId || '');
    if (!slug) return res.status(400).json({ error: "Slug requerido para despliegue" });

    const deployRes = await CloudDeployOrchestrator.deployToNetlifyCloud(slug, req.body);
    res.json({ success: true, slug, deployUrl: deployRes.url, deployedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: "Fallo en deploy Netlify", details: error.message });
  }
});

module.exports = router;
