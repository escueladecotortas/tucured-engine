// Archivo: scripts/test_showroom_wa_integration.cjs
// Suite de Certificación: Integración Visual WhatsApp Baileys en Showroom L1 (Argus QA - Ley de 200 líneas)
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const waRoutes = require('../backend/services/whatsapp/wa_routes.cjs');
const waService = require('../backend/services/whatsapp/wa_node.cjs');

async function runSuite() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('🛡️ ARGUS QA: VERIFICACIÓN DE INTEGRACIÓN VISUAL BAILEYS EN SHOWROOM');
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

  // Check 1: Integridad del HTML de Showroom
  const showroomPath = path.join(__dirname, '../public/showroom_l1.html');
  const showroomHtml = fs.readFileSync(showroomPath, 'utf-8');

  const requiredIds = [
    'wa-status-badge', 'wa-status-text', 'btn-wa-init', 'btn-wa-logout',
    'wa-qr-modal', 'modal-qr-img', 'modal-qr-loader', 'btn-close-qr-modal',
    'wa-test-box', 'wa-test-phone', 'btn-wa-check', 'btn-wa-send', 'wa-test-feedback'
  ];

  const missingIds = requiredIds.filter(id => !showroomHtml.includes(`id="${id}"`));
  assert(
    missingIds.length === 0,
    '1. Presencia de Elementos DOM Requeridos en showroom_l1.html',
    missingIds.length === 0 ? '13/13 IDs presentes (Badge, Modal, QR, Botones, Test)' : `Faltan: ${missingIds.join(', ')}`
  );

  // Check 2: Llamadas a la Micro-API en Script de Showroom
  const hasStatusFetch = showroomHtml.includes("fetch('/api/wa/status')");
  const hasInitFetch = showroomHtml.includes("fetch('/api/wa/init'");
  const hasLogoutFetch = showroomHtml.includes("fetch('/api/wa/logout'");
  const hasCheckFetch = showroomHtml.includes("fetch('/api/wa/check-phone'");
  const hasSendFetch = showroomHtml.includes("fetch('/api/wa/send-test'");

  assert(
    hasStatusFetch && hasInitFetch && hasLogoutFetch && hasCheckFetch && hasSendFetch,
    '2. Conexión de Endpoints Fetch en Frontend Showroom',
    'Endpoints status, init, logout, check-phone, send-test integrados'
  );

  // Check 3: Polling reactivo y auto-cierre del Modal
  const hasPolling = showroomHtml.includes('startWaPolling') && showroomHtml.includes('stopWaPolling') && showroomHtml.includes('setInterval');
  assert(
    hasPolling,
    '3. Sistema de Polling y Auto-detección de Vinculación',
    'Polling a /api/wa/status con temporizador y auto-dismiss implementado'
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
    // Check 4: Endpoint POST /api/wa/logout
    const logoutRes = await request('/api/wa/logout', 'POST');
    assert(
      logoutRes.status === 200 && logoutRes.body.success === true && logoutRes.body.status?.status === 'CLOSE',
      '4. Endpoint POST /api/wa/logout (Purgado y reset de sesión)',
      `Status HTTP 200, Estado resultante: ${logoutRes.body.status?.status}`
    );

    // Check 5: Endpoint POST /api/wa/check-phone con número móvil argentino
    const checkRes = await request('/api/wa/check-phone', 'POST', { phone: '3815123456' });
    assert(
      checkRes.status === 200 && checkRes.body.success === true && checkRes.body.jid.startsWith('549381'),
      '5. Normalización y Validación JID en check-phone',
      `JID generado: ${checkRes.body.jid}`
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
