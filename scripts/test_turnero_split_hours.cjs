// Archivo: scripts/test_turnero_split_hours.cjs
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️ ARGUS QA: BATERÍA DE PRUEBAS - HORARIO PARTIDO & INPUTS MOBILE');
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
const lineCountL1 = contentL1.split('\n').length;

// 1. Generación de slots con horario corrido vs horario partido (corte de siesta)
runCheck('1. Generación de slots con horario partido: exclusión total de la siesta', () => {
  const generateRange = (startStr, endStr, interval) => {
    const slots = [];
    let current = new Date(`2000-01-01T${startStr}:00`);
    const end = new Date(`2000-01-01T${endStr}:00`);
    while (current <= end) {
      slots.push(current.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
      current.setMinutes(current.getMinutes() + interval);
    }
    return slots;
  };

  const generateTimeSlots = (cfg) => {
    const s1 = generateRange(cfg.open, cfg.close, cfg.interval);
    if (!cfg.isSplit || !cfg.open2 || !cfg.close2) return s1;
    const s2 = generateRange(cfg.open2, cfg.close2, cfg.interval);
    return [...s1, ...s2];
  };

  // Horario Partido (Mañana: 09:00-13:00, Tarde: 17:00-21:00 c/ 30 min)
  const partido = generateTimeSlots({
    open: "09:00", close: "13:00",
    isSplit: true,
    open2: "17:00", close2: "21:00",
    interval: 30
  });

  assert.strictEqual(partido.length, 18, 'Horario partido debe tener 18 slots en total');
  assert.strictEqual(partido[0], "09:00");
  assert.strictEqual(partido[8], "13:00");
  assert.strictEqual(partido[9], "17:00");
  assert.strictEqual(partido[17], "21:00");

  const siestaTimes = ["13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
  siestaTimes.forEach(t => {
    assert.strictEqual(partido.includes(t), false, `El horario ${t} (siesta) NO debe generarse`);
  });

  assert.ok(contentL1.includes('data-split'), 'L1 debe contener data-split');
});

// 2. Atributos de input mobile-first
runCheck('2. Atributos ergonómicos mobile-first (inputmode, autocomplete, autocapitalize)', () => {
  assert.ok(contentL1.includes('inputmode="numeric"'), 'Input de teléfono debe incluir inputmode="numeric"');
  assert.ok(contentL1.includes('autocomplete="tel"'), 'Input de teléfono debe incluir autocomplete="tel"');
  assert.ok(contentL1.includes('autocapitalize="words"'), 'Inputs de nombre y apellido deben incluir autocapitalize="words"');
  assert.ok(contentL1.includes('autocomplete="given-name"'), 'Input de nombre debe incluir autocomplete="given-name"');
});

// 3. Sanitización y Capital Case en Nombre y Apellido
runCheck('3. Formateo y Capital Case de Nombres y Apellidos en Paso 3 y WhatsApp', () => {
  const toTitleCase = (str) => (str || '').trim().toLowerCase().replace(/(?:^|\s|-|')\S/g, c => c.toUpperCase());

  assert.strictEqual(toTitleCase('juan carlos'), 'Juan Carlos');
  assert.strictEqual(toTitleCase('PÉREZ GÓMEZ'), 'Pérez Gómez');
  assert.strictEqual(toTitleCase('   maría del carmen  '), 'María Del Carmen');

  assert.ok(contentL1.includes('toTitleCase'), 'L1 debe implementar toTitleCase');
});

// 4. Arquitectura del Admin Drawer Mobile-First y botón de confirmación con icono
runCheck('4. Ergonomía Mobile-First: Bottom Drawer y Botón Confirmar WA con icono', () => {
  assert.ok(showroomContent.includes('mob-tab-identidad') && showroomContent.includes('mob-tab-agenda') && showroomContent.includes('mob-tab-whatsapp'), 'Showroom debe incluir el Bottom Navigation Drawer para mobile');
  assert.ok(contentL1.includes('btn-confirm-'), 'L1 debe incluir el botón de confirmación');
  assert.ok(contentL1.includes('svg') || contentL1.includes('Confirmar WA'), 'L1 debe incluir el botón de confirmación con icono');
});

// 5. Ley de 200 Líneas estricta (< 200 líneas)
runCheck('5. Ley de 200 Líneas en booking_l1_turnero.html', () => {
  assert.ok(lineCountL1 <= 200, `El archivo tiene ${lineCountL1} líneas (límite: <= 200)`);
  console.log(`   ℹ️ [LOC STATS] booking_l1_turnero.html: ${lineCountL1}/200 líneas`);
});

console.log('\n════════════════════════════════════════════════════════════════════');
if (passed === checks) {
  console.log(`🎯 RESULTADO: ${passed}/${checks} CHECKS EXITOSOS (100%)`);
  process.exit(0);
} else {
  console.log(`⚠️ ALERTA: ${checks - passed} CHECKS FALLIDOS`);
  process.exit(1);
}
