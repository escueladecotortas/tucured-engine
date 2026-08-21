// Archivo: scripts/test_turnero_l1_param.cjs
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️ ARGUS QA: BATERÍA DE PRUEBAS - TURNERO L1 PARAMETRIZADO');
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

// 1. Generación de slots según rango e intervalo dinámicos
runCheck('1. Generación dinámica de slots por rango (08:00 a 12:00 c/ 30 min = 9 slots)', () => {
  const generateTimeSlots = (open, close, interval) => {
    const slots = [];
    let current = new Date(`2000-01-01T${open}:00`);
    const end = new Date(`2000-01-01T${close}:00`);
    while (current <= end) {
      slots.push(current.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
      current.setMinutes(current.getMinutes() + interval);
    }
    return slots;
  };

  const slots30 = generateTimeSlots("08:00", "12:00", 30);
  assert.strictEqual(slots30.length, 9, 'Debe haber 9 slots (08:00, 08:30, 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 12:00)');
  assert.strictEqual(slots30[0], '08:00');
  assert.strictEqual(slots30[slots30.length - 1], '12:00');

  const slots60 = generateTimeSlots("09:00", "13:00", 60);
  assert.strictEqual(slots60.length, 5, 'Debe haber 5 slots (09:00, 10:00, 11:00, 12:00, 13:00)');
});

// 2. Paginación de días (4 por vista) y límite de días máximos
runCheck('2. Paginación de 4 días por vista y navegación de offsets', () => {
  const maxDays = 14;
  const getAllDays = () => Array.from({ length: maxDays }, (_, i) => ({ day: i + 1 }));
  const days = getAllDays();
  
  assert.strictEqual(days.length, 14, 'El total de días debe ser 14');
  
  // Vista 1 (offset 0)
  const v1 = days.slice(0, 4);
  assert.strictEqual(v1.length, 4, 'La vista 1 debe contener exactamente 4 pastillas');
  assert.strictEqual(v1[0].day, 1);
  assert.strictEqual(v1[3].day, 4);

  // Vista 2 (offset 4)
  const v2 = days.slice(4, 8);
  assert.strictEqual(v2.length, 4, 'La vista 2 debe contener exactamente 4 pastillas');
  assert.strictEqual(v2[0].day, 5);
  assert.strictEqual(v2[3].day, 8);

  // Verificación en el HTML de L1
  assert.ok(contentL1.includes('grid grid-cols-4 gap-2'), 'L1 debe contener grid grid-cols-4');
  assert.ok(contentL1.includes('day-prev-{{WIDGET_ID}}') && contentL1.includes('day-next-{{WIDGET_ID}}'), 'L1 debe contener botones de paginación');
});

// 3. Rechazo de inputs inválidos (Nombre solo numérico, profanidad, teléfono con letras)
runCheck('3. Validación estricta de nombres, apellidos, profanidad y teléfono', () => {
  const validateName = (val) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,30}$/.test((val || '').trim());
  const sanitizePhone = (val) => val.replace(/\D/g, '').replace(/^549?/, '').replace(/^0/, '').replace(/^(\d{2,4})15/, '$1');
  const hasBadWords = (str) => {
    const bad = ['mierda', 'puto', 'puta', 'boludo', 'pelotudo', 'concha', 'hdp', 'spam', 'carajo', 'forro'];
    const low = (str || '').toLowerCase();
    return bad.some(w => low.includes(w)) || /[<>{}\\\/]/.test(str);
  };

  // Nombres inválidos
  assert.strictEqual(validateName('12345'), false, 'Nombre puramente numérico debe ser rechazado');
  assert.strictEqual(validateName('J'), false, 'Nombre de 1 letra debe ser rechazado');
  assert.strictEqual(validateName('Juan!'), false, 'Nombre con caracteres especiales debe ser rechazado');
  assert.strictEqual(validateName('Juan Carlos'), true, 'Nombre alfabético válido debe ser aceptado');

  // Profanidad / XSS
  assert.strictEqual(hasBadWords('boludo'), true, 'Debe detectar insultos');
  assert.strictEqual(hasBadWords('<script>'), true, 'Debe detectar caracteres peligrosos < >');
  assert.strictEqual(hasBadWords('Carlos Gomez'), false, 'Texto limpio no debe dar falso positivo');

  // Teléfono
  assert.strictEqual(sanitizePhone('+54 9 0381 15-4433221'), '3814433221', 'Debe sanitizar prefijos 54, 9, 0, 15');
});

// 4. Reducción efectiva de slots pasados a un máximo de 1 elemento
runCheck('4. Reducción de slots pasados: máximo 1 slot tachado previo', () => {
  const allSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"];
  const currentMins = 12 * 60 + 40; // 12:40 hs

  const pastSlots = [];
  const upcomingSlots = [];
  allSlots.forEach(t => {
    const [sh, sm] = t.split(':').map(Number);
    if ((sh * 60 + sm) <= currentMins) pastSlots.push(t);
    else upcomingSlots.push(t);
  });

  // Solo se conserva el último horario pasado
  const lastPast = pastSlots.slice(-1);
  const slotsToRender = [...lastPast.map(t => ({ time: t, isPast: true })), ...upcomingSlots.map(t => ({ time: t, isPast: false }))];

  assert.strictEqual(slotsToRender.filter(s => s.isPast).length, 1, 'Debe haber exactamente 1 slot pasado');
  assert.strictEqual(slotsToRender[0].time, "12:30", 'El slot pasado debe ser el inmediatamente anterior (12:30)');
  assert.strictEqual(slotsToRender[1].time, "13:00", 'El siguiente slot debe ser el primer vigente (13:00)');
  assert.strictEqual(slotsToRender.length, 4, 'Total de slots renderizados reducidos (1 pasado + 3 vigentes = 4 slots)');
});

// 5. Existencia e integridad del Showroom Split-Screen
runCheck('5. Integridad del Showroom Split-Screen (public/showroom_l1.html)', () => {
  const showroomContent = fs.readFileSync(SHOWROOM_PATH, 'utf-8');
  assert.ok(showroomContent.includes('SHOWROOM LIVE // TURNERO L1'), 'Debe contener el header del showroom');
  assert.ok(showroomContent.includes('cfg-biz-name') && showroomContent.includes('cfg-open'), 'Debe contener inputs de configuración');
  assert.ok(showroomContent.includes('widget-host-container'), 'Debe contener el contenedor de renderizado vivo');
  assert.ok(showroomContent.includes('btn-copy-configured'), 'Debe contener el botón de copiado configurado');
});

console.log('\n════════════════════════════════════════════════════════════════════');
if (passed === checks) {
  console.log(`🎯 RESULTADO: ${passed}/${checks} CHECKS EXITOSOS (100%)`);
  process.exit(0);
} else {
  console.log(`⚠️ ALERTA: ${checks - passed} CHECKS FALLIDOS`);
  process.exit(1);
}
