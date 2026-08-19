// Archivo: backend/routes/leads/enrich.js
// Subruta y Handler Atómico: Enriquecimiento Profundo y Re-extracción CYBORG (Ley de 200 líneas)

const express = require('express');
const router = express.Router();
const { db } = require('../../firebase-admin');
const EnricherService = require('../../services/EnricherService');

async function enrichLeadHandler(req, res, getLocalProspects, syncLocalDump) {
    try {
        const { leadId, lead } = req.body;
        let leadData = lead || null;

        if (!leadData && leadId) {
            if (db) {
                try {
                    const doc = await db.collection('prospects').doc(leadId).get();
                    if (doc.exists) leadData = { id: doc.id, ...doc.data() };
                } catch (e) {}
            }
            if (!leadData && typeof getLocalProspects === 'function') {
                leadData = getLocalProspects().find(p => p.id === leadId || p.slug === leadId);
            }
        } else if (!leadData && req.body.name) {
            leadData = req.body;
        }

        if (!leadData || !leadData.name) {
            return res.status(400).json({ error: "leadId o lead con nombre requerido" });
        }

        const enrichedData = await EnricherService.enrich(leadData);
        const finalId = leadData.id || enrichedData.slug || `lead_${Date.now()}`;
        enrichedData.id = finalId;
        enrichedData.status = 'stitch_ready';

        if (db) {
            try { await db.collection('prospects').doc(finalId).set(enrichedData, { merge: true }); } catch (e) {}
        }
        if (typeof syncLocalDump === 'function') {
            syncLocalDump(finalId, enrichedData, false);
        }

        res.json({
            success: true,
            lead: enrichedData,
            status: 'stitch_ready',
            kpis: {
                reviewsValidas: (enrichedData.topReviews || []).length,
                fotosIndexadas: (enrichedData.photos || []).length,
                featuresDetectados: (enrichedData.features || []).length
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error en enriquecimiento", details: error.message });
    }
}

module.exports = { enrichLeadHandler };
