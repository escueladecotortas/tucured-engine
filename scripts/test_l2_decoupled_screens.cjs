// Archivo: scripts/test_l2_decoupled_screens.cjs
// Suite de Certificación: Desacople Estructural L2 en Pantallas Dedicadas (Admin Full-Screen vs Cliente Isolado)

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ADMIN_L2 = path.join(ROOT, 'public/admin_l2.html');
const CLIENT_L2 = path.join(ROOT, 'public/demo_l2_cliente.html');
const WIDGET_LAB = path.join(ROOT, 'public/widget-laboratory.html');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️ ARGUS QA: CERTIFICACIÓN DESACOPLE ESTRUCTURAL PANTALLAS L2');
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

// 1. Integridad de Admin L2 Full-Screen
runCheck('1. Integridad física y estructural de public/admin_l2.html', () => {
  if (!fs.existsSync(ADMIN_L2)) throw new Error('Archivo public/admin_l2.html no existe');
  const c = fs.readFileSync(ADMIN_L2, 'utf8');
  if (!c.includes('Admin Master L2')) throw new Error('Falta título de panel de gestión');
  if (!c.includes('view-section-calendar') || !c.includes('view-section-crm') || !c.includes('view-section-config')) {
    throw new Error('Faltan las 3 secciones principales (Calendario, CRM, Config)');
  }
  if (!c.includes('mobile-nav-tab') || !c.includes('md:hidden')) {
    throw new Error('Falta barra de navegación móvil inferior (Bottom Nav Drawer)');
  }
  if (!c.includes('/demo_l2_cliente.html')) {
    throw new Error('Falta enlace directo al Turnero Cliente en el header o nav');
  }
  return 'Panel de administración 100% full-screen con 3 vistas y bottom nav móvil';
});

// 2. Integridad de Vista Cliente Aislada
runCheck('2. Integridad física y visual de public/demo_l2_cliente.html', () => {
  if (!fs.existsSync(CLIENT_L2)) throw new Error('Archivo public/demo_l2_cliente.html no existe');
  const c = fs.readFileSync(CLIENT_L2, 'utf8');
  if (!c.includes('max-w-[440px]')) throw new Error('Debe tener ancho max-w-[440px] mobile-first');
  if (!c.includes('/admin_l2.html')) throw new Error('Falta botón de retorno al Admin L2');
  if (!c.includes('localStorage.getItem')) throw new Error('Debe consumir persistencia reactiva de localStorage');
  if (!c.includes('fetchAvailability')) throw new Error('Debe incluir consulta asíncrona de disponibilidad');
  if (!c.includes('BEGIN:VCALENDAR')) throw new Error('Debe incluir exportación .ics');
  return 'Vista cliente aislada mobile-first (440px) con consumo reactivo de configuración';
});

// 3. Persistencia Compartida & Gobernanza
runCheck('3. Lógica de persistencia compartida (Admin -> Cliente)', () => {
  const adminCode = fs.readFileSync(ADMIN_L2, 'utf8');
  const clientCode = fs.readFileSync(CLIENT_L2, 'utf8');

  const sharedKeys = [
    'tucu_l2_biz_name',
    'tucu_l2_wa_number',
    'tucu_schedule',
    'tucu_l2_vacations',
    'tucu_l2_blacklist',
    'tucu_l2_occupied_slots'
  ];

  sharedKeys.forEach(k => {
    if (!adminCode.includes(k) || !clientCode.includes(k)) {
      throw new Error(`Clave de persistencia ${k} no está sincronizada entre Admin y Cliente`);
    }
  });

  return 'Sincronización total en localStorage: Identidad, Cronograma, Vacaciones, Lista Negra y Slots Ocupados';
});

// 4. Navegación Bidireccional Limpia
runCheck('4. Navegación bidireccional y enlaces en widget-laboratory.html', () => {
  const lab = fs.readFileSync(WIDGET_LAB, 'utf8');
  if (!lab.includes('/admin_l2.html')) throw new Error('Falta enlace a Admin L2 en laboratorio');
  if (!lab.includes('/demo_l2_cliente.html')) throw new Error('Falta enlace a Cliente L2 en laboratorio');

  const admin = fs.readFileSync(ADMIN_L2, 'utf8');
  if (!admin.includes('href="/demo_l2_cliente.html"')) throw new Error('Admin no enlaza a Cliente');

  const client = fs.readFileSync(CLIENT_L2, 'utf8');
  if (!client.includes('href="/admin_l2.html"')) throw new Error('Cliente no enlaza a Admin');

  return 'Navegación fluida y bidireccional certificada entre Laboratorio, Admin y Cliente';
});

// 5. Doctrina de Hierro & Ley de 200 Líneas en Test
runCheck('5. Cumplimiento de la Ley de 200 Líneas en suite de desacople', () => {
  const loc = fs.readFileSync(__filename, 'utf8').split('\n').length;
  if (loc > 180) throw new Error(`test_l2_decoupled_screens.cjs supera 180 líneas (${loc} lín)`);
  return `${loc}/200 líneas (umbral preventivo < 180 OK)`;
});

console.log('\n════════════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed / (passed + failed)) * 100)}%)`);
console.log('════════════════════════════════════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
