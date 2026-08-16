// Archivo: backend/stitch/builder/WidgetManager.js
const fs = require('fs');
const path = require('path');

/**
 * WidgetManager - Gestiona el inventario de piezas HTML.
 */
class WidgetManager {
    constructor(widgetsDir) {
        this.widgetsDir = widgetsDir;
        this.widgets = {
            heroes: this.loadWidgets('heroes'),
            grids: this.loadWidgets('grids'),
            galleries: this.loadWidgets('galleries'),
            booking: this.loadWidgets('booking'),
            powerups: this.loadWidgets('powerups'),
            social: this.loadWidgets('social'),
            footers: this.loadWidgets('footers')
        };
    }

    loadWidgets(category) {
        const dir = path.join(this.widgetsDir, category);
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir)
            .filter(f => f.endsWith('.html'))
            .map(f => ({
                name: f,
                content: fs.readFileSync(path.join(dir, f), 'utf8')
            }));
    }

    findWidget(category, partialName) {
        const found = this.widgets[category]?.find(w => w.name.includes(partialName));
        if (!found) {
            console.warn(`⚠️ [Stitch] Widget no encontrado: ${category}/${partialName}`);
        }
        return found;
    }

    randomWidget(category) {
        const list = this.widgets[category];
        if (!list || list.length === 0) return { content: `<!-- Widget faltante: ${category} -->` };
        return list[Math.floor(Math.random() * list.length)];
    }

    logInventory() {
        const total = Object.values(this.widgets).reduce((sum, arr) => sum + arr.length, 0);
        console.log(`📦 Inventario: ${total} widgets cargados`);
        for (const [cat, widgets] of Object.entries(this.widgets)) {
            console.log(`   ${cat}: ${widgets.map(w => w.name.replace('.html', '')).join(', ') || '(vacío)'}`);
        }
    }
}

module.exports = WidgetManager;
