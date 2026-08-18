// Archivo: backend/routes/nexus/assets.js
// Rutas de Inspección, Recuperación y Reclasificación de Assets de Stitch (Ley de 200 líneas)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { db } = require('../../firebase-admin');

const ARCHIVES_DIR = path.resolve(process.cwd(), 'nexus_archives/tucu-red/clients');
const PUBLIC_CLIENTS_DIR = path.resolve(process.cwd(), 'public/clients');
const DUMP_PATH = path.resolve(process.cwd(), 'data/db_dump.json');

// GET /api/nexus/assets/list?slug=<slug>
router.get('/list', (req, res) => {
    try {
        const slug = (req.query.slug || req.query.id || req.query.projectId || '').trim();
        if (!slug) return res.status(400).json({ error: 'Parámetro slug requerido' });

        const candidateDirs = [
            path.join(ARCHIVES_DIR, slug, 'assets'),
            path.join(PUBLIC_CLIENTS_DIR, slug, 'assets'),
            path.join(ARCHIVES_DIR, slug),
            path.join(PUBLIC_CLIENTS_DIR, slug)
        ];

        let foundDir = null;
        for (const dir of candidateDirs) {
            if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
                foundDir = dir;
                break;
            }
        }

        if (!foundDir) return res.json({ success: true, slug, count: 0, assets: [] });

        const files = fs.readdirSync(foundDir)
            .filter(f => !f.startsWith('.') && /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(f))
            .map(file => {
                const fullPath = path.join(foundDir, file);
                const stat = fs.statSync(fullPath);
                const role = file.includes('ambient_') ? 'atmosphere' : file.includes('product_') ? 'showcase' : file.includes('hero') ? 'hero' : file.includes('logo') ? 'logo' : 'general';
                return {
                    name: file,
                    sizeBytes: stat.size,
                    url: `/nexus_archives/tucu-red/clients/${slug}/assets/${file}`,
                    role
                };
            });

        res.json({ success: true, slug, count: files.length, assets: files });
    } catch (e) {
        res.status(500).json({ error: 'Fallo al listar assets', details: e.message });
    }
});

// GET /api/nexus/assets/client-assets?slug=<slug>
router.get('/client-assets', (req, res) => {
    try {
        const slug = (req.query.slug || req.query.id || '').trim();
        if (!slug) return res.status(400).json({ error: 'Parámetro slug requerido' });

        const candidatePaths = [
            path.join(ARCHIVES_DIR, slug, 'client-assets.json'),
            path.join(PUBLIC_CLIENTS_DIR, slug, 'client-assets.json')
        ];

        for (const p of candidatePaths) {
            if (fs.existsSync(p)) {
                const data = JSON.parse(fs.readFileSync(p, 'utf8'));
                return res.json({ success: true, slug, clientAssets: data });
            }
        }
        res.status(404).json({ error: `client-assets.json no encontrado para ${slug}` });
    } catch (e) {
        res.status(500).json({ error: 'Error al leer client-assets.json', details: e.message });
    }
});

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
        let savedPath = null;

        for (const p of candidatePaths) {
            if (fs.existsSync(p)) {
                try {
                    assetsData = JSON.parse(fs.readFileSync(p, 'utf8'));
                    savedPath = p;
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

        // Persistir en disco
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

// GET /api/nexus/assets/payload?slug=<slug>
router.get('/payload', async (req, res) => {
    try {
        const slug = (req.query.slug || req.query.id || '').trim();
        if (!slug) return res.status(400).json({ error: 'Parámetro slug requerido' });

        const clientDir = path.join(ARCHIVES_DIR, slug);
        const assetsJsonPath = path.join(clientDir, 'client-assets.json');
        const manifestPath = path.join(clientDir, 'stitch-manifest.json');

        let payload = null;
        let stitchManifest = null;

        if (fs.existsSync(assetsJsonPath)) {
            try { payload = JSON.parse(fs.readFileSync(assetsJsonPath, 'utf8')); } catch (e) {}
        }
        if (fs.existsSync(manifestPath)) {
            try { stitchManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (e) {}
        }

        if (!payload && db) {
            try {
                const doc = await db.collection('prospects').doc(slug).get();
                if (doc.exists) payload = doc.data();
            } catch (e) {}
        }

        if (!payload && fs.existsSync(DUMP_PATH)) {
            try {
                const dump = JSON.parse(fs.readFileSync(DUMP_PATH, 'utf8'));
                payload = dump.prospects?.[slug] || Object.values(dump.prospects || {}).find(p => p.slug === slug || p.id === slug);
            } catch (e) {}
        }

        if (!payload) return res.status(404).json({ error: `Payload no encontrado para ${slug}` });
        res.json({ success: true, slug, payload, stitchManifest });
    } catch (error) {
        res.status(500).json({ error: 'Error al recuperar payload', details: error.message });
    }
});

// GET /api/nexus/assets/stitch-manifest?slug=<slug>
router.get('/stitch-manifest', async (req, res) => {
    try {
        const slug = (req.query.slug || req.query.id || '').trim();
        if (!slug) return res.status(400).json({ error: 'Parámetro slug requerido' });

        const manifestPath = path.join(ARCHIVES_DIR, slug, 'stitch-manifest.json');
        const publicManifestPath = path.join(PUBLIC_CLIENTS_DIR, slug, 'stitch-manifest.json');

        let manifest = null;
        if (fs.existsSync(manifestPath)) manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        else if (fs.existsSync(publicManifestPath)) manifest = JSON.parse(fs.readFileSync(publicManifestPath, 'utf8'));

        if (!manifest) return res.status(404).json({ error: `stitch-manifest.json no encontrado para ${slug}` });
        res.json({ success: true, slug, manifest });
    } catch (error) {
        res.status(500).json({ error: 'Error al recuperar manifiesto', details: error.message });
    }
});

// GET /api/nexus/assets/design-md?slug=<slug>
router.get('/design-md', (req, res) => {
    try {
        const slug = (req.query.slug || '').trim();
        if (!slug) return res.status(400).send('Parámetro slug requerido');

        const paths = [
            path.join(ARCHIVES_DIR, slug, 'DESIGN.md'),
            path.join(PUBLIC_CLIENTS_DIR, slug, 'DESIGN.md')
        ];

        for (const p of paths) {
            if (fs.existsSync(p)) {
                res.set('Content-Type', 'text/plain; charset=utf-8');
                return res.send(fs.readFileSync(p, 'utf8'));
            }
        }
        res.status(404).send(`DESIGN.md no encontrado para slug: ${slug}`);
    } catch (error) {
        res.status(500).send(`Error al recuperar DESIGN.md: ${error.message}`);
    }
});

module.exports = router;
