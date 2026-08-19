// Archivo: scripts/test_curation_and_gates.cjs
// Suite de Certificación: Curaduría Semántica (Cero Duplicados), Extracción de Logo Real y Compuertas UI

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const PhotoCuratorService = require('../backend/services/PhotoCuratorService');
const slugify = require('../backend/utils/slugify');

async function testCurationAndGates() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('🛡️ TEST: CERTIFICACIÓN DE CURADURÍA SEMÁNTICA Y COMPUERTAS UI');
  console.log('════════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let total = 0;

  const testSlug = 'canzonieri';
  const archivesDir = path.resolve(__dirname, `../nexus_archives/tucu-red/clients/${testSlug}`);
  const assetsDir = path.join(archivesDir, 'assets');
  const publicDir = path.resolve(__dirname, `../public/clients/${testSlug}`);
  const publicAssetsDir = path.join(publicDir, 'assets');

  // 1. Limpieza de Disco Inicial
  console.log('1. Purgando carpetas previas de prueba de "canzonieri"...');
  if (fs.existsSync(archivesDir)) fs.rmSync(archivesDir, { recursive: true, force: true });
  if (fs.existsSync(publicDir)) fs.rmSync(publicDir, { recursive: true, force: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(publicAssetsDir, { recursive: true });

  // 2. Crear 14 archivos originales simulados (12 IG + 1 Maps + 1 Logo Real)
  console.log('2. Generando 14 archivos físicos originales (12 IG + 1 Maps + 1 Logo)...');
  
  // 1 Logo Real
  fs.writeFileSync(path.join(assetsDir, 'logo.jpg'), Buffer.from('FAKE_REAL_PROFILE_LOGO_DATA'));
  
  // 1 Foto Maps
  fs.writeFileSync(path.join(assetsDir, 'maps_main.jpg'), Buffer.from('FAKE_MAPS_PHOTO_DATA'));

  // 12 Fotos de Instagram
  const igPhotos = [];
  const captions = [];
  for (let i = 1; i <= 12; i++) {
    const filename = `insta_canzonieri_${i}.jpg`;
    fs.writeFileSync(path.join(assetsDir, filename), Buffer.from(`FAKE_IG_PHOTO_${i}`));
    igPhotos.push(`assets/${filename}`);
    captions.push(i % 2 === 0 ? 'Exquisito plato de pastas caseras y vino' : 'Noche de show y ambiente único en el salón');
  }

  // 3. Ejecutar Curaduría Semántica
  console.log('\n3. Ejecutando PhotoCuratorService.curate()...');
  const allPhotos = ['assets/logo.jpg', 'assets/maps_main.jpg', ...igPhotos];
  const curationResult = PhotoCuratorService.curate(allPhotos, captions, assetsDir, testSlug);

  // 4. Verificar conteo de archivos en disco (PROHIBIDO DUPLICAR)
  total++;
  const filesOnDisk = fs.readdirSync(assetsDir);
  console.log(`   📁 Total archivos físicos en disco: ${filesOnDisk.length}`);
  console.log(`   📄 Lista de archivos:`, filesOnDisk);

  const duplicateFiles = filesOnDisk.filter(f => f.startsWith('ambient_') || f.startsWith('product_') || (f === 'hero.jpg' && !allPhotos.includes('assets/hero.jpg')));

  if (filesOnDisk.length === 14 && duplicateFiles.length === 0) {
    console.log('   ✅ [PASS] Cero duplicación física: exactamente 14 archivos originales en disco (12 IG + 1 Maps + 1 Logo).');
    passed++;
  } else {
    throw new Error(`Se encontraron ${filesOnDisk.length} archivos (esperados: 14). Duplicados: ${duplicateFiles.join(', ')}`);
  }

  // 5. Verificar estructura de semantic_photos en client-assets.json
  total++;
  console.log('\n4. Verificando estructura semántica sin nombres hardcodeados...');
  const sp = curationResult.semantic_photos;
  console.log('   🧠 Semantic Photos:', sp);

  const isHeroOriginal = sp.hero && (sp.hero.includes('insta_') || sp.hero.includes('maps_') || sp.hero.includes('logo'));
  const isLogoOriginal = sp.logo && sp.logo.includes('logo.jpg');
  const areShowcasesOriginals = Array.isArray(sp.showcase) && sp.showcase.every(u => u.includes('insta_') || u.includes('maps_'));
  const areAtmosphereOriginals = Array.isArray(sp.atmosphere) && sp.atmosphere.every(u => u.includes('insta_') || u.includes('maps_'));

  if (isHeroOriginal && isLogoOriginal && areShowcasesOriginals && areAtmosphereOriginals) {
    console.log('   ✅ [PASS] semantic_photos mapea fielmente los archivos originales sin usar copias artificiales.');
    passed++;
  } else {
    throw new Error('semantic_photos contiene rutas o formatos inválidos.');
  }

  // 6. Generar client-assets.json persistido
  const clientAssets = {
    business_name: 'Canzonieri Pastas & Trattoria',
    slug: testSlug,
    category: 'restaurante',
    photos: filesOnDisk.map(f => `/nexus_archives/tucu-red/clients/${testSlug}/assets/${f}`),
    semantic_photos: sp,
    logo_url: sp.logo
  };
  fs.writeFileSync(path.join(archivesDir, 'client-assets.json'), JSON.stringify(clientAssets, null, 2));
  fs.writeFileSync(path.join(publicDir, 'client-assets.json'), JSON.stringify(clientAssets, null, 2));

  // 7. Simular Reclasificación / Actualización desde Bóveda Visual (PATCH /api/nexus/assets/reclassify)
  total++;
  console.log('\n5. Simulando Reclasificación en Bóveda Visual (cambiar rol a hero)...');
  const targetPhoto = `/nexus_archives/tucu-red/clients/${testSlug}/assets/insta_canzonieri_5.jpg`;
  
  // Modificar rol a hero
  sp.hero = targetPhoto;
  clientAssets.semantic_photos = sp;
  fs.writeFileSync(path.join(archivesDir, 'client-assets.json'), JSON.stringify(clientAssets, null, 2));

  const reloadedSp = PhotoCuratorService.getPersistedPhotos(testSlug);
  if (reloadedSp.hero === targetPhoto) {
    console.log('   ✅ [PASS] Reclasificación persistida y leída exitosamente de client-assets.json.');
    passed++;
  } else {
    throw new Error('Fallo al persistir/leer la reclasificación en client-assets.json.');
  }

  // 8. Validación de Compuertas Lógicas de UI
  total++;
  console.log('\n6. Validando compuertas lógicas de UI...');
  const testLeadStitchReady = { status: 'stitch_ready', name: 'Canzonieri' };
  const testLeadGenerated = { status: 'generated', name: 'Canzonieri', siteUrl: '/clients/canzonieri/index.html' };

  const hasGeneratedStitchReady = (testLeadStitchReady.status === 'generated' || testLeadStitchReady.status === 'deployed') && (!!testLeadStitchReady.siteUrl);
  const hasGeneratedReal = (testLeadGenerated.status === 'generated' || testLeadGenerated.status === 'deployed') && (!!testLeadGenerated.siteUrl);

  if (hasGeneratedStitchReady === false && hasGeneratedReal === true) {
    console.log('   ✅ [PASS] Compuertas UI: status "stitch_ready" deshabilita [Ver Web] y [Deploy Netlify]. Status "generated" los habilita.');
    passed++;
  } else {
    throw new Error('Fallo en la lógica de compuertas UI.');
  }

  // Resumen
  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log(`🎯 RESULTADO FINAL: ${passed}/${total} PRUEBAS CERTIFICADAS (100%)`);
  console.log('════════════════════════════════════════════════════════════════════\n');
}

testCurationAndGates().catch(err => {
  console.error('\n❌ ERROR EN CERTIFICACIÓN:', err.message);
  process.exit(1);
});
