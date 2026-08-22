// Archivo: scripts/test_render_health_endpoint.cjs
/**
 * 🛡️ ARGUS QA: CERTIFICACIÓN DESPLIEGUE RENDER & KEEP-ALIVE UPTIMEROBOT
 * - Verificación en vivo de GET /health (HTTP 200, status: "online", baileysState)
 * - Verificación de GET /api/health
 * - Validez estructural de render.yaml
 * - Existencia y completitud de docs/despliegue_render_uptimerobot.md
 * - Ley de 200 Líneas en suite QA
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
let passCount = 0;
let totalChecks = 5;

console.log('═'.repeat(68));
console.log('🛡️ ARGUS QA: CERTIFICACIÓN DESPLIEGUE RENDER & UPTIMEROBOT');
console.log('═'.repeat(68) + '\n');

function check(title, condition, detail) {
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${title} → ${detail}`);
  } else {
    console.error(`❌ [FAIL] ${title} → ${detail}`);
  }
}

async function runTests() {
  const { app } = require('../backend/server');
  const server = http.createServer(app);
  const TEST_PORT = 5899;

  await new Promise((resolve) => server.listen(TEST_PORT, resolve));

  function getJson(urlPath) {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${TEST_PORT}${urlPath}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }).on('error', reject);
    });
  }

  // 1. Verificar GET /health (Endpoint Keep-Alive)
  const healthRes = await getJson('/health');
  const isHealthOk = healthRes.status === 200 &&
    healthRes.body?.status === 'online' &&
    typeof healthRes.body?.uptime === 'number' &&
    typeof healthRes.body?.baileysState === 'string' &&
    healthRes.body?.service === 'tucured-engine-backend';

  check(
    '1. Endpoint Keep-Alive GET /health para UptimeRobot',
    isHealthOk,
    `HTTP 200 OK | status: "${healthRes.body?.status}", baileysState: "${healthRes.body?.baileysState}"`
  );

  // 2. Verificar GET /api/health
  const apiHealthRes = await getJson('/api/health');
  const isApiHealthOk = apiHealthRes.status === 200 &&
    apiHealthRes.body?.status === 'HEALTHY' &&
    typeof apiHealthRes.body?.baileysState === 'string';

  check(
    '2. Endpoint Diagnóstico GET /api/health',
    isApiHealthOk,
    `HTTP 200 OK | engine: "${apiHealthRes.body?.engine}", baileysState: "${apiHealthRes.body?.baileysState}"`
  );

  // 3. Validez de render.yaml
  const renderYamlPath = path.join(rootDir, 'render.yaml');
  const hasRenderYaml = fs.existsSync(renderYamlPath);
  const yamlContent = hasRenderYaml ? fs.readFileSync(renderYamlPath, 'utf-8') : '';
  const isYamlValid = hasRenderYaml &&
    yamlContent.includes('type: web') &&
    yamlContent.includes('plan: free') &&
    yamlContent.includes('healthCheckPath: /health') &&
    yamlContent.includes('startCommand: node backend/server.js');

  check(
    '3. Manifiesto de Despliegue render.yaml (IaC Free Tier)',
    isYamlValid,
    'Configuración de Web Service Node.js, plan gratuito y healthCheckPath /health'
  );

  // 4. Guía de Despliegue en Documentación
  const docPath = path.join(rootDir, 'docs/despliegue_render_uptimerobot.md');
  const hasDoc = fs.existsSync(docPath);
  const docContent = hasDoc ? fs.readFileSync(docPath, 'utf-8') : '';
  const isDocComplete = hasDoc &&
    docContent.includes('GUÍA OPERATIVA: DESPLIEGUE CLOUD $0') &&
    docContent.includes('Render.com') &&
    docContent.includes('UptimeRobot') &&
    docContent.includes('Every 5 minutes');

  check(
    '4. Guía Operativa (docs/despliegue_render_uptimerobot.md)',
    isDocComplete,
    'Instructivo paso a paso de conexión a Render Blueprint y monitor HTTP UptimeRobot'
  );

  // 5. Cumplimiento de la Ley de 200 Líneas en Suite QA
  const suiteLines = fs.readFileSync(__filename, 'utf-8').split('\n').length;
  const complies200 = suiteLines <= 180;

  check(
    '5. Cumplimiento de la Ley de 200 Líneas en Suite QA',
    complies200,
    `Líneas de la suite: ${suiteLines}/200 líneas (umbral preventivo < 180 OK)`
  );

  server.close();

  console.log('\n' + '═'.repeat(68));
  console.log(`🎯 RESULTADO: ${passCount}/${totalChecks} CHECKS CERTIFICADOS (${Math.round((passCount/totalChecks)*100)}%)`);
  console.log('═'.repeat(68) + '\n');

  if (passCount !== totalChecks) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Error ejecutando tests:', err);
  process.exit(1);
});
