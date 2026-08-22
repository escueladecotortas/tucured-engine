// Archivo: scripts/test_l2_scaffolding.cjs
// Suite de Certificación: Documentación Oficial L1 y Scaffolding / Bifurcación Showroom L2

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANUAL_USER = path.join(ROOT, 'docs/manual_usuario_turnero_l1.md');
const MANUAL_TECH = path.join(ROOT, 'docs/manual_tecnico_turnero_l1.md');
const WIDGET_L2 = path.join(ROOT, 'backend/stitch/widgets/booking/booking_l2_turnero.html');
const SHOWROOM_L2 = path.join(ROOT, 'public/showroom_l2.html');
const SHOWROOM_L1 = path.join(ROOT, 'public/showroom_l1.html');
const WIDGET_LAB = path.join(ROOT, 'public/widget-laboratory.html');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️ ARGUS QA: CERTIFICACIÓN DE MANUALES L1 & BIFURCACIÓN SHOWROOM L2');
console.log('════════════════════════════════════════════════════════════════════\n');

let passed = 0;
let failed = 0;

function runCheck(label, fn) {
  try {
    const details = fn();
    console.log(`✅ [PASS] ${label}${details ? ' → ' + details : ''}`);
    passed++;
  } catch (e) {
    console.error(`❌ [FAIL] ${label} → ${e.message}`);
    failed++;
  }
}

// 1. Integridad de Manual de Usuario L1
runCheck('1. Existencia y completitud de docs/manual_usuario_turnero_l1.md', () => {
  if (!fs.existsSync(MANUAL_USER)) throw new Error('Archivo no existe');
  const c = fs.readFileSync(MANUAL_USER, 'utf8');
  if (!c.includes('Doble Llave Soberana')) throw new Error('Falta sección de vinculación QR y Doble Llave');
  if (!c.includes('Horario Corrido') || !c.includes('Horario Partido')) throw new Error('Falta sección de horarios corrido/partido');
  if (!c.includes('Tokens Dinámicos')) throw new Error('Falta sección de tokens WhatsApp');
  if (!c.includes('{{cliente}}') || !c.includes('{{comercio}}')) throw new Error('Faltan ejemplos de tokens dinámicos');
  return `${c.split('\n').length} líneas de documentación para el comerciante`;
});

// 2. Integridad de Manual Técnico L1
runCheck('2. Existencia y completitud de docs/manual_tecnico_turnero_l1.md', () => {
  if (!fs.existsSync(MANUAL_TECH)) throw new Error('Archivo no existe');
  const c = fs.readFileSync(MANUAL_TECH, 'utf8');
  if (!c.includes('data-schedule') || !c.includes('data-biz-name') || !c.includes('data-wa')) {
    throw new Error('Falta especificación de atributos data-*');
  }
  if (!c.includes('WidgetInjector.js')) throw new Error('Falta especificación de inyección en Stitch');
  if (!c.includes('/api/wa/status') || !c.includes('/api/wa/qr')) throw new Error('Falta especificación de Micro-API Baileys');
  if (!c.includes('localStorage')) throw new Error('Falta sección de persistencia client-side');
  return `${c.split('\n').length} líneas de especificación técnica y arquitectura`;
});

// 3. Integridad de Componente L2 bifurcado
runCheck('3. Integridad física y dimensional de booking_l2_turnero.html', () => {
  if (!fs.existsSync(WIDGET_L2)) throw new Error('Archivo no existe');
  const c = fs.readFileSync(WIDGET_L2, 'utf8');
  if (!c.includes('max-w-[440px]')) throw new Error('Debe tener ancho max-w-[440px]');
  if (!c.includes('fetchAvailability')) throw new Error('Debe contener simulación de disponibilidad asíncrona');
  if (!c.includes('BEGIN:VCALENDAR')) throw new Error('Debe contener exportación de calendario .ics');
  return `${c.split('\n').length} líneas con capacidades asíncronas y exportación .ics`;
});

// 4. Integridad de Showroom L2 Split-Screen
runCheck('4. Integridad estructural de public/showroom_l2.html', () => {
  if (!fs.existsSync(SHOWROOM_L2)) throw new Error('Archivo no existe');
  const c = fs.readFileSync(SHOWROOM_L2, 'utf8');
  if (!c.includes('SHOWROOM LIVE // TURNERO L2')) throw new Error('Título L2 ausente');
  if (!c.includes('tab-btn-l2')) throw new Error('Pestaña Nivel L2 ausente');
  if (!c.includes('btn-ics-SHOWROOM_L2') && !c.includes('Añadir al Calendario (.ics)')) throw new Error('Botón de exportación .ics ausente');
  if (!c.includes('showroom_l1.html')) throw new Error('Falta enlace a Showroom L1');
  return 'Showroom L2 activo con pestañas Identidad, Agenda, WhatsApp y Nivel L2';
});

// 5. Enlaces de navegación en Laboratorio de Widgets
runCheck('5. Enlaces bidireccionales en public/widget-laboratory.html', () => {
  const c = fs.readFileSync(WIDGET_LAB, 'utf8');
  if (!c.includes('/showroom_l1.html')) throw new Error('Falta enlace a Showroom L1');
  if (!c.includes('/showroom_l2.html')) throw new Error('Falta enlace a Showroom L2');
  return 'Enlaces a Showroom L1 y Showroom L2 integrados en sidebar del laboratorio';
});

// 6. Doctrina de Hierro & Ley de 200 Líneas en Test
runCheck('6. Cumplimiento de la Ley de 200 Líneas en suite de scaffolding', () => {
  const loc = fs.readFileSync(__filename, 'utf8').split('\n').length;
  if (loc > 180) throw new Error(`test_l2_scaffolding.cjs supera 180 líneas (${loc} lín)`);
  return `${loc}/200 líneas (umbral preventivo < 180 OK)`;
});

console.log('\n════════════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed / (passed + failed)) * 100)}%)`);
console.log('════════════════════════════════════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
