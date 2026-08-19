// Archivo: backend/routes/nexus/assets/list.js
// Subruta Atómica: Listado de Assets y Lectura de client-assets.json (Ley de 200 líneas)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const ARCHIVES_DIR = path.resolve(process.cwd(), 'nexus_archives/tucu-red/clients');
const PUBLIC_CLIENTS_DIR = path.resolve(process.cwd(), 'public/clients');

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

module.exports = router;
