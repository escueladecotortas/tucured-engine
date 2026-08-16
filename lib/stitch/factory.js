import fs from 'fs/promises';
import path from 'path';

// NEXUS STITCH FACTORY v2.0 (ES Module for Next.js)
// "The Weaver of the Web"

export class StitchFactory {
    constructor() {
        this.basePath = path.join(process.cwd(), 'lib/stitch'); // Next.js Root relative
        this.catalog = {};
    }

    async init() {
        console.log("🧵 Stitch Factory: Loading Patterns...");
        this.catalog = {
            heroes: await this.loadWidgets('heroes'),
            grids: await this.loadWidgets('grids'),
            galleries: await this.loadWidgets('galleries'),
            booking: await this.loadWidgets('booking'),
            powerups: await this.loadWidgets('powerups'),
            social: await this.loadWidgets('social'),
            footers: await this.loadWidgets('footers')
        };
        console.log("🧵 Stitch Factory: Patterns Loaded.");
    }

    async loadWidgets(category) {
        const dir = path.join(this.basePath, 'widgets', category);
        try {
            const files = await fs.readdir(dir);
            const widgets = {};
            for (const file of files) {
                if (file.endsWith('.html')) {
                    const content = await fs.readFile(path.join(dir, file), 'utf-8');
                    const name = file.replace('.html', '').replace(`${category}_`, ''); // branding_hero_v1 -> v1
                    widgets[name] = { name, content };
                }
            }
            return widgets;
        } catch (e) {
            console.warn(`Category ${category} not found or empty.`);
            return {};
        }
    }

    findWidget(category, partialName) {
        const cat = this.catalog[category];
        if (!cat) return { content: `<!-- Missing Category: ${category} -->` };
        // Simple search: find first key that includes the partial name
        const key = Object.keys(cat).find(k => k.includes(partialName));
        return cat[key] || { content: `<!-- Missing ${category}/${partialName} -->` };
    }

    randomWidget(category) {
        const cat = this.catalog[category];
        if (!cat || Object.keys(cat).length === 0) {
            return { content: `<!-- Missing Widget Category: ${category} -->` };
        }
        const keys = Object.keys(cat);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return cat[randomKey];
    }

    stitchSite(clientData) {
        // THE DJ ALGORITHM: Selects the best pieces based on the Vibe
        console.log(`🎧 DJ Stitch Mixin' for: ${clientData.name}`);

        const selection = {};

        // 1. Hero Logic
        if (clientData.hero?.leadMagnet) {
            selection.hero = this.findWidget('heroes', 'v5_form') || this.randomWidget('heroes');
        } else if (clientData.hero?.video) {
             selection.hero = this.findWidget('heroes', 'v1_video') || this.randomWidget('heroes');
        } else {
            selection.hero = this.randomWidget('heroes');
        }

        // 2. Grid Logic & Power-Ups
        selection.powerups = []; // Array to hold all active powerups

        // Shop + Cart Logic
        if (clientData.features?.shop) {
             selection.grid = this.findWidget('grids', 'v5_products'); // Force Shop Grid
             selection.powerups.push(this.findWidget('powerups', 'cart_v1')); // Inject Cart
        } else {
             selection.grid = this.randomWidget('grids');
        }

        // Promo Bar Logic
        if (clientData.features?.promo) {
            selection.powerups.push(this.findWidget('powerups', 'bar_v1'));
        }

        // Calculator Logic (Injects as a section, usually before footer)
        if (clientData.features?.calculator) {
            selection.calc = this.findWidget('powerups', 'calc_v1');
        } else {
            selection.calc = { content: '' };
        }

        // Combine all floating/utility powerups into one string
        selection.powerup = { 
            content: selection.powerups.map(p => p.content).join('\n') 
        };

        // 3. Gallery Logic
        if (clientData.images && clientData.images.length > 5) {
             selection.gallery = this.findWidget('galleries', 'v1_reel') || this.randomWidget('galleries');
        } else {
             selection.gallery = this.randomWidget('galleries'); // Default
        }

        // 4. Booking Logic
        if (clientData.features?.booking) {
            selection.booking = this.findWidget('booking', 'v1_turnero');
        } else {
             selection.booking = { content: '' }; // Empty if not needed
        }

        // 5. Footer Logic
        if (clientData.contact?.address) {
            selection.footer = this.findWidget('footers', 'v1_map') || this.randomWidget('footers');
        } else {
            selection.footer = this.randomWidget('footers');
        }
        
        selection.social = this.randomWidget('social');

        return this.assembleHTML(selection, clientData);
    }

    assembleHTML(pieces, clientData) {
        let fullHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${clientData.name} - ${clientData.tagline}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.css" rel="stylesheet" />
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=Playfair+Display:wght@700&display=swap');
        :root {
            --primary: ${clientData.brand?.primaryColor || '#000'};
            --secondary: ${clientData.brand?.secondaryColor || '#666'};
            --font-head: 'Playfair Display', serif;
            --font-body: 'Inter', sans-serif;
        }
        body { font-family: var(--font-body); }
        h1, h2, h3 { font-family: var(--font-head); }
    </style>
</head>
<body class="bg-white">
    ${pieces.hero.content}
    ${pieces.social.content}
    ${pieces.grid.content}
    ${pieces.booking.content}
    ${pieces.gallery.content}
    ${pieces.calc.content}
    ${pieces.footer.content}
    ${pieces.powerup.content}
</body>
</html>`;

        // PLACEHOLDER REPLACEMENT ENGINE (Simple v1)
        fullHTML = fullHTML.replace(/\{\{HERO_TITLE\}\}/g, clientData.content?.heroTitle || "Título Pendiente");
        fullHTML = fullHTML.replace(/\{\{HERO_SUBTITLE\}\}/g, clientData.content?.heroSubtitle || "Subtítulo pendiente");
        fullHTML = fullHTML.replace(/\{\{CTA_TEXT\}\}/g, clientData.content?.ctaText || "Click Aquí");
        fullHTML = fullHTML.replace(/\{\{HERO_BG_IMAGE\}\}/g, clientData.images?.[0] || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80");

        // Lead Magnet Hero Placeholders
        fullHTML = fullHTML.replace(/\{\{RATING_TEXT\}\}/g, "Más de 500 clientes felices en Tucumán");
        fullHTML = fullHTML.replace(/\{\{BENEFIT_1\}\}/g, clientData.content?.benefits?.[0] || "Atención inmediata sin esperas.");
        fullHTML = fullHTML.replace(/\{\{BENEFIT_2\}\}/g, clientData.content?.benefits?.[1] || "Presupuesto transparente y fijo.");
        fullHTML = fullHTML.replace(/\{\{BENEFIT_3\}\}/g, clientData.content?.benefits?.[2] || "Garantía de satisfacción total.");
        
        fullHTML = fullHTML.replace(/\{\{FORM_TITLE\}\}/g, clientData.content?.formTitle || "Solicitá tu Presupuesto");
        fullHTML = fullHTML.replace(/\{\{FORM_SUBTITLE\}\}/g, clientData.content?.formSubtitle || "Completá tus datos y te contactamos en 15 minutos.");
        fullHTML = fullHTML.replace(/\{\{FORM_CTA\}\}/g, clientData.content?.formCta || "¡Quiero mi Asesoría!");

        // Generic Gallery Placeholders (fallback)
        for (let i = 1; i <= 5; i++) {
             fullHTML = fullHTML.replace(new RegExp(`\\{\\{IMG_${i}\\}\\}`, 'g'), clientData.images?.[i-1] || `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=800&q=60`);
        }

        // Booking Placeholders
        fullHTML = fullHTML.replace(/\{\{BOOKING_TITLE\}\}/g, "Reserva tu Turno");
        fullHTML = fullHTML.replace(/\{\{BOOKING_desc\}\}/g, "Selecciona el día y horario que mejor te convenga.");
        fullHTML = fullHTML.replace(/\{\{BOOKING_CTA\}\}/g, "Agendar Cita Ahora");
        fullHTML = fullHTML.replace(/\{\{WHATSAPP_NUMBER\}\}/g, clientData.contact?.whatsapp || "5491100000000");

        // Shop Placeholders
        fullHTML = fullHTML.replace(/\{\{SHOP_TITLE\}\}/g, "Nuestros Productos");
        fullHTML = fullHTML.replace(/\{\{SHOP_SUBTITLE\}\}/g, "Selección premium con entrega inmediata.");
        // Mock Products
        fullHTML = fullHTML.replace(/\{\{PROD_1_NAME\}\}/g, "Pack Premium");
        fullHTML = fullHTML.replace(/\{\{PROD_1_PRICE\}\}/g, "15000");
        fullHTML = fullHTML.replace(/\{\{PROD_1_OLD_PRICE\}\}/g, "18000");
        fullHTML = fullHTML.replace(/\{\{PROD_1_IMG\}\}/g, "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=60");
        
        fullHTML = fullHTML.replace(/\{\{PROD_2_NAME\}\}/g, "Básico");
        fullHTML = fullHTML.replace(/\{\{PROD_2_PRICE\}\}/g, "5000");
        fullHTML = fullHTML.replace(/\{\{PROD_2_IMG\}\}/g, "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=500&q=60");

        fullHTML = fullHTML.replace(/\{\{PROD_3_NAME\}\}/g, "Eco-Friendly");
        fullHTML = fullHTML.replace(/\{\{PROD_3_PRICE\}\}/g, "8500");
        fullHTML = fullHTML.replace(/\{\{PROD_3_IMG\}\}/g, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=60");

        fullHTML = fullHTML.replace(/\{\{PROD_4_NAME\}\}/g, "Edición Limitada");
        fullHTML = fullHTML.replace(/\{\{PROD_4_PRICE\}\}/g, "22000");
        fullHTML = fullHTML.replace(/\{\{PROD_4_IMG\}\}/g, "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=60");

        // Promo Placeholders
        fullHTML = fullHTML.replace(/\{\{PROMO_TEXT\}\}/g, "⚡ Oferta Relámpago: Envío Gratis en pedidos > $20.000");
        fullHTML = fullHTML.replace(/\{\{PROMO_HOURS_DURATION\}\}/g, "4"); // 4 hours left
        fullHTML = fullHTML.replace(/\{\{PROMO_CTA\}\}/g, "Ver Catálogo");

        // Calculator Placeholders
        fullHTML = fullHTML.replace(/\{\{CALC_TITLE\}\}/g, "Calculá tu Envío");
        fullHTML = fullHTML.replace(/\{\{CALC_DESC\}\}/g, "Ingresá la distancia en km para estimar el costo.");
        fullHTML = fullHTML.replace(/\{\{CALC_INPUT_LABEL\}\}/g, "Distancia (Km)");
        fullHTML = fullHTML.replace(/\{\{CALC_UNIT\}\}/g, "km");
        fullHTML = fullHTML.replace(/\{\{CALC_UNIT_PRICE\}\}/g, "800"); // $800 per km
        fullHTML = fullHTML.replace(/\{\{CALC_SERVICE_NAME\}\}/g, "Envío a Domicilio");

         // ... Add more replacements as needed

        return fullHTML;
    }
}
