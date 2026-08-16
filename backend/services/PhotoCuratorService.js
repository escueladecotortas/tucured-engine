// Archivo: backend/services/PhotoCuratorService.js
// Curación inteligente de fotos con Gemini Vision
// Clasifica cada foto según su uso ideal en la landing page
// HERO → foto de ambiente/local, GRID → producto, GALLERY → estilo de vida

const fs = require('fs');
const path = require('path');

class PhotoCuratorService {

    /**
     * Clasifica las fotos descargadas según su uso ideal.
     * Usa análisis heurístico del nombre y contexto del caption.
     * En el futuro, puede integrar Gemini Vision para análisis real.
     * @param {Array} photos - Array de paths relativos ('assets/insta_...')
     * @param {Array} captions - Captions correspondientes de IG
     * @param {string} assetsDir - Directorio donde están las fotos
     * @returns {Object} Fotos clasificadas por rol
     */
    static curate(photos, captions = [], assetsDir = '') {
        console.log(`🎨 [PhotoCurator] Curando ${photos.length} fotos...`);

        const classified = {
            hero: null,         // Mejor foto para el hero (grande, impactante)
            products: [],       // Fotos de productos (para grid/catálogo)
            gallery: [],        // Fotos de estilo de vida (galería)
            logo: null,         // Logo (ya resuelto)
            storefront: null,   // Frente del local
        };

        // Separar logo y storefront primero
        photos.forEach((photoPath, i) => {
            const filename = path.basename(photoPath).toLowerCase();

            if (filename === 'logo.jpg') {
                classified.logo = photoPath;
                return;
            }

            if (filename.includes('maps_main')) {
                classified.storefront = photoPath;
                // Storefront = candidata ideal para hero
                classified.hero = photoPath;
                return;
            }

            // Analizar caption correspondiente para clasificar
            const caption = captions[i] || '';
            const role = this._classifyByCaption(caption, filename);

            if (role === 'product') {
                classified.products.push({
                    path: photoPath,
                    label: this._extractProductName(caption),
                    caption: caption.substring(0, 100),
                });
            } else {
                classified.gallery.push({
                    path: photoPath,
                    caption: caption.substring(0, 100),
                });
            }
        });

        // Si no hay storefront, usar la foto más "ambiental" como hero
        if (!classified.hero && classified.gallery.length > 0) {
            classified.hero = classified.gallery[0].path;
        } else if (!classified.hero && classified.products.length > 0) {
            // Último recurso: primera foto de producto
            classified.hero = classified.products[0].path;
        }

        // Verificar tamaños si el directorio existe
        if (assetsDir && fs.existsSync(assetsDir)) {
            this._sortByFileSize(classified, assetsDir);
        }

        console.log(`   ✅ Hero: ${classified.hero || 'NONE'}`);
        console.log(`   📦 Productos: ${classified.products.length}`);
        console.log(`   🖼️ Galería: ${classified.gallery.length}`);
        console.log(`   🏪 Storefront: ${classified.storefront || 'NONE'}`);

        return classified;
    }

    /**
     * Clasifica por análisis del caption.
     * Keywords de productos → "product"
     * Keywords de ambiente/emoción → "gallery"
     */
    static _classifyByCaption(caption, filename) {
        const lower = caption.toLowerCase();

        // Indicadores fuertes de producto
        const productKeywords = [
            'precio', 'disponible', 'talle', 'tallas',
            'comprar', 'pedido', 'envío', 'consulta',
            'stock', 'oferta', 'promo', 'descuento',
            'producto', 'nuevo', 'reingres', 'llegaron',
            'marca', 'probiótic', 'aliment', 'accesori',
            'juguete', 'ropa', 'calzado', 'colección',
        ];

        const isProduct = productKeywords.some(kw => lower.includes(kw));
        if (isProduct) return 'product';

        // Indicadores de ambiente/estilo de vida
        const galleryKeywords = [
            'aniversario', 'gracias', 'equipo', 'familia',
            'local', 'tienda', 'espacio', 'inauguración',
            'visita', 'cliente', 'mascota', 'compañero',
        ];

        const isGallery = galleryKeywords.some(kw => lower.includes(kw));
        if (isGallery) return 'gallery';

        // Sin caption claro → por defecto gallery
        return caption.length > 50 ? 'product' : 'gallery';
    }

    /**
     * Extrae el nombre del producto del caption.
     */
    static _extractProductName(caption) {
        if (!caption) return 'Producto';

        // Buscar patrones comunes:
        // "CROOCS" "RUFFITOS" etc (palabras en mayúsculas)
        const upperMatch = caption.match(/\b([A-ZÁÉÍÓÚ]{4,})\b/);
        if (upperMatch) return upperMatch[1];

        // Primeras 4 palabras como fallback
        const words = caption.split(/\s+/).slice(0, 4).join(' ');
        return words || 'Producto';
    }

    /**
     * Ordena las fotos por tamaño (las más grandes = mejor calidad).
     * La más grande debería ser el hero.
     */
    static _sortByFileSize(classified, assetsDir) {
        const getSize = (relativePath) => {
            try {
                const fullPath = path.join(assetsDir, path.basename(relativePath));
                if (fs.existsSync(fullPath)) {
                    return fs.statSync(fullPath).size;
                }
            } catch (e) { /* silenciar */ }
            return 0;
        };

        // Ordenar productos por tamaño descendente
        classified.products.sort((a, b) => getSize(b.path) - getSize(a.path));
        classified.gallery.sort((a, b) => getSize(b.path) - getSize(a.path));

        // Si la foto más grande es un producto y no hay hero aún
        if (classified.products.length > 0 && !classified.storefront) {
            const largest = classified.products[0];
            const largestSize = getSize(largest.path);
            const heroSize = classified.hero ? getSize(classified.hero) : 0;

            // No poner un producto como hero
            // Mejor usar la foto de galería más grande
            if (classified.gallery.length > 0) {
                const galleryLargest = getSize(classified.gallery[0].path);
                if (galleryLargest > heroSize) {
                    classified.hero = classified.gallery[0].path;
                }
            }
        }
    }
}

module.exports = PhotoCuratorService;
