// Archivo: backend/routes/leads/manage.js
// Operaciones de gestión, geolocalización y borrado de prospectos (Ley de 200 líneas)

const express = require('express');
const router = express.Router();
const { db } = require('../../firebase-admin');
const mapsScraperService = require('../../services/MapsScraperService');
const { deleteLeadHandler } = require('./core');

// Scraping y validación
router.post('/leads/scrape', async (req, res) => {
    try {
        const { keyword, city, limit } = req.body;
        if (!keyword || !city) return res.status(400).json({ error: 'Palabra clave y ciudad requeridas' });
        const leads = await mapsScraperService.scrape(keyword, city, limit || 5);
        res.json({ success: true, leads });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Validación de dirección
router.post('/validate-address', (req, res) => {
    const { address, city } = req.body;
    if (!address) return res.status(400).json({ error: 'Dirección requerida' });
    const full = city ? `${address}, ${city}` : address;
    res.json({
        success: true,
        formattedAddress: full,
        googleUrl: `https://www.google.com/maps/search/${encodeURIComponent(full)}`
    });
});

// Actualizar estado de prospecto
router.put('/prospects/:id/status', async (req, res) => {
    try {
        if (db) {
            await db.collection('prospects').doc(req.params.id).update({
                status: req.body.status,
                updatedAt: new Date()
            });
        }
        res.json({ success: true, id: req.params.id, status: req.body.status });
    } catch (error) {
        res.status(500).json({ error: 'Fallo al actualizar estado' });
    }
});

// Eliminar prospecto (Delega a deleteLeadHandler centralizado)
router.delete('/prospects/:id', deleteLeadHandler);
router.delete('/leads/:id', deleteLeadHandler);
router.delete('/:id', deleteLeadHandler);

module.exports = router;
