// Archivo: backend/services/StitchContractValidator.js
const cheerio = require("cheerio");
const TerminalService = require("./TerminalService");
const { GENERIC_CITY_PATTERNS, PLACEHOLDER_PATTERNS } = require("./ValidatorRules");

/**
 * StitchContractValidator v2.0 — Operación Fórmula 1
 * Portero entre Stitch y NexusInjector. Corrige el HTML inyectado.
 * Cumple con la Ley de 200 líneas.
 */
class StitchContractValidator {
    static preValidate(prospectData) {
        const p = prospectData || {};
        p.address = p.address || p.googlePlace?.formatted_address || 'San Miguel de Tucumán';
        p.placeId = p.placeId || p.googlePlace?.placeId || 'ChIJRz_m0731vZYREJOf_7f5u0g';
        p.googleMapsUrl = p.googleMapsUrl || p.googlePlace?.url || `https://www.google.com/maps/search/?api=1&query=place_id:${p.placeId}`;
        p.phone = p.phone || p.googlePlace?.phone || p.googlePlace?.international_phone_number;
        p.whatsapp = p.whatsapp || p.phone;
        
        p.namedColors = p.namedColors || {};
        const pal = p.palette || {};
        p.namedColors.primary = p.namedColors.primary || pal.primary || '#182319';
        p.namedColors.secondary = p.namedColors.secondary || pal.secondary || '#C5A059';
        p.namedColors.surface = p.namedColors.surface || pal.surface || '#fbf9f6';
        
        TerminalService.broadcast(`🛡️ Orion Sentinel: Contrato enriquecido (${p.name})`, "info");
        return p;
    }

    static validate(rawHtml, prospectData) {
        const p = this.preValidate(prospectData);
        if (!rawHtml) return rawHtml;

        const $ = cheerio.load(rawHtml, { decodeEntities: false });
        let fixes = 0;

        // Regla 1: Mapa único
        const maps = $('iframe[src*="google.com/maps"], iframe[src*="maps.google.com"]');
        if (maps.length > 1) {
            maps.slice(0, -1).each((i, el) => $(el).remove());
            fixes++;
        }

        // Regla 2: Texto decorativo en Hero
        const hero = $("section").first();
        if (hero.length > 0) {
            hero.find("span, div, p").each((i, el) => {
                const $el = $(el);
                const style = $el.attr("style") || "";
                const isOverlay = ($el.attr("class") || "").includes("absolute") || style.includes("position: absolute");
                if (isOverlay && GENERIC_CITY_PATTERNS.some(pat => pat.test($el.text().trim()))) {
                    $el.css({ opacity: "0.01", "z-index": "-10", "pointer-events": "none" });
                    fixes++;
                }
            });
        }

        let htmlStr = $.html();
        const data = { address: p.googlePlace?.formatted_address || p.address, name: p.name, city: p.city || "Tucumán" };

        PLACEHOLDER_PATTERNS.forEach(({ pattern, field }) => {
            if (pattern.test(htmlStr)) {
                const replacement = field ? data[field] : "";
                if (replacement !== undefined) {
                    htmlStr = htmlStr.replace(pattern, replacement);
                    fixes++;
                }
            }
        });

        // Regla 4: WhatsApp
        if (p.phone) {
            const clean = p.phone.replace(/\D/g, "");
            const norm = clean.startsWith("549") ? clean : `549${clean.replace(/^0?54?/, "")}`;
            htmlStr = htmlStr.replace(/href="https:\/\/wa\.me\/(\d+)"/g, (m, num) => {
                if (num !== norm && num !== clean) { fixes++; return `href="https://wa.me/${norm}"`; }
                return m;
            });
        }

        // Regla 5: Logos Rotos
        const reloaded = cheerio.load(htmlStr, { decodeEntities: false });
        reloaded("img[alt*='logo' i]").each((i, el) => {
            const src = reloaded(el).attr("src") || "";
            if (!src || src === "#" || src.includes("placeholder")) {
                const initials = (p.name || "N").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
                reloaded(el).replaceWith(`<div class="fallback-logo">${initials}</div>`);
                fixes++;
            }
        });

        TerminalService.broadcast(`✅ ContractValidator: ${fixes} correcciones`, fixes > 0 ? "warning" : "success");
        return reloaded.html();
    }
}

module.exports = StitchContractValidator;
