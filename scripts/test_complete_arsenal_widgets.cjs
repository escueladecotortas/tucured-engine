// Archivo: scripts/test_complete_arsenal_widgets.js
// Certificación E2E de los 4 Widgets v2 del Arsenal Stitch 2026 — ARGUS QA

const fs = require('fs');
const path = require('path');

const WIDGETS_ROOT = path.resolve(__dirname, '../backend/stitch/widgets');
const VALIDATOR_PATH = path.resolve(__dirname, '../backend/services/injector/manifest/WidgetValidator');
const POOLS_PATH = path.resolve(__dirname, '../backend/services/injector/manifest/WidgetPools');

// Los 4 widgets v2 del Arsenal 2026 con sus rutas físicas y slots esperados
const ARSENAL_V2 = [
  {
    name: 'social_v2_marquee_reviews',
    file: 'social/social_v2_marquee_reviews.html',
    mustContain: ['marquee-track', 'REVIEW_1_TEXT', 'REVIEW_2_TEXT', 'RATING_DISPLAY'],
    slotId: 'slot-reviews',
    label: '📺 Reviews Marquee Cinético',
  },
  {
    name: 'contact_v2_action_dock',
    file: 'social/contact_v2_action_dock.html',
    mustContain: ['actionDock', 'WHATSAPP_CLEAN', 'PHONE_RAW', 'MAPS_URL'],
    slotId: 'slot-contact',
    label: '📱 Action Dock Mobile',
  },
  {
    name: 'gallery_v2_stories_grid',
    file: 'galleries/gallery_v2_stories_grid.html',
    mustContain: ['stories', 'PHOTO_1', 'CAPTION_1', 'INSTAGRAM_HANDLE', 'scale-105'],
    slotId: 'slot-stories',
    label: '🎞️ Stories Grid 4:5',
  },
  {
    name: 'trust_v2_live_badge',
    file: 'social/trust_v2_live_badge.html',
    mustContain: ['trustBadge', 'RATING', 'REVIEWS_COUNT', 'backdrop-blur-md', 'animate-ping'],
    slotId: 'slot-trust-badge',
    label: '⭐ Live Trust Badge',
  },
];

// Datos de prueba de Bar Irlanda
const TEST_PROSPECT = {
  name: 'Bar Irlanda',
  rating: 4.8,
  reviewsCount: 1247,
  phone: '5493812345678',
  whatsapp: '5493812345678',
  instagram: 'barirlanda_tuc',
  photos: ['assets/photo_1.jpg', 'assets/photo_2.jpg', 'assets/photo_3.jpg'],
  topReviews: [{ text: 'Excelente lugar!', author: 'Martín G.', rating: 5 }],
  features: ['dine-in', 'takeout', 'outdoor seating'],
};

let passed = 0;
let failed = 0;
const results = [];

console.log('\n══════════════════════════════════════════════════════');
console.log('🔬 ARGUS QA — Arsenal Stitch 2026 (4 Widgets v2)');
console.log('══════════════════════════════════════════════════════\n');

// CHECK 1: Existencia física de los 4 archivos
console.log('📁 CHECK 1: Existencia física de archivos HTML...');
for (const widget of ARSENAL_V2) {
  const filePath = path.join(WIDGETS_ROOT, widget.file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`   ✅ ${widget.label} → ${widget.file} (${Math.round(stats.size / 1024 * 10) / 10} KB)`);
    passed++;
  } else {
    console.error(`   ❌ MISSING: ${widget.file}`);
    failed++;
  }
}

// CHECK 2: Contenido semántico (tokens, clases, variables)
console.log('\n🧬 CHECK 2: Validación de contenido semántico...');
for (const widget of ARSENAL_V2) {
  const filePath = path.join(WIDGETS_ROOT, widget.file);
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').length;
  const missing = widget.mustContain.filter(token => !content.includes(token));

  if (missing.length === 0 && lines <= 180) {
    console.log(`   ✅ ${widget.label} → ${lines} líneas · Tokens OK`);
    passed++;
  } else {
    if (missing.length > 0) console.error(`   ❌ ${widget.name}: Tokens faltantes → ${missing.join(', ')}`);
    if (lines > 180) console.error(`   ⚠️  ${widget.name}: ${lines} líneas (excede Ley 200)`);
    failed++;
  }
}

// CHECK 3: Registro en WidgetPools (pool UNIVERSAL)
console.log('\n📦 CHECK 3: Registro en WidgetPools.UNIVERSAL...');
try {
  const { UNIVERSAL } = require(POOLS_PATH);
  for (const widget of ARSENAL_V2) {
    if (UNIVERSAL.includes(widget.name)) {
      console.log(`   ✅ ${widget.name} → en UNIVERSAL`);
      passed++;
    } else {
      console.error(`   ❌ ${widget.name}: NO está en UNIVERSAL`);
      failed++;
    }
  }
} catch (err) {
  console.error(`   ❌ Error cargando WidgetPools: ${err.message}`);
  ARSENAL_V2.forEach(() => failed++);
}

// CHECK 4: WidgetValidator — activación correcta por datos de prueba
console.log('\n🎛️  CHECK 4: Activación correcta en WidgetValidator...');
try {
  const WidgetValidator = require(VALIDATOR_PATH);
  const expectedActive = [
    'social_v2_marquee_reviews',
    'contact_v2_action_dock',
    'gallery_v2_stories_grid',
    'trust_v2_live_badge',
  ];
  for (const wName of expectedActive) {
    const active = WidgetValidator.hasDataFor(wName, TEST_PROSPECT);
    if (active) {
      console.log(`   ✅ ${wName}: ACTIVADO con datos de prueba`);
      passed++;
    } else {
      console.error(`   ❌ ${wName}: NO activado (check reglas de WidgetValidator)`);
      failed++;
    }
  }
} catch (err) {
  console.error(`   ❌ Error cargando WidgetValidator: ${err.message}`);
  ARSENAL_V2.forEach(() => failed++);
}

// RESUMEN FINAL
const total = passed + failed;
console.log('\n══════════════════════════════════════════════════════');
console.log(`📊 RESULTADO: ${passed}/${total} checks pasados`);
if (failed === 0) {
  console.log('🏆 ARSENAL 2026 CERTIFIED — 4/4 Widgets v2 operativos.');
} else {
  console.log(`⚠️  ${failed} check(s) fallados. Revisar output arriba.`);
}
console.log('══════════════════════════════════════════════════════\n');

process.exit(failed === 0 ? 0 : 1);
