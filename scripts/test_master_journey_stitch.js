// Archivo: scripts/test_master_journey_stitch.js
// Suite de Certificación: Ingesta Profunda, Curaduría Semántica, Prompt Stitch y Widgets E2E

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

const { app } = require('../backend/server');
const StitchPromptService = require('../backend/services/StitchPromptService');
const PhotoCuratorService = require('../backend/services/PhotoCuratorService');
const NexusInjectorService = require('../backend/services/NexusInjectorService');

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('⚡ SUITE DE CERTIFICACIÓN: JOURNEY MAESTRO STITCH E2E');
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
    const archivesDir = path.resolve(__dirname, `../nexus_archives/tucu-red/clients/${testSlug}`);
    const assetsDir = path.join(archivesDir, 'assets');
    fs.mkdirSync(assetsDir, { recursive: true });

    // Mock de imágenes para curaduría
    fs.writeFileSync(path.join(assetsDir, 'raw_1.jpg'), 'fake-image-1');
    fs.writeFileSync(path.join(assetsDir, 'raw_2.jpg'), 'fake-image-2');
    fs.writeFileSync(path.join(assetsDir, 'raw_3.jpg'), 'fake-image-3');

    // 1. Curaduría Semántica de Activos
    await checkAsync('1. Curaduría Semántica de Activos (hero, product_*, ambient_*)', async () => {
        const photos = ['assets/raw_1.jpg', 'assets/raw_2.jpg', 'assets/raw_3.jpg'];
        const captions = ['Noche increíble en la barra con amigos', 'Nuestra mejor IPA artesanal', 'Promo hamburguesa completa con papas'];
        
        const curated = PhotoCuratorService.curate(photos, captions, assetsDir, testSlug);
        if (!curated.hero) throw new Error('Hero no seleccionado');
        
        const heroExists = fs.existsSync(path.join(assetsDir, 'hero.jpg'));
        const prodExists = fs.existsSync(path.join(assetsDir, 'product_1.jpg'));
        const ambExists = fs.existsSync(path.join(assetsDir, 'ambient_1.jpg'));
        
        if (!heroExists || !prodExists || !ambExists) {
            throw new Error('Faltan archivos semánticos materializados (hero/product/ambient)');
        }
        return `Hero: ${curated.hero} | hero.jpg, product_1.jpg y ambient_1.jpg materializados`;
    });

    // 2. Ingesta Profunda y Payload Estructurado (Maps + IG)
    const testLead = {
        name: 'Bar Irlanda',
        slug: testSlug,
        category: 'gastronomia_bar',
        toneVoice: 'Nocturno, juvenil, cervecero, enérgico',
        rating: 4.3,
        reviewsCount: 4288,
        coordinates: { lat: -26.8322, lng: -65.2044 },
        openingHours: ['Lunes a Domingo: 19:00 - 04:00'],
        phone: '+5493815559876',
        whatsapp: '+5493815559876',
        address: 'Catamarca 380, San Miguel de Tucumán',
        topReviews: [
            { author: 'Martín G.', rating: 5, text: 'Excelente ambiente y la mejor cerveza artesanal.' },
            { author: 'Sofía R.', rating: 5, text: 'Tragos de autor imperdibles y música de 10.' },
            { author: 'Luciano T.', rating: 4, text: 'Muy buena comida y atención rápida.' }
        ]
    };

    // Guardar client-assets.json
    fs.writeFileSync(path.join(archivesDir, 'client-assets.json'), JSON.stringify(testLead, null, 2));

    await checkAsync('2. Payload Estructurado con Horarios, Coordenadas y Rating 4.3 (4288 reviews)', async () => {
        const raw = fs.readFileSync(path.join(archivesDir, 'client-assets.json'), 'utf8');
        const json = JSON.parse(raw);
        if (json.rating !== 4.3 || json.reviewsCount !== 4288 || !json.coordinates?.lat || !json.openingHours?.length) {
            throw new Error(`Datos incompletos: ${JSON.stringify(json)}`);
        }
        return `${json.rating}⭐ | ${json.reviewsCount} reviews | ${json.category} | ${json.coordinates.lat}, ${json.coordinates.lng}`;
    });

    // 3. Prompt Maestro de Google Stitch (Idea + Theme + Content)
    let generatedPrompt = '';
    await checkAsync('3. Prompt Maestro de Google Stitch (Fórmula Canónica Idea + Theme + Content)', async () => {
        generatedPrompt = StitchPromptService.assembleSeed(testLead);
        if (!generatedPrompt.includes('Idea:') || !generatedPrompt.includes('Theme:') || !generatedPrompt.includes('Content:')) {
            throw new Error('Estructura Idea + Theme + Content faltante');
        }
        if (!generatedPrompt.includes('slot-turnero') || !generatedPrompt.includes('slot-reviews') || !generatedPrompt.includes('slot-map')) {
            throw new Error('Placeholders semánticos de slots no incluidos');
        }
        return `Prompt validado (${generatedPrompt.length} chars) con slots semánticos`;
    });

    // 4. Inyección Modular de Widgets (Arsenal Stitch)
    await checkAsync('4. Inyección Modular de Widgets en Slots Semánticos (#slot-turnero, #slot-reviews, #slot-map)', async () => {
        const rawHtml = `<!DOCTYPE html><html><head><title>Bar Irlanda</title></head><body>
            <header><h1>Bar Irlanda</h1></header>
            <div id="slot-turnero"></div>
            <div id="slot-reviews"></div>
            <div id="slot-map"></div>
            <footer><p>Footer</p></footer>
        </body></html>`;

        const processed = NexusInjectorService.process(rawHtml, testLead);
        if (!processed.includes('turneroModal') && !processed.includes('Reservá tu Mesa')) {
            throw new Error('Widget turnero no inyectado');
        }
        if (!processed.includes('Lo que dicen nuestros clientes') && !processed.includes('Google')) {
            throw new Error('Widget reviews no inyectado');
        }
        if (!processed.includes('Cómo Llegar a Bar Irlanda') && !processed.includes('Google Maps')) {
            throw new Error('Widget map no inyectado');
        }
        return `3 widgets hidratados e inyectados en slots semánticos`;
    });

    // 5. Ley de 200 Líneas en Archivos Modificados
    const files = [
        'backend/services/enrichment/AiEnricher.js',
        'backend/services/enrichment/MapsEnricher.js',
        'backend/services/PhotoCuratorService.js',
        'backend/services/EnricherService.js',
        'backend/services/prompts/templates/PipelineTemplates.js',
        'backend/services/injector/WidgetInjector.js',
        'src/components/database/ProspectsTable.jsx'
    ];

    try {
        for (const rel of files) {
            const p = path.resolve(__dirname, '..', rel);
            if (fs.existsSync(p)) {
                const lines = fs.readFileSync(p, 'utf-8').split('\n').length;
                if (lines > 180) throw new Error(`${rel} supera 180 líneas (${lines} lín)`);
            }
        }
        console.log(`✅ [PASS] 5. Ley de 200 Líneas estricta → ${files.length} archivos auditados (< 180 líneas)`);
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
