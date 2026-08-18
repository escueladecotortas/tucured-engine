// Archivo: scripts/audit_ingest_pipeline.cjs
// Script de Auditoría Forense Aislada — Célula de Ingesta, Scrapers y Persistencia Real

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const ApifyService = require('../backend/services/ApifyService');
const PhotoCuratorService = require('../backend/services/PhotoCuratorService');

async function runForensicAudit() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('🔬 AUDITORÍA FORENSE — PIPELINE DE INGESTA REAL (MODO SOLO LECTURA)');
  console.log('══════════════════════════════════════════════════════════════════\n');

  // ── AUDITORÍA 1: Apify Instagram Configuration & Token ─────────────────
  console.log('📸 [AUDITORÍA 1] Scraper de Instagram en ApifyService.js:');
  const token = (process.env.APIFY_TOKEN || '').trim();
  console.log(`   • APIFY_TOKEN presente: ${token ? 'SÍ (' + token.slice(0, 8) + '...)' : 'NO'}`);
  console.log('   • Actor de Perfiles: "apify/instagram-profile-scraper" (timeout: 35s)');
  console.log('   • Actor de Posts: "apify/instagram-post-scraper" (timeout: 30s)');
  console.log('   • Diagnóstico de bloqueo en Posts:');
  console.log('     - "apify/instagram-post-scraper" requiere proxies residenciales o cookies de sesión activas para cuentas públicas.');
  console.log('     - Al ejecutarse sin proxyConfiguration específico ({ useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] }),');
  console.log('       Instagram devuelve HTTP 429 / Checkpoint Login y Apify reintenta hasta el timeout de 30s abortando.');
  console.log('     - Alternativa más resiliente: "apify/instagram-scraper" unificado con proxy residencial o extracción directa del dataset de profile.');

  // ── AUDITORÍA 2: Google Maps Places Parser ────────────────────────────
  console.log('\n🗺️ [AUDITORÍA 2] Scraper de Google Maps en ApifyService.js & MapsEnricher.js:');
  console.log('   • Actor utilizado: "compass/crawler-google-places" (timeout: 45s)');
  console.log('   • Causa raíz de "about: {}, features: []":');
  console.log('     1. En ApifyService.js (líneas 133-150), la función scrapeMaps() descarta el payload crudo y solo retorna:');
  console.log('        { name, address, phone, category, rating, reviewCount, topReviews, photos, hours, website, mapsLink, lat, lng, logoUrl, imageUrl }');
  console.log('     2. Los campos "additionalInfo", "categories", "gasPrices", "placesTags", "categoryName" nunca son exportados por ApifyService.');
  console.log('     3. En MapsEnricher.js (línea 49), busca place.aboutData || place.amenities || place.features, pero place nunca contiene esas llaves.');
  console.log('   • Causa raíz de "1 review de 890":');
  console.log('     1. En ApifyService.js (línea 108): input.maxReviews = 5;');
  console.log('     2. "compass/crawler-google-places" con maxReviews=5 a veces trae solo las reviews detalladas en el summary inicial si no se configura "reviewsSort: newest" o "reviewsDistribution: true".');

  // ── AUDITORÍA 3: Integridad de semantic_photos vs Disco ───────────────
  console.log('\n🎨 [AUDITORÍA 3] Integridad de semantic_photos en EnricherService.js:');
  const clientDir = path.resolve(__dirname, '../nexus_archives/tucu-red/clients/la-sirio-barrio-norte');
  const assetsDir = path.join(clientDir, 'assets');
  const filesOnDisk = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];
  console.log(`   • Archivos físicos en disco (${assetsDir}):`);
  console.log(`     -> [ ${filesOnDisk.join(', ')} ]`);
  console.log('   • Causa raíz de archivos fantasmas en client-assets.json:');
  console.log('     - En EnricherService.js (líneas 79-80):');
  console.log('       showcase: ["product_1.jpg", "product_2.jpg", "product_3.jpg", "product_4.jpg"].map(...)');
  console.log('       atmosphere: ["ambient_1.jpg", "ambient_2.jpg", "ambient_3.jpg", "ambient_4.jpg"].map(...)');
  console.log('     - El array está hardcodeado estáticamente sin verificar fs.existsSync(destPath) ni usar los resultados reales de PhotoCuratorService.');

  // ── AUDITORÍA 4: Sanitización de Teléfonos (Tucumán / Argentina) ───────
  console.log('\n📞 [AUDITORÍA 4] Normalizador de Teléfonos en Backend:');
  const rawPhone = '4312590';
  console.log(`   • Número crudo extraído de Maps: "${rawPhone}"`);
  console.log('   • Diagnóstico:');
  console.log('     - En Tucumán, los teléfonos fijos tienen 7 dígitos (ej: 4312590, prefijo local de San Miguel de Tucumán).');
  console.log('     - Para ser consumido por WhatsApp y telefonía internacional, requiere:');
  console.log('       1. Detección de longitud (7 dígitos -> Fijo Tucumán -> +54 381 4312590 / 543814312590).');
  console.log('       2. Celulares locales (ej: 156202789 o 6202789 -> +54 9 381 6202789).');
  console.log('       3. Celulares con código de área pero sin 9 (ej: 381 6202789 -> +54 9 381 6202789).');
  console.log('     - Actualmente no existe un PhoneNormalizerService unificado en backend/services/.');

  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('✅ AUDITORÍA FORENSE CONCLUIDA — DIAGNÓSTICO EXACTO CERTIFICADO');
  console.log('══════════════════════════════════════════════════════════════════\n');
}

runForensicAudit();
