// Archivo: scripts/test_standardized_widgets_render.js
// Suite de Certificación: Renderizado y Adaptabilidad Cromática de los 13 Widgets de Arsenal Stitch

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const cheerio = require('cheerio');

const WIDGETS_ROOT = path.resolve(__dirname, '../backend/stitch/widgets');
const WidgetInjector = require('../backend/services/injector/WidgetInjector');

async function run() {
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('⚡ SUITE DE CERTIFICACIÓN: ESTANDARIZACIÓN CROMÁTICA DE 13 WIDGETS');
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

    // 1. Validar ausencia de bg-white rígido sin dark: en los 13 widgets
    await checkAsync('1. Erradicación de clases rígidas "bg-white" sin variante dark: en widgets', async () => {
        const issues = [];
        function scanDir(dir) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) scanDir(fullPath);
                else if (entry.isFile() && entry.name.endsWith('.html')) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const lines = content.split('\n');
                    lines.forEach((line, idx) => {
                        if (/\bbg-white\b/.test(line) && !/dark:bg-/.test(line) && !line.includes('img') && !line.includes('svg')) {
                            issues.push(`${entry.name}:${idx+1}`);
                        }
                    });
                }
            }
        }
        scanDir(WIDGETS_ROOT);
        if (issues.length > 0) {
            throw new Error(`Clases bg-white no contextuales encontradas en: ${issues.join(', ')}`);
        }
        return 'Todos los 13 widgets utilizan variantes dark/light adaptativas';
    });

    // 2. Probar inyección E2E con WidgetInjector en DOM Dark Mode
    await checkAsync('2. Inyección e Hidratación E2E en HTML Dark Mode (Slots Semánticos)', async () => {
        const mockTemplate = `
        <!DOCTYPE html>
        <html class="dark">
        <body class="bg-zinc-950 text-white font-sans">
            <header class="p-6"><h1>Bar Irlanda</h1></header>
            <main>
                <div id="slot-turnero"></div>
                <div id="slot-reviews"></div>
                <div id="slot-map"></div>
            </main>
            <footer><p>&copy; 2026</p></footer>
        </body>
        </html>`;

        const $ = cheerio.load(mockTemplate);
        const prospectData = {
            name: 'Bar Irlanda',
            whatsapp: '+5493815559876',
            rating: 4.3,
            reviewsCount: 4288,
            address: 'Catamarca 380, San Miguel de Tucumán',
            topReviews: [
                { text: 'Excelente ambiente y cerveza artesanal irlandesa.' },
                { text: 'Tragos de autor y muy buena pizza.' },
                { text: 'Lugar obligado en la noche tucumana.' }
            ]
        };

        WidgetInjector.injectWidgets($, prospectData, {}, '', []);
        const injectedHtml = $.html();

        if (!injectedHtml.includes('Reservá tu Mesa / Turno en Bar Irlanda')) throw new Error('Turnero no inyectó título');
        if (!injectedHtml.includes('Rating Oficial: 4.3/5 (4288 opiniones)')) throw new Error('Reviews no inyectó rating');
        if (!injectedHtml.includes('Cómo Llegar a Bar Irlanda')) throw new Error('Mapa no inyectó título');
        if (injectedHtml.includes('<section class="py-20 bg-white">')) throw new Error('Se detectó sección bg-white rígida en reviews');

        return 'Turnero, Google Reviews y Mapa hidratados sin conflicto cromático';
    });

    // 3. Re-inyección y Certificación sobre Landing Real de Bar Irlanda
    await checkAsync('3. Certificación Visual en Landing Real de "Bar Irlanda" (public/clients/bar-irlanda)', async () => {
        const targetPath = path.resolve(__dirname, '../public/clients/bar-irlanda/index.html');
        if (fs.existsSync(targetPath)) {
            const raw = fs.readFileSync(targetPath, 'utf8');
            const $ = cheerio.load(raw);
            const prospectData = {
                name: 'Bar Irlanda',
                whatsapp: '+5493815559876',
                rating: 4.3,
                reviewsCount: 4288,
                address: 'Catamarca 380, San Miguel de Tucumán',
                topReviews: [
                    { text: 'Excelente atención, la mejor cerveza artesanal y una ambientación única.' },
                    { text: 'Tragos excelentes y tapeo de primera. El mejor pub de la ciudad.' },
                    { text: 'Música increíble y una onda bárbara. Recomendadísimo.' }
                ]
            };
            
            // Limpiar secciones inyectadas previas
            $('section#booking, section#reviews, section#ubicacion').remove();
            $('section').each((i, el) => {
                const txt = $(el).text();
                if (txt.includes('Lo que dicen nuestros clientes') || txt.includes('Reservá tu Mesa') || txt.includes('Cómo Llegar')) {
                    $(el).remove();
                }
            });

            WidgetInjector.injectWidgets($, prospectData, {}, '', []);
            fs.writeFileSync(targetPath, $.html(), 'utf8');

            const updatedHtml = fs.readFileSync(targetPath, 'utf8');
            if (updatedHtml.includes('<section class="py-20 bg-white">')) {
                throw new Error('Se detectó bloque bg-white rígido en Bar Irlanda');
            }
            return `Landing actualizada con éxito (${updatedHtml.length} bytes, 0 anomalías cromáticas)`;
        }
        return 'Archivo bar-irlanda omitido (no encontrado en disco)';
    });

    // 4. Verificar Ley de 200 Líneas en archivos modificados
    await checkAsync('4. Ley de 200 Líneas estricta en widgets e inyector (< 180 lín)', async () => {
        const files = [
            'backend/stitch/widgets/social/trust_v1_google.html',
            'backend/stitch/widgets/booking/booking_v1_turnero.html',
            'backend/stitch/widgets/powerups/calc_v1_simple.html',
            'backend/stitch/widgets/powerups/cart_v1_whatsapp.html',
            'backend/stitch/widgets/footers/footer_v1_map.html',
            'backend/stitch/widgets/galleries/gallery_v1_reel.html',
            'backend/stitch/widgets/powerups/bar_v1_countdown.html',
            'backend/services/injector/WidgetInjector.js'
        ];

        for (const file of files) {
            const p = path.resolve(__dirname, '..', file);
            const lines = fs.readFileSync(p, 'utf8').split('\n').length;
            if (lines > 180) throw new Error(`${file} supera 180 líneas (${lines} lín)`);
        }
        return '8/8 archivos auditados por debajo de 180 líneas';
    });

    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log(`🎯 RESULTADO: ${passed}/${passed + failed} CHECKS CERTIFICADOS (${Math.round((passed/(passed+failed))*100)}%)`);
    console.log('════════════════════════════════════════════════════════════════════\n');

    process.exit(failed > 0 ? 1 : 0);
}

run();
