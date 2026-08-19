// Archivo: backend/routes/nexus/assets/manifest.js
// Subruta Atómica: Recuperación de Payload, Stitch Manifest y DESIGN.md (Ley de 200 líneas)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { db } = require('../../../firebase-admin');

const ARCHIVES_DIR = path.resolve(process.cwd(), 'nexus_archives/tucu-red/clients');
const PUBLIC_CLIENTS_DIR = path.resolve(process.cwd(), 'public/clients');
const DUMP_PATH = path.resolve(process.cwd(), 'data/db_dump.json');

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
