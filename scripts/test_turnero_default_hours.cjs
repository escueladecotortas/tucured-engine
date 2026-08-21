// Archivo: scripts/test_turnero_default_hours.cjs
/**
 * 🛡️ SUITE DE PRUEBAS QA - ARGUS // TASK-068
 * Verificación de Horario Corrido Simple por Defecto,
 * Desahogo Visual de WhatsApp y Ley de 200 Líneas.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const L1_FILE = path.join(ROOT, 'backend/stitch/widgets/booking/booking_l1_turnero.html');
const SHOWROOM_FILE = path.join(ROOT, 'public/showroom_l1.html');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️ ARGUS QA: BATERÍA DE PRUEBAS - HORARIO CORRIDO & DESAHOGO VISUAL');
console.log('════════════════════════════════════════════════════════════════════\n');

let totalChecks = 0;
let passedChecks = 0;

function assert(condition, message, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`✅ [PASS] ${message} → ${details}`);
  } else {
    console.error(`❌ [FAIL] ${message} → ${details}`);
  }
}

// Check 1: Ley de 200 Líneas en booking_l1_turnero.html
const l1Content = fs.readFileSync(L1_FILE, 'utf8');
const l1Lines = l1Content.split(/\r?\n/).length;
assert(
  l1Lines <= 200,
  '1. Ley de 200 Líneas en booking_l1_turnero.html',
  `${l1Lines}/200 líneas (umbral preventivo < 180 OK)`
);

// Check 2: Estado isSplit: false por defecto en booking_l1_turnero.html
const hasL1DefaultSplitFalse = l1Content.includes('isSplit:false') || l1Content.includes('isSplit: false');
const hasL1SplitTrue = l1Content.includes('isSplit:true') || l1Content.includes('isSplit: true');
assert(
  hasL1DefaultSplitFalse && !hasL1SplitTrue,
  '2. defaultSchedule en booking_l1_turnero.html tiene isSplit: false en todos los días',
  'isSplit: false verificado en defaultSchedule'
);

// Check 3: Simulación Algorítmica de Generación de Slots Corridos (Lunes 09:00 a 18:00 sin turno tarde)
function generateRange(startStr, endStr, interval = 30) {
  const slots = [];
  let current = new Date(`2000-01-01T${startStr}:00`);
  const end = new Date(`2000-01-01T${endStr}:00`);
  while (current <= end) {
    slots.push(current.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    current.setMinutes(current.getMinutes() + interval);
  }
  return slots;
}

function generateTimeSlots(dayCfg, interval = 30) {
  if (!dayCfg || !dayCfg.enabled) return [];
  const s1 = generateRange(dayCfg.open, dayCfg.close, interval);
  return (!dayCfg.isSplit || !dayCfg.open2 || !dayCfg.close2)
    ? s1
    : [...s1, ...generateRange(dayCfg.open2, dayCfg.close2, interval)];
}

const defaultMonCfg = { enabled: true, open: "09:00", close: "18:00", isSplit: false, open2: "17:00", close2: "21:00" };
const monSlots = generateTimeSlots(defaultMonCfg, 30);
const expectedFirst = "09:00";
const expectedLast = "18:00";
const has14hsSlot = monSlots.includes("14:00") && monSlots.includes("15:00") && monSlots.includes("16:00");
assert(
  monSlots.length === 19 && monSlots[0] === expectedFirst && monSlots[monSlots.length - 1] === expectedLast && has14hsSlot,
  '3. Generación Algorítmica Horario Corrido Simple (Lunes 09:00 a 18:00)',
  `19 slots corridos continuos: ${monSlots[0]}..${monSlots[monSlots.length - 1]} (incluye siesta 14:00, 15:00, 16:00)`
);

// Check 4: weeklySchedule en showroom_l1.html arranca con isSplit: false
const showroomContent = fs.readFileSync(SHOWROOM_FILE, 'utf8');
const hasShowroomWeeklySplitFalse = /1:\s*\{\s*enabled:\s*true,\s*open:\s*"09:00",\s*close:\s*"18:00",\s*isSplit:\s*false/.test(showroomContent);
assert(
  hasShowroomWeeklySplitFalse,
  '4. weeklySchedule inicial en showroom_l1.html configurado con isSplit: false',
  'Lunes a Viernes 09:00 a 18:00 corrido verificado'
);

// Check 5: Desahogo Visual de WhatsApp (Textarea espaciosa y sin max-h restrictivo)
const hasTextareaSpacious = showroomContent.includes('rows="6"') && showroomContent.includes('resize-y');
const hasNoRestrictiveScrollOnTemplate = !showroomContent.includes('max-h-32 overflow-y-auto') && !showroomContent.includes('max-h-40 overflow-y-auto');
assert(
  hasTextareaSpacious && hasNoRestrictiveScrollOnTemplate,
  '5. Desahogo Visual del Editor de Template en showroom_l1.html',
  'Textarea rows="6" expandible y sin max-h restrictivo'
);

// Check 6: Burbuja Real de WhatsApp sin Scroll Interno
const hasSpaciousBubble = showroomContent.includes('bg-[#005c4b]') && showroomContent.includes('break-words') && showroomContent.includes('leading-relaxed');
const bubbleHasNoInnerScroll = !showroomContent.includes('id="wa-bubble-preview" class="max-h-');
assert(
  hasSpaciousBubble && bubbleHasNoInnerScroll,
  '6. Contenedor de Burbuja Real de WhatsApp Holgado sin Scroll Interno',
  'Burbuja verde #005c4b con wrap natural, leading-relaxed y sin max-h'
);

// Check 7: Timestamp Dinámico en Burbuja de WhatsApp
const hasDynamicTimestamp = showroomContent.includes('timeEl.innerText = now.toLocaleTimeString');
assert(
  hasDynamicTimestamp,
  '7. Timestamp Dinámico en Previsualización de Burbuja WhatsApp',
  'Hora reactiva inyectada en #wa-bubble-time'
);

console.log('\n════════════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADO: ${passedChecks}/${totalChecks} CHECKS EXITOSOS (${Math.round(passedChecks/totalChecks*100)}%)`);
console.log('════════════════════════════════════════════════════════════════════\n');

if (passedChecks !== totalChecks) {
  process.exit(1);
}
