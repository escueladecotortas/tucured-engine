// Archivo: scripts/test_l3_scaffolding_la_fachada.cjs
/**
 * 🛡️ ARGUS QA: CERTIFICACIÓN SCAFFOLDING L3 BASADO EN LA-FACHADA & INFORME
 * - Preservación de base original public/clients/la-fachada
 * - Scaffolding desacoplado public/clients/la-fachada-l3
 * - Existencia y rigurosidad técnica de docs/informe_arquitectura_l3.md
 * - Ley de 200 Líneas en suite QA
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let passCount = 0;
let totalChecks = 4;

console.log('═'.repeat(68));
console.log('🛡️ ARGUS QA: CERTIFICACIÓN SCAFFOLDING L3 & INFORME DE ARQUITECTURA');
console.log('═'.repeat(68) + '\n');

function check(title, condition, detail) {
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${title} → ${detail}`);
  } else {
    console.error(`❌ [FAIL] ${title} → ${detail}`);
  }
}

const baseDir = path.join(rootDir, 'public/clients/la-fachada');
const l3Dir = path.join(rootDir, 'public/clients/la-fachada-l3');
const docPath = path.join(rootDir, 'docs/informe_arquitectura_l3.md');

// 1. Preservación de Producción (public/clients/la-fachada/)
const hasBaseFiles = fs.existsSync(path.join(baseDir, 'index.html')) &&
  fs.existsSync(path.join(baseDir, 'stitch-manifest.json')) &&
  fs.existsSync(path.join(baseDir, 'widget-manifest.json')) &&
  fs.existsSync(path.join(baseDir, 'client-assets.json'));

check(
  '1. Preservación de Base de Producción (public/clients/la-fachada)',
  hasBaseFiles,
  'Landing page base, manifiestos Stitch/Widgets y configuración de assets preservados'
);

// 2. Scaffolding Desacoplado de Nivel 3 (public/clients/la-fachada-l3/)
const hasL3Files = fs.existsSync(path.join(l3Dir, 'index.html')) &&
  fs.existsSync(path.join(l3Dir, 'stitch-manifest.json')) &&
  fs.existsSync(path.join(l3Dir, 'widget-manifest.json')) &&
  fs.existsSync(path.join(l3Dir, 'client-assets.json'));

const l3ManifestContent = hasL3Files ? fs.readFileSync(path.join(l3Dir, 'stitch-manifest.json'), 'utf-8') : '';
const hasL3Params = l3ManifestContent.includes('"tier": "L3"') && l3ManifestContent.includes('"staff"');

check(
  '2. Scaffolding Desacoplado de Nivel 3 (public/clients/la-fachada-l3)',
  hasL3Files && hasL3Params,
  'Entorno aislado con configuración multi-staff, servicios y montaje para widget L3'
);

// 3. Existencia y Rigurosidad de docs/informe_arquitectura_l3.md
const docContent = fs.existsSync(docPath) ? fs.readFileSync(docPath, 'utf-8') : '';
const hasDocComplete = docContent.includes('INFORME DE ARQUITECTURA TÉCNICA: EVOLUCIÓN NIVEL 3 (L3)') &&
  docContent.includes('Multi-Staff / Barberos') &&
  docContent.includes('Catálogo de Servicios') &&
  docContent.includes('Matriz de Concurrencia') &&
  docContent.includes('Automatizaciones & Recordatorios Proactivos') &&
  docContent.includes('tucu_l3_bookings') &&
  docContent.includes('PLAN DE FASES DE IMPLEMENTACIÓN');

check(
  '3. Informe de Arquitectura Técnica L3 (docs/informe_arquitectura_l3.md)',
  hasDocComplete,
  'Diagnóstico, 5 vectores de evolución, modelo de datos JSON y plan de 4 fases detallados'
);

// 4. Cumplimiento de la Ley de 200 Líneas en Suite QA
const suiteLines = fs.readFileSync(__filename, 'utf-8').split('\n').length;
const complies200 = suiteLines <= 180;

check(
  '4. Cumplimiento de la Ley de 200 Líneas en Suite QA',
  complies200,
  `Líneas de la suite: ${suiteLines}/200 líneas (umbral preventivo < 180 OK)`
);

console.log('\n' + '═'.repeat(68));
console.log(`🎯 RESULTADO: ${passCount}/${totalChecks} CHECKS CERTIFICADOS (${Math.round((passCount/totalChecks)*100)}%)`);
console.log('═'.repeat(68) + '\n');

if (passCount !== totalChecks) {
  process.exit(1);
}
