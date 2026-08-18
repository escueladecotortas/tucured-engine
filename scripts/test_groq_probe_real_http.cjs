// Archivo: scripts/test_groq_probe_real_http.cjs
// Certificación Automatizada — Test HTTP Real contra Backend Local (Probe Groq & Multicloud)

const http = require('http');

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

async function runRealHttpCertification() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('🔬 ARGUS QA — TASK-038: CERTIFICACIÓN HTTP REAL PROBE GROQ & APIS');
  console.log('══════════════════════════════════════════════════════════════════\n');

  // ── TEST 1: POST /api/nexus/health/test-api (Groq Probe) ───────────────
  console.log('⚡ [CHECK 1] Petición HTTP Real POST /api/nexus/health/test-api {"provider":"groq"}...');
  try {
    const res = await fetchHttp('http://localhost:5006/api/nexus/health/test-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { provider: 'groq' });

    if (res.status === 200 && res.data?.success && res.data?.status === 'connected') {
      ok(`Probe Groq respondió HTTP 200 OK — Status: "${res.data.status}", Modelo: "${res.data.model}", Latencia: ${res.data.latencyMs}ms`);
    } else {
      err(`Probe Groq falló (HTTP ${res.status}): ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    err(`Error de red contra backend: ${e.message}`);
  }

  // ── TEST 2: GET /api/nexus/health/apis (All Connected) ─────────────────
  console.log('\n🌐 [CHECK 2] Petición HTTP Real GET /api/nexus/health/apis (Smoke Test)...');
  try {
    const res = await fetchHttp('http://localhost:5006/api/nexus/health/apis');
    if (res.status === 200 && res.data?.allConnected === true) {
      ok(`Todas las 6 APIs conectadas (allConnected: true)`);
      const provs = res.data.providers || {};
      Object.entries(provs).forEach(([k, v]) => {
        console.log(`      • ${k.toUpperCase()}: ${v.status} (${v.latencyMs}ms)`);
      });
    } else {
      err(`Fallo en health check general: ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    err(`Error en health check: ${e.message}`);
  }

  // ── RESUMEN FINAL ─────────────────────────────────────────────────────
  const total = passed + failed;
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log(`📊 RESULTADO: ${passed}/${total} checks pasados`);
  if (failed === 0) {
    console.log('🏆 TASK-038 CERTIFIED — Saneamiento Dinámico y Probe HTTP 200 Operativo.');
  } else {
    console.log(`⚠️ ${failed} check(s) fallados.`);
  }
  console.log('══════════════════════════════════════════════════════════════════\n');

  process.exit(failed === 0 ? 0 : 1);
}

runRealHttpCertification();
