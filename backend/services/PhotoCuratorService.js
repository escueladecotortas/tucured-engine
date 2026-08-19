// Archivo: backend/services/PhotoCuratorService.js
// Curaduría Semántica por Rol Visual y Sincronización con Bóveda (Sin Duplicación Física) — Ley de 200 líneas

const fs = require('fs');
const path = require('path');

const ROLE_KEYWORDS = {
  identity:   ['logo', 'brand', 'isotipo', 'cartel', 'profile', 'avatar', 'icon'],
  showcase:   ['plato', 'menu', 'burger', 'pizza', 'trago', 'cocktail', 'postre', 'product', 'armazon', 'lente', 'cristal', 'pasta', 'milanesa'],
  atmosphere: ['local', 'ambiente', 'noche', 'show', 'odalisca', 'salon', 'mesa', 'patio', 'decoracion', 'interior', 'clinica', 'fachada'],
  details:    ['detalle', 'textura', 'iluminacion', 'close', 'zoom']
};

const DISCARD_KEYWORDS = ['flyer', 'ticket', 'recibo', 'factura', 'qr_', 'promo_txt'];

class PhotoCuratorService {
  /**
   * Realiza curaduría puramente semántica sin duplicar archivos en disco (cero fs.copyFileSync).
   * Mantiene los nombres de archivos originales (insta_..., maps_...).
   */
  static curate(photos = [], captions = [], assetsDir = '', clientId = '') {
    console.log(`🎨 [PhotoCurator v3] Curando ${photos.length} fotos semánticamente para ${clientId || 'cliente'}...`);
    const classified = { identity: [], showcase: [], atmosphere: [], details: [], discarded: [] };

    photos.forEach((photoPath, i) => {
      const filename = path.basename(photoPath).toLowerCase();
      const caption = (captions[i] || '').toLowerCase();
      if (DISCARD_KEYWORDS.some(k => filename.includes(k) || caption.includes(k))) {
        classified.discarded.push(photoPath);
        return;
      }
      const scores = {};
      for (const [role, keywords] of Object.entries(ROLE_KEYWORDS)) {
        scores[role] = keywords.filter(k => filename.includes(k) || caption.includes(k)).length;
      }
      const bestRole = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
      const role = bestRole[1] > 0 ? bestRole[0] : 'atmosphere';
      classified[role].push({ path: photoPath, caption: caption.slice(0, 100), score: bestRole[1] });
    });

    const slug = clientId || (assetsDir ? path.basename(path.dirname(assetsDir)) : '');
    const toStaticUrl = (p) => {
      if (!p) return null;
      if (p.startsWith('http://') || p.startsWith('https://')) return p;
      const cleanName = path.basename(p);
      return `/nexus_archives/tucu-red/clients/${slug}/assets/${cleanName}`;
    };

    // Mapeo semántico puro a partir de nombres de archivo existentes
    const semantic_photos = {
      hero: null,
      logo: null,
      showcase: [],
      atmosphere: []
    };

    // 1. Logo: si existe logo.jpg en el directorio o classified.identity
    const hasLogoOnDisk = assetsDir && fs.existsSync(path.join(assetsDir, 'logo.jpg'));
    if (hasLogoOnDisk) {
      semantic_photos.logo = toStaticUrl('logo.jpg');
    } else if (classified.identity.length > 0) {
      semantic_photos.logo = toStaticUrl(classified.identity[0].path);
    }

    // Excluir el logo de los pools de hero, showcase y atmosphere
    const isLogoFile = (p) => path.basename(p || '').toLowerCase().includes('logo');
    const nonLogoPhotos = photos.filter(p => !isLogoFile(p));
    const nonLogoAtmosphere = classified.atmosphere.filter(item => !isLogoFile(item.path));
    const nonLogoShowcase = classified.showcase.filter(item => !isLogoFile(item.path));

    // 2. Hero: primer foto de atmósfera o producto o primera foto disponible de feed
    const heroCandidate = nonLogoAtmosphere[0] || nonLogoShowcase[0] || (nonLogoPhotos.length > 0 ? { path: nonLogoPhotos[0] } : null);
    if (heroCandidate) {
      semantic_photos.hero = toStaticUrl(heroCandidate.path);
    }

    // 3. Showcase (hasta 4 fotos originales)
    const showcaseItems = [...nonLogoShowcase].sort((a, b) => b.score - a.score).slice(0, 4);
    semantic_photos.showcase = showcaseItems.map(item => toStaticUrl(item.path)).filter(Boolean);

    // 4. Atmosphere (hasta 4 fotos originales)
    const atmosphereItems = [...nonLogoAtmosphere].slice(0, 4);
    semantic_photos.atmosphere = atmosphereItems.map(item => toStaticUrl(item.path)).filter(Boolean);

    return { classified, semantic_photos };
  }

  static getPersistedPhotos(slug) {
    const candidatePaths = [
      path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${slug}/client-assets.json`),
      path.resolve(process.cwd(), `public/clients/${slug}/client-assets.json`)
    ];
    for (const clientPath of candidatePaths) {
      if (fs.existsSync(clientPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(clientPath, 'utf8'));
          if (data.semantic_photos) return data.semantic_photos;
        } catch (e) {}
      }
    }
    return { hero: null, logo: null, showcase: [], atmosphere: [] };
  }
}

module.exports = PhotoCuratorService;
