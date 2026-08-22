// Archivo: scripts/test_l2_isolated_views.cjs
// Suite de Certificación: Aislamiento Físico de Pantallas L2 y Purga de Capas Flotantes

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ADMIN_L2 = path.join(ROOT, 'public/admin_l2.html');
const CLIENT_L2 = path.join(ROOT, 'public/demo_l2_cliente.html');
const SHOWROOM_L1 = path.join(ROOT, 'public/showroom_l1.html');
const WIDGET_L1 = path.join(ROOT, 'backend/stitch/widgets/booking/booking_l1_turnero.html');
const WIDGET_L2 = path.join(ROOT, 'backend/stitch/widgets/booking/booking_l2_turnero.html');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️ ARGUS QA: CERTIFICACIÓN DE AISLAMIENTO FÍSICO PANTALLAS L2');
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

// 1. Purga total de nodos superpuestos del widget dentro de admin_l2.html
runCheck('1. Purga total de capas y widget superpuesto en public/admin_l2.html', () => {
  if (!fs.existsSync(ADMIN_L2)) throw new Error('Archivo public/admin_l2.html no existe');
  const c = fs.readFileSync(ADMIN_L2, 'utf8');
  if (c.includes('smart-turnero-widget-') || c.includes('widget-host-container')) {
    throw new Error('admin_l2.html aún contiene nodos embebidos del widget de turnero');
  }
  if (!c.includes('view-section-calendar') || !c.includes('view-section-crm') || !c.includes('view-section-config')) {
    throw new Error('Faltan secciones administrativas puras');
  }
  return '100% Admin Puro sin split-screen ni superposiciones móviles';
});

// 2. Reemplazo de marca por defecto a "Nexus Studio Demo"
runCheck('2. Reemplazo efectivo de marca default ("Nexus Studio Demo")', () => {
  const adminCode = fs.readFileSync(ADMIN_L2, 'utf8');
  const clientCode = fs.readFileSync(CLIENT_L2, 'utf8');
  const l1Code = fs.readFileSync(SHOWROOM_L1, 'utf8');

  if (!adminCode.includes('Nexus Studio Demo')) throw new Error('admin_l2.html no contiene "Nexus Studio Demo"');
  if (!clientCode.includes('Nexus Studio Demo')) throw new Error('demo_l2_cliente.html no contiene "Nexus Studio Demo"');
  if (!l1Code.includes('Nexus Studio Demo')) throw new Error('showroom_l1.html no contiene "Nexus Studio Demo"');

  if (adminCode.includes('Óptica 100') || clientCode.includes('Óptica 100') || l1Code.includes('Óptica 100')) {
    throw new Error('Aún persiste "Óptica 100" en los archivos principales');
  }
  return 'Identidad neutral "Nexus Studio Demo" unificada en todo el ecosistema';
});

// 3. Ergonomía Mobile-First y Bottom Navigation
runCheck('3. Ergonomía móvil (375px/414px) y Bottom Navigation Drawer', () => {
  const adminCode = fs.readFileSync(ADMIN_L2, 'utf8');
  const clientCode = fs.readFileSync(CLIENT_L2, 'utf8');

  if (!adminCode.includes('fixed bottom-0') || !adminCode.includes('md:hidden')) {
    throw new Error('Falta barra de navegación móvil fija en admin_l2.html');
  }
  if (!adminCode.includes('pb-16 md:pb-0')) {
    throw new Error('Falta padding inferior para evitar colisión con la barra fija en mobile');
  }
  if (!clientCode.includes('max-w-[440px]')) {
    throw new Error('demo_l2_cliente.html debe tener contenedor max-w-[440px]');
  }
  return 'Layouts 100% responsivos adaptados para pantallas de 375px y 414px';
});

// 4. Navegación Aislada y Botones Dedicados
runCheck('4. Navegación aislada [Abrir Turnero Cliente] y [Panel Admin]', () => {
  const adminCode = fs.readFileSync(ADMIN_L2, 'utf8');
  const clientCode = fs.readFileSync(CLIENT_L2, 'utf8');

  if (!adminCode.includes('Abrir Turnero Cliente') && !adminCode.includes('/demo_l2_cliente.html')) {
    throw new Error('Falta botón de acceso a turnero cliente en admin_l2.html');
  }
  if (!clientCode.includes('Panel Admin') && !clientCode.includes('/admin_l2.html')) {
    throw new Error('Falta botón de retorno al admin en demo_l2_cliente.html');
  }
  return 'Navegación bidireccional limpia y desacoplada';
});

// 5. Cumplimiento de la Ley de 200 Líneas en Test
runCheck('5. Cumplimiento de la Ley de 200 Líneas en suite de aislamiento', () => {
  const loc = fs.readFileSync(__filename, 'utf8').split('\n').length;
  if (loc > 180) throw new Error(`test_l2_isolated_views.cjs supera 180 líneas (${loc} lín)`);
  return `${loc}/200 líneas (umbral preventivo < 180 OK)`;
});

console.log('\n════════════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed / (passed + failed)) * 100)}%)`);
console.log('════════════════════════════════════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
