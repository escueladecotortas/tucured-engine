/**
 * NEXUS STITCH ENGINE v2.0
 * Refactorizado para cumplir con la Ley de 200 líneas.
 */
const fs = require('fs');
const path = require('path');
const WidgetManager = require('./builder/WidgetManager');
const DJAlgorithm = require('./builder/DJAlgorithm');
const Hydrator = require('./builder/Hydrator');

class NexusBuilder {
    constructor() {
        this.wm = new WidgetManager(path.join(__dirname, 'widgets'));
        this.dj = new DJAlgorithm(this.wm);
        
        if (require.main === module) {
            console.log('🧵 NEXUS BUILDER ENGINE v2.0 (MODULAR) INICIADO...');
            this.wm.logInventory();
        }
    }

    stitch(clientData) {
        const pieces = this.dj.selectWidgets(clientData);
        const { style = {}, meta = {}, fonts = {} } = clientData;

        const googleFontsLink = fonts.googleFontsUrl ? `<link href="${fonts.googleFontsUrl}" rel="stylesheet">` : '';
        const fontAwesomeLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">';
        const fontHead = fonts.headingFont || 'Inter';
        const fontBody = fonts.bodyFont || 'Inter';

        const layout = this.getBaseLayout({ 
            meta, googleFontsLink, fontAwesomeLink, style, fontHead, fontBody, pieces 
        });

        return Hydrator.hydrate(layout, clientData);
    }

    getBaseLayout(d) {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${d.meta.title || 'Sitio Generado'} | Home</title>
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    ${d.googleFontsLink} ${d.fontAwesomeLink}
    <style>
        :root {
            --primary: ${d.style.primary || '#000000'};
            --secondary: ${d.style.secondary || '#666666'};
            --accent: ${d.style.accent || '#007bff'};
            --font-head: '${d.fontHead}', sans-serif;
            --font-body: '${d.fontBody}', sans-serif;
        }
        body { font-family: var(--font-body); margin: 0; color: #1a1a1a; background: #fff; }
        h1, h2, h3, h4, h5, h6 { font-family: var(--font-head); }
        .whatsapp-float {
            position: fixed; width: 60px; height: 60px; bottom: 30px; right: 30px;
            background-color: #25d366; color: #FFF; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; z-index: 9999;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
    ${d.pieces.hero?.content || ''}
    ${d.pieces.social?.content || ''}
    ${d.pieces.grid?.content || ''}
    ${d.pieces.booking?.content || ''}
    ${d.pieces.gallery?.content || ''}
    ${d.pieces.calc?.content || ''}
    ${d.pieces.footer?.content || ''}
    ${d.pieces.powerup?.content || ''}
    <a href="https://wa.me/{{WHATSAPP_NUMBER}}?text={{WHATSAPP_MESSAGE}}" class="whatsapp-float" target="_blank">
        <i class="fab fa-whatsapp"></i>
    </a>
</body>
</html>`;
    }
}

if (require.main === module) {
    // Test logic remains same
    const factory = new NexusBuilder();
    const result = factory.stitch({
        meta: { title: 'Test Modular' },
        style: { primary: '#22c55e' },
        content: { heroTitle: 'Soberanía Digital' }
    });
    console.log('✅ TEST MODULAR COMPLETADO.');
}

module.exports = NexusBuilder;
