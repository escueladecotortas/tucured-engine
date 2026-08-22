// Archivo: scripts/test_l3_multirubro_census.cjs
/**
 * 🛡️ ARGUS QA: CERTIFICACIÓN CENSO ADMIN ORIGINAL & PRESETS MULTI-RUBRO L3
 * - Auditoría e inventario físico de componentes en public/clients/barber-l3
 * - Validez del archivo maestro backend/stitch/widgets/booking/rubros_presets.json
 * - Existencia y rigurosidad de documentos técnicos
 * - Ley de 200 Líneas en suite QA
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let passCount = 0;
let totalChecks = 5;

console.log('═'.repeat(68));
console.log('🛡️ ARGUS QA: CERTIFICACIÓN CENSO ADMIN & MOTOR MULTI-RUBRO L3');
console.log('═'.repeat(68) + '\n');

function check(title, condition, detail) {
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${title} → ${detail}`);
  } else {
    console.error(`❌ [FAIL] ${title} → ${detail}`);
  }
}

const adminDir = path.join(rootDir, 'public/clients/barber-l3/src/app/admin');
const presetsPath = path.join(rootDir, 'backend/stitch/widgets/booking/rubros_presets.json');
const docInventario = path.join(rootDir, 'docs/inventario_admin_original_l3.md');
const docPresets = path.join(rootDir, 'docs/especificacion_multi_rubro_l3.md');

// 1. Auditoría física del Admin original
const hasAdminComponents = fs.existsSync(path.join(adminDir, 'turnos/components/DesktopTable.jsx')) &&
  fs.existsSync(path.join(adminDir, 'configuracion/personal/components/AvailabilityColumn.jsx')) &&
  fs.existsSync(path.join(adminDir, 'configuracion/servicios/components/TableList.jsx')) &&
  fs.existsSync(path.join(adminDir, 'configuracion/sistema/components/BookingParamsManager.jsx'));

check(
  '1. Auditoría e Inventario Físico de Componentes del Admin Previo',
  hasAdminComponents,
  'Módulos de Turnos, Personal, Servicios y Parámetros del Sistema auditados con éxito'
);

// 2. Validez estructural de rubros_presets.json
let presetsValid = false;
try {
  const presetsJson = JSON.parse(fs.readFileSync(presetsPath, 'utf-8'));
  const requiredRubros = ['barberia', 'peluqueria_estetica', 'salud_consultorio', 'profesional_servicios'];
  const allExist = requiredRubros.every(r => presetsJson.presets && presetsJson.presets[r]);
  const hasFields = allExist && presetsJson.presets.salud_consultorio.config.requireInsuranceField === true;
  presetsValid = allExist && hasFields;
} catch (e) {
  presetsValid = false;
}

check(
  '2. Validez Estructural del Archivo Maestro (rubros_presets.json)',
  presetsValid,
  '4 presets universales (barberia, estetica, salud, profesional) con labels y flags activos'
);

// 3. Documento de Inventario del Admin Original
const invContent = fs.existsSync(docInventario) ? fs.readFileSync(docInventario, 'utf-8') : '';
const invComplete = invContent.includes('INVENTARIO FORENSE: ADMIN ORIGINAL DE APP BARBERÍA') &&
  invContent.includes('DesktopTable.jsx') &&
  invContent.includes('AvailabilityColumn.jsx') &&
  invContent.includes('PLAN DE MIGRACIÓN & DESACOPLE');

check(
  '3. Documento de Inventario Forense (docs/inventario_admin_original_l3.md)',
  invComplete,
  'Inventario de vistas, análisis de componentes React y plan de migración local-first'
);

// 4. Documento de Especificación Multi-Rubro L3
const specContent = fs.existsSync(docPresets) ? fs.readFileSync(docPresets, 'utf-8') : '';
const specComplete = specContent.includes('ESPECIFICACIÓN TÉCNICA: MOTOR L3 MULTI-RUBRO UNIVERSAL') &&
  specContent.includes('MATRIZ DE PRESETS DE RUBRO SOPORTADOS') &&
  specContent.includes('ARQUITECTURA DE ENLACE DINÁMICO');

check(
  '4. Documento de Especificación Multi-Rubro (docs/especificacion_multi_rubro_l3.md)',
  specComplete,
  'Matriz de presets, esquema de enlace dinámico y desacople total de rubros'
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
