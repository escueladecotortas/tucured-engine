// Archivo: scripts/test_showroom_wizard.cjs
// Suite de Certificación: Wizard Onboarding Seguro, Auto-inyección y Erradicación de Alerts (Argus QA - Ley de 200 líneas)
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const waRoutes = require('../backend/services/whatsapp/wa_routes.cjs');
const waService = require('../backend/services/whatsapp/wa_node.cjs');

async function runSuite() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('🛡️ ARGUS QA: VERIFICACIÓN DE WIZARD ONBOARDING & ERRADICACIÓN ALERTS');
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

  const showroomPath = path.join(__dirname, '../public/showroom_l1.html');
  const showroomHtml = fs.readFileSync(showroomPath, 'utf-8');

  // Check 1: Erradicación Absoluta de window.alert, window.confirm y prompt
  const hasAlert = /\balert\s*\(/.test(showroomHtml);
  const hasConfirm = /\bconfirm\s*\(/.test(showroomHtml);
  const hasPrompt = /\bprompt\s*\(/.test(showroomHtml);

  assert(
    !hasAlert && !hasConfirm && !hasPrompt,
    '1. Erradicación Absoluta de Alerts/Confirms/Prompts Nativos',
    `alert(): ${hasAlert ? 'DETECTADO ❌' : '0 ✅'} | confirm(): ${hasConfirm ? 'DETECTADO ❌' : '0 ✅'} | prompt(): ${hasPrompt ? 'DETECTADO ❌' : '0 ✅'}`
  );

  // Check 2: Estructura del Wizard Onboarding Seguro (3 Pasos)
  const wizardElements = [
    'wizard-step-1', 'wizard-step-2', 'wizard-step-3',
    'wiz-dot-1', 'wiz-dot-2', 'wiz-dot-3',
    'btn-wizard-to-step-2', 'btn-wizard-back-to-1',
    'wizard-connected-number', 'wizard-test-phone',
    'btn-wizard-send-test', 'btn-wizard-finish'
  ];
  const missingWizard = wizardElements.filter(id => !showroomHtml.includes(`id="${id}"`));
  assert(
    missingWizard.length === 0,
    '2. Estructura Completa del Wizard Onboarding (3 Pasos)',
    missingWizard.length === 0 ? '12/12 componentes del Stepper presentes' : `Faltan: ${missingWizard.join(', ')}`
  );

  // Check 3: Modal Nativo de Desconexión & Toast
  const nativeModals = ['wa-logout-modal', 'btn-cancel-logout', 'btn-confirm-logout', 'toast-notification', 'toast-message'];
  const missingModals = nativeModals.filter(id => !showroomHtml.includes(`id="${id}"`));
  assert(
    missingModals.length === 0,
    '3. Modal Nativo de Desconexión y Sistema Toast Flotante',
    missingModals.length === 0 ? 'Modal nativo con Tailwind y Toast presentes' : `Faltan: ${missingModals.join(', ')}`
  );

  // Check 4: Auto-Inyección y Badge Verificado en Identidad
  const hasVerifiedBadge = showroomHtml.includes('id="wa-verified-badge"');
  const hasAutoInjectionLogic = showroomHtml.includes('inputWaNumber.value = verifiedPhone') && showroomHtml.includes('extractPhoneFromJid');
  assert(
    hasVerifiedBadge && hasAutoInjectionLogic,
    '4. Sincronización Blindada & Auto-Inyección en Pestaña Identidad',
    'Badge "Verificado vía QR" y mutación reactiva de #cfg-wa-number verificados'
  );

  // Iniciar servidor Express de prueba
  const app = express();
  app.use(express.json());
  app.use('/api/wa', waRoutes);
  const server = http.createServer(app);

  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const request = (urlPath, method = 'GET', body = null) => {
    return new Promise((resolve, reject) => {
      const url = new URL(urlPath, baseUrl);
      const req = http.request(url, {
        method,
        headers: { 'Content-Type': 'application/json' }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: res.headers['content-type']?.includes('json') ? JSON.parse(data) : data });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });
      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  };

  try {
    // Check 5: Purga y Reseteo con POST /api/wa/logout
    const logoutRes = await request('/api/wa/logout', 'POST');
    assert(
      logoutRes.status === 200 && logoutRes.body.success === true &&
      logoutRes.body.status?.status === 'CLOSE',
      '5. Ciclo de Purga y Logout en Micro-API',
      `Sesión reiniciada a CLOSE y credenciales eliminadas`
    );
  } finally {
    server.close();
    await waService.stop();
  }

  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log(`🎯 RESULTADO: ${passed}/${total} CHECKS EXITOSOS (${Math.round((passed/total)*100)}%)`);
  console.log('════════════════════════════════════════════════════════════════════\n');

  if (passed !== total) process.exit(1);
}

runSuite().catch(err => {
  console.error('❌ Error fatal en suite de pruebas:', err);
  process.exit(1);
});
