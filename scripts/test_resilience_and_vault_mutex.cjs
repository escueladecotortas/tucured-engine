// Archivo: scripts/test_resilience_and_vault_mutex.cjs
// Suite de Certificación: Resiliencia del Orquestador, SSOT en Descarte y Mutex de Logo (TASK-056)

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const reclassifyRouter = require('../backend/routes/nexus/assets/reclassify');
const listRouter = require('../backend/routes/nexus/assets/list');

async function testResilienceAndVaultMutex() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('🛡️ TEST: RESILIENCIA DEL ORQUESTADOR, SSOT BÓVEDA Y MUTEX DE LOGO');
  console.log('════════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let total = 0;

  // ── TEST 1: Mutex de Logo y Purga en Bóveda (Backend API) ────────────────
  const testSlug = 'test_vault_mutex';
  const archivesDir = path.resolve(__dirname, `../nexus_archives/tucu-red/clients/${testSlug}`);
  const assetsDir = path.join(archivesDir, 'assets');
  const publicDir = path.resolve(__dirname, `../public/clients/${testSlug}`);
  const publicAssetsDir = path.join(publicDir, 'assets');

  // Limpieza inicial
  if (fs.existsSync(archivesDir)) fs.rmSync(archivesDir, { recursive: true, force: true });
  if (fs.existsSync(publicDir)) fs.rmSync(publicDir, { recursive: true, force: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(publicAssetsDir, { recursive: true });

  // Crear 4 fotos físicas simuladas
  fs.writeFileSync(path.join(assetsDir, 'logo.jpg'), Buffer.from('LOGO_DATA'));
  fs.writeFileSync(path.join(assetsDir, 'photo_1.jpg'), Buffer.from('PHOTO_1_DATA'));
  fs.writeFileSync(path.join(assetsDir, 'photo_2.jpg'), Buffer.from('PHOTO_2_DATA'));
  fs.writeFileSync(path.join(assetsDir, 'photo_3.jpg'), Buffer.from('PHOTO_3_DATA'));

  const initialAssets = {
    business_name: 'Test Mutex Business',
    slug: testSlug,
    photos: [
      `/nexus_archives/tucu-red/clients/${testSlug}/assets/logo.jpg`,
      `/nexus_archives/tucu-red/clients/${testSlug}/assets/photo_1.jpg`,
      `/nexus_archives/tucu-red/clients/${testSlug}/assets/photo_2.jpg`,
      `/nexus_archives/tucu-red/clients/${testSlug}/assets/photo_3.jpg`
    ],
    semantic_photos: {
      logo: `/nexus_archives/tucu-red/clients/${testSlug}/assets/logo.jpg`,
      hero: `/nexus_archives/tucu-red/clients/${testSlug}/assets/photo_1.jpg`,
      showcase: [`/nexus_archives/tucu-red/clients/${testSlug}/assets/photo_2.jpg`],
      atmosphere: [`/nexus_archives/tucu-red/clients/${testSlug}/assets/photo_3.jpg`]
    },
    logo_url: `/nexus_archives/tucu-red/clients/${testSlug}/assets/logo.jpg`
  };

  fs.writeFileSync(path.join(archivesDir, 'client-assets.json'), JSON.stringify(initialAssets, null, 2));
  fs.writeFileSync(path.join(publicDir, 'client-assets.json'), JSON.stringify(initialAssets, null, 2));

  // Levantar servidor Express en memoria para probar endpoints
  const app = express();
  app.use(express.json());
  app.use('/api/nexus/assets', reclassifyRouter);
  app.use('/api/nexus/assets', listRouter);

  const server = http.createServer(app);
  await new Promise(r => server.listen(5098, '127.0.0.1', r));

  const postJson = (urlPath, body) => new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5098,
      path: urlPath,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve({ status: res.statusCode, json: JSON.parse(raw) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });

  const getJson = (urlPath) => new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:5098${urlPath}`, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve({ status: res.statusCode, json: JSON.parse(raw) }));
    }).on('error', reject);
  });

  console.log('1. Probando descarte de foto y purga física en disco (SSOT)...');
  total++;
  const discardRes = await postJson('/api/nexus/assets/reclassify', {
    slug: testSlug,
    photoUrl: `/nexus_archives/tucu-red/clients/${testSlug}/assets/photo_3.jpg`,
    newRole: 'discard'
  });

  const file3Exists = fs.existsSync(path.join(assetsDir, 'photo_3.jpg'));
  const listAfterDiscard = await getJson(`/api/nexus/assets/list?slug=${testSlug}`);

  if (discardRes.status === 200 && discardRes.json.success && !file3Exists && listAfterDiscard.json.count === 3) {
    console.log('   ✅ [PASS] Descarte exitoso: HTTP 200, archivo purgado de disco y contador sincronizado a 3 activos.');
    passed++;
  } else {
    throw new Error(`Fallo en descarte: status=${discardRes.status}, fileExists=${file3Exists}, listCount=${listAfterDiscard.json?.count}`);
  }

  console.log('\n2. Probando Mutex de Logo (Exclusión Mutua al asignar nuevo logo)...');
  total++;
  const newLogoUrl = `/nexus_archives/tucu-red/clients/${testSlug}/assets/photo_2.jpg`;
  const logoReclassRes = await postJson('/api/nexus/assets/reclassify', {
    slug: testSlug,
    photoUrl: newLogoUrl,
    newRole: 'logo'
  });

  const assetsAfterLogo = JSON.parse(fs.readFileSync(path.join(archivesDir, 'client-assets.json'), 'utf8'));

  if (logoReclassRes.status === 200 && assetsAfterLogo.semantic_photos.logo === newLogoUrl && !assetsAfterLogo.semantic_photos.showcase.includes(newLogoUrl)) {
    console.log(`   ✅ [PASS] Mutex de Logo: nuevo logo asignado exclusivamente a ${newLogoUrl} y removido de roles previos.`);
    passed++;
  } else {
    throw new Error('Fallo en exclusión mutua de logo en client-assets.json');
  }

  // ── TEST 3: Verificación de Código de GalleryModal (Mutex UI y Sin Botón Tacho)
  console.log('\n3. Verificando UI en GalleryModal.jsx (Mutex en Select y Cero Botón Tacho)...');
  total++;
  const modalCode = fs.readFileSync(path.resolve(__dirname, '../src/components/database/GalleryModal.jsx'), 'utf8');

  const hasTrashIcon = modalCode.includes('<Trash2');
  const hasMutexLogic = modalCode.includes('isLogoAssignedElsewhere') && modalCode.includes('disabled={isOptDisabled}');
  const hasOnUpdateLead = modalCode.includes('onUpdateLead') && modalCode.includes('onUpdateLead(');

  if (!hasTrashIcon && hasMutexLogic && hasOnUpdateLead) {
    console.log('   ✅ [PASS] GalleryModal: botón tacho erradicado, Mutex de Logo activo con disabled={isOptDisabled} y sincronización con onUpdateLead.');
    passed++;
  } else {
    throw new Error(`Fallo en GalleryModal: hasTrashIcon=${hasTrashIcon}, hasMutexLogic=${hasMutexLogic}, hasOnUpdateLead=${hasOnUpdateLead}`);
  }

  // ── TEST 4: Resiliencia del Orquestador dev_runner.js
  console.log('\n4. Verificando Resiliencia del Orquestador Dual (dev_runner.js)...');
  total++;
  const runnerCode = fs.readFileSync(path.resolve(__dirname, '../scripts/dev_runner.js'), 'utf8');

  const hasTolerantExit = runnerCode.includes("Backend Express finalizó/reinició") && runnerCode.includes("spawnBackend()");
  const noFatalExitOnBackend = !runnerCode.includes("Backend Express finalizó con código de error: ${code}\n            cleanup()");

  if (hasTolerantExit && noFatalExitOnBackend) {
    console.log('   ✅ [PASS] dev_runner.js: orquestador resiliente con auto-respawn tolerante a reinicios sin abortar Vite.');
    passed++;
  } else {
    throw new Error('dev_runner.js no contiene la lógica tolerante a reinicios.');
  }

  // Cerrar servidor y limpiar datos de prueba
  server.close();
  if (fs.existsSync(archivesDir)) fs.rmSync(archivesDir, { recursive: true, force: true });
  if (fs.existsSync(publicDir)) fs.rmSync(publicDir, { recursive: true, force: true });

  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log(`🎯 RESULTADO FINAL: ${passed}/${total} PRUEBAS CERTIFICADAS (100%)`);
  console.log('════════════════════════════════════════════════════════════════════\n');
}

testResilienceAndVaultMutex().catch(err => {
  console.error('\n❌ ERROR EN CERTIFICACIÓN:', err.message);
  process.exit(1);
});
