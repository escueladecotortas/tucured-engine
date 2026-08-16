const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { db } = require('../../firebase-admin');
const mapsScraperService = require('../../services/MapsScraperService');

// Scraper & Validator
router.post('/leads/scrape', async (req, res) => {
    try {
        const { keyword, city, limit } = req.body;
        if (!keyword || !city) return res.status(400).json({ error: 'Keyword and city required' });
        const leads = await mapsScraperService.scrape(keyword, city, limit || 5);
        res.json({ success: true, leads });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/validate-address', (req, res) => {
    const { address, city } = req.body;
    if (!address) return res.status(400).json({ error: 'Address required' });
    const full = city ? `${address}, ${city}` : address;
    res.json({ success: true, formattedAddress: full, googleUrl: `https://www.google.com/maps/search/${encodeURIComponent(full)}` });
});

// Manage Operations
router.put('/prospects/:id/status', async (req, res) => {
    try {
        await db.collection('prospects').doc(req.params.id).update({ status: req.body.status, updatedAt: new Date() });
        res.json({ success: true, id: req.params.id, status: req.body.status });
    } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.delete('/prospects/:id', async (req, res) => {
    try {
        const doc = await db.collection('prospects').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        const data = doc.data();
        await db.collection('prospects').doc(req.params.id).delete();

        const safeName = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const clientPath = data.clientPath || path.resolve(__dirname, '../../../nexus_archives/tucu-red/clients', safeName);
        if (fs.existsSync(clientPath)) fs.rmSync(clientPath, { recursive: true, force: true });
        res.json({ success: true, id: req.params.id });
    } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

router.delete('/prospects/:id/photos', async (req, res) => {
    try {
        const doc = await db.collection('prospects').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Not found' });
        const data = doc.data();
        const { index, photoUrl } = req.body;

        await db.collection('prospects').doc(req.params.id).update({
            photos: data.photos?.filter((_, i) => i !== index) || [],
            updatedAt: new Date()
        });

        if (!photoUrl.startsWith('http')) {
            const safeName = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const localFile = path.join(__dirname, '../../../nexus_archives/tucu-red/clients', safeName, photoUrl);
            if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
        }
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

module.exports = router;
