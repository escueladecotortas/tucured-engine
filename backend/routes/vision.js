const express = require('express');
const router = express.Router();
const multer = require('multer');
const CatalogVisionService = require('../services/CatalogVisionService');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 50 * 1024 * 1024 } });

const VisualBionicsService = require('../services/VisualBionicsService');

router.post('/ingest', upload.single('catalog'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });
        console.log(`👁️ API: Ingesting catalog: ${req.file.originalname}`);
        const result = await CatalogVisionService.ingestCatalog(req.file.path, req.file.mimetype);
        res.json(result.success ? result : { success: false, error: result.error });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

router.post('/capture', async (req, res) => {
    const { url, projectId } = req.body;
    console.log(`📡 [VISION] Incoming Capture Request: URL=${url}, Project=${projectId}`);
    
    if (!url) return res.status(400).json({ error: "No URL provided" });

    try {
        const result = await VisualBionicsService.capture(url, projectId);
        const screenshotData = result.result.content.find(c => c.type === 'image');
        
        if (screenshotData && projectId) {
            VisualBionicsService.saveToVault(screenshotData.data, url, projectId);
        }

        res.json({ success: true, screenshot: screenshotData ? screenshotData.data : null });
    } catch (error) {
        console.error("❌ Capture Fail:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
