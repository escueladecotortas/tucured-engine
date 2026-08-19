// Archivo: backend/routes/nexus/assets/reclassify.js
// Subruta Atómica: Reclasificación Semántica de Fotos en Bóveda Visual y Sync con Firestore (Ley de 200 líneas)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { db } = require('../../../firebase-admin');

const ARCHIVES_DIR = path.resolve(process.cwd(), 'nexus_archives/tucu-red/clients');
const PUBLIC_CLIENTS_DIR = path.resolve(process.cwd(), 'public/clients');

// PATCH & POST /api/nexus/assets/reclassify & /api/nexus/assets/update
const reclassifyHandler = async (req, res) => {
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

        const filename = path.basename(photoUrl);

        // Limpiar de roles anteriores
        sp.showcase = sp.showcase.filter(u => u !== photoUrl && !u.endsWith(filename));
        sp.atmosphere = sp.atmosphere.filter(u => u !== photoUrl && !u.endsWith(filename));
        if (sp.hero === photoUrl || (sp.hero && sp.hero.endsWith(filename))) sp.hero = null;
        if (sp.logo === photoUrl || (sp.logo && sp.logo.endsWith(filename))) sp.logo = null;

        // Asignar nuevo rol o descartar
        if (newRole === 'hero') {
            sp.hero = photoUrl;
        } else if (newRole === 'logo') {
            sp.logo = photoUrl;
            assetsData.logo_url = photoUrl;
        } else if (newRole === 'showcase') {
            sp.showcase.push(photoUrl);
        } else if (newRole === 'atmosphere') {
            sp.atmosphere.push(photoUrl);
        } else if (newRole === 'discard') {
            assetsData.photos = (assetsData.photos || []).filter(u => u !== photoUrl && !u.endsWith(filename));
            // Purgar archivo físico del disco si existe
            const candidateFilePaths = [
                path.join(ARCHIVES_DIR, slug, 'assets', filename),
                path.join(PUBLIC_CLIENTS_DIR, slug, 'assets', filename)
            ];
            candidateFilePaths.forEach(fp => {
                if (fs.existsSync(fp)) {
                    try { fs.unlinkSync(fp); } catch (e) {}
                }
            });
        }

        // Persistir en disco (dual: archives + public)
        candidatePaths.forEach(p => {
            const dir = path.dirname(p);
            if (fs.existsSync(dir)) fs.writeFileSync(p, JSON.stringify(assetsData, null, 2), 'utf8');
        });

        // Sincronizar en Firestore si el documento existe
        if (db) {
            try {
                const docRef = db.collection('prospects').doc(slug);
                const doc = await docRef.get();
                if (doc.exists) {
                    await docRef.update({
                        semantic_photos: sp,
                        photos: assetsData.photos || [],
                        logoUrl: assetsData.logo_url || null,
                        updatedAt: new Date().toISOString()
                    });
                }
            } catch (dbErr) {
                console.warn(`   ⚠️ [Reclassify] Error actualizando Firestore para ${slug}:`, dbErr.message);
            }
        }

        res.json({
            success: true,
            slug,
            photoUrl,
            newRole,
            semantic_photos: sp,
            photosCount: assetsData.photos?.length || 0,
            photos: assetsData.photos || []
        });
    } catch (e) {
        res.status(500).json({ error: 'Fallo al reclasificar activo', details: e.message });
    }
};

router.patch('/reclassify', reclassifyHandler);
router.post('/reclassify', reclassifyHandler);
router.patch('/update', reclassifyHandler);
router.post('/update', reclassifyHandler);

module.exports = router;
