// Archivo: scripts/test_archetype_prompt_and_postprocessor.cjs
// Certificación Automatizada — Prompts por Arquetipo, Post-Procesador de Logo y Reclasificación en Bóveda

const http = require('http');
const StitchPromptBuilder = require('../backend/services/stitch/StitchPromptBuilder');
const StitchPostProcessor = require('../backend/services/stitch/StitchPostProcessor');

let passed = 0;
let failed = 0;

const ok = (msg) => { console.log(`   ✅ ${msg}`); passed++; };
const err = (msg) => { console.error(`   ❌ ${msg}`); failed++; };

function fetchHttp(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postBody = postData ? (typeof postData === 'string' ? postData : JSON.stringify(postData)) : null;
    const reqOpts = {
      hostname: u.hostname,
      port: u.port || 5006,
      path: u.pathname + u.search,
      method: options.method || (postData ? 'POST' : 'GET'),
      headers: {
        ...(options.headers || {}),
        ...(postBody ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postBody)
        } : {})
      }
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
    if (postBody) req.write(postBody);
    req.end();
  });
}

async function runArchetypeAndPostProcessorCertification() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('🔬 ARGUS QA — TASK-042: ARQUETIPOS DE PROMPT, LOGO REAL & RECLASIFICACIÓN');
  console.log('══════════════════════════════════════════════════════════════════\n');

  // ── TEST 1: Ensamblador de Prompts por Arquetipo ───────────────────────
  console.log('⚡ [CHECK 1] Ensamblador de Prompts Dinámico por Arquetipo...');
  const gastronomiaData = {
    name: 'La Sirio Barrio Norte',
    category: 'gastronomia_bar',
    rating: 4.2,
    reviewsCount: 890,
    phone: '+54 381 431-2590',
    address: 'Maipú 575, Tucumán',
    topReviews: [{ text: 'Exquisitos platos árabes y cálido lugar', rating: 5 }],
    features: ['buen café', 'platos vegetarianos', 'servicio a la mesa']
  };

  const opticaData = {
    name: '100 OPTICAS',
    category: 'Optician',
    rating: 4.3,
    reviewsCount: 39,
    phone: '+54 381 421-7626',
    address: 'Maipú 562, Tucumán',
    topReviews: [{ text: 'Excelente atención y cristales de calidad', rating: 5 }],
    features: ['tarjetas de crédito', 'atención rápida']
  };

  const promptGastro = StitchPromptBuilder.buildPrompt(gastronomiaData);
  const promptOptica = StitchPromptBuilder.buildPrompt(opticaData);

  const isGastroOk = promptGastro.includes('GASTRONÓMICO') && promptGastro.includes('carta auténtica') && promptGastro.includes('<div id="nexus-booking_v1_turnero"></div>');
  const isOpticaOk = promptOptica.includes('SALUD, ÓPTICA') && promptOptica.includes('salud visual') && promptOptica.includes('marcos y cristales');

  if (isGastroOk && isOpticaOk) {
    ok('Prompts generados diferenciados con precisión según Arquetipo Semántico (Gastronomía vs Óptica/Salud)');
  } else {
    err(`Fallo en diferenciación de prompts por arquetipo (Gastro: ${isGastroOk}, Óptica: ${isOpticaOk})`);
  }

  // ── TEST 2: Post-Procesador de HTML (Logo Real + Purga de Slots) ───────
  console.log('\n🖼️ [CHECK 2] Pipeline Post-Procesador de HTML y Reemplazo de Logo Real...');
  const mockStitchHtml = `
  <!DOCTYPE html>
  <html>
    <head><title>Test Page</title></head>
    <body class="bg-black text-white">
      <nav><div id="brand-logo"><svg>dummy-logo</svg></div></nav>
      <div class="hero"><h1>Bienvenido</h1></div>
      [gallery_v2_stories_grid]
      <div id="nexus-booking_v1_turnero"></div>
      [contact_v2_action_dock]
      <footer><p>Footer content</p></footer>
    </body>
  </html>`;

  const processedHtml = StitchPostProcessor.process(mockStitchHtml, gastronomiaData, null);

  const hasLogoImg = processedHtml.includes('/nexus_archives/tucu-red/clients/la-sirio-barrio-norte/assets/logo.jpg');
  const hasNoTextSlots = !processedHtml.includes('[gallery_v2_stories_grid]') && !processedHtml.includes('[contact_v2_action_dock]');
  const hasInjectedBooking = processedHtml.includes('Reservá tu Mesa') || processedHtml.includes('confirmar');

  if (hasLogoImg && hasNoTextSlots && hasInjectedBooking) {
    ok('Post-procesador insertó el logo real, inyectó widgets en slots y purgó texto plano residual');
  } else {
    err(`Fallo en post-procesador (Logo: ${hasLogoImg}, SinTextoPlano: ${hasNoTextSlots}, WidgetInyectado: ${hasInjectedBooking})`);
  }

  // ── TEST 3: Endpoint de Reclasificación Manual en Bóveda ───────────────
  console.log('\n🏷️ [CHECK 3] Endpoint PATCH /api/nexus/assets/reclassify...');
  try {
    const reclassifyPayload = {
      slug: 'la-sirio-barrio-norte',
      photoUrl: '/nexus_archives/tucu-red/clients/la-sirio-barrio-norte/assets/product_1.jpg',
      newRole: 'showcase'
    };

    const res = await fetchHttp('http://127.0.0.1:5006/api/nexus/assets/reclassify', {
      method: 'PATCH'
    }, reclassifyPayload);

    if (res.status === 200 && res.data?.success && res.data?.newRole === 'showcase') {
      ok(`Endpoint /api/nexus/assets/reclassify respondió HTTP 200 OK — Rol "${res.data.newRole}" asignado exitosamente`);
    } else {
      err(`Fallo en /api/nexus/assets/reclassify (HTTP ${res.status}): ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    err(`Error de red en endpoint reclassify: ${e.message}`);
  }

  // ── RESUMEN FINAL ─────────────────────────────────────────────────────
  const total = passed + failed;
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log(`📊 RESULTADO: ${passed}/${total} checks pasados`);
  if (failed === 0) {
    console.log('🏆 TASK-042 CERTIFIED — Ensamblador por Arquetipos, Logo Real y Reclasificación en Bóveda Operativo.');
  } else {
    console.log(`⚠️ ${failed} check(s) fallados.`);
  }
  console.log('══════════════════════════════════════════════════════════════════\n');

  process.exit(failed === 0 ? 0 : 1);
}

runArchetypeAndPostProcessorCertification();
