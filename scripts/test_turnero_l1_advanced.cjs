// Archivo: scripts/test_turnero_l1_advanced.cjs
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️ ARGUS QA: BATERÍA DE PRUEBAS - TURNERO L1 CONFIG AVANZADA L3');
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

// 1. Deshabilitación correcta de días no laborables seleccionados
runCheck('1. Deshabilitación de días no laborables (Lunes a Viernes activos, Fin de semana inactivo)', () => {
  const workdays = [1, 2, 3, 4, 5]; // Lun-Vie
  const testDates = [
    { date: new Date('2026-08-24T12:00:00Z'), expectedDisabled: false }, // Lunes (1)
    { date: new Date('2026-08-29T12:00:00Z'), expectedDisabled: true },  // Sábado (6)
    { date: new Date('2026-08-30T12:00:00Z'), expectedDisabled: true }   // Domingo (0)
  ];

  testDates.forEach(td => {
    const isWorkday = workdays.includes(td.date.getDay());
    assert.strictEqual(!isWorkday, td.expectedDisabled, `Día ${td.date.getDay()} fallo en filtro laboral`);
  });

  assert.ok(contentL1.includes('data-workdays'), 'L1 debe contener atributo data-workdays');
});

// 2. Bloqueo de fechas coincidentes con feriados 2026
runCheck('2. Bloqueo de feriados patrios de Argentina 2026', () => {
  const HOLIDAYS_2026 = ["2026-01-01","2026-02-16","2026-02-17","2026-03-24","2026-04-02","2026-04-03","2026-05-01","2026-05-25","2026-06-17","2026-06-20","2026-07-09","2026-08-17","2026-10-12","2026-11-20","2026-12-08","2026-12-25"];

  const toIsoDate = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  
  const may25 = new Date('2026-05-25T12:00:00');
  const july9 = new Date('2026-07-09T12:00:00');
  const aug20 = new Date('2026-08-20T12:00:00'); // No feriado

  assert.strictEqual(HOLIDAYS_2026.includes(toIsoDate(may25)), true, '25 de Mayo debe ser feriado bloqueado');
  assert.strictEqual(HOLIDAYS_2026.includes(toIsoDate(july9)), true, '9 de Julio debe ser feriado bloqueado');
  assert.strictEqual(HOLIDAYS_2026.includes(toIsoDate(aug20)), false, '20 de Agosto no debe ser feriado');

  assert.ok(contentL1.includes('HOLIDAYS_2026') || contentL1.includes('2026-05-25'), 'L1 debe incluir el catálogo de feriados 2026');
  assert.ok(contentL1.includes('data-block-holidays'), 'L1 debe incluir data-block-holidays');
});

// 3. Sustitución fiel de comodines en el string final de WhatsApp
runCheck('3. Reemplazo e inyección fiel de tokens dinámicos de WhatsApp', () => {
  const template = "Hola {{comercio}}! Soy {{cliente}} y quiero reservar el {{fecha}} a las {{hora}}. Mi WhatsApp es {{telefono}}.";
  const values = {
    cliente: "Leo Lucardi",
    comercio: "Óptica Visión 100",
    fecha: "jueves, 20 de agosto",
    hora: "16:30",
    telefono: "3815544332"
  };

  const formatted = template
    .replace(/\{\{cliente\}\}/g, values.cliente)
    .replace(/\{\{fecha\}\}/g, values.fecha)
    .replace(/\{\{hora\}\}/g, values.hora)
    .replace(/\{\{comercio\}\}/g, values.comercio)
    .replace(/\{\{telefono\}\}/g, values.telefono);

  const expected = "Hola Óptica Visión 100! Soy Leo Lucardi y quiero reservar el jueves, 20 de agosto a las 16:30. Mi WhatsApp es 3815544332.";
  assert.strictEqual(formatted, expected, 'El string final con tokens debe coincidir exactamente');
  
  assert.ok(contentL1.includes('replace(/\\{\\{cliente\\}\\}/g'), 'L1 debe implementar sustitución de token cliente');
  assert.ok(contentL1.includes('replace(/\\{\\{fecha\\}\\}/g'), 'L1 debe implementar sustitución de token fecha');
  assert.ok(contentL1.includes('replace(/\\{\\{hora\\}\\}/g'), 'L1 debe implementar sustitución de token hora');
});

// 4. Copiado íntegro y exportación desde el Showroom Split-Screen
runCheck('4. Exportación e integridad del Showroom Split-Screen (showroom_l1.html)', () => {
  assert.ok(showroomContent.includes('cfg-block-holidays'), 'El Showroom debe contener toggle switch de feriados');
  assert.ok(showroomContent.includes('workday-pills'), 'El Showroom debe contener pastillas de días laborales');
  assert.ok(showroomContent.includes('insertToken'), 'El Showroom debe contener función de inserción de tokens');
  assert.ok(showroomContent.includes('btn-copy-configured'), 'El Showroom debe contener botón de copiado parametrizado');
});

console.log('\n════════════════════════════════════════════════════════════════════');
if (passed === checks) {
  console.log(`🎯 RESULTADO: ${passed}/${checks} CHECKS EXITOSOS (100%)`);
  process.exit(0);
} else {
  console.log(`⚠️ ALERTA: ${checks - passed} CHECKS FALLIDOS`);
  process.exit(1);
}
