// Archivo: backend/routes/stitch.js
// Catálogo y Motor de Ensamblado de Componentes Stitch

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const WIDGETS_ROOT = path.resolve(__dirname, '../stitch/widgets');

// Helper para categorizar y catalogar widgets
function scanStitchWidgets() {
    const catalog = [];
    if (!fs.existsSync(WIDGETS_ROOT)) return catalog;

    const categories = fs.readdirSync(WIDGETS_ROOT, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    categories.forEach(cat => {
        const catDir = path.join(WIDGETS_ROOT, cat);
        const files = fs.readdirSync(catDir).filter(f => f.endsWith('.html') || f.endsWith('.js'));

        files.forEach(file => {
            const fullPath = path.join(catDir, file);
            const content = fs.readFileSync(fullPath, 'utf8');
            const name = file.replace(/\.(html|js)$/, '').replace(/_/g, ' ').replace(/-/g, ' ');

            catalog.push({
                id: `${cat}_${file.replace(/\./g, '_')}`,
                fileName: file,
                category: cat,
                name: name.charAt(0).toUpperCase() + name.slice(1),
                categoryLabel: cat.toUpperCase(),
                sizeBytes: fs.statSync(fullPath).size,
                snippet: content.substring(0, 300),
                content: content,
                props: ['title', 'subtitle', 'theme', 'actionUrl', 'images']
            });
        });
    });

    return catalog;
}

// GET /api/stitch/components - Catálogo completo de widgets
router.get('/components', (req, res) => {
    try {
        const components = scanStitchWidgets();
        res.json({
            success: true,
            total: components.length,
            categories: ['all', 'heroes', 'grids', 'galleries', 'booking', 'social', 'footers', 'powerups'],
            components
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/stitch/catalog - Alias
router.get('/catalog', (req, res) => {
    const components = scanStitchWidgets();
    res.json({ success: true, total: components.length, components });
});

// GET /api/stitch/component/:category/:file - Contenido de widget
router.get('/component/:category/:file', (req, res) => {
    const { category, file } = req.params;
    const filePath = path.join(WIDGETS_ROOT, category, file);
    if (fs.existsSync(filePath)) {
        res.type('text/plain').send(fs.readFileSync(filePath, 'utf8'));
    } else {
        res.status(404).json({ success: false, error: "recurso_no_encontrado" });
    }
});

// POST /api/stitch/render - Renderizado simulado
router.post('/render', (req, res) => {
    const { componentId, data = {} } = req.body;
    const components = scanStitchWidgets();
    const comp = components.find(c => c.id === componentId);
    if (!comp) return res.status(404).json({ success: false, error: "Componente no encontrado" });

    let rendered = comp.content
        .replace(/\{\{title\}\}/g, data.title || 'Título de Muestra')
        .replace(/\{\{subtitle\}\}/g, data.subtitle || 'Subtítulo persuasivo para el cliente')
        .replace(/\{\{actionUrl\}\}/g, data.actionUrl || '#');

    res.json({ success: true, renderedHtml: rendered });
});

module.exports = router;
