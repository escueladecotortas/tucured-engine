// Archivo: scripts/reprocess_100opticas.cjs
// Re-procesamiento con WidgetInjector y StitchPostProcessor para 100 OPTICAS

const fs = require('fs');
const path = require('path');
const NexusInjectorService = require('../backend/services/NexusInjectorService');

function reprocess() {
  const slug = '100-opticas';
  const destDir = path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${slug}`);
  const publicDir = path.resolve(process.cwd(), `public/clients/${slug}`);
  const htmlPath = path.join(destDir, 'index.html');
  const assetsJsonPath = path.join(destDir, 'client-assets.json');

  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  let rawHtml = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : `
  <!DOCTYPE html>
  <html>
    <head><title>100 OPTICAS</title></head>
    <body class="bg-black text-white">
      <nav><div id="brand-logo"><svg>dummy-logo</svg></div></nav>
      <div class="hero"><h1>100 OPTICAS - Salud Visual</h1></div>
      [gallery_v1_reel]
      <div id="nexus-booking_v1_turnero"></div>
      [social_v2_marquee_reviews]
      [contact_v2_action_dock]
      <div id="nexus-footer_v1_map"></div>
      <footer><p>100 Ópticas</p></footer>
    </body>
  </html>`;

  let assetsData = {};
  if (fs.existsSync(assetsJsonPath)) {
    try { assetsData = JSON.parse(fs.readFileSync(assetsJsonPath, 'utf8')); } catch (e) {}
  }

  const prospectData = {
    slug,
    name: '100 OPTICAS',
    category: 'Optician',
    phone: '+54 381 421-7626',
    whatsapp: '+54 381 421-7626',
    address: 'Maipú 562, San Miguel de Tucumán',
    rating: 4.3,
    reviewsCount: 39,
    topReviews: assetsData.topReviews || [{ text: 'Excelente atención y cristales de primera', rating: 5 }],
    photos: assetsData.photos || [],
    semantic_photos: assetsData.semantic_photos || {}
  };

  console.log(`⚡ Re-procesando HTML de "${prospectData.name}" con nuevo Inyector y Post-Procesador...`);
  const finalHtml = NexusInjectorService.process(rawHtml, prospectData);

  fs.writeFileSync(htmlPath, finalHtml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'index.html'), finalHtml, 'utf8');

  console.log('✅ HTML de 100 OPTICAS persistido exitosamente.');
}

reprocess();
