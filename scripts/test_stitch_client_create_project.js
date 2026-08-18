// Archivo: scripts/test_stitch_client_create_project.js
// Suite de Certificación: Extracción Quirúrgica de Project ID en StitchMcpClient

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config();

const StitchMcpClient = require('../backend/services/StitchMcpClient');
const StitchRpcHandler = require('../backend/services/stitch/StitchRpcHandler');

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('⚡ SUITE DE CERTIFICACIÓN: EXTRACCIÓN QUIRÚRGICA DE PROJECT ID');
    console.log('════════════════════════════════════════════════════════════════════\n');

    let passed = 0;
    let failed = 0;

    async function checkAsync(label, fn) {
        try {
            const res = await fn();
            console.log(`✅ [PASS] ${label}${res ? ' → ' + res : ''}`);
            passed++;
        } catch (e) {
            console.error(`❌ [FAIL] ${label} → ${e.message}`);
            failed++;
        }
    }

    let realProjectId = null;
    let rawResponse = null;

    // Test 1: Invocación Real a create_project y captura de payload crudo
    await checkAsync('1. Invocación Real create_project con X-Goog-Api-Key', async () => {
        rawResponse = await StitchRpcHandler.request("create_project", { title: "Bar Irlanda Certification Test" });
        if (!rawResponse || (!rawResponse.result && !rawResponse.name)) {
            throw new Error(`Respuesta inválida de Stitch MCP: ${JSON.stringify(rawResponse)}`);
        }
        return `Payload crudo recibido (${JSON.stringify(rawResponse).length} bytes)`;
    });

    // Test 2: Invocación de StitchMcpClient._createProject
    await checkAsync('2. StitchMcpClient._createProject extrae Project ID numérico válido', async () => {
        realProjectId = await StitchMcpClient._createProject("Bar Irlanda Real Project");
        if (!realProjectId || typeof realProjectId !== 'string' || !/^\d{15,22}$/.test(realProjectId)) {
            throw new Error(`Project ID inválido obtenido: "${realProjectId}"`);
        }
        return `Project ID extraído con éxito: ${realProjectId}`;
    });

    // Test 3: Resiliencia ante múltiples formatos de deserialización
    await checkAsync('3. Resiliencia de parseo ante variaciones de payload (SDK / JSON-RPC / Regex)', async () => {
        // Formato 1: structuredContent
        const mock1 = { result: { structuredContent: { name: "projects/998877665544332211" } } };
        const origReq = StitchRpcHandler.request;
        
        try {
            StitchRpcHandler.request = async () => mock1;
            const p1 = await StitchMcpClient._createProject("Mock Test 1");
            if (p1 !== "998877665544332211") throw new Error(`Formato 1 falló: ${p1}`);

            // Formato 2: content[0].text escapado
            const mock2 = { result: { content: [{ text: "{\"name\":\"projects/112233445566778899\",\"title\":\"Test\"}" }] } };
            StitchRpcHandler.request = async () => mock2;
            const p2 = await StitchMcpClient._createProject("Mock Test 2");
            if (p2 !== "112233445566778899") throw new Error(`Formato 2 falló: ${p2}`);

            // Formato 3: Objeto crudo con regex fallback
            const mock3 = { result: { raw_output: "Project created with id projects/554433221100998877 successfully" } };
            StitchRpcHandler.request = async () => mock3;
            const p3 = await StitchMcpClient._createProject("Mock Test 3");
            if (p3 !== "554433221100998877") throw new Error(`Formato 3 falló: ${p3}`);

            return `3/3 formatos de deserialización resueltos con precisión`;
        } finally {
            StitchRpcHandler.request = origReq;
        }
    });

    // Test 4: Ley de 200 Líneas en StitchMcpClient.js
    const targetFile = path.resolve(__dirname, '../backend/services/StitchMcpClient.js');
    try {
        const lines = fs.readFileSync(targetFile, 'utf-8').split('\n').length;
        if (lines > 180) throw new Error(`StitchMcpClient.js supera 180 líneas (${lines} lín)`);
        console.log(`✅ [PASS] 4. Ley de 200 Líneas estricta → ${lines} líneas (< 180 lín)`);
        passed++;
    } catch (e) {
        console.error(`❌ [FAIL] 4. Ley de 200 Líneas → ${e.message}`);
        failed++;
    }

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed/(passed+failed))*100)}%)`);
    console.log(`📋 RAW STITCH PAYLOAD: ${JSON.stringify(rawResponse)}`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

run();
