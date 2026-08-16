const express = require('express');
const router = express.Router();
const AutoSiteGenerator = require('../../services/AutoSiteGenerator');
const StitchPromptService = require('../../services/StitchPromptService');
const { db } = require('../../firebase-admin');

router.post('/nexus-builder', async (req, res) => {
    try {
        const { name, category, phone, instagram, address, photos, forceRegenerate, goal, audience, vibe, usp } = req.body;
        if (!name) return res.status(400).json({ error: 'Campo requerido: name' });

        let enrichedData = req.body;
        const pId = req.body.prospectId || req.body.id;
        if (pId) {
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
        }, { forceRegenerate: !!forceRegenerate });

        await db.collection('prospects').doc(result.clientId).set({
            name, category, phone, instagram, address,
            status: result.deployUrl ? 'generated' : 'generated_no_deploy',
            clientPath: result.path, brandKit: result.brandKit,
            generatedAt: new Date(), deployUrl: result.deployUrl || null,
            netlifySiteId: result.siteId || null,
            engine: 'nexus-builder'
        }, { merge: true });

        res.json({ success: true, clientId: result.clientId, path: result.path, deployUrl: result.deployUrl });
    } catch (error) { res.status(500).json({ error: 'Falló la generación', details: error.message }); }
});

module.exports = router;
