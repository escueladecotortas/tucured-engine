// Archivo: scripts/audit_stitch_screen_selection.cjs
// Auditoría Forense: Selección de Pantalla en Canvas Stitch, Navbar, Slots y URLs CDN

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function runAudit() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('🔬 AUDITORÍA FORENSE — PIPELINE STITCH & ARTEFACTOS COMPILADOS');
  console.log('══════════════════════════════════════════════════════════════════\n');

  const slug = 'la-sirio-barrio-norte';
  const htmlPath = path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${slug}/index.html`);
  const assetsJsonPath = path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${slug}/client-assets.json`);

  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ Archivo HTML no encontrado en: ${htmlPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(html);

  console.log(`📄 [AUDITORÍA ARCHIVO] ${htmlPath} (${html.length} bytes, ${html.split('\n').length} líneas)\n`);

  // 1. Auditoría de Navbar
  console.log('🔍 1. ANÁLISIS DEL NAVBAR & BRANDING:');
  const nav = $('nav');
  if (nav.length > 0) {
    const navLinks = nav.find('a');
    console.log(`   - Elementos <nav> encontrados: ${nav.length}`);
    console.log(`   - Enlaces en Navbar: ${navLinks.length}`);
    navLinks.each((i, el) => {
      console.log(`     [${i + 1}] Texto: "${$(el).text().trim()}" | href: "${$(el).attr('href')}" | contiene <img>: ${$(el).find('img').length > 0}`);
    });
  } else {
    console.log('   ⚠️ No se encontró etiqueta <nav>');
  }

  // 2. Auditoría de Carrusel de Imágenes (Tokens sin hidratar)
  console.log('\n🔍 2. ANÁLISIS DE IMÁGENES ROTAS / PLACEHOLDERS ({{IMG_...}}):');
  const unhydratedImgs = html.match(/\{\{IMG_\d+\}\}/g) || [];
  const brokenImgTags = $('img[src*="{{"], img[src*="undefined"], img[src=""]');
  console.log(`   - Placeholders de texto "{{IMG_X}}" encontrados en HTML: ${unhydratedImgs.length} (${unhydratedImgs.join(', ')})`);
  console.log(`   - Etiquetas <img> con src rota/placeholder: ${brokenImgTags.length}`);
  brokenImgTags.each((i, el) => {
    console.log(`     [${i + 1}] src="${$(el).attr('src')}" en contenedor: ${$(el).parent().attr('class') || 'sin-clase'}`);
  });

  // 3. Auditoría de Imágenes de Stock vs CDN vs Locales
  console.log('\n🔍 3. ANÁLISIS DE FUENTES DE IMÁGENES (<img src> y background-image):');
  let googleLh3Count = 0;
  let localAssetCount = 0;
  let placeholderCount = 0;
  let otherCount = 0;

  $('img').each((i, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('lh3.googleusercontent.com')) googleLh3Count++;
    else if (src.includes('/nexus_archives/') || src.includes('/clients/')) localAssetCount++;
    else if (src.includes('{{') || src.includes('[') || src.includes('placeholder')) placeholderCount++;
    else otherCount++;
  });

  console.log(`   - Fotos Google Maps/LH3 CDN: ${googleLh3Count}`);
  console.log(`   - Fotos Locales Normalizadas (/nexus_archives/...): ${localAssetCount}`);
  console.log(`   - Placeholders / Plantillas: ${placeholderCount}`);
  console.log(`   - Otras fuentes (SVGs, UI avatars): ${otherCount}`);

  // 4. Auditoría de URLs CDN públicas disponibles en client-assets.json
  console.log('\n🔍 4. DISPONIBILIDAD DE URLs CDN PÚBLICAS EN CLIENT DATA:');
  if (fs.existsSync(assetsJsonPath)) {
    const assetsData = JSON.parse(fs.readFileSync(assetsJsonPath, 'utf8'));
    console.log(`   - logo_url: ${assetsData.logo_url || 'N/A'}`);
    console.log(`   - semantic_photos.hero: ${assetsData.semantic_photos?.hero || 'N/A'}`);
    console.log(`   - semantic_photos.showcase: ${assetsData.semantic_photos?.showcase?.length || 0} fotos`);
    console.log(`   - semantic_photos.atmosphere: ${assetsData.semantic_photos?.atmosphere?.length || 0} fotos`);
  }

  // 5. Auditoría de Slots de Widgets
  console.log('\n🔍 5. SLOTS DEL ARSENAL 2026 INYECTADOS:');
  const widgets = [
    'booking_v1_turnero', 'gallery_v2_stories_grid', 'gallery_v1_reel',
    'social_v2_marquee_reviews', 'trust_v2_live_badge', 'contact_v2_action_dock', 'footer_v1_map'
  ];
  widgets.forEach(w => {
    const present = html.includes(w) || html.includes(`WIDGET: ${w}`) || $(`#nexus-${w}`).length > 0;
    console.log(`   - [${w}]: ${present ? '✅ Inyectado / Presente' : '❌ No detectado'}`);
  });

  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('📊 AUDITORÍA COMPLETADA CON ÉXITO');
  console.log('══════════════════════════════════════════════════════════════════\n');
}

runAudit();
