// Archivo: backend/routes/leads/bulk.js
// Operaciones masivas de prospectos y assets con soporte Cloud & Local-First

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { db } = require('../../firebase-admin');
const ArgusService = require('../../services/ArgusService');
const slugify = require('../../utils/slugify');

const LOCAL_DUMP_PATH = path.resolve(__dirname, '../../../data/db_dump.json');

router.post('/prospects', async (req, res) => {
    try {
        const { prospects } = req.body;
        if (!Array.isArray(prospects)) return res.status(400).json({ error: "Array de prospectos requerido" });

        let savedCount = 0;
        let downloadedAssets = 0;

        if (db) {
            const batch = db.batch();
            for (const p of prospects) {
                const docId = p.id || `lead_${Date.now()}_${savedCount}`;
                batch.set(db.collection('prospects').doc(docId), { ...p, id: docId }, { merge: true });
                savedCount++;
            }
            await batch.commit();
        }

        // Mirror en dump local
        try {
            let dumpObj = fs.existsSync(LOCAL_DUMP_PATH) ? JSON.parse(fs.readFileSync(LOCAL_DUMP_PATH, 'utf8')) : {};
            dumpObj.prospects = dumpObj.prospects || {};
            prospects.forEach(p => {
                const docId = p.id || `lead_${Date.now()}_${savedCount}`;
                dumpObj.prospects[docId] = { ...p, id: docId };
                if (!db) savedCount++;
            });
            fs.writeFileSync(LOCAL_DUMP_PATH, JSON.stringify(dumpObj, null, 2));
        } catch (e) {}

        // Descarga y validación preventiva de fotos con Argus
        for (const p of prospects) {
            if (p.photos?.length > 0) {
                const safeName = slugify(p.name || 'prospect');
                const assetsDir = path.resolve(__dirname, '../../../nexus_archives/tucu-red/clients', safeName, 'assets');
                if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

                for (let i = 0; i < Math.min(p.photos.length, 3); i++) {
                    const dest = path.join(assetsDir, `gallery_${p.id || safeName}_${i}.jpg`);
                    try {
                        if (await ArgusService.verifyAndSave(p.photos[i], dest)) downloadedAssets++;
                    } catch (e) {}
                }
            }
        }

        res.json({ success: true, savedCount, downloadedAssets });
    } catch (error) {
        res.status(500).json({ error: "Fallo en guardado masivo", details: error.message });
    }
});

module.exports = router;
