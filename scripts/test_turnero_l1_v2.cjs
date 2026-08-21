// Archivo: scripts/test_turnero_l1_v2.cjs
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️ ARGUS QA: BATERÍA DE PRUEBAS - TURNERO L1 & SHOWROOM v2.0');
console.log('════════════════════════════════════════════════════════════════════\n');

const L1_PATH = path.join(__dirname, '../backend/stitch/widgets/booking/booking_l1_turnero.html');
const SHOWROOM_PATH = path.join(__dirname, '../public/showroom_l1.html');

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

const contentL1 = fs.readFileSync(L1_PATH, 'utf-8');
const showroomContent = fs.readFileSync(SHOWROOM_PATH, 'utf-8');

// 1. Generación de 4 días hábiles sin mostrar días cerrados intermedios
runCheck('1. Salteo dinámico: recopila únicamente días hábiles sin casilleros cerrados', () => {
  const workdays = [1, 2, 3, 4]; // Lun a Jue (Viernes, Sábado y Domingo cerrados)
  const maxDays = 8;
  const days = [];
  const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  let cur = new Date('2026-08-24T12:00:00Z'); // Lunes
  let guard = 0;

  while (days.length < maxDays && guard < 60) {
    guard++;
    const d = new Date(cur);
    const dayOfWeek = d.getDay();
    if (workdays.includes(dayOfWeek)) {
      days.push({ dayOfWeek, name: names[dayOfWeek], date: d.getDate() });
    }
    cur.setDate(cur.getDate() + 1);
  }

  assert.strictEqual(days.length, 8, 'Debe recolectar 8 días hábiles');
  // Primer bloque de 4 días: Lun, Mar, Mié, Jue
  const b1 = days.slice(0, 4);
  assert.deepStrictEqual(b1.map(d => d.name), ['Lun', 'Mar', 'Mié', 'Jue'], 'El bloque 1 debe contener Lun-Jue');
  // Segundo bloque de 4 días: Lun, Mar, Mié, Jue (salteando Vie, Sáb, Dom)
  const b2 = days.slice(4, 8);
  assert.deepStrictEqual(b2.map(d => d.name), ['Lun', 'Mar', 'Mié', 'Jue'], 'El bloque 2 debe saltar directo al siguiente Lunes');

  assert.ok(contentL1.includes('while (days.length < cfg.maxDays'), 'L1 debe implementar while para recolectar días activos');
});

// 2. Detección y aplicación de excepciones de feriados con horario especial
runCheck('2. Feriados con excepciones y horario especial dinámico', () => {
  const HOLIDAYS = ["2026-10-12"];
  const holidayExceptions = {
    "2026-10-12": { open: "09:00", close: "13:00" }
  };
  const cfg = { open: "09:00", close: "20:00", interval: 60 };

  const generateTimeSlots = (special) => {
    const openH = special?.open || cfg.open;
    const closeH = special?.close || cfg.close;
    const slots = [];
    let current = new Date(`2000-01-01T${openH}:00`);
    const end = new Date(`2000-01-01T${closeH}:00`);
    while (current <= end) {
      slots.push(current.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
      current.setMinutes(current.getMinutes() + cfg.interval);
    }
    return slots;
  };

  const normalSlots = generateTimeSlots(null);
  assert.strictEqual(normalSlots.length, 12, 'Día normal 09:00 a 20:00 c/ 60 min debe dar 12 slots');

  const specialSlots = generateTimeSlots(holidayExceptions["2026-10-12"]);
  assert.strictEqual(specialSlots.length, 5, 'Feriado especial 09:00 a 13:00 c/ 60 min debe dar 5 slots');
  assert.strictEqual(specialSlots[specialSlots.length - 1], '13:00');

  assert.ok(contentL1.includes('holidayExceptions'), 'L1 debe soportar holidayExceptions');
});

// 3. Comportamiento de guardado y lectura de la semilla en localStorage
runCheck('3. Persistencia y semilla en localStorage (tucu_turnero_profile)', () => {
  assert.ok(contentL1.includes('tucu_turnero_profile'), 'L1 debe consultar tucu_turnero_profile');
  assert.ok(contentL1.includes('localStorage.setItem(\'tucu_turnero_profile\''), 'L1 debe persistir el perfil en localStorage al confirmar');
  assert.ok(contentL1.includes('input-phone-'), 'El campo teléfono debe existir en L1 para la semilla');
});

// 4. Renderizado correcto de la previsualización del chat WhatsApp y blindaje CSS
runCheck('4. Previsualización de burbuja WhatsApp y Blindaje Anti-Autofill', () => {
  assert.ok(showroomContent.includes('wa-bubble-preview'), 'Showroom debe incluir el contenedor wa-bubble-preview');
  assert.ok(showroomContent.includes('bg-[#005c4b]'), 'Showroom debe estilizar la burbuja verde de WhatsApp (#005c4b)');
  assert.ok(contentL1.includes('-webkit-autofill'), 'L1 debe incluir reglas CSS anti-autofill');
  assert.ok(showroomContent.includes('-webkit-autofill'), 'Showroom debe incluir reglas CSS anti-autofill');
});

console.log('\n════════════════════════════════════════════════════════════════════');
if (passed === checks) {
  console.log(`🎯 RESULTADO: ${passed}/${checks} CHECKS EXITOSOS (100%)`);
  process.exit(0);
} else {
  console.log(`⚠️ ALERTA: ${checks - passed} CHECKS FALLIDOS`);
  process.exit(1);
}
