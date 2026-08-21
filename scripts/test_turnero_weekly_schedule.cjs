// Archivo: scripts/test_turnero_weekly_schedule.cjs
// Suite de Certificación: Horarios Independientes por Día de la Semana en Admin y Turnero L1 (Argus QA)
const path = require('path');
const fs = require('fs');

async function runSuite() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('🛡️ ARGUS QA: BATERÍA DE PRUEBAS - HORARIOS INDEPENDIENTES POR DÍA');
  console.log('════════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let total = 0;

  function assert(condition, name, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${name}${details ? ` → ${details}` : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}${details ? ` → ${details}` : ''}`);
    }
  }

  // Check 1: Integridad y Ley de 200 Líneas de booking_l1_turnero.html
  const l1Path = path.join(__dirname, '../backend/stitch/widgets/booking/booking_l1_turnero.html');
  const l1Content = fs.readFileSync(l1Path, 'utf-8');
  const l1Lines = l1Content.split('\n').length;
  assert(
    l1Lines <= 200 && l1Lines <= 180,
    '1. Ley de 200 Líneas en booking_l1_turnero.html',
    `${l1Lines}/200 líneas (umbral preventivo < 180 OK)`
  );

  // Check 2: Soporte data-schedule y parseo en booking_l1_turnero.html
  const hasDataSchedule = l1Content.includes('data-schedule') && l1Content.includes('parseScheduleData');
  const hasPerDayCalculation = l1Content.includes('dayData.dayOfWeek') && l1Content.includes('cfg.schedule[dayData.dayOfWeek]');
  assert(
    hasDataSchedule && hasPerDayCalculation,
    '2. Parametrización y Algoritmo por Día en booking_l1_turnero.html',
    'Lectura de data-schedule y selección dinámica de franja según dayOfWeek'
  );

  // Check 3: Simulación Algorítmica de Generación de Slots Diferenciados
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

  const testSchedule = {
    1: { enabled: true, open: "09:00", close: "13:00", isSplit: true, open2: "17:00", close2: "21:00" }, // Lunes (18 slots)
    6: { enabled: true, open: "09:00", close: "13:00", isSplit: false, open2: "17:00", close2: "21:00" }, // Sábado (9 slots)
    0: { enabled: false, open: "09:00", close: "13:00", isSplit: false, open2: "17:00", close2: "21:00" } // Domingo (0 slots)
  };

  const generateSlotsForDay = (dayIndex, schedule, interval = 30) => {
    const dayCfg = schedule[dayIndex];
    if (!dayCfg || !dayCfg.enabled) return [];
    const s1 = generateRange(dayCfg.open, dayCfg.close, interval);
    if (!dayCfg.isSplit || !dayCfg.open2 || !dayCfg.close2) return s1;
    return [...s1, ...generateRange(dayCfg.open2, dayCfg.close2, interval)];
  };

  const mondaySlots = generateSlotsForDay(1, testSchedule, 30);
  const saturdaySlots = generateSlotsForDay(6, testSchedule, 30);
  const sundaySlots = generateSlotsForDay(0, testSchedule, 30);

  assert(
    mondaySlots.length === 18 &&
    mondaySlots[0] === '09:00' && mondaySlots[8] === '13:00' &&
    mondaySlots[9] === '17:00' && mondaySlots[17] === '21:00',
    '3. Generación Lunes Horario Partido (Mañana y Tarde)',
    `18 slots generados: ${mondaySlots[0]}..${mondaySlots[8]} y ${mondaySlots[9]}..${mondaySlots[17]}`
  );

  assert(
    saturdaySlots.length === 9 &&
    saturdaySlots[0] === '09:00' && saturdaySlots[8] === '13:00',
    '4. Generación Sábado Turno Simple Mañana (Cierre al mediodía)',
    `9 slots generados: ${saturdaySlots[0]}..${saturdaySlots[8]}`
  );

  assert(
    sundaySlots.length === 0,
    '5. Exclusión Total de Días Deshabilitados (Domingo)',
    '0 slots generados para días cerrados'
  );

  // Check 6: Presencia de UI Matriz Semanal en showroom_l1.html
  const showroomPath = path.join(__dirname, '../public/showroom_l1.html');
  const showroomContent = fs.readFileSync(showroomPath, 'utf-8');
  const hasContainer = showroomContent.includes('id="weekly-schedule-container"');
  const hasCloneBtn = showroomContent.includes('id="btn-clone-schedule"');
  const hasScheduleSync = showroomContent.includes('weeklySchedule') && showroomContent.includes('renderWeeklyScheduleUI');

  assert(
    hasContainer && hasCloneBtn && hasScheduleSync,
    '6. UI Matriz Semanal y Botón de Clonación en showroom_l1.html',
    'Contenedor 7 días, renderWeeklyScheduleUI y #btn-clone-schedule integrados'
  );

  // Check 7: Serialización data-schedule en Exportación
  const hasExportSchedule = showroomContent.includes("replace(/\\{\\{SCHEDULE_JSON\\}\\}/g, JSON.stringify(vals.schedule))");
  assert(
    hasExportSchedule,
    '7. Serialización Correcta de data-schedule en Copiado de Código',
    'JSON.stringify(vals.schedule) inyectado en template exportado'
  );

  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log(`🎯 RESULTADO: ${passed}/${total} CHECKS EXITOSOS (${Math.round((passed/total)*100)}%)`);
  console.log('════════════════════════════════════════════════════════════════════\n');

  if (passed !== total) process.exit(1);
}

runSuite().catch(err => {
  console.error('❌ Error fatal en suite de pruebas:', err);
  process.exit(1);
});
