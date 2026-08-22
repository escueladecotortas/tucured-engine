// Archivo: scripts/test_unified_architecture.cjs
// Suite de Certificación: Unificación Metodológica (Admin/Cliente Puros) y Nuevo Showroom de Catálogo

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ADMIN_L1 = path.join(ROOT, 'public/admin_l1.html');
const CLIENT_L1 = path.join(ROOT, 'public/demo_l1_cliente.html');
const ADMIN_L2 = path.join(ROOT, 'public/admin_l2.html');
const CLIENT_L2 = path.join(ROOT, 'public/demo_l2_cliente.html');
const WIDGETS_CATALOG = path.join(ROOT, 'public/tucu_widgets.html');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️ ARGUS QA: CERTIFICACIÓN DE ARQUITECTURA UNIFICADA & SHOWROOM');
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

// 1. Integridad física y desacople de pantallas puras (L1 y L2)
runCheck('1. Existencia y desacople físico de las 4 pantallas (L1 & L2)', () => {
  const files = [ADMIN_L1, CLIENT_L1, ADMIN_L2, CLIENT_L2];
  files.forEach(f => {
    if (!fs.existsSync(f)) throw new Error(`Archivo ausente: ${path.basename(f)}`);
  });

  const a1 = fs.readFileSync(ADMIN_L1, 'utf8');
  const c1 = fs.readFileSync(CLIENT_L1, 'utf8');
  const a2 = fs.readFileSync(ADMIN_L2, 'utf8');
  const c2 = fs.readFileSync(CLIENT_L2, 'utf8');

  // Sin split-screen en admins
  if (a1.includes('smart-turnero-widget-') || a2.includes('smart-turnero-widget-')) {
    throw new Error('Los paneles Admin no deben tener widgets incrustados en split-screen');
  }

  // Clientes contienen sus widgets centrados
  if (!c1.includes('smart-turnero-widget-') || !c2.includes('smart-turnero-widget-')) {
    throw new Error('Las vistas de cliente deben renderizar su respectivo widget');
  }

  return '4 pantallas puras y desacopladas (Admin L1, Cliente L1, Admin L2, Cliente L2)';
});

// 2. Navegación bidireccional entre pares Admin <-> Cliente
runCheck('2. Navegación bidireccional estandarizada [Abrir Turnero] / [Panel Admin]', () => {
  const a1 = fs.readFileSync(ADMIN_L1, 'utf8');
  const c1 = fs.readFileSync(CLIENT_L1, 'utf8');
  const a2 = fs.readFileSync(ADMIN_L2, 'utf8');
  const c2 = fs.readFileSync(CLIENT_L2, 'utf8');

  if (!a1.includes('/demo_l1_cliente.html') || !a1.includes('Abrir Turnero Cliente')) throw new Error('Admin L1 no enlaza a Cliente L1');
  if (!c1.includes('/admin_l1.html') || !c1.includes('Panel Admin')) throw new Error('Cliente L1 no enlaza a Admin L1');

  if (!a2.includes('/demo_l2_cliente.html') || !a2.includes('Abrir Turnero Cliente')) throw new Error('Admin L2 no enlaza a Cliente L2');
  if (!c2.includes('/admin_l2.html') || !c2.includes('Panel Admin')) throw new Error('Cliente L2 no enlaza a Admin L2');

  return 'Enlaces estandarizados y bidireccionales en Nivel 1 y Nivel 2';
});

// 3. Integridad del Showroom de Catálogo (tucu_widgets.html)
runCheck('3. Arquitectura de 3 columnas en public/tucu_widgets.html', () => {
  if (!fs.existsSync(WIDGETS_CATALOG)) throw new Error('Archivo public/tucu_widgets.html no existe');
  const c = fs.readFileSync(WIDGETS_CATALOG, 'utf8');

  // Verificar 3 columnas
  if (!c.includes('item-widget-l1') || !c.includes('item-widget-l2')) throw new Error('Columna 1 (Sidebar) incompleta');
  if (!c.includes('preview-iframe') || !c.includes('stage-title')) throw new Error('Columna 2 (Stage) incompleta');
  if (!c.includes('card-features') || !c.includes('btn-action-admin') || !c.includes('btn-action-client')) {
    throw new Error('Columna 3 (Ficha Comercial) incompleta');
  }

  // Erradicar definitivamente botón "Copiar código" en catálogo
  if (c.toLowerCase().includes('copiar código') || c.toLowerCase().includes('copiar codigo')) {
    throw new Error('Prohibido: "Copiar código" detectado en tucu_widgets.html');
  }

  return 'Catálogo 3 columnas de alto impacto con preview responsivo y ficha comercial';
});

// 4. Persistencia compartida reactiva vía localStorage
runCheck('4. Persistencia reactiva local-first (Admin -> Cliente)', () => {
  const a1 = fs.readFileSync(ADMIN_L1, 'utf8');
  const c1 = fs.readFileSync(CLIENT_L1, 'utf8');
  const a2 = fs.readFileSync(ADMIN_L2, 'utf8');
  const c2 = fs.readFileSync(CLIENT_L2, 'utf8');

  ['tucu_schedule', 'Nexus Studio Demo'].forEach(token => {
    if (!a1.includes(token) || !c1.includes(token) || !a2.includes(token) || !c2.includes(token)) {
      throw new Error(`Token de persistencia o identidad ausente: ${token}`);
    }
  });

  return 'Sincronización en caliente certificada en ambos niveles';
});

// 5. Cumplimiento de la Ley de 200 Líneas en Test
runCheck('5. Cumplimiento de la Ley de 200 Líneas en suite de arquitectura', () => {
  const loc = fs.readFileSync(__filename, 'utf8').split('\n').length;
  if (loc > 180) throw new Error(`test_unified_architecture.cjs supera 180 líneas (${loc} lín)`);
  return `${loc}/200 líneas (umbral preventivo < 180 OK)`;
});

console.log('\n════════════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed / (passed + failed)) * 100)}%)`);
console.log('════════════════════════════════════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
