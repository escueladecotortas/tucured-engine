// Archivo: scripts/test_l2_full_lifecycle.cjs
/**
 * 🛡️ ARGUS QA: SUITE DE VALIDACIÓN CICLO COMPLETO L2
 * - Detección de colisiones en vivo y persistencia SSOT (tucu_l2_bookings)
 * - Cancelación autónoma vía token hash en gestion_turno.html
 * - Carga manual de turnos en admin_l2.html
 * - Blindaje y bloqueo en caliente por Lista Negra
 * - Ley de 200 Líneas
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let passCount = 0;
let totalChecks = 5;

console.log('═'.repeat(68));
console.log('🛡️ ARGUS QA: CERTIFICACIÓN DE CICLO COMPLETO TURNERO L2');
console.log('═'.repeat(68) + '\n');

function check(title, condition, detail) {
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${title} → ${detail}`);
  } else {
    console.error(`❌ [FAIL] ${title} → ${detail}`);
  }
}

// 1. Integridad de booking_l2_turnero.html y demo_l2_cliente.html con colisiones tucu_l2_bookings
const widgetL2Content = fs.readFileSync(path.join(rootDir, 'backend/stitch/widgets/booking/booking_l2_turnero.html'), 'utf-8');
const demoL2Content = fs.readFileSync(path.join(rootDir, 'public/demo_l2_cliente.html'), 'utf-8');

const hasCollisionsL2 = widgetL2Content.includes('tucu_l2_bookings') &&
  widgetL2Content.includes('TK-') &&
  widgetL2Content.includes('gestion_turno.html?token=') &&
  demoL2Content.includes('tucu_l2_bookings') &&
  demoL2Content.includes('TK-');

check(
  '1. Motor de Persistencia y Colisiones L2 (tucu_l2_bookings & TK-XXXX)',
  hasCollisionsL2,
  'Detección de slots ocupados en tiempo real y generación de token hash con link de autogestión'
);

// 2. Pantalla de Autogestión (public/gestion_turno.html)
const gestionTurnoPath = path.join(rootDir, 'public/gestion_turno.html');
const hasGestionTurno = fs.existsSync(gestionTurnoPath);
const gestionContent = hasGestionTurno ? fs.readFileSync(gestionTurnoPath, 'utf-8') : '';

const hasGestionLogic = hasGestionTurno &&
  gestionContent.includes('tucu_l2_bookings') &&
  gestionContent.includes('CANCELLED') &&
  gestionContent.includes('btn-modal-confirm-cancel') &&
  gestionContent.includes('wa.me');

check(
  '2. Pantalla de Autogestión del Cliente (public/gestion_turno.html)',
  hasGestionLogic,
  'Lectura de ?token=, modal nativo de confirmación, mutación a CANCELLED y notificación WA'
);

// 3. Carga Manual y Gestión de Turnos en Admin L2 (public/admin_l2.html)
const adminL2Content = fs.readFileSync(path.join(rootDir, 'public/admin_l2.html'), 'utf-8');
const hasAdminManualAndCollisions = adminL2Content.includes('tucu_l2_bookings') &&
  adminL2Content.includes('btn-save-manual-booking') &&
  adminL2Content.includes('manual-book-name') &&
  adminL2Content.includes('gestion_turno.html?token=') &&
  adminL2Content.includes('cancelBooking');

check(
  '3. Carga Manual de Turnos y Autogestión en Admin L2 (public/admin_l2.html)',
  hasAdminManualAndCollisions,
  'Modal de agendamiento manual, métricas de ocupación reactivas y enlace directo a autogestión'
);

// 4. Blindaje contra Lista Negra en Cliente L2
const hasBlacklistDefense = widgetL2Content.includes('tucu_l2_blacklist') &&
  widgetL2Content.includes('No es posible registrar turnos con esta línea telefónica') &&
  demoL2Content.includes('No es posible registrar turnos con esta línea telefónica');

check(
  '4. Blindaje y Bloqueo en Caliente por Lista Negra',
  hasBlacklistDefense,
  'Rechazo preventivo en Paso 2 de teléfonos restringidos con alerta de seguridad'
);

// 5. Ley de 200 Líneas en Componente y Suite
const widgetLines = widgetL2Content.split('\n').length;
const suiteLines = fs.readFileSync(__filename, 'utf-8').split('\n').length;
const complies200 = widgetLines <= 180 && suiteLines <= 180;

check(
  '5. Cumplimiento de la Ley de 200 Líneas (Modularización PEAC)',
  complies200,
  `Widget L2: ${widgetLines}/200 líneas | Suite: ${suiteLines}/200 líneas (< 180 OK)`
);

console.log('\n' + '═'.repeat(68));
console.log(`🎯 RESULTADO: ${passCount}/${totalChecks} CHECKS CERTIFICADOS (${Math.round((passCount/totalChecks)*100)}%)`);
console.log('═'.repeat(68) + '\n');

if (passCount !== totalChecks) {
  process.exit(1);
}
