// Archivo: scripts/test_stitch_step3_resilience.js
// Suite de Certificación: Paso 3 de Stitch, Descarga Resiliente e Inyección sin Fallos

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config();

const StitchPipeline = require('../backend/services/stitch/StitchPipeline');
const NexusInjectorService = require('../backend/services/NexusInjectorService');
const CloudDeployOrchestrator = require('../backend/services/CloudDeployOrchestrator');

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('⚡ SUITE DE CERTIFICACIÓN: PASO 3 RESILIENTE Y MANEJO DE DESCARGA');
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

    const testSlug = 'bar-irlanda-test';
    
    // HTML de muestra completo y válido (> 1200 bytes)
    const sampleHtml = `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bar Irlanda - Cervecería y Pub en Tucumán</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-zinc-950 text-white font-sans antialiased">
        <header class="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-emerald-400">Bar Irlanda</h1>
            <nav class="space-x-4"><a href="#menu" class="hover:text-emerald-400">Carta</a><a href="#contacto" class="hover:text-emerald-400">Contacto</a></nav>
        </header>
        <main class="container mx-auto px-4 py-12">
            <section id="hero" class="text-center py-16">
                <h2 class="text-4xl font-extrabold mb-4">El mejor bar de Tucumán</h2>
                <p class="text-zinc-400 max-w-xl mx-auto">Cervezas artesanales, tragos de autor y la mejor gastronomía nocturna.</p>
            </section>
        </main>
        <footer class="p-6 border-t border-zinc-900 text-center text-zinc-500">
            <p>Bar Irlanda © 2026 • Tucu Red Engine</p>
        </footer>
    </body>
    </html>`;

    // 1. Iniciar Servidor Local para simular CDN de Stitch
    const mockCdnServer = http.createServer((req, res) => {
        if (req.url === '/download/bar-irlanda.html') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(sampleHtml);
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    });

    await new Promise(r => mockCdnServer.listen(0, '127.0.0.1', r));
    const cdnPort = mockCdnServer.address().port;
    const mockDownloadUrl = `http://127.0.0.1:${cdnPort}/download/bar-irlanda.html`;

    const testLead = {
        name: 'Bar Irlanda',
        slug: testSlug,
        category: 'gastronomia_bar',
        toneVoice: 'Nocturno, cervecero, enérgico',
        rating: 4.3,
        reviewsCount: 4288,
        phone: '+5493815559876',
        whatsapp: '+5493815559876',
        address: 'Catamarca 380, Tucumán',
        topReviews: [{ author: 'Lucas', rating: 5, text: 'Gran cerveza artesanal y show en vivo.' }]
    };

    // Test 1: Paso 3 de StitchPipeline (Descarga + Inyección + Persistencia Dual)
    await checkAsync('1. Paso 3 (Descarga + Inyección + Persistencia Dual) → localUrl', async () => {
        const res = await StitchPipeline.processHtml(mockDownloadUrl, testSlug, testLead, null, { selectedWidgets: [] });
        if (!res.success || !res.localUrl) throw new Error(`Resultado inválido: ${JSON.stringify(res)}`);

        const archivesHtml = path.resolve(__dirname, `../nexus_archives/tucu-red/clients/${testSlug}/index.html`);
        const publicHtml = path.resolve(__dirname, `../public/clients/${testSlug}/index.html`);

        if (!fs.existsSync(archivesHtml) || !fs.existsSync(publicHtml)) {
            throw new Error('Falta index.html en nexus_archives o public/clients');
        }

        const content = fs.readFileSync(publicHtml, 'utf8');
        if (!content.includes('Bar Irlanda') || content.length < 500) {
            throw new Error('Contenido HTML generado corrupto o incompleto');
        }
        return `Generado en ${res.localUrl} (${content.length} bytes)`;
    });

    // Test 2: Inyección Resiliente ante HTML sin slots explícitos
    await checkAsync('2. Inyección Resiliente de Widgets sin slots explícitos (anexado antes de footer)', async () => {
        const rawNoSlots = `<html><body><h1>Sin Slots</h1><footer>Footer</footer></body></html>`;
        const result = NexusInjectorService.process(rawNoSlots, testLead);
        
        if (!result.includes('Lo que dicen nuestros clientes') || !result.includes('Cómo Llegar a Bar Irlanda')) {
            throw new Error('Widgets no inyectados en fallback antes de footer');
        }
        return `Widgets inyectados automáticamente antes de footer`;
    });

    // Test 3: Desenmascaramiento de Excepciones y Trazabilidad en Paso 3
    await checkAsync('3. Desenmascaramiento de Errores: reporte con stack y motivo claro', async () => {
        const origGenerate = (await import('../backend/services/StitchMcpClient.js')).default || require('../backend/services/StitchMcpClient');
        const prevGen = origGenerate.generate;
        
        // Mock de error para comprobar que NO se tragan las excepciones
        origGenerate.generate = async () => ({
            success: false,
            error: 'STITCH_TIMEOUT_SEGUNDO_PASO'
        });

        try {
            let threwExpected = false;
            try {
                await CloudDeployOrchestrator.executeCloudPipeline(testLead, testSlug);
            } catch (err) {
                if (err.message.includes('STITCH_TIMEOUT_SEGUNDO_PASO')) threwExpected = true;
            }
            if (!threwExpected) throw new Error('No se propagó el mensaje de error real');
            return `Propagación de error transparente y desenmascarada certicada`;
        } finally {
            origGenerate.generate = prevGen;
        }
    });

    // Test 4: Ley de 200 Líneas en Archivos del Paso 3
    const files = [
        'backend/services/stitch/StitchPipeline.js',
        'backend/services/stitch/StitchRpcHandler.js',
        'backend/services/CloudDeployOrchestrator.js',
        'backend/services/injector/WidgetInjector.js'
    ];

    try {
        for (const rel of files) {
            const p = path.resolve(__dirname, '..', rel);
            if (fs.existsSync(p)) {
                const lines = fs.readFileSync(p, 'utf-8').split('\n').length;
                if (lines > 180) throw new Error(`${rel} supera 180 líneas (${lines} lín)`);
            }
        }
        console.log(`✅ [PASS] 4. Ley de 200 Líneas estricta → ${files.length} archivos auditados (< 180 líneas)`);
        passed++;
    } catch (e) {
        console.error(`❌ [FAIL] 4. Ley de 200 Líneas → ${e.message}`);
        failed++;
    }

    await new Promise(r => mockCdnServer.close(r));

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed/(passed+failed))*100)}%)`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

run();
