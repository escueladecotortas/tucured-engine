// Archivo: backend/services/numerology/TypographySelector.js
// Selector Tipográfico Armónico y Generador de Google Fonts

class TypographySelector {
    static selectHeadingFont(vibe) {
        if (!vibe) return 'Outfit';
        if (vibe.includes('6') || vibe.includes('Belleza') || vibe.includes('Estética')) return 'Playfair Display';
        if (vibe.includes('11') || vibe.includes('22') || vibe.includes('Maestro')) return 'Cinzel';
        if (vibe.includes('1') || vibe.includes('8') || vibe.includes('Poder')) return 'Rajdhani';
        return 'Outfit';
    }

    static generateFontsUrl(vibe) {
        const heading = this.selectHeadingFont(vibe);
        const encoded = encodeURIComponent(heading);
        return `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap`;
    }

    static selectButtonStyle(vibe) {
        if (vibe && (vibe.includes('6') || vibe.includes('22'))) return 'rounded-full shadow-lg';
        if (vibe && vibe.includes('11')) return 'rounded-xl border border-indigo-500/50';
        return 'rounded-lg';
    }
}

module.exports = TypographySelector;
