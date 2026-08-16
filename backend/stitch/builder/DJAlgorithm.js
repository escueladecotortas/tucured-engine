// Archivo: backend/stitch/builder/DJAlgorithm.js

/**
 * DJAlgorithm - Motor de selección inteligente de piezas.
 * PURGED: Standardized to NEXUS UI KIT.
 */
class DJAlgorithm {
    constructor(widgetManager) {
        this.wm = widgetManager;
    }

    selectWidgets(clientData) {
        const selection = {};
        const hints = clientData.hints || {};
        const features = clientData.features || {};

        // 1. HERO (Prioridad: Hint > Standard)
        const heroName = hints.hero || 'nexus-hero';
        selection.hero = this.wm.findWidget('heroes', heroName) || this.wm.randomWidget('heroes');

        // 2. GRID (Prioridad: Hint > Catalog)
        const gridName = hints.grid || 'nexus-catalog';
        selection.grid = this.wm.findWidget('grids', gridName) || this.wm.randomWidget('grids');

        // 3. POWERUPS (Cuarentena Premium - Refactorización a Web Components pendiente)
        selection.powerup = { content: '' };

        // 4. CALC (Legacy Purged)
        selection.calc = { content: '' };

        // 5. GALLERY
        selection.gallery = (clientData.images?.length > 0) ? (this.wm.findWidget('galleries', 'nexus-gallery') || { content: '' }) : { content: '' };

        // 6. BOOKING
        selection.booking = features.booking ? (this.wm.findWidget('booking', 'nexus-booking') || { content: '' }) : { content: '' };

        // 7. SOCIAL
        selection.social = (clientData.instagram?.handle) ? (this.wm.findWidget('social', 'nexus-instagram') || { content: '' }) : { content: '' };

        // 8. FOOTER
        selection.footer = this.wm.findWidget('footers', 'nexus-footer') || this.wm.randomWidget('footers');

        return selection;
    }
}

module.exports = DJAlgorithm;
