// Archivo: scripts/test_stitch_mcp_client.cjs
// Test de Certificación: StitchMcpClient y StitchRpcHandler con Trazabilidad y Error Rejection

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const StitchMcpClient = require('../backend/services/StitchMcpClient');
const StitchRpcHandler = require('../backend/services/stitch/StitchRpcHandler');

async function testStitchMcp() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('🛡️ TEST: CERTIFICACIÓN DE STITCH MCP CLIENT (GATE 2 - FORJA)');
  console.log('════════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let total = 0;

  // TEST 1: Creación de proyecto real con trazabilidad y extracción de ID
  console.log('1. Probando StitchMcpClient._createProject("100 Ópticas - Certificación")...');
  total++;
  try {
    const projectId = await StitchMcpClient._createProject("100 Ópticas - Certificación");
    console.log(`   ✅ [PASS] Project ID obtenido exitosamente: ${projectId}`);
    if (typeof projectId === 'string' && projectId.length >= 10) {
      passed++;
    } else {
      throw new Error(`Project ID inválido o vacío: ${projectId}`);
    }
  } catch (err) {
    throw new Error(`Fallo en _createProject: ${err.message}`);
  }

  // TEST 2: Rechazo explícito de promesas ante isError: true
  console.log('\n2. Probando rechazo de promesas ante argumentos inválidos (isError: true)...');
  total++;
  try {
    // get_screen sin los parámetros requeridos name / projectId
    await StitchRpcHandler.request("get_screen", { invalidParam: "test" });
    throw new Error('Se esperaba que la promesa fuera rechazada por isError: true pero resolvió');
  } catch (err) {
    if (err.message.includes('[Stitch MCP') || err.message.includes('argument') || err.message.includes('Required')) {
      console.log(`   ✅ [PASS] Promesa rechazada correctamente con mensaje: "${err.message}"`);
      passed++;
    } else {
      throw err;
    }
  }

  // TEST 3: Sanitización de argumentos (objetos o strings vacíos como title)
  console.log('\n3. Probando sanitización de title en _createProject({ name: "Objeto Title" })...');
  total++;
  try {
    const projectId2 = await StitchMcpClient._createProject({ name: "Objeto Title Fallback" });
    console.log(`   ✅ [PASS] Project ID con title sanitizado: ${projectId2}`);
    passed++;
  } catch (err) {
    throw new Error(`Fallo en sanitización: ${err.message}`);
  }

  console.log('\n════════════════════════════════════════════════════════════════════');
  console.log(`🎯 RESULTADO FINAL: ${passed}/${total} PRUEBAS STITCH CERTIFICADAS (100%)`);
  console.log('════════════════════════════════════════════════════════════════════\n');
}

testStitchMcp().catch(err => {
  console.error('\n❌ ERROR EN CERTIFICACIÓN STITCH MCP:', err.message);
  process.exit(1);
});
