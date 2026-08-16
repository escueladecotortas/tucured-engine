const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

router.post('/clients', async (req, res) => {
    try {
        const { brandName, slug, category, catalog, personalData } = req.body;
        if (!brandName || !slug) return res.status(400).json({ error: "Brand Name and Slug are required." });

        const clientData = {
            name: brandName, category: category || 'General', status: 'active', plan: 'semilla', createdAt: new Date(), onboardingVersion: 'v1.0',
            owner: { name: personalData?.name || 'Unknown', whatsapp: personalData?.whatsapp || '', email: personalData?.email || '' },
            catalog: catalog || []
        };

        await db.collection('clients').doc(slug).set(clientData, { merge: true });
        await db.collection('nexus_activity').add({ type: 'new_client', agent: 'tucu_red', message: `Nuevo Aliado: ${brandName}`, timestamp: new Date() });
        res.json({ success: true, clientId: slug });
    } catch (error) { res.status(500).json({ error: "Failed to save client data." }); }
});

module.exports = router;
