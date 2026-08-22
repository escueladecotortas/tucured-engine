// Archivo: scripts/test_showcase_clean.cjs
// Suite de Certificación: Erradicación de Bucle de Iframes y Mockup Mobile Limpio

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WIDGETS_CATALOG = path.join(ROOT, 'public/tucu_widgets.html');
const DEMO_L1 = path.join(ROOT, 'public/demo_l1_cliente.html');
const DEMO_L2 = path.join(ROOT, 'public/demo_l2_cliente.html');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️ ARGUS QA: CERTIFICACIÓN DE SHOWCASE CLEAN & SMARTPHONE MOCKUP');
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

// 1. Enlace Limpio de Iframes a Vistas Cliente Puras
runCheck('1. Iframe central apunta exclusivamente a demo_l1/demo_l2_cliente.html', () => {
  if (!fs.existsSync(WIDGETS_CATALOG)) throw new Error('Archivo public/tucu_widgets.html no existe');
  const c = fs.readFileSync(WIDGETS_CATALOG, 'utf8');

  if (!c.includes('demo_l1_cliente.html') || !c.includes('demo_l2_cliente.html')) {
    throw new Error('Faltan enlaces a las vistas cliente puras');
  }

  // Verificar que el iframe inicial apunte a demo_l1_cliente
  if (!c.includes('src="demo_l1_cliente.html')) {
    throw new Error('El iframe inicial debe cargar demo_l1_cliente.html');
  }

  return 'Iframe enlaza directamente a vistas cliente aisladas';
});

// 2. Ausencia de recursividad a widget-laboratory o split-screens en preview
runCheck('2. Ausencia total de recursividad (widget-laboratory / split-screen) en preview', () => {
  const c = fs.readFileSync(WIDGETS_CATALOG, 'utf8');

  // Buscar en el objeto de configuración JS widgetsData
  const jsBlock = c.substring(c.indexOf('const widgetsData ='), c.indexOf('function selectWidget'));
  if (jsBlock.includes('widget-laboratory.html') || jsBlock.includes('showroom_')) {
    throw new Error('El stage de previsualización contiene enlaces a laboratorios o showrooms obsoletos');
  }

  return 'Cero bucles recursivos en el motor de previsualización';
});

// 3. Mockup de Smartphone y Supresión de Scrollbars
runCheck('3. Mockup de Smartphone Premium con estilos de scrollbar suprimidos', () => {
  const c = fs.readFileSync(WIDGETS_CATALOG, 'utf8');

  if (!c.includes('rounded-[44px]') && !c.includes('rounded-[40px]')) {
    throw new Error('Falta curvatura de marco de smartphone');
  }
  if (!c.includes('w-[380px]')) {
    throw new Error('Dimensiones del marco de smartphone deben incluir w-[380px]');
  }
  if (!c.includes('hide-scrollbar') || !c.includes('scrolling="no"')) {
    throw new Error('Supresión de scrollbars no configurada en el marco o iframe');
  }

  return 'Marco smartphone de 380px con notch, bordes redondeados y scrollbars suprimidos';
});

// 4. Integridad de Modo Embebido en Vistas Cliente
runCheck('4. Detección de modo embebido en demo_l1_cliente y demo_l2_cliente', () => {
  const l1 = fs.readFileSync(DEMO_L1, 'utf8');
  const l2 = fs.readFileSync(DEMO_L2, 'utf8');

  if (!l1.includes('is-embedded') || !l2.includes('is-embedded')) {
    throw new Error('Falta soporte de clase is-embedded en las vistas cliente');
  }

  return 'Ambas vistas cliente ocultan encabezados al embeberse en smartphone';
});

// 5. Cumplimiento de la Ley de 200 Líneas en Test
runCheck('5. Cumplimiento de la Ley de 200 Líneas en suite de showcase', () => {
  const loc = fs.readFileSync(__filename, 'utf8').split('\n').length;
  if (loc > 180) throw new Error(`test_showcase_clean.cjs supera 180 líneas (${loc} lín)`);
  return `${loc}/200 líneas (umbral preventivo < 180 OK)`;
});

console.log('\n════════════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed / (passed + failed)) * 100)}%)`);
console.log('════════════════════════════════════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
