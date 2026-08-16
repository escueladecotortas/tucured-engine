// Archivo: backend/services/ValidatorRules.js

/**
 * PATRONES DE VALIDACIÓN (Vanguardia 2026)
 * Diccionarios de limpieza para el HTML generado por Stitch.
 */

// Patrones de texto decorativo genérico que Stitch inyecta como overlays en el Hero
const GENERIC_CITY_PATTERNS = [
    /buenos aires/i, /ciudad autónoma/i, /capital federal/i,
    /córdoba capital/i, /rosario/i, /mendoza/i, /santa fe/i,
    /san miguel de tucumán/i, /tucumán/i,
];

// Placeholders de texto que deben reemplazarse con datos reales
const PLACEHOLDER_PATTERNS = [
    { pattern: /calle principal\s*\d*/gi, field: "address" },
    { pattern: /dirección aquí/gi, field: "address" },
    { pattern: /su dirección aquí/gi, field: "address" },
    { pattern: /nombre del cliente/gi, field: "name" },
    { pattern: /Lorem\s+ipsum[\w\s,.]*/gi, field: null }, // Eliminar
    { pattern: /lorem st\.?/gi, field: "address" },
    { pattern: /\[ciudad\]/gi, field: "city" },
    { pattern: /\[nombre del negocio\]/gi, field: "name" },
];

module.exports = {
    GENERIC_CITY_PATTERNS,
    PLACEHOLDER_PATTERNS
};
