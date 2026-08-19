// Archivo: backend/routes/nexus/assets/reclassify.js
// Subruta Atómica: Reclasificación Semántica de Fotos en Bóveda Visual (Ley de 200 líneas)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const ARCHIVES_DIR = path.resolve(process.cwd(), 'nexus_archives/tucu-red/clients');
const PUBLIC_CLIENTS_DIR = path.resolve(process.cwd(), 'public/clients');

// PATCH & POST /api/nexus/assets/reclassify — Reclasificación Manual en Bóveda Visual
const reclassifyHandler = (req, res) => {
    try {
        const { slug, photoUrl, newRole } = req.body;
        if (!slug || !photoUrl || !newRole) {
            return res.status(400).json({ error: 'Parámetros slug, photoUrl y newRole son requeridos' });
        }

        const candidatePaths = [
            path.join(ARCHIVES_DIR, slug, 'client-assets.json'),
            path.join(PUBLIC_CLIENTS_DIR, slug, 'client-assets.json')
        ];

        let assetsData = null;
        for (const p of candidatePaths) {
            if (fs.existsSync(p)) {
                try {
                    assetsData = JSON.parse(fs.readFileSync(p, 'utf8'));
                    break;
                } catch (e) {}
            }
        }

        if (!assetsData) return res.status(404).json({ error: `client-assets.json no encontrado para ${slug}` });

        assetsData.semantic_photos = assetsData.semantic_photos || { hero: null, logo: null, showcase: [], atmosphere: [] };
        const sp = assetsData.semantic_photos;
        sp.showcase = Array.isArray(sp.showcase) ? sp.showcase : [];
        sp.atmosphere = Array.isArray(sp.atmosphere) ? sp.atmosphere : [];

        // Limpiar de roles anteriores
        sp.showcase = sp.showcase.filter(u => u !== photoUrl && !u.endsWith(path.basename(photoUrl)));
        sp.atmosphere = sp.atmosphere.filter(u => u !== photoUrl && !u.endsWith(path.basename(photoUrl)));
        if (sp.hero === photoUrl || (sp.hero && sp.hero.endsWith(path.basename(photoUrl)))) sp.hero = null;
        if (sp.logo === photoUrl || (sp.logo && sp.logo.endsWith(path.basename(photoUrl)))) sp.logo = null;

        // Asignar nuevo rol
        if (newRole === 'hero') sp.hero = photoUrl;
        else if (newRole === 'logo') { sp.logo = photoUrl; assetsData.logo_url = photoUrl; }
        else if (newRole === 'showcase') sp.showcase.push(photoUrl);
        else if (newRole === 'atmosphere') sp.atmosphere.push(photoUrl);
        else if (newRole === 'discard') {
            assetsData.photos = (assetsData.photos || []).filter(u => u !== photoUrl && !u.endsWith(path.basename(photoUrl)));
        }

        // Persistir en disco (dual: archives + public)
        candidatePaths.forEach(p => {
            const dir = path.dirname(p);
            if (fs.existsSync(dir)) fs.writeFileSync(p, JSON.stringify(assetsData, null, 2), 'utf8');
        });

        res.json({ success: true, slug, photoUrl, newRole, semantic_photos: sp, photosCount: assetsData.photos?.length || 0 });
    } catch (e) {
        res.status(500).json({ error: 'Fallo al reclasificar activo', details: e.message });
    }
};

router.patch('/reclassify', reclassifyHandler);
router.post('/reclassify', reclassifyHandler);

module.exports = router;
