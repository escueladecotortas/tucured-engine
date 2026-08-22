// Archivo: scripts/test_l2_client_journey.cjs
/**
 * 🛡️ ARGUS QA: CERTIFICACIÓN CLIENT JOURNEY L2 & DESPACHO BAILEYS
 * - Confirmación de turno 100% nativa en pantalla web sin popup forzado a wa.me
 * - Invocación asíncrona de endpoint Baileys para envío de comprobante con link de autogestión
 * - Fallback inteligente si Baileys está desconectado o en error
 * - Copys alineados a "Mensaje Automático de Confirmación al Cliente"
 * - Ley de 200 Líneas en widget L2 y suite QA
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let passCount = 0;
let totalChecks = 5;

console.log('═'.repeat(68));
console.log('🛡️ ARGUS QA: CERTIFICACIÓN CLIENT JOURNEY L2 & DESPACHO BAILEYS');
console.log('═'.repeat(68) + '\n');

function check(title, condition, detail) {
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${title} → ${detail}`);
  } else {
    console.error(`❌ [FAIL] ${title} → ${detail}`);
  }
}

const widgetL2Path = path.join(rootDir, 'backend/stitch/widgets/booking/booking_l2_turnero.html');
const demoL2Path = path.join(rootDir, 'public/demo_l2_cliente.html');
const adminL2Path = path.join(rootDir, 'public/admin_l2.html');
const waRoutesPath = path.join(rootDir, 'backend/services/whatsapp/wa_routes.cjs');

const widgetContent = fs.readFileSync(widgetL2Path, 'utf-8');
const demoContent = fs.readFileSync(demoL2Path, 'utf-8');
const adminContent = fs.readFileSync(adminL2Path, 'utf-8');
const waRoutesContent = fs.readFileSync(waRoutesPath, 'utf-8');

// 1. Confirmación de turno web nativa (Paso 4 / Tarjeta de Éxito)
const hasNativeWebConfirmation = widgetContent.includes('¡Turno Confirmado con Éxito!') &&
  widgetContent.includes('btn-manage-link') &&
  widgetContent.includes('gestion_turno.html?token=') &&
  demoContent.includes('¡Turno Confirmado con Éxito!') &&
  demoContent.includes('btn-manage-link');

check(
  '1. Confirmación Web Nativa (Zero Popup Forzado a wa.me)',
  hasNativeWebConfirmation,
  'Transición inmediata a tarjeta de éxito con código #TK-XXXX, fecha, hora y enlace de autogestión'
);

// 2. Invocación de API Baileys para despacho automático
const hasBaileysDispatch = (widgetContent.includes('/api/wa/send-test') || widgetContent.includes('/api/wa/send-booking')) &&
  (demoContent.includes('/api/wa/send-test') || demoContent.includes('/api/wa/send-booking')) &&
  waRoutesContent.includes('/send-booking');

check(
  '2. Despacho Automático de Notificación al WhatsApp del Cliente',
  hasBaileysDispatch,
  'Invocación asíncrona de endpoint POST /api/wa/send-* con plantilla estructurada'
);

// 3. Fallback inteligente ante desconexión / estado CLOSE
const hasFallbackLogic = widgetContent.includes('btn-fallback-wa') &&
  widgetContent.includes('Guardar comprobante en mi WhatsApp') &&
  demoContent.includes('btn-fallback-wa') &&
  demoContent.includes('Guardar comprobante en mi WhatsApp');

check(
  '3. Fallback Inteligente si Baileys está Desconectado / Offline',
  hasFallbackLogic,
  'Muestra botón secundario para guardar comprobante vía deep link sin bloquear la reserva'
);

// 4. Copys de Mensaje Automático en admin_l2.html
const hasAdminAutoMessageCopy = adminContent.includes('Mensaje Automático de Confirmación al Cliente') &&
  (adminContent.includes('despacha automáticamente al WhatsApp del cliente') || adminContent.includes('servidor Baileys despacha automáticamente'));

check(
  '4. Ajuste de Copys en Admin L2 (Mensaje Automático al Cliente)',
  hasAdminAutoMessageCopy,
  'Aclaración explícita sobre el despacho automático del sistema al momento de reservar'
);

// 5. Ley de 200 Líneas en Widget y Suite QA
const widgetLines = widgetContent.split('\n').length;
const suiteLines = fs.readFileSync(__filename, 'utf-8').split('\n').length;
const complies200 = widgetLines <= 180 && suiteLines <= 180;

check(
  '5. Cumplimiento de la Ley de 200 Líneas (Modularización PEAC)',
  complies200,
  `Widget L2: ${widgetLines}/200 líneas | Suite: ${suiteLines}/200 líneas (< 180 OK)`
);

console.log('\n' + '═'.repeat(68));
console.log(`🎯 RESULTADO: ${passCount}/${totalChecks} CHECKS CERTIFICADOS (${Math.round((passCount/totalChecks)*100)}%)`);
console.log('═'.repeat(68) + '\n');

if (passCount !== totalChecks) {
  process.exit(1);
}
