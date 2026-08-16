// Archivo: backend/services/ColorPaletteService.js
// SERVICE: ColorPaletteService v4.0 (Modularized - Ley de 200 líneas)
// Generador de paleta de 6 colores con rueda cromática + validación WCAG.

const ContrastRemediator = require("./style/ContrastRemediator");
const ColorHarmonizer = require("./style/ColorHarmonizer");

class ColorPaletteService {
  /**
   * Genera una paleta completa de 6 colores desde un color semilla.
   */
  static generate(seedHex, vibeNum = 6) {
    const hsl = ColorHarmonizer.hexToHSL(seedHex);
    const adjusted = ColorHarmonizer.adjustByVibe(hsl, vibeNum);
    const palette = ColorHarmonizer.buildHarmony(adjusted, vibeNum);
    const validated = this._validateWCAG(palette);
    validated.cssModule = this._buildCSSTokens(validated);
    return validated;
  }

  static _validateWCAG(palette) {
    palette.text = ContrastRemediator.remediate(palette.text, palette.surface, 4.5);
    palette.accent = ContrastRemediator.remediate(palette.accent, palette.surface, 3.0);
    palette.muted = ContrastRemediator.remediate(palette.muted, palette.surface, 4.5);
    const textRatio = ContrastRemediator.getContrastRatio(palette.text, palette.surface);
    const ctaRatio = ContrastRemediator.getContrastRatio(palette.accent, palette.surface);

    return {
      ...palette,
      wcag: {
        textOnSurface: { ratio: textRatio.toFixed(1), passed: textRatio >= 4.5 },
        accentOnSurface: { ratio: ctaRatio.toFixed(1), passed: ctaRatio >= 3.0 },
      }
    };
  }

  static _buildCSSTokens(palette) {
    return `@theme {
  --color-primary: ${palette.primary}; --color-secondary: ${palette.secondary};
  --color-accent: ${palette.accent}; --color-surface: ${palette.surface};
  --color-text: ${palette.text}; --color-muted: ${palette.muted};
  --color-primary-alpha: color-mix(in hsl, var(--color-primary) calc(100% * var(--alpha, 1)), transparent);
  --color-secondary-alpha: color-mix(in hsl, var(--color-secondary) calc(100% * var(--alpha, 1)), transparent);
  --color-accent-alpha: color-mix(in hsl, var(--color-accent) calc(100% * var(--alpha, 1)), transparent);
  --color-surface-alpha: color-mix(in hsl, var(--color-surface) calc(100% * var(--alpha, 1)), transparent);
}`.trim();
  }
}

module.exports = ColorPaletteService;
