// Archivo: backend/utils/slugify.js
// Utilidad SSOT para generar slugs normalizados seguros

function slugify(text) {
    if (!text) return 'prospect';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres inválidos
        .replace(/[\s_-]+/g, '-') // Espacios y guiones bajos a guión simple
        .replace(/^-+|-+$/g, ''); // Quitar guiones iniciales y finales
}

module.exports = slugify;
