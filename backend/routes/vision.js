// Archivo: backend/routes/vision.js
// Enrutador para Visión Artificial, Ingesta de Catálogos y Biónica Visual

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir, limits: { fileSize: 50 * 1024 * 1024 } });

const CatalogVisionService = require('../services/CatalogVisionService');
const VisualBionicsService = require('../services/VisualBionicsService');

// Ingesta de catálogo de productos
router.post('/ingest', upload.single('catalog'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });
        console.log(`👁️ API: Ingestando catálogo: ${req.file.originalname}`);
        const result = await CatalogVisionService.ingestCatalog(req.file.path, req.file.mimetype);
        res.json(result.success ? result : { success: false, error: result.error });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Captura y auditoría biónica
router.post('/capture', async (req, res) => {
    const { url, projectId } = req.body;
    console.log(`📡 [VISION] Solicitud de Captura Biónica: URL=${url}, Project=${projectId}`);
    
    if (!url) return res.status(400).json({ success: false, error: "URL no proporcionada" });

    try {
        const result = await VisualBionicsService.capture(url, projectId || 'general');
        res.json(result);
    } catch (error) {
        console.error("❌ Error en Captura Biónica:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Auditoría general
router.get('/audit', async (req, res) => {
    const targetUrl = req.query.url || 'http://localhost:5005';
    const projectId = req.query.projectId || 'general';
    const result = await VisualBionicsService.capture(targetUrl, projectId);
    res.json(result);
});

module.exports = router;
