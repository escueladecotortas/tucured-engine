// Archivo: backend/utils/slugify.js
// Utilidad SSOT para generar slugs normalizados seguros

function slugify(text) {
    if (!text) return 'prospect';

    const accentsMap = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'Á': 'a', 'É': 'e', 'Í': 'i', 'Ó': 'o', 'Ú': 'u',
        'ñ': 'n', 'Ñ': 'n',
        'ü': 'u', 'Ü': 'u'
    };

    let safeText = text.toString().split('').map(char => accentsMap[char] || char).join('');
    
    return safeText
        .toLowerCase()
        .replace(/[^a-z0-9-_ ]/g, '') // Eliminar todo menos a-z, 0-9, guiones y espacios
        .trim()
        .replace(/[\s_]+/g, '-') // Convertir espacios o guiones bajos a guiones
        .replace(/^-+|-+$/g, '') // Quitar guiones iniciales y finales
        .split('-')
        .filter(word => word.length > 0)
        .slice(0, 2)
        .join('-') || 'prospect'; // Limitar a dos palabras y prevenir cadena vacía
}

module.exports = slugify;
