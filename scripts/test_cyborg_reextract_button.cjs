// Archivo: scripts/test_cyborg_reextract_button.cjs
// Certificación Automatizada — Re-Extracción Táctica CYBORG y Telemetría Vitalis

const http = require('http');
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

const ok = (msg) => { console.log(`   ✅ ${msg}`); passed++; };
const err = (msg) => { console.error(`   ❌ ${msg}`); failed++; };

function fetchHttp(url, options = {}, postData = null) {
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
        let parsed = null;
        try { parsed = JSON.parse(body); } catch (e) { parsed = body; }
        resolve({ status: res.statusCode, data: parsed });
      });
    });
    req.on('error', reject);
    if (postData) req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    req.end();
  });
}

async function runCyborgButtonCertification() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('🔬 ARGUS QA — TASK-039: RE-EXTRACCIÓN CYBORG & TELEMETRÍA VITALIS');
  console.log('══════════════════════════════════════════════════════════════════\n');

  // ── TEST 1: Verificación de Código en ProspectsTable.jsx ──────────────
  console.log('🖥️ [CHECK 1] Botón Táctico [⚡ Re-extraer CYBORG] en ProspectsTable.jsx...');
  try {
    const tablePath = path.resolve(__dirname, '../src/components/database/ProspectsTable.jsx');
    const content = fs.readFileSync(tablePath, 'utf8');

    const hasButton = content.includes('handleCyborgReExtract') && content.includes('Re-ejecutar Ingesta Profunda CYBORG');
    const hasStyle = content.includes('bg-cyan-600') && content.includes('border-cyan-500/30');

    if (hasButton && hasStyle) {
      ok('Botón [⚡ Re-extraer CYBORG] implementado con estilo cyan y tooltip correcto');
    } else {
      err('Falta implementación del botón o estilo en ProspectsTable.jsx');
    }
  } catch (e) {
    err(`Error leyendo ProspectsTable.jsx: ${e.message}`);
  }

  // ── TEST 2: Endpoint POST /api/leads/enrich con lead existente ────────
  console.log('\n⚡ [CHECK 2] Disparo de Re-Extracción CYBORG (Gate 1 Aislado)...');
  try {
    const payload = {
      lead: {
        name: 'La Sirio Barrio Norte',
        slug: 'la-sirio-barrio-norte',
        instagram: 'lasirioresto',
        address: 'Maipú 575, T4000 San Miguel de Tucumán, Tucumán, Argentina',
        phone: '4312590',
        city: 'San Miguel de Tucumán',
        category: 'gastronomia_bar'
      }
    };

    const res = await fetchHttp('http://localhost:5006/api/leads/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, payload);

    if (res.status === 200 && res.data?.success) {
      const status = res.data.status || res.data.lead?.status;
      if (status === 'stitch_ready') {
        ok(`Re-Extracción retornó HTTP 200 con status "${status}" (Gate 1 aislado, sin auto-forja)`);
      } else {
        err(`Status inesperado: ${status}`);
      }
      
      const kpis = res.data.kpis || {};
      console.log(`      • Reviews Válidas: ${kpis.reviewsValidas || 0}`);
      console.log(`      • Fotos Indexadas: ${kpis.fotosIndexadas || 0}`);
      console.log(`      • Features Detectados: ${kpis.featuresDetectados || 0}`);
    } else {
      err(`Fallo en endpoint /api/leads/enrich (HTTP ${res.status}): ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    err(`Error en llamada a endpoint: ${e.message}`);
  }

  // ── TEST 3: Telemetría de Salud Vitalis Doctor ────────────────────────
  console.log('\n🩺 [CHECK 3] Sincronización de Telemetría en Vitalis Doctor...');
  try {
    const res = await fetchHttp('http://localhost:5006/api/vitalis/scan');
    if (res.status === 200 && res.data?.success && res.data?.data?.status === 'HEALTHY') {
      ok(`Vitalis scan respondió HEALTHY (Score: ${res.data.data.score}/100, Memoria: ${res.data.data.memoryRssMb}MB)`);
    } else {
      err(`Fallo en Vitalis scan: ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    err(`Error en Vitalis scan: ${e.message}`);
  }

  // ── RESUMEN FINAL ─────────────────────────────────────────────────────
  const total = passed + failed;
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log(`📊 RESULTADO: ${passed}/${total} checks pasados`);
  if (failed === 0) {
    console.log('🏆 TASK-039 CERTIFIED — Re-Extracción CYBORG y Telemetría Vitalis Operativa.');
  } else {
    console.log(`⚠️ ${failed} check(s) fallados.`);
  }
  console.log('══════════════════════════════════════════════════════════════════\n');

  process.exit(failed === 0 ? 0 : 1);
}

runCyborgButtonCertification();
