// Archivo: scripts/test_baileys_poc.cjs
// Suite de Certificación: WhatsApp Baileys PoC (Argus QA - Ley de 200 líneas)
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const waService = require('../backend/services/whatsapp/wa_node.cjs');
const waRoutes = require('../backend/services/whatsapp/wa_routes.cjs');

async function runSuite() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('🛡️ ARGUS QA: BATERÍA DE PRUEBAS - MICRO-SERVICIO WHATSAPP BAILEYS');
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

  // Check 1: Singleton y API pública
  assert(
    typeof waService.init === 'function' &&
    typeof waService.getStatus === 'function' &&
    typeof waService.checkPhone === 'function' &&
    typeof waService.sendTestMessage === 'function' &&
    typeof waService.formatJid === 'function',
    '1. Arquitectura y API pública de wa_node.cjs',
    'Métodos init, getStatus, checkPhone, sendTestMessage, formatJid presentes'
  );

  // Check 2: Formateo y Normalización JID
  const testPhone1 = '3815123456';
  const jidObj1 = waService.formatJid(testPhone1);
  const testPhone2 = '+54 9 381 531-2590';
  const jidObj2 = waService.formatJid(testPhone2);
  assert(
    jidObj1 && jidObj1.jid === '5493815123456@s.whatsapp.net' &&
    jidObj2 && jidObj2.jid === '5493815312590@s.whatsapp.net',
    '2. Normalización E.164 y Ensamblado de JID',
    `JID1: ${jidObj1?.jid} | JID2: ${jidObj2?.jid}`
  );

  // Iniciar servidor express temporal para testear endpoints
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
    // Check 3: GET /api/wa/status
    const statusRes = await request('/api/wa/status');
    assert(
      statusRes.status === 200 && statusRes.body.success === true &&
      ['CLOSE', 'CONNECTING', 'QR_READY', 'OPEN'].includes(statusRes.body.status),
      '3. Endpoint GET /api/wa/status',
      `Status HTTP 200, Estado actual: ${statusRes.body.status}`
    );

    // Check 4: POST /api/wa/check-phone
    const checkRes = await request('/api/wa/check-phone', 'POST', { phone: '3815123456' });
    assert(
      checkRes.status === 200 && checkRes.body.success === true &&
      checkRes.body.jid === '5493815123456@s.whatsapp.net' &&
      checkRes.body.display.includes('+54 9 381'),
      '4. Endpoint POST /api/wa/check-phone (Sanitización y lookup seguro)',
      `JID: ${checkRes.body.jid} | Display: ${checkRes.body.display}`
    );

    // Check 5: POST /api/wa/send-test (Guardia de desconexión)
    const sendRes = await request('/api/wa/send-test', 'POST', { phone: '3815123456', message: 'Test message' });
    assert(
      sendRes.status === 500 && sendRes.body.success === false &&
      sendRes.body.error.includes('No se puede enviar mensaje'),
      '5. Endpoint POST /api/wa/send-test (Guardia estricta de sesión cerrada)',
      `Rechazo controlado: ${sendRes.body.error}`
    );

    // Check 6: GET /api/wa/qr (Dashboard Web)
    const qrRes = await request('/api/wa/qr');
    assert(
      qrRes.status === 200 && typeof qrRes.body === 'string' &&
      qrRes.body.includes('WhatsApp Baileys PoC'),
      '6. Dashboard Web Visual GET /api/wa/qr',
      'HTML renderizado con éxito para escaneo móvil'
    );

    // Check 7: Ley de 200 Líneas
    const filesToCheck = [
      'backend/services/whatsapp/wa_node.cjs',
      'backend/services/whatsapp/wa_routes.cjs',
      'backend/routes/wa.js'
    ];
    let allUnder200 = true;
    const stats = filesToCheck.map(f => {
      const full = path.join(__dirname, '..', f);
      const loc = fs.readFileSync(full, 'utf-8').split('\n').length;
      if (loc > 200) allUnder200 = false;
      return `${path.basename(f)}: ${loc}/200 lín`;
    });
    assert(allUnder200, '7. Cumplimiento de la Ley de 200 Líneas en Módulos Baileys', stats.join(' | '));

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
