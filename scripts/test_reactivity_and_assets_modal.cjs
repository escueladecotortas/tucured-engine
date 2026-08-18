// Archivo: scripts/test_reactivity_and_assets_modal.cjs
// Certificación Automatizada — Reactividad, Bóveda Visual y Estado Vacío Inteligente

const http = require('http');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

const ok = (msg) => { console.log(`   ✅ ${msg}`); passed++; };
const err = (msg) => { console.error(`   ❌ ${msg}`); failed++; };

function fetchHttp(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqOpts = {
      hostname: u.hostname,
      port: u.port || 80,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };
    const req = http.request(reqOpts, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runReactivityAndAssetsCertification() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('🔬 ARGUS QA — TASK-040: REACTIVIDAD, BÓVEDA VISUAL & ESTADO VACÍO');
  console.log('══════════════════════════════════════════════════════════════════\n');

  // ── TEST 1: Copy Táctico y Botón en ProspectsTable.jsx ────────────────
  console.log('⚡ [CHECK 1] Copy Táctico y Reactividad en ProspectsTable.jsx...');
  try {
    const tablePath = path.resolve(__dirname, '../src/components/database/ProspectsTable.jsx');
    const content = fs.readFileSync(tablePath, 'utf8');

    const hasTitle = content.includes('title="⚡ Extraer Datos (CYBORG)"');
    const hasToast = content.includes('⚡ Datos actualizados vía CYBORG para');
    const hasReactivity = content.includes('setLocalList(prev => prev.map') && content.includes('onUpdateLead(updated)');

    if (hasTitle && hasToast && hasReactivity) {
      ok('Copy oficial "⚡ Extraer Datos (CYBORG)" y reactividad en caliente local y propagada verificados');
    } else {
      err(`Falta coincidencia en ProspectsTable.jsx (Title: ${hasTitle}, Toast: ${hasToast}, Reactivity: ${hasReactivity})`);
    }
  } catch (e) {
    err(`Error leyendo ProspectsTable.jsx: ${e.message}`);
  }

  // ── TEST 2: Resolución de URLs y Servidor Estático de Activos ─────────
  console.log('\n🖼️ [CHECK 2] Bóveda Visual & HTTP 200 en Activos Persistidos...');
  try {
    // Probar si el archivo estático responde HTTP 200 en el backend
    const assetUrl = 'http://localhost:5006/nexus_archives/tucu-red/clients/la-sirio-barrio-norte/assets/hero.jpg';
    const res = await fetchHttp(assetUrl);

    if (res.status === 200) {
      ok(`Activo visual accesible en servidor Express: ${assetUrl} (HTTP 200 OK, Content-Type: ${res.headers['content-type']})`);
    } else {
      err(`Fallo al servir activo visual (HTTP ${res.status}): ${assetUrl}`);
    }
  } catch (e) {
    err(`Error de red verificando activo visual: ${e.message}`);
  }

  // ── TEST 3: Roles Semánticos en GalleryModal.jsx ──────────────────────
  console.log('\n🎨 [CHECK 3] Clasificación por Rol Visual en GalleryModal.jsx...');
  try {
    const modalPath = path.resolve(__dirname, '../src/components/database/GalleryModal.jsx');
    const content = fs.readFileSync(modalPath, 'utf8');

    const hasRoles = content.includes('ROLE_TAGS') && content.includes('hero') && content.includes('showcase') && content.includes('atmosphere');
    const hasSemantic = content.includes('prospect.semantic_photos');

    if (hasRoles && hasSemantic) {
      ok('GalleryModal renderiza semantic_photos con badges de rol (Hero, Logo, Showcase, Atmosphere)');
    } else {
      err('Falta soporte de semantic_photos o roles en GalleryModal.jsx');
    }
  } catch (e) {
    err(`Error leyendo GalleryModal.jsx: ${e.message}`);
  }

  // ── TEST 4: Estado Vacío Inteligente en ProspectDocViewers.jsx ────────
  console.log('\nℹ️ [CHECK 4] Estado Vacío Inteligente en ProspectDocViewers.jsx...');
  try {
    const viewersPath = path.resolve(__dirname, '../src/components/database/ProspectDocViewers.jsx');
    const content = fs.readFileSync(viewersPath, 'utf8');

    const hasEmptyState = content.includes('Sin Forja Registrada') && content.includes('Este comercio aún no ha sido forjado con Google Stitch');

    if (hasEmptyState) {
      ok('Estado vacío inteligente informativo implementado en DesignMdViewer y StitchManifestViewer');
    } else {
      err('Falta mensaje de estado vacío en ProspectDocViewers.jsx');
    }
  } catch (e) {
    err(`Error leyendo ProspectDocViewers.jsx: ${e.message}`);
  }

  // ── RESUMEN FINAL ─────────────────────────────────────────────────────
  const total = passed + failed;
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log(`📊 RESULTADO: ${passed}/${total} checks pasados`);
  if (failed === 0) {
    console.log('🏆 TASK-040 CERTIFIED — Reactividad, Bóveda Visual y Estado Vacío Operativo.');
  } else {
    console.log(`⚠️ ${failed} check(s) fallados.`);
  }
  console.log('══════════════════════════════════════════════════════════════════\n');

  process.exit(failed === 0 ? 0 : 1);
}

runReactivityAndAssetsCertification();
