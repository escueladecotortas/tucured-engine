// Archivo: scripts/test_backend_live_boot.cjs
/**
 * CERTIFICACIÓN DE ARRANQUE EN VIVO DE BACKEND
 * Protocolo: Nexus OS v11.1 - ARGUS (QA) & KAEL (DevOps)
 */

const http = require('http');
const path = require('path');
const { app } = require('../backend/server');

const TEST_PORT = 5088;

async function run() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('🩺 CERTIFICACIÓN DE ARRANQUE Y CARGA DE RUTAS EN BACKEND');
  console.log('════════════════════════════════════════════════════════════════════\n');

  const server = http.createServer(app);
  await new Promise(r => server.listen(TEST_PORT, '127.0.0.1', r));
  console.log(`🚀 Servidor Express iniciado exitosamente en http://127.0.0.1:${TEST_PORT}\n`);

  let passed = 0;
  let failed = 0;

  async function testRoute(label, path, expectedStatus = 200) {
    return new Promise((resolve) => {
      http.get(`http://127.0.0.1:${TEST_PORT}${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === expectedStatus) {
            console.log(`✅ [PASS] ${label} (${path}) ➔ HTTP ${res.statusCode}`);
            passed++;
          } else {
            console.error(`❌ [FAIL] ${label} (${path}) ➔ Esperado: ${expectedStatus}, Recibido: ${res.statusCode}`);
            failed++;
          }
          resolve();
        });
      }).on('error', (err) => {
        console.error(`❌ [FAIL] ${label} (${path}) ➔ Error de red: ${err.message}`);
        failed++;
        resolve();
      });
    });
  }

  await testRoute('Health Check General', '/api/health', 200);
  await testRoute('Listado de Prospectos (Local-First)', '/api/leads/prospects', 200);
  await testRoute('Kanban Tasks SSOT', '/api/kanban/tasks', 200);
  await testRoute('Nexus Ping', '/api/nexus/ping', 200);
  await testRoute('Nexus Metrics', '/api/nexus/metrics', 200);
  await testRoute('Nexus Assets List (100 Opticas)', '/api/nexus/assets/list?slug=100-opticas', 200);

  await new Promise(r => server.close(r));

  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log(`🎯 RESULTADO FINAL: ${passed}/${passed + failed} PRUEBAS EXITOSAS (${Math.round((passed / (passed + failed)) * 100)}%)`);
  console.log('════════════════════════════════════════════════════════════════════');

  process.exit(failed > 0 ? 1 : 0);
}

run();
