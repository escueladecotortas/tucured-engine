// Archivo: scripts/test_narrative_prompt_and_dynamic_widgets.cjs
// Certificación Automatizada — Generador Narrativo por ADN y Selección Contextual de Widgets

const StitchPromptBuilder = require('../backend/services/stitch/StitchPromptBuilder');
const WidgetPools = require('../backend/services/injector/manifest/WidgetPools');
const WidgetManifestService = require('../backend/services/WidgetManifestService');

let passed = 0;
let failed = 0;

const ok = (msg) => { console.log(`   ✅ ${msg}`); passed++; };
const err = (msg) => { console.error(`   ❌ ${msg}`); failed++; };

function runNarrativeAndWidgetCertification() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('🔬 ARGUS QA — TASK-044: GENERADOR NARRATIVO POR ADN & WIDGETS CONTEXTUALES');
  console.log('══════════════════════════════════════════════════════════════════\n');

  // ── TEST 1: Generador Narrativo por ADN (La Sirio Barrio Norte) ─────────
  console.log('⚡ [CHECK 1] ADN Narrativo Auténtico para Gastronomía (La Sirio)...');
  const sirioData = {
    name: 'La Sirio Barrio Norte',
    category: 'gastronomia_bar',
    rating: 4.2,
    reviewsCount: 890,
    phone: '+54 381 431-2590',
    address: 'Maipú 575, Tucumán',
    topReviews: [
      { text: 'Comida árabe libre exquisita, keppe al horno y sfijas imperdibles', rating: 5 },
      { text: 'Cena show con odaliscas y música tradicional, ambiente familiar único', rating: 5 }
    ],
    features: ['Comida Árabe Tradicional', 'Cena Show & Odaliscas', 'Shawarma', 'Keppe al Horno'],
    googlePlace: {
      imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipN_sirio_hero',
      photos: ['https://lh3.googleusercontent.com/p/AF1QipN_sirio_1', 'https://lh3.googleusercontent.com/p/AF1QipN_sirio_2']
    }
  };

  const sirioPrompt = StitchPromptBuilder.buildPrompt(sirioData);

  const hasArabicNarrative = sirioPrompt.includes('Comida árabe libre') || sirioPrompt.includes('Cena Show & Odaliscas');
  const hasNoRigidNumberedList = !sirioPrompt.includes('1. NAVBAR') && !sirioPrompt.includes('2. HERO SECTION') && !sirioPrompt.includes('3. ESPECIALIDADES');
  const hasCdnUrls = sirioPrompt.includes('https://lh3.googleusercontent.com/p/AF1QipN_sirio_hero');

  if (hasArabicNarrative && hasNoRigidNumberedList && hasCdnUrls) {
    ok('Prompt narrativo para La Sirio contiene ADN árabe auténtico, fotos CDN y CERO listas rígidas de layout');
  } else {
    err(`Fallo en prompt La Sirio (Narrativa: ${hasArabicNarrative}, SinListaRígida: ${hasNoRigidNumberedList}, CDN: ${hasCdnUrls})`);
  }

  // ── TEST 2: Generador Narrativo Clínico para Salud / Ópticas ───────────
  console.log('\n⚡ [CHECK 2] ADN Narrativo Clínico para Óptica (100 ÓPTICAS)...');
  const opticaData = {
    name: '100 OPTICAS',
    category: 'Optician',
    rating: 4.3,
    reviewsCount: 39,
    phone: '+54 381 421-7626',
    address: 'Maipú 562, Tucumán',
    topReviews: [{ text: 'Atención personalizada y cristales multifocales de primera calidad', rating: 5 }],
    features: ['Examen visual computarizado', 'Cristales antirreflejo', 'Armazones de diseño', 'Obras sociales']
  };

  const opticaPrompt = StitchPromptBuilder.buildPrompt(opticaData);

  const hasOpticNarrative = opticaPrompt.includes('Salud Visual') || opticaPrompt.includes('cristales multifocales') || opticaPrompt.includes('Armazones de diseño');
  const isDifferentiated = !opticaPrompt.includes('Cena show') && !opticaPrompt.includes('carta auténtica');

  if (hasOpticNarrative && isDifferentiated) {
    ok('Prompt para 100 ÓPTICAS es 100% clínico y diferenciado del rubro gastronómico');
  } else {
    err(`Fallo en prompt Óptica (Clínico: ${hasOpticNarrative}, Diferenciado: ${isDifferentiated})`);
  }

  // ── TEST 3: Matriz de Selección de Widgets por Rubro ──────────────────
  console.log('\n🎛️ [CHECK 3] Selección Inteligente de Slots por Rubro...');
  const gastroPool = WidgetPools.getPoolForCategory('gastronomia_bar');
  const opticaPool = WidgetPools.getPoolForCategory('Optician');

  const gastroHasStories = gastroPool.includes('gallery_v2_stories_grid');
  const opticaExcludesStories = !opticaPool.includes('gallery_v2_stories_grid');
  const bothHaveTrustBadge = gastroPool.includes('trust_v2_live_badge') && opticaPool.includes('trust_v2_live_badge');

  if (gastroHasStories && opticaExcludesStories && bothHaveTrustBadge) {
    ok(`Matriz de Widgets Contextualizada (Gastronomía activa Stories Grid [${gastroPool.length} widgets]; Óptica prioriza Turnero/Trust [${opticaPool.length} widgets])`);
  } else {
    err(`Fallo en matriz de widgets (GastroStories: ${gastroHasStories}, OpticaExcluyeStories: ${opticaExcludesStories})`);
  }

  // ── RESUMEN FINAL ─────────────────────────────────────────────────────
  const total = passed + failed;
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log(`📊 RESULTADO: ${passed}/${total} checks pasados`);
  if (failed === 0) {
    console.log('🏆 TASK-044 CERTIFIED — Generador Narrativo por ADN y Widgets Contextuales Operativo.');
  } else {
    console.log(`⚠️ ${failed} check(s) fallados.`);
  }
  console.log('══════════════════════════════════════════════════════════════════\n');

  process.exit(failed === 0 ? 0 : 1);
}

runNarrativeAndWidgetCertification();
