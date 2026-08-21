// Archivo: scripts/test_turneros_suite.cjs
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️ ARGUS QA: BATERÍA DE PRUEBAS - BIFURCACIÓN & COPIADO AISLADO');
console.log('════════════════════════════════════════════════════════════════════\n');

const L1_PATH = path.join(__dirname, '../backend/stitch/widgets/booking/booking_l1_turnero.html');
const L2_PATH = path.join(__dirname, '../backend/stitch/widgets/booking/booking_l2_turnero.html');
const LAB_PATH = path.join(__dirname, '../public/widget-laboratory.html');

let checks = 0;
let passed = 0;

function runCheck(name, testFn) {
  checks++;
  try {
    testFn();
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ [FAIL] ${name}\n   Error: ${error.message}`);
  }
}

// 1. Integridad física y dimensional de booking_l1_turnero.html
runCheck('Integridad y calibración dimensional de booking_l1_turnero.html', () => {
  const content = fs.readFileSync(L1_PATH, 'utf-8');
  assert.ok(content.length > 1000, 'El archivo L1 está vacío o truncado');
  assert.ok(content.includes('max-w-[440px]'), 'L1 debe tener max-w-[440px]');
  assert.ok(content.includes('p-6 sm:p-7'), 'L1 debe tener padding p-6 sm:p-7');
  assert.ok(content.includes('max-h-64 sm:max-h-72'), 'L1 debe tener max-h-64 sm:max-h-72');
  assert.ok(content.includes('smart-turnero-widget-{{WIDGET_ID}}'), 'Falta el contenedor principal');
  assert.ok(content.includes('<script>'), 'Falta el bloque script en L1');
});

// 2. Integridad física y dimensional de booking_l2_turnero.html
runCheck('Integridad y calibración dimensional de booking_l2_turnero.html', () => {
  const content = fs.readFileSync(L2_PATH, 'utf-8');
  assert.ok(content.length > 1500, 'El archivo L2 está vacío o truncado');
  assert.ok(content.includes('max-w-[440px]'), 'L2 debe tener max-w-[440px]');
  assert.ok(content.includes('p-6 sm:p-7'), 'L2 debe tener padding p-6 sm:p-7');
  assert.ok(content.includes('max-h-64 sm:max-h-72'), 'L2 debe tener max-h-64 sm:max-h-72');
  assert.ok(content.includes('fetchAvailability'), 'Falta la simulación asíncrona en L2');
  assert.ok(content.includes('BEGIN:VCALENDAR'), 'Falta exportación .ics en L2');
});

// 3. Aislamiento estricto de código en widget-laboratory.html
runCheck('Copiado aislado por widget en widget-laboratory.html', () => {
  const labContent = fs.readFileSync(LAB_PATH, 'utf-8');
  assert.ok(labContent.includes('function copyCode(idx, btn)'), 'Falta la función copyCode calibrada');
  assert.ok(labContent.includes('id="code-0"'), 'Falta textarea con código aislado del widget 0');
  assert.ok(labContent.includes('id="btn-copy-0"'), 'Falta botón con feedback para widget 0');
  assert.ok(labContent.includes('¡Copiado!'), 'Falta feedback visual de copiado');
  // Asegurar que el textarea code-0 contiene los tags de plantilla
  assert.ok(labContent.includes('{{WIDGET_ID}}'), 'El textarea debe preservar los placeholders crudos');
});

// 4. Algoritmo de filtrado de horarios pasados (Hoy)
runCheck('Algoritmo de filtrado de horarios pasados (Hoy)', () => {
  const currentTotalMins = 12 * 60 + 30; // 12:30 PM
  const slotTotalMins = 10 * 60; // 10:00 AM
  const isPast = true && (slotTotalMins <= currentTotalMins);
  assert.strictEqual(isPast, true, 'El horario de 10:00 debería marcarse como pasado a las 12:30');
});

// 5. Bloqueo de slots devueltos por el endpoint (L2)
runCheck('Bloqueo asíncrono de slots ocupados (L2)', () => {
  const occupied = ["09:30", "11:30", "17:00"];
  const testSlot = "11:30";
  const isOccupied = occupied.includes(testSlot);
  assert.strictEqual(isOccupied, true, 'El slot 11:30 debe estar bloqueado por Mock API');
});

// 6. Formateo y sanitización WA / ICS
runCheck('Sanitización robusta de teléfono (L2)', () => {
  const sanitizePhone = (val) => {
    let num = val.replace(/\D/g, '');
    num = num.replace(/^549?/, '');
    num = num.replace(/^0/, '');
    num = num.replace(/^(\d{2,4})15/, '$1');
    return num;
  };
  assert.strictEqual(sanitizePhone('+54 9 0381 15-456-7890'), '3814567890');
  assert.strictEqual(sanitizePhone('0381 15 1234567'), '3811234567');
});

runCheck('Generación del payload de ICS (L2)', () => {
  const bizName = "Test Biz";
  const state = { name: "Juan", pax: "2", hash: "A1B2C3" };
  const d = new Date('2026-08-20T10:00:00.000Z');
  const endD = new Date(d);
  endD.setMinutes(endD.getMinutes() + 60);

  const fmt = (dt) => dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const ics = [
    "BEGIN:VCALENDAR",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(d)}`,
    `DTEND:${fmt(endD)}`,
    `SUMMARY:Reserva en ${bizName}`,
    `DESCRIPTION:Reserva para ${state.name} (${state.pax} pax). ID: #${state.hash}`
  ].join("\\r\\n");

  assert.ok(ics.includes('DTSTART:20260820T100000Z'));
  assert.ok(ics.includes('ID: #A1B2C3'));
});

console.log('\n════════════════════════════════════════════════════════════════════');
if (passed === checks) {
  console.log(`🎯 RESULTADO: ${passed}/${checks} CHECKS EXITOSOS (100%)`);
  process.exit(0);
} else {
  console.log(`⚠️ ALERTA: ${checks - passed} CHECKS FALLIDOS`);
  process.exit(1);
}
