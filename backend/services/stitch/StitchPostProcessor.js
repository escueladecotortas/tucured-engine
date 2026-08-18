// Archivo: backend/services/stitch/StitchPostProcessor.js
// Pipeline Post-Procesador de HTML: Sanitización de Navbar, Logo Real y Purga de Slots — Ley de 200 líneas

const cheerio = require('cheerio');
const WidgetInjector = require('../injector/WidgetInjector');

function generateSlug(text) {
  return String(text || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 40);
}

class StitchPostProcessor {
  static process(rawHtml, prospectData, widgetManifest) {
    if (!rawHtml || typeof rawHtml !== 'string') return rawHtml;

    const $ = cheerio.load(rawHtml);
    const slug = prospectData.slug || prospectData.clientId || generateSlug(prospectData.name) || 'client';
    const name = prospectData.name || 'Comercio';
    const phone = prospectData.phone || prospectData.whatsapp || '';
    const waClean = phone.replace(/[^\d]/g, '');
    const logoSrc = `/nexus_archives/tucu-red/clients/${slug}/assets/logo.jpg`;

    // 1. SANITIZACIÓN QUIRÚRGICA DE NAVBAR / HEADER
    const nav = $('nav, header.fixed, header').first();
    if (nav.length > 0) {
      // a) Reemplazar o asegurar contenedor de Logo + Nombre a la izquierda
      const brandContainer = `
        <div class="flex items-center gap-3">
          <img src="${logoSrc}" alt="${name}" class="h-10 w-10 object-contain rounded-xl border border-white/10 shadow-sm" onerror="this.style.display='none'">
          <span class="font-bold text-lg text-white font-display tracking-tight">${name}</span>
        </div>`;
      
      const brandSlot = nav.find('#brand-logo, [data-brand-logo], .brand, .logo').first();
      if (brandSlot.length > 0) {
        brandSlot.replaceWith(brandContainer);
      } else {
        const firstDiv = nav.find('> div > div:first-child, > div:first-child');
        if (firstDiv.length > 0) firstDiv.replaceWith(brandContainer);
      }

      // b) Erradicación absoluta de enlaces internos huérfanos (Menú, Reservas, Galería, etc.)
      nav.find('a:not([href*="wa.me"]):not([href*="whatsapp"])').remove();
      nav.find('.hidden.md\\:flex, .hidden.lg\\:flex, [class*="nav-links"]').remove();

      // c) Inyectar botón CTA de WhatsApp funcional a la derecha
      const ctaBtn = `
        <a href="https://wa.me/${waClean}?text=${encodeURIComponent(`Hola! Quisiera consultar por ${name}`)}" 
           target="_blank" rel="noopener noreferrer" 
           class="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2">
          💬 Contactar
        </a>`;
      const existingBtn = nav.find('button, a[class*="bg-accent"], a[class*="bg-emerald"]').last();
      if (existingBtn.length > 0) {
        existingBtn.replaceWith(ctaBtn);
      } else {
        nav.find('> div, > div:first-child').append(ctaBtn);
      }
    }

    // 2. INYECCIÓN ATÓMICA DE WIDGETS
    WidgetInjector.injectWidgets($, prospectData, widgetManifest);

    // 3. PURGA RESIDUAL ESTRICTA DE PLACEHOLDERS Y TOKENS
    let html = $.html();
    const RESIDUAL_REGEX = /\[(?:nexus-)?(?:gallery_v[12]_[\w]+|contact_v2_action_dock|social_v2_marquee_reviews|trust_v2_live_badge|booking_v1_turnero|footer_v1_map|slot-[\w]+|[\w_]+)\]/gi;
    html = html.replace(RESIDUAL_REGEX, '');
    html = html.replace(/\{\{IMG_\d+\}\}/g, `/nexus_archives/tucu-red/clients/${slug}/assets/ambient_1.jpg`);

    return html;
  }
}

module.exports = StitchPostProcessor;
