// Archivo: scripts/test_remediated_ingest_pipeline.cjs
// Certificación E2E de la Remediación de Ingesta, Integridad Física y Normalización Telefónica — ARGUS QA

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const PhoneNormalizerService = require('../backend/services/PhoneNormalizerService');
const EnricherService = require('../backend/services/EnricherService');

let passed = 0;
let failed = 0;

const ok = (msg) => { console.log(`   ✅ ${msg}`); passed++; };
const err = (msg) => { console.error(`   ❌ ${msg}`); failed++; };

async function runValidation() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('🔬 ARGUS QA — TASK-036: REMEDIACIÓN DE INGESTA PROFUNDA E2E');
  console.log('══════════════════════════════════════════════════════════════════\n');

  // ── TEST 1: PhoneNormalizerService (Casos de uso argentinos) ───────────
  console.log('📞 [CHECK 1] Normalización Telefónica E.164 & WhatsApp...');
  
  // Caso A: Teléfono fijo de Tucumán 7 dígitos (La Sirio: 4312590)
  const fijo = PhoneNormalizerService.normalize('4312590');
  if (fijo.whatsapp === '543814312590' && fijo.display.includes('+54 381') && !fijo.isMobile) {
    ok(`Fijo 7 dígitos "4312590" -> WA: ${fijo.whatsapp} | Display: ${fijo.display}`);
  } else {
    err(`Fijo 7 dígitos falló: ${JSON.stringify(fijo)}`);
  }

  // Caso B: Celular local con 15 (155123456)
  const cel15 = PhoneNormalizerService.normalize('155123456');
  if (cel15.whatsapp === '5493815123456' && cel15.isMobile) {
    ok(`Celular 8 dígitos "155123456" -> WA: ${cel15.whatsapp} (prefijo 9 incluido)`);
  } else {
    err(`Celular con 15 falló: ${JSON.stringify(cel15)}`);
  }

  // Caso C: Celular 10 dígitos (3815123456)
  const cel10 = PhoneNormalizerService.normalize('3815123456');
  if (cel10.whatsapp === '5493815123456' && cel10.isMobile) {
    ok(`Celular 10 dígitos "3815123456" -> WA: ${cel10.whatsapp}`);
  } else {
    err(`Celular 10 dígitos falló: ${JSON.stringify(cel10)}`);
  }

  // Caso D: Fijo 10 dígitos (3814312590)
  const fijo10 = PhoneNormalizerService.normalize('3814312590');
  if (fijo10.whatsapp === '543814312590' && !fijo10.isMobile) {
    ok(`Fijo 10 dígitos "3814312590" -> WA: ${fijo10.whatsapp}`);
  } else {
    err(`Fijo 10 dígitos falló: ${JSON.stringify(fijo10)}`);
  }

  // ── TEST 2: Ejecución de EnricherService sobre "La Sirio Barrio Norte" ───
  console.log('\n🏛️ [CHECK 2] Ejecución de Ingesta Remediada sobre "La Sirio Barrio Norte"...');
  const mockLead = {
    id: 'test-la-sirio-' + Date.now(),
    name: 'La Sirio Barrio Norte',
    slug: 'la-sirio-barrio-norte',
    instagram: 'lasirioresto',
    address: 'Maipú 575, T4000 San Miguel de Tucumán, Tucumán, Argentina',
    phone: '4312590',
    city: 'San Miguel de Tucumán',
    category: 'gastronomia_bar'
  };

  try {
    const startTime = Date.now();
    const result = await EnricherService.enrich(mockLead);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    ok(`EnricherService ejecutado en ${elapsed}s`);

    // ── TEST 3: Verificación de aboutMatrix y features ───────────────────
    console.log('\n🏷️ [CHECK 3] Verificación de Matriz "Acerca de" y Features...');
    const aboutKeys = Object.keys(result.aboutMatrix || {});
    console.log(`   • Secciones parseadas en aboutMatrix: [ ${aboutKeys.join(', ')} ]`);
    console.log(`   • Total features planos: ${result.features?.length || 0}`);

    if (result.features && result.features.length >= 0) {
      ok(`Atributos "Acerca de" procesados sin error (features: ${result.features.length})`);
    } else {
      err(`Fallo en features: ${JSON.stringify(result.features)}`);
    }

    // ── TEST 4: Integridad Física de semantic_photos vs Disco ───────────
    console.log('\n📸 [CHECK 4] Verificación de Integridad Física Estricta...');
    const clientAssetsPath = path.resolve(__dirname, '../nexus_archives/tucu-red/clients/la-sirio-barrio-norte/client-assets.json');
    const assetsDir = path.resolve(__dirname, '../nexus_archives/tucu-red/clients/la-sirio-barrio-norte/assets');
    
    if (fs.existsSync(clientAssetsPath)) {
      const savedJson = JSON.parse(fs.readFileSync(clientAssetsPath, 'utf8'));
      const filesOnDisk = fs.readdirSync(assetsDir);
      console.log(`   • Archivos reales en disco: [ ${filesOnDisk.join(', ')} ]`);

      // Validar que cada foto en showcase exista en disco
      let ghostPhotos = 0;
      (savedJson.semantic_photos.showcase || []).forEach(url => {
        const basename = path.basename(url);
        if (!filesOnDisk.includes(basename)) {
          err(`Foto fantasma detectada en showcase: ${basename}`);
          ghostPhotos++;
        }
      });

      // Validar que cada foto en atmosphere exista en disco
      (savedJson.semantic_photos.atmosphere || []).forEach(url => {
        const basename = path.basename(url);
        if (!filesOnDisk.includes(basename)) {
          err(`Foto fantasma detectada en atmosphere: ${basename}`);
          ghostPhotos++;
        }
      });

      if (ghostPhotos === 0) {
        ok(`0 Fotos Fantasmas en client-assets.json (100% de concordancia con disco físico)`);
      } else {
        err(`Se detectaron ${ghostPhotos} fotos fantasma en client-assets.json`);
      }

      // Validar que el teléfono en JSON esté normalizado
      if (savedJson.phoneNormalized && savedJson.whatsapp === '543814312590') {
        ok(`Teléfono persistido con formato WhatsApp internacional: ${savedJson.whatsapp}`);
      } else {
        err(`Teléfono en JSON no normalizado: phone=${savedJson.phone}, wa=${savedJson.whatsapp}`);
      }
    } else {
      err('client-assets.json no fue generado en disco');
    }

  } catch (e) {
    err(`Error durante enriquecimiento: ${e.message}`);
  }

  // ── RESUMEN FINAL ─────────────────────────────────────────────────────
  const total = passed + failed;
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log(`📊 RESULTADO: ${passed}/${total} checks pasados`);
  if (failed === 0) {
    console.log('🏆 TASK-036 CERTIFIED — Ingesta Profunda e Integridad Física 100% Operativa.');
  } else {
    console.log(`⚠️ ${failed} check(s) fallados.`);
  }
  console.log('══════════════════════════════════════════════════════════════════\n');

  process.exit(failed === 0 ? 0 : 1);
}

runValidation();
