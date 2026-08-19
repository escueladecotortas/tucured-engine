// Archivo: scripts/test_sse_terminal.cjs
// Suite de Certificación: Telemetría en Tiempo Real y Streaming SSE con TerminalService

const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const { app } = require('../backend/server');
const TerminalService = require('../backend/services/telemetry/TerminalService');

const TEST_PORT = 5067;

async function testSseTelemetry() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('📡 TEST: CERTIFICACIÓN DE TELEMETRÍA EN TIEMPO REAL SSE');
  console.log('════════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let total = 0;

  // 1. Iniciar servidor Express
  const server = http.createServer(app);
  await new Promise(r => server.listen(TEST_PORT, '127.0.0.1', r));
  console.log(`1. Servidor de prueba escuchando en http://127.0.0.1:${TEST_PORT}`);

  const receivedEvents = [];

  // 2. Conectar cliente SSE a /api/terminal/stream
  const sseReq = http.request({
    hostname: '127.0.0.1',
    port: TEST_PORT,
    path: '/api/terminal/stream',
    method: 'GET',
    headers: {
      'Accept': 'text/event-stream'
    }
  }, (res) => {
    res.on('data', (chunk) => {
      const text = chunk.toString();
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const rawJson = line.substring(6).trim();
            const data = JSON.parse(rawJson);
            receivedEvents.push(data);
          } catch (e) {}
        }
      }
    });
  });

  sseReq.on('error', (err) => {
    console.error('❌ Error en cliente SSE:', err.message);
  });

  sseReq.end();

  // Esperar handshake inicial
  await new Promise(r => setTimeout(r, 600));

  total++;
  if (receivedEvents.length > 0 && receivedEvents[0].message.includes('Enlace neural SSE establecido')) {
    console.log('   ✅ [PASS] Conexión SSE establecida con mensaje de handshake inicial.');
    passed++;
  } else {
    throw new Error('No se recibió el mensaje de bienvenida inicial de SSE.');
  }

  // 3. Emitir secuencia de eventos de pipeline con progreso real
  console.log('\n2. Emitiendo secuencia de telemetría de pipeline (Gate 2 Forja)...');
  
  TerminalService.broadcast('🚀 Pipeline Stitch v5.2 activado para "100 ÓPTICAS"', 'info', 10, 'ORION');
  await new Promise(r => setTimeout(r, 200));

  TerminalService.broadcast('🌱 Paso 1/3: Ensamblando Semilla Narrativa por Arquetipo...', 'info', 25, 'ATENEA');
  await new Promise(r => setTimeout(r, 200));

  TerminalService.broadcast('🎨 Paso 2/3: Director de Arte & ADN Visual...', 'info', 50, 'LOREM');
  await new Promise(r => setTimeout(r, 200));

  TerminalService.broadcast('⬇️ Paso 3/3: Descarga, Inyección & Persistencia...', 'info', 75, 'CODI');
  await new Promise(r => setTimeout(r, 200));

  TerminalService.broadcast('🧬 Inyectando Arsenal de Widgets & Sanitizando Navbar...', 'info', 92, 'ARGUS');
  await new Promise(r => setTimeout(r, 200));

  TerminalService.broadcast('✅ Forja completada exitosamente. Preview listo.', 'success', 100, 'NEXUS');
  await new Promise(r => setTimeout(r, 400));

  // 4. Validar recepción y estructura completa de los eventos
  total++;
  console.log(`\n3. Verificando eventos capturados por el cliente SSE (${receivedEvents.length} eventos)...`);
  
  const pipelineEvents = receivedEvents.filter(e => e.progress !== null && e.progress !== undefined);
  console.log('   📊 Progresiones capturadas: ' + pipelineEvents.map(e => `${e.agent}:${e.progress}%`).join(' -> '));

  const expectedPercentages = [10, 25, 50, 75, 92, 100];
  const matchedPercentages = expectedPercentages.every(p => pipelineEvents.some(e => e.progress === p));

  if (matchedPercentages && pipelineEvents.length >= 6) {
    console.log('   ✅ [PASS] Todos los porcentajes de progreso real (10% -> 25% -> 50% -> 75% -> 92% -> 100%) recibidos.');
    passed++;
  } else {
    throw new Error(`Faltan eventos de progreso esperados. Recibidos: ${JSON.stringify(pipelineEvents)}`);
  }

  // 5. Validar estructura de campos (timestamp, agent, message, status, progress)
  total++;
  const lastEvent = pipelineEvents[pipelineEvents.length - 1];
  if (lastEvent.status === 'success' && lastEvent.progress === 100 && lastEvent.agent === 'NEXUS' && lastEvent.timestamp) {
    console.log('   ✅ [PASS] Evento final tiene payload completo y estado "success" con 100% de progreso.');
    passed++;
  } else {
    throw new Error('Estructura de evento SSE inválida en el evento de cierre.');
  }

  // Cerrar cliente y servidor
  sseReq.destroy();
  await new Promise(r => server.close(r));

  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log(`🎯 RESULTADO FINAL: ${passed}/${total} PRUEBAS SSE CERTIFICADAS (100%)`);
  console.log('════════════════════════════════════════════════════════════════════\n');
}

testSseTelemetry().catch(err => {
  console.error('\n❌ ERROR EN CERTIFICACIÓN SSE:', err.message);
  process.exit(1);
});
