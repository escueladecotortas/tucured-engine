// Archivo: backend/services/PhotoCuratorService.js
// Curaduría Semántica por Rol Visual y Sincronización con Bóveda — Ley de 200 líneas

const fs = require('fs');
const path = require('path');

const ROLE_KEYWORDS = {
  identity:   ['logo', 'brand', 'isotipo', 'cartel', 'profile', 'avatar', 'icon'],
  showcase:   ['plato', 'menu', 'burger', 'pizza', 'trago', 'cocktail', 'postre', 'product', 'armazon', 'lente', 'cristal'],
  atmosphere: ['local', 'ambiente', 'noche', 'show', 'odalisca', 'salon', 'mesa', 'patio', 'decoracion', 'interior', 'clinica'],
  details:    ['detalle', 'textura', 'iluminacion', 'close', 'zoom']
};

const DISCARD_KEYWORDS = ['flyer', 'ticket', 'recibo', 'factura', 'qr_', 'promo_txt'];

class PhotoCuratorService {
  static curate(photos, captions = [], assetsDir = '', clientId = '') {
    console.log(`🎨 [PhotoCurator v2] Curando ${photos.length} fotos por Rol Visual para ${clientId || 'cliente'}...`);
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

    const materialized = (assetsDir && fs.existsSync(assetsDir))
      ? this._materializeRoleFiles(classified, assetsDir)
      : { hero: null, logo: null, showcase: [], atmosphere: [] };

    return { classified, materialized };
  }

  static _materializeRoleFiles(classified, assetsDir) {
    const result = { hero: null, logo: null, showcase: [], atmosphere: [] };
    try {
      const copyTo = (srcPath, targetName) => {
        if (!srcPath) return null;
        const src = path.isAbsolute(srcPath) ? srcPath : path.join(assetsDir, path.basename(srcPath));
        const dest = path.join(assetsDir, targetName);
        if (fs.existsSync(src)) {
          if (src !== dest) { try { fs.copyFileSync(src, dest); } catch (e) {} }
          return `assets/${targetName}`;
        }
        return null;
      };

      if (classified.identity[0]) result.logo = copyTo(classified.identity[0].path, 'logo.jpg');
      const heroSource = classified.atmosphere[0] || classified.showcase[0] || classified.details[0];
      if (heroSource) result.hero = copyTo(heroSource.path, 'hero.jpg');

      [...classified.showcase].sort((a, b) => b.score - a.score).slice(0, 4).forEach((item, idx) => {
        const p = copyTo(item.path, `product_${idx + 1}.jpg`);
        if (p) result.showcase.push(p);
      });

      [...classified.atmosphere].slice(1, 5).forEach((item, idx) => {
        const p = copyTo(item.path, `ambient_${idx + 1}.jpg`);
        if (p) result.atmosphere.push(p);
      });
    } catch (err) {
      console.warn(`   ⚠️ [PhotoCurator] Error materializando: ${err.message}`);
    }
    return result;
  }

  static getPersistedPhotos(slug) {
    const clientPath = path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${slug}/client-assets.json`);
    if (fs.existsSync(clientPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(clientPath, 'utf8'));
        return data.semantic_photos || { hero: null, logo: null, showcase: [], atmosphere: [] };
      } catch (e) {}
    }
    return { hero: null, logo: null, showcase: [], atmosphere: [] };
  }
}

module.exports = PhotoCuratorService;
