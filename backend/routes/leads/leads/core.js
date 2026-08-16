const express = require('express');
const router = express.Router();
const { db } = require('../../firebase-admin');
const EnricherService = require('../../services/EnricherService');
const TheDirector = require('../../services/TheDirector');
const rateLimit = require('express-rate-limit');

// Security Middlewares
const validateInternalKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(403).json({ error: "Unauthorized access: Invalid or missing API Key" });
    }
    next();
};

const enrichLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // limit each IP to 15 requests per windowMs
    message: { error: "Too many enrichment requests. Please try again later." }
});

// Save a simple lead
router.post('/leads', async (req, res) => {
    try {
        const { name, phone, email, context, source, category, goal, audience, vibe, usp } = req.body;
        if (!name || !phone) return res.status(400).json({ error: "Name and Phone are required" });

        const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const leadData = { name, slug, phone, email: email || '', context: context || '', category: category || 'general', goal: goal || 'leads', audience: audience || 'local', vibe: vibe || '2', usp: usp || '', source: source || 'tucu_red_form', status: 'new', createdAt: new Date() };

        const result = await db.collection('prospects').add(leadData);
        await db.collection('nexus_activity').add({ type: 'new_lead', agent: 'tucu_red', message: `Nuevo Lead: ${name}`, metadata: { leadId: result.id, ...leadData }, timestamp: new Date() });

        TheDirector.action(result.id, { skipEnrichment: true });
        res.json({ success: true, id: result.id, slug });
    } catch (error) { res.status(500).json({ error: "Failed to save lead" }); }
});

// Phase 2: Enrichment (Hardened)
router.post('/leads/enrich', validateInternalKey, enrichLimiter, async (req, res) => {
    try {
        const { leadId } = req.body;
        if (!leadId) return res.status(400).json({ error: "Lead ID required" });

        const leadDoc = await db.collection('prospects').doc(leadId).get();
        if (!leadDoc.exists) return res.status(404).json({ error: "Lead not found" });

        const enrichedData = await EnricherService.enrich(leadDoc.data());
        const cleanUpdateData = { ...enrichedData, status: 'enriched', enrichedAt: new Date() };
        Object.keys(cleanUpdateData).forEach(key => cleanUpdateData[key] === undefined && delete cleanUpdateData[key]);

        await db.collection('prospects').doc(leadId).update(cleanUpdateData);
        await db.collection('nexus_activity').add({ type: 'lead_enriched', agent: 'nexus_core', message: `Enriquecido: ${leadDoc.data().name}`, timestamp: new Date() });
        res.json({ success: true, lead: enrichedData });
    } catch (error) { res.status(500).json({ error: "Enrichment failed" }); }
});

// List Prospects
router.get('/prospects', async (req, res) => {
    try {
        const snapshot = await db.collection('prospects').get();
        res.json({ prospects: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
    } catch (error) { res.status(500).json({ error: 'Failed to fetch prospects' }); }
});

module.exports = router;
