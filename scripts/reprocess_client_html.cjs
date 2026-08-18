// Archivo: scripts/reprocess_client_html.cjs
// Re-procesamiento quirúrgico de HTML para certificar sanitización de Navbar, Logo y Carrusel

const fs = require('fs');
const path = require('path');
const NexusInjectorService = require('../backend/services/NexusInjectorService');

function reprocess() {
  const slug = 'la-sirio-barrio-norte';
  const destDir = path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${slug}`);
  const publicDir = path.resolve(process.cwd(), `public/clients/${slug}`);
  const htmlPath = path.join(destDir, 'index.html');
  const assetsJsonPath = path.join(destDir, 'client-assets.json');

  if (!fs.existsSync(htmlPath)) {
    console.error('❌ index.html no encontrado');
    process.exit(1);
  }

  const rawHtml = fs.readFileSync(htmlPath, 'utf8');
  let assetsData = {};
  if (fs.existsSync(assetsJsonPath)) {
    assetsData = JSON.parse(fs.readFileSync(assetsJsonPath, 'utf8'));
  }

  const prospectData = {
    slug,
    name: 'La Sirio Barrio Norte',
    category: 'gastronomia_bar',
    phone: '+54 381 431-2590',
    whatsapp: '+54 381 431-2590',
    address: 'Maipú 575, San Miguel de Tucumán',
    rating: 4.2,
    reviewsCount: 890,
    topReviews: assetsData.topReviews || [{ text: 'Exquisitos platos árabes y cálido lugar', rating: 5 }],
    photos: assetsData.photos || [],
    semantic_photos: assetsData.semantic_photos || {}
  };

  console.log(`⚡ Re-procesando HTML de "${prospectData.name}"...`);
  const finalHtml = NexusInjectorService.process(rawHtml, prospectData);

  fs.writeFileSync(htmlPath, finalHtml, 'utf8');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'index.html'), finalHtml, 'utf8');
  }

  console.log('✅ HTML re-procesado y persistido exitosamente en nexus_archives y public/clients');
}

reprocess();
