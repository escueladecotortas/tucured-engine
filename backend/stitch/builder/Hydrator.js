// Archivo: backend/stitch/builder/Hydrator.js

/**
 * Hydrator - Se encarga del reemplazo de placeholders y limpieza de HTML.
 * UPDATED: Integrated ATENEA Dynamic Design Bridge & WCAG Contrast Algorithm.
 * V2.2: HOTFIX DE ANCLAS DOM (ASIGNACIÓN FORZOSA DE IDs).
 */
class Hydrator {
    static hydrate(html, clientData) {
        let fullHTML = html;
        const { content = {}, contact = {}, services = [], reviews = [], meta = {}, style = {}, fonts = {} } = clientData;

        // --- ATENEA DYNAMIC BRIDGE ---
        let finalStyle = { ...style };
        if (clientData.ateneaDesign?.colors) {
            const colors = clientData.ateneaDesign.colors; // Array de hex strings
            const sortedByLuminance = [...colors].sort((a, b) => this.getLuminance(a) - this.getLuminance(b));
            
            finalStyle.primary = colors[0] || style.primary; 
            finalStyle.surface = sortedByLuminance[0]; 
            finalStyle.secondary = colors[1] || style.secondary;
            finalStyle.accent = colors[2] || style.accent;
            
            const bgLuminance = this.getLuminance(finalStyle.surface);
            finalStyle.onSurface = bgLuminance > 0.5 ? '#111827' : '#f9fafb'; 
            finalStyle.onSurfaceVariant = bgLuminance > 0.5 ? '#374151' : '#d1d5db';
        }

        // --- TOKENS (NEXUS DESIGN SYSTEM) ---
        fullHTML = fullHTML.replace(/\{\{PRIMARY_COLOR\}\}/g, finalStyle.primary || '#171817');
        fullHTML = fullHTML.replace(/\{\{SECONDARY_COLOR\}\}/g, finalStyle.secondary || '#fbf9f4');
        fullHTML = fullHTML.replace(/\{\{ACCENT_COLOR\}\}/g, finalStyle.accent || '#C5A059');
        fullHTML = fullHTML.replace(/\{\{SURFACE_COLOR\}\}/g, finalStyle.surface || '#fbf9f4');
        fullHTML = fullHTML.replace(/\{\{ON_SURFACE_COLOR\}\}/g, finalStyle.onSurface || '#1b1c19');
        fullHTML = fullHTML.replace(/\{\{ON_SURFACE_VARIANT\}\}/g, finalStyle.onSurfaceVariant || '#454844');
        fullHTML = fullHTML.replace(/\{\{HEAD_FONT\}\}/g, fonts.headingFont || 'serif');
        fullHTML = fullHTML.replace(/\{\{BODY_FONT\}\}/g, fonts.bodyFont || 'sans-serif');
        fullHTML = fullHTML.replace(/\{\{CLIENT_NAME\}\}/g, meta.title || 'Nexus Boutique');

        // --- JSON DATA FIELDS (WEB COMPONENTS) ---
        const catalogData = services.map(s => ({
            name: s.name,
            description: s.description,
            price: s.price,
            image: s.image || `https://placehold.co/400x300/333/FFF?text=${encodeURIComponent(s.name)}`
        }));
        fullHTML = fullHTML.replace(/\{\{CATALOG_JSON\}\}/g, JSON.stringify(catalogData).replace(/"/g, '&quot;'));
        
        const galleryData = clientData.images || [];
        fullHTML = fullHTML.replace(/\{\{GALLERY_JSON\}\}/g, JSON.stringify(galleryData).replace(/"/g, '&quot;'));

        const reviewsData = reviews.map(r => ({
            name: r.author || 'Cliente',
            text: r.text || '',
            photo: r.photo || 'https://via.placeholder.com/44'
        }));
        fullHTML = fullHTML.replace(/\{\{REVIEWS_JSON\}\}/g, JSON.stringify(reviewsData).replace(/"/g, '&quot;'));

        const instaPhotos = clientData.instagram?.photos || galleryData.slice(0, 6);
        fullHTML = fullHTML.replace(/\{\{INSTA_PHOTOS_JSON\}\}/g, JSON.stringify(instaPhotos).replace(/"/g, '&quot;'));
        fullHTML = fullHTML.replace(/\{\{INSTA_HANDLE\}\}/g, clientData.instagram?.handle || 'nexus.os');
        fullHTML = fullHTML.replace(/\{\{INSTA_DISPLAY_HANDLE\}\}/g, clientData.instagram?.displayHandle || '@nexus.os');
        fullHTML = fullHTML.replace(/\{\{INSTA_URL\}\}/g, clientData.instagram?.url || '#');

        // --- CORE CONTENT ---
        fullHTML = fullHTML.replace(/\{\{HERO_TITLE\}\}/g, content.heroTitle || meta.title || 'Nexus Experience');
        fullHTML = fullHTML.replace(/\{\{HERO_SUBTITLE\}\}/g, content.heroSubtitle || '');
        fullHTML = fullHTML.replace(/\{\{CTA_TEXT\}\}/g, content.ctaText || 'Consultar');
        fullHTML = fullHTML.replace(/\{\{SHOP_TITLE\}\}/g, content.shopTitle || 'Nuestro Catálogo');
        fullHTML = fullHTML.replace(/\{\{BOOKING_TAGLINE\}\}/g, content.bookingDesc || 'Atención personalizada en cada detalle.');

        // --- CONTACT & LOCATION ---
        const whatsappNumber = contact.whatsapp || '5493816202789';
        const whatsappMsg = encodeURIComponent(contact.whatsappMessage || `Hola! Vi su web y quería consultar`);
        fullHTML = fullHTML.replace(/\{\{WHATSAPP_NUMBER\}\}/g, whatsappNumber);
        fullHTML = fullHTML.replace(/\{\{WHATSAPP_MESSAGE\}\}/g, whatsappMsg);
        fullHTML = fullHTML.replace(/\{\{LOCATION_QUERY\}\}/g, encodeURIComponent(contact.address || 'Tucumán'));
        fullHTML = fullHTML.replace(/\{\{LOCATION_ADDRESS\}\}/g, contact.address || 'Ubicación Central');
        fullHTML = fullHTML.replace(/\{\{CLIENT_EMAIL\}\}/g, contact.email || 'hola@nexus-os.com');

        // --- [HOTFIX] INTERCEPCIÓN DE COMPILADOR (FUERZA BRUTA) ---
        
        // 1. Inyección de Core JS en el <head>
        if (!fullHTML.includes('nexus-core.js')) {
            fullHTML = fullHTML.replace('</head>', '<script src="/nexus-core.js" type="module"></script>\n</head>');
        }

        // 2. Purga de Nav/Header (Eliminar basura que Stitch intente alucinar)
        fullHTML = fullHTML.replace(/<nav[^>]*>([\s\S]*?)<\/nav>/gi, '');
        fullHTML = fullHTML.replace(/<header[^>]*>([\s\S]*?)<\/header>/gi, '');
        fullHTML = fullHTML.replace(/id="(?:header|nav|navigation|menu)"/gi, 'id="legacy-removed"');
        fullHTML = fullHTML.replace(/class="[^"]*(?:header|nav|navigation|menu)[^"]*"/gi, (match) => {
             return match.includes('nexus-') ? match : 'class="hidden"';
        });

        // 3. Inyección Forzosa de <nexus-navbar> al inicio del body
        const navLinks = JSON.stringify([
            { label: "Servicios", url: "#servicios" },
            { label: "Sobre Mí", url: "#sobre-mi" },
            { label: "Contacto", url: "#contacto" }
        ]).replace(/"/g, '&quot;');
        
        const navbarComponent = `<nexus-navbar data-links="${navLinks}" data-logo="${meta.title || 'Nexus'}"></nexus-navbar>\n`;
        fullHTML = fullHTML.replace(/(<body[^>]*>)/i, `$1\n${navbarComponent}`);

        // 4. Reparación de Botones (Smooth Scroll a Contacto)
        fullHTML = fullHTML.replace(/(<(?:button|a)[^>]*>)(Reservar|Explorar)(<\/(?:button|a)>)/gi, (match, p1, p2, p3) => {
            if (p1.includes('onclick')) return match;
            const newTag = p1.replace(/(\/?>)$/, ` onclick="document.getElementById('contacto').scrollIntoView({behavior: 'smooth'})"$1`);
            return `${newTag}${p2}${p3}`;
        });

        // 5. [NUEVO] Asignación Forzosa de IDs (DOM Anchors)
        // #servicios
        fullHTML = fullHTML.replace(/(<nexus-catalog[^>]*>)/i, (m) => m.includes('id=') ? m : m.replace('<nexus-catalog', '<nexus-catalog id="servicios"'));
        if (!fullHTML.includes('id="servicios"')) {
            fullHTML = fullHTML.replace(/(<[^>]*Propuesta[^>]*>)/i, (m) => m.includes('id=') ? m : m.replace('>', ' id="servicios">'));
        }
        
        // #sobre-mi
        fullHTML = fullHTML.replace(/(<nexus-gallery[^>]*>)/i, (m) => m.includes('id=') ? m : m.replace('<nexus-gallery', '<nexus-gallery id="sobre-mi"'));

        // #contacto
        fullHTML = fullHTML.replace(/(<nexus-booking[^>]*>)/i, (m) => m.includes('id=') ? m : m.replace('<nexus-booking', '<nexus-booking id="contacto"'));
        if (!fullHTML.includes('id="contacto"')) {
            fullHTML = fullHTML.replace(/(<nexus-footer[^>]*>)/i, (m) => m.includes('id=') ? m : m.replace('<nexus-footer', '<nexus-footer id="contacto"'));
        }

        // Corrección de links en Footer (Asignación forzosa a anclas exactas)
        fullHTML = fullHTML.replace(/(<footer[\s\S]*?href=["'])(?:#|#inicio|#home)(["'])/gi, '$1#inicio$2');
        fullHTML = fullHTML.replace(/(<footer[\s\S]*?href=["'])(?:#servicios|#productos|#menu)(["'])/gi, '$1#servicios$2');
        fullHTML = fullHTML.replace(/(<footer[\s\S]*?href=["'])(?:#galeria|#sobre-mi|#historia)(["'])/gi, '$1#sobre-mi$2');
        fullHTML = fullHTML.replace(/(<footer[\s\S]*?href=["'])(?:#contacto|#ubicacion)(["'])/gi, '$1#contacto$2');

        // --- FINAL CLEANUP ---
        fullHTML = fullHTML.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, ''); // [HOTFIX A] Purga de CSS Inline
        return fullHTML.replace(/\{\{[A-Z0-9_]+\}\}/g, '');
    }

    /**
     * Helper: Calculate Relative Luminance for WCAG Contrast
     */
    static getLuminance(hex) {
        if (!hex || hex.length < 6) return 0;
        const rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255);
        const [r, g, b] = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
}

module.exports = Hydrator;
