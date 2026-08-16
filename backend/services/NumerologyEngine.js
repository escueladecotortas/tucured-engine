// Archivo: backend/services/NumerologyEngine.js
// SERVICE: NumerologyEngine v4.0 (Modularized - Ley de 200 líneas)
// Motor de vibración energética y brand-kit de Tucu Red.

const VibeDictionary = require("./numerology/VibeDictionary");
const TypographySelector = require("./numerology/TypographySelector");

class NumerologyEngine {
  /**
   * Calcula el número maestro de un nombre (1-9, 11, 22, 33).
   */
  static calculateMasterNumber(name) {
    const letterValues = {
      'A': 1, 'J': 1, 'S': 1, 'B': 2, 'K': 2, 'T': 2, 'C': 3, 'L': 3, 'U': 3,
      'D': 4, 'M': 4, 'V': 4, 'E': 5, 'N': 5, 'W': 5, 'F': 6, 'O': 6, 'X': 6,
      'G': 7, 'P': 7, 'Y': 7, 'H': 8, 'Q': 8, 'Z': 8, 'I': 9, 'R': 9
    };
    const cleanName = name.replace(/\s*v\d+|\s*version\s*\d+/gi, '').toUpperCase().replace(/[^A-Z]/g, '');
    let sum = 0;
    for (const letter of cleanName) sum += letterValues[letter] || 0;
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = String(sum).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return sum;
  }

  /**
   * Genera paleta de colores HÍBRIDA.
   */
  static generateColorPalette(businessName, category = 'general', metadata = {}) {
    const masterNumber = this.calculateMasterNumber(businessName);
    const basePalettes = VibeDictionary.getBasePalettes();
    const categoryOverrides = VibeDictionary.getCategoryOverrides();
    
    let palette = { ...basePalettes[masterNumber] };
    if (!palette.primaryColor) palette = { ...basePalettes[6] }; // Fallback a 6 (Amor/Cuidado)

    // Categoría Overrides (Solo para enriquecer la descripción, no para cambiar el color primario)
    if (categoryOverrides[category]) {
      const override = categoryOverrides[category];
      palette.description = `${palette.description}, con matices de ${override.vibeDescription}`;
    }
    
    if (metadata.existingBrandKit?.brand) palette = { ...palette, ...metadata.existingBrandKit.brand };

    return { ...palette, masterNumber: palette.masterNumber || masterNumber, backgroundColor: '#0d0d0d', textColor: '#f5f5f5' };
  }

  /**
   * Genera brand kit completo.
   */
  static generateBrandKit(businessData) {
    const { name, category, phone, instagram, address } = businessData;
    const colorPalette = this.generateColorPalette(name, category);
    const vibe = colorPalette.vibe;

    return {
      projectName: name,
      brand: { ...colorPalette },
      typography: {
        headingFont: TypographySelector.selectHeadingFont(vibe),
        headingWeights: [400, 600, 700],
        bodyFont: 'Montserrat',
        bodyWeights: [300, 400, 500],
        googleFontsUrl: TypographySelector.generateFontsUrl(vibe)
      },
      styles: {
        borderRadius: '8px',
        buttonStyle: TypographySelector.selectButtonStyle(vibe),
        cardStyle: 'glass-dark',
        animationStyle: 'subtle-fade'
      },
      numerology: { masterNumber: colorPalette.masterNumber, vibe, description: colorPalette.description },
      instagram: instagram || '', phone: phone || '', address: address || ''
    };
  }
}

module.exports = NumerologyEngine;
