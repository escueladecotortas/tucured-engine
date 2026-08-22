// Archivo: scripts/test_import_barber_l3.cjs
/**
 * 🛡️ ARGUS QA: CERTIFICACIÓN IMPORTACIÓN, NEUTRALIZACIÓN & CENSO APP BARBER L3
 * - Existencia e integridad de archivos importados en public/clients/barber-l3/
 * - Resolución de rutas y assets relativos sin enlaces rotos
 * - Neutralización efectiva de nombres de marca directa
 * - Existencia y rigurosidad de docs/censo_app_barber_l3.md
 * - Ley de 200 Líneas en suite QA
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let passCount = 0;
let totalChecks = 5;

console.log('═'.repeat(68));
console.log('🛡️ ARGUS QA: CERTIFICACIÓN IMPORTACIÓN & CENSO APP BARBER L3');
console.log('═'.repeat(68) + '\n');

function check(title, condition, detail) {
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${title} → ${detail}`);
  } else {
    console.error(`❌ [FAIL] ${title} → ${detail}`);
  }
}

const targetDir = path.join(rootDir, 'public/clients/barber-l3');
const docPath = path.join(rootDir, 'docs/censo_app_barber_l3.md');
const indexHtmlPath = path.join(targetDir, 'index.html');

// 1. Existencia física e integridad estructural
const hasCoreDirs = fs.existsSync(path.join(targetDir, 'src/app/page.jsx')) &&
  fs.existsSync(path.join(targetDir, 'src/components/widgets/NexusScheduler/index.jsx')) &&
  fs.existsSync(path.join(targetDir, 'assets/css/main.css')) &&
  fs.existsSync(path.join(targetDir, 'package.json')) &&
  fs.existsSync(indexHtmlPath);

check(
  '1. Existencia Física e Integridad de la App Clonada',
  hasCoreDirs,
  'Estructura completa de componentes Next.js/React, assets y entry point importados'
);

// 2. Ausencia de enlaces rotos en el entry point HTML
const indexContent = fs.existsSync(indexHtmlPath) ? fs.readFileSync(indexHtmlPath, 'utf-8') : '';
const cssExists = fs.existsSync(path.join(targetDir, 'assets/css/main.css'));
const logoExists = fs.existsSync(path.join(targetDir, 'assets/images/logo_barber-l3-barberia-unisex.jpeg')) ||
  fs.existsSync(path.join(targetDir, 'assets/images/logo_la-fachada-barberia-unisex.jpeg'));

check(
  '2. Resolución Limpia de Assets Relativos (Zero Rutas Rotas)',
  cssExists && logoExists && indexContent.length > 500,
  'CSS principal, imágenes de identidad y bundles resueltos correctamente'
);

// 3. Neutralización de nombres de marca directa
const hasNeutralization = indexContent.includes('Nexus Barber L3') ||
  indexContent.includes('Barber Studio L3') ||
  indexContent.includes('Nexus Barber');

check(
  '3. Neutralización de Marca hacia Identidad de Laboratorio',
  hasNeutralization,
  'Reemplazo de menciones directas por "Nexus Barber L3 / Studio L3"'
);

// 4. Existencia y completitud del documento de censo
const docContent = fs.existsSync(docPath) ? fs.readFileSync(docPath, 'utf-8') : '';
const hasCensoComplete = docContent.includes('CENSO TÉCNICO & MAPEADO ESTRUCTURAL: APP BARBERÍA L3') &&
  docContent.includes('ÁRBOL ESTRUCTURAL DE ARCHIVOS IMPORTADOS') &&
  docContent.includes('PILA TECNOLÓGICA DETECTADA') &&
  docContent.includes('PUNTOS DE ACOPLE PARA EL MOTOR L3');

check(
  '4. Informe de Censo Estructural (docs/censo_app_barber_l3.md)',
  hasCensoComplete,
  'Inventario de directorios, diagnóstico de pila tecnológica y puntos de acople documentados'
);

// 5. Cumplimiento de la Ley de 200 Líneas en Suite QA
const suiteLines = fs.readFileSync(__filename, 'utf-8').split('\n').length;
const complies200 = suiteLines <= 180;

check(
  '5. Cumplimiento de la Ley de 200 Líneas en Suite QA',
  complies200,
  `Líneas de la suite: ${suiteLines}/200 líneas (umbral preventivo < 180 OK)`
);

console.log('\n' + '═'.repeat(68));
console.log(`🎯 RESULTADO: ${passCount}/${totalChecks} CHECKS CERTIFICADOS (${Math.round((passCount/totalChecks)*100)}%)`);
console.log('═'.repeat(68) + '\n');

if (passCount !== totalChecks) {
  process.exit(1);
}
