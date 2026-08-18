// Archivo: scripts/test_three_gates_and_identity.cjs
// Certificación ARGUS QA: 3 Gates, 7 Slots, Identidad y Purga de Mocks

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;

const ok  = (msg) => { console.log(`   ✅ ${msg}`); passed++; };
const err = (msg) => { console.error(`   ❌ ${msg}`); failed++; };

console.log('\n══════════════════════════════════════════════════════════');
console.log('🔬 ARGUS QA — TASK-035: 3 Gates + 7 Slots + Identidad');
console.log('══════════════════════════════════════════════════════════\n');

// ── CHECK 1: Purga de Mocks en projects.js ──────────────────────────────────
console.log('🧹 CHECK 1: Purga de mocks en src/data/projects.js...');
try {
  const projectsPath = path.join(ROOT, 'src/data/projects.js');
  const content = fs.readFileSync(projectsPath, 'utf8');

  // Los mocks deben existir pero con source:'mock'
  const adoreMock  = content.includes("'adore-tu-esencia'") && content.includes("source: 'mock'");
  const amoraMock  = content.includes("'amora-nails'")      && content.includes("source: 'mock'");
  const systemMock = content.includes("'system'")           && content.includes("source: 'mock'");

  if (adoreMock && amoraMock && systemMock) {
    ok('Adoré, Amora y Nexus System marcados con source:"mock"');
  } else {
    err(`Mocks no marcados correctamente. adoré=${adoreMock}, amora=${amoraMock}, system=${systemMock}`);
  }

  // Verificar que useClientPortfolio filtra source:'mock'
  const hookPath = path.join(ROOT, 'src/hooks/useClientPortfolio.js');
  const hook = fs.readFileSync(hookPath, 'utf8');
  if (hook.includes("source !== 'mock'")) {
    ok('useClientPortfolio.js filtra source:"mock" correctamente');
  } else {
    err('useClientPortfolio.js NO filtra source:"mock"');
  }
} catch (e) {
  err(`Error leyendo projects.js: ${e.message}`);
}

// ── CHECK 2: Gate 1 — Ingesta aislada sin auto-forja ───────────────────────
console.log('\n⚡ CHECK 2: Gate 1 — Ingesta aislada (sin auto-forja)...');
try {
  const actionsPath = path.join(ROOT, 'src/components/tabs/neural-factory/useNeuralActions.js');
  const content = fs.readFileSync(actionsPath, 'utf8');

  if (content.includes("status: 'stitch_ready'") && !content.includes('Auto-Forja') && content.includes('kpis:')) {
    ok('Gate 1: termina en stitch_ready + KPIs, SIN auto-forja');
  } else {
    err('Gate 1 aún tiene auto-forja o falta KPIs. Revisar useNeuralActions.js');
  }

  if (content.includes('tiempoTotal') && content.includes('reviewsValidas') && content.includes('fotosIndexadas')) {
    ok('KPIs de ingesta: tiempoTotal, reviewsValidas, fotosIndexadas presentes');
  } else {
    err('Faltan campos de KPIs en Gate 1');
  }
} catch (e) {
  err(`Error leyendo useNeuralActions.js: ${e.message}`);
}

// ── CHECK 3: Gate 3 — Deploy Manual en GenerationResult ────────────────────
console.log('\n🚀 CHECK 3: Gate 3 — Deploy manual en GenerationResult.jsx...');
try {
  const resultPath = path.join(ROOT, 'src/components/leads/modal/GenerationResult.jsx');
  const content = fs.readFileSync(resultPath, 'utf8');

  if (content.includes('Desplegar a Netlify') && content.includes('/api/forge/deploy') && content.includes('Último Despliegue')) {
    ok('Gate 3: botón Deploy Manual + endpoint /api/forge/deploy + timestamp');
  } else {
    err('Gate 3 incompleto: falta botón deploy, endpoint o timestamp');
  }
} catch (e) {
  err(`Error leyendo GenerationResult.jsx: ${e.message}`);
}

// ── CHECK 4: WidgetInjector — 7 slots canónicos ─────────────────────────────
console.log('\n🔌 CHECK 4: WidgetInjector — 7 slots canónicos...');
const REQUIRED_SLOTS = [
  'booking_v1_turnero',
  'gallery_v2_stories_grid',
  'gallery_v1_reel',
  'social_v2_marquee_reviews',
  'trust_v2_live_badge',
  'contact_v2_action_dock',
  'footer_v1_map',
];
try {
  const injectorPath = path.join(ROOT, 'backend/services/injector/WidgetInjector.js');
  const content = fs.readFileSync(injectorPath, 'utf8');
  for (const slot of REQUIRED_SLOTS) {
    if (content.includes(slot)) {
      ok(`Slot "${slot}" presente en WidgetInjector`);
    } else {
      err(`Slot "${slot}" AUSENTE en WidgetInjector`);
    }
  }
  // Purga de placeholders
  if (content.includes('PLACEHOLDER_REGEX')) {
    ok('Purga de placeholders [widget_name] implementada');
  } else {
    err('Purga de placeholders ausente');
  }
  // Contextualización por rubro
  if (content.includes('resolveBookingTokens') && content.includes('optica')) {
    ok('Contextualización de booking por rubro (salud/óptica vs gastronomía)');
  } else {
    err('Falta contextualización de booking por rubro');
  }
} catch (e) {
  err(`Error leyendo WidgetInjector.js: ${e.message}`);
}

// ── CHECK 5: Identidad — Visores DESIGN.md y stitch-manifest ───────────────
console.log('\n🎨 CHECK 5: Identidad — Visores DESIGN.md y stitch-manifest...');
try {
  const assetPath = path.join(ROOT, 'src/components/tabs/identity/IdentityAssetSection.jsx');
  const content = fs.readFileSync(assetPath, 'utf8');

  if (content.includes('design-md') && content.includes('stitch-manifest') && content.includes('nexus/assets')) {
    ok('IdentityAssetSection conecta /api/nexus/assets/design-md y /api/nexus/assets/stitch-manifest');
  } else {
    err('IdentityAssetSection no conecta a los endpoints de disco real');
  }
  if (content.includes('hexMatches') && content.includes('backgroundColor')) {
    ok('Renderizador de paleta cromática con cajas de color interactivas implementado');
  } else {
    err('Falta renderizador de paleta cromática en IdentityAssetSection');
  }
  if (content.includes('fontFamily') && content.includes('uniqueFonts')) {
    ok('Renderizador de tipografías implementado');
  } else {
    err('Falta renderizador de tipografías');
  }
} catch (e) {
  err(`Error leyendo IdentityAssetSection.jsx: ${e.message}`);
}

// ── CHECK 6: Endpoint /api/nexus/assets/design-md existe ───────────────────
console.log('\n🌐 CHECK 6: Endpoint /api/nexus/assets/design-md en backend...');
try {
  const assetsRoutePath = path.join(ROOT, 'backend/routes/nexus/assets.js');
  const content = fs.readFileSync(assetsRoutePath, 'utf8');
  if (content.includes('/design-md') && content.includes('DESIGN.md')) {
    ok('Endpoint GET /api/nexus/assets/design-md presente en backend/routes/nexus/assets.js');
  } else {
    err('Endpoint /design-md no encontrado en assets.js');
  }
} catch (e) {
  err(`Error leyendo assets.js: ${e.message}`);
}

// ── RESUMEN ─────────────────────────────────────────────────────────────────
const total = passed + failed;
console.log('\n══════════════════════════════════════════════════════════');
console.log(`📊 RESULTADO: ${passed}/${total} checks pasados`);
if (failed === 0) {
  console.log('🏆 TASK-035 CERTIFIED — 3 Gates + 7 Slots + Identidad operativos.');
} else {
  console.log(`⚠️  ${failed} check(s) fallados. Revisar output arriba.`);
}
console.log('══════════════════════════════════════════════════════════\n');

process.exit(failed === 0 ? 0 : 1);
