// Archivo: scripts/test_stitch_official_generation.js
// Suite de Certificación: Autenticación X-Goog-Api-Key, SDK Oficial y Forja E2E de Google Stitch

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurar variable para SDK oficial
process.env.STITCH_API_KEY = (process.env.STITCH_API_KEY || process.env.GOOGLE_STITCH_API_KEY || '').replace(/["']/g, '').trim();

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🔱 CERTIFICACIÓN OFICIAL DE GOOGLE STITCH SDK & HEADER X-Goog-Api-Key');
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

    // 1. Handshake Canónico JSON-RPC con X-Goog-Api-Key
    await checkAsync('1. Handshake Canónico JSON-RPC con X-Goog-Api-Key (HTTP 200 / Cero 401)', async () => {
        const apiKey = process.env.STITCH_API_KEY;
        if (!apiKey) throw new Error('STITCH_API_KEY / GOOGLE_STITCH_API_KEY no configurada');

        const body = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} });
        const res = await new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'stitch.googleapis.com', port: 443, path: '/mcp', method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'Content-Length': Buffer.byteLength(body)
                }
            }, r => {
                let d = '';
                r.on('data', c => d += c);
                r.on('end', () => resolve({ status: r.statusCode, data: JSON.parse(d || '{}') }));
            });
            req.on('error', reject);
            req.write(body);
            req.end();
        });

        if (res.status !== 200) throw new Error(`HTTP Status ${res.status}: ${JSON.stringify(res.data)}`);
        const toolsCount = res.data?.result?.tools?.length || 0;
        return `HTTP 200 OK | ${toolsCount} herramientas registradas en Stitch MCP`;
    });

    // 2. Conexión mediante @google/stitch-sdk oficial
    let project = null;
    await checkAsync('2. Inicialización y Creación de Proyecto con @google/stitch-sdk', async () => {
        const { stitch, StitchToolClient } = await import('@google/stitch-sdk');
        
        const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });
        const { tools } = await client.listTools();
        await client.close();

        project = await stitch.createProject("Bar Irlanda - Tucu Red Demo");
        const pId = project.id || project.projectId;
        if (!pId) throw new Error('No se recibió ID de proyecto');
        return `Project ID: ${pId} ("Bar Irlanda - Tucu Red Demo")`;
    });

    // 3. Generación de Pantalla con Prompt Enriquecido según Fórmula Stitch
    let generatedScreen = null;
    let htmlContent = '';
    const testSlug = 'bar-irlanda-test';
    
    await checkAsync('3. Generación Oficial de Pantalla (Formula Stitch: Idea + Theme + Content)', async () => {
        if (!project) throw new Error('Proyecto no inicializado en paso anterior');

        const prompt = `
Landing page de alta conversión para "Bar Irlanda" en Tucumán.
- Idea: Pub temático irlandés y cervecería artesanal con eventos en vivo.
- Theme: Estilo gastronómico / bar nocturno con alta fidelidad, colores oscuros con acentos dorados y verdes irlandeses, tipografía sans-serif limpia.
- Content: Sección Hero con CTA a WhatsApp (+5493815559876), grilla de eventos y menú cervecero, galería de fotos y formulario de reserva.
        `.trim();

        console.log('   ⏳ Invocando project.generate("Bar Irlanda")... (puede tomar 15-25s)');
        generatedScreen = await project.generate(prompt, "DESKTOP");
        if (!generatedScreen) throw new Error('Fallo al generar pantalla');

        const htmlUrl = await generatedScreen.getHtml();
        if (!htmlUrl) throw new Error('No se recibió URL de descarga de HTML');

        // Descargar el HTML real
        htmlContent = await new Promise((resolve, reject) => {
            https.get(htmlUrl, r => {
                let d = '';
                r.on('data', c => d += c);
                r.on('end', () => resolve(d));
            }).on('error', reject);
        });

        if (!htmlContent || htmlContent.length < 200) throw new Error(`HTML descargado inválido (${htmlContent.length} bytes)`);
        return `Screen ID: ${generatedScreen.id || generatedScreen.screenId} | HTML: ${htmlContent.length} bytes`;
    });

    // 4. Persistencia Dual (public/clients/<slug>/index.html + nexus_archives/...)
    await checkAsync('4. Persistencia Dual en Disco (public/clients + nexus_archives)', async () => {
        const publicPath = path.resolve(__dirname, `../public/clients/${testSlug}`);
        const archivesPath = path.resolve(__dirname, `../nexus_archives/tucu-red/clients/${testSlug}`);

        fs.mkdirSync(publicPath, { recursive: true });
        fs.mkdirSync(archivesPath, { recursive: true });

        fs.writeFileSync(path.join(publicPath, 'index.html'), htmlContent, 'utf-8');
        fs.writeFileSync(path.join(archivesPath, 'index.html'), htmlContent, 'utf-8');

        if (!fs.existsSync(path.join(publicPath, 'index.html'))) throw new Error('No existe public/clients/.../index.html');
        if (!fs.existsSync(path.join(archivesPath, 'index.html'))) throw new Error('No existe nexus_archives/.../index.html');

        return `Guardado en: public/clients/${testSlug}/index.html (${htmlContent.length} B)`;
    });

    // 5. Ley de 200 Líneas en Archivos de Stitch
    const files = [
        'backend/services/stitch/StitchRpcHandler.js',
        'backend/services/stitch/StitchPipeline.js',
        'backend/services/StitchMcpClient.js',
        'backend/routes/forge/stitch.js'
    ];

    try {
        for (const rel of files) {
            const p = path.resolve(__dirname, '..', rel);
            if (fs.existsSync(p)) {
                const lines = fs.readFileSync(p, 'utf-8').split('\n').length;
                if (lines > 180) throw new Error(`${rel} supera 180 líneas (${lines} lín)`);
            }
        }
        console.log(`✅ [PASS] 5. Ley de 200 Líneas estricta → ${files.length} archivos conformes (< 180 líneas)`);
        passed++;
    } catch (e) {
        console.error(`❌ [FAIL] 5. Ley de 200 Líneas → ${e.message}`);
        failed++;
    }

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed/(passed+failed))*100)}%)`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

run();
