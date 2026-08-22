// Archivo: backend/services/injector/WidgetInjector.js
// Inyector Atómico Bidireccional con Purga Estricta y Tokens Contextualizados (Ley de 200 líneas)

const fs = require('fs');
const path = require('path');
const WidgetPools = require('./manifest/WidgetPools');

const WIDGETS_DIR = path.resolve(__dirname, '../../stitch/widgets');

const WIDGET_FILES = {
  booking_l1_turnero:        'booking/booking_l1_turnero.html',
  booking_v1_turnero:        'booking/booking_l1_turnero.html',
  gallery_v2_stories_grid:   'galleries/gallery_v2_stories_grid.html',
  gallery_v1_reel:           'galleries/gallery_v1_reel.html',
  social_v2_marquee_reviews: 'social/social_v2_marquee_reviews.html',
  trust_v2_live_badge:       'social/trust_v2_live_badge.html',
  contact_v2_action_dock:    'social/contact_v2_action_dock.html',
  footer_v1_map:             'footers/footer_v1_map.html',
};

const DEFAULT_SCHEDULE = JSON.stringify({
  1: { enabled: true, open: "09:00", close: "18:00", isSplit: false, open2: "17:00", close2: "21:00" },
  2: { enabled: true, open: "09:00", close: "18:00", isSplit: false, open2: "17:00", close2: "21:00" },
  3: { enabled: true, open: "09:00", close: "18:00", isSplit: false, open2: "17:00", close2: "21:00" },
  4: { enabled: true, open: "09:00", close: "18:00", isSplit: false, open2: "17:00", close2: "21:00" },
  5: { enabled: true, open: "09:00", close: "18:00", isSplit: false, open2: "17:00", close2: "21:00" },
  6: { enabled: true, open: "09:00", close: "13:00", isSplit: false, open2: "17:00", close2: "21:00" },
  0: { enabled: false, open: "09:00", close: "13:00", isSplit: false, open2: "17:00", close2: "21:00" }
});

class WidgetInjector {
  static injectWidgets($, prospectData, widgetManifest) {
    const slug = prospectData?.slug || (prospectData?.name || 'client').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const phone = prospectData?.whatsapp || prospectData?.phone || '';
    const name = prospectData?.name || 'Comercio';
    const category = prospectData?.category || '';
    const rating = String(prospectData?.rating || 4.3);
    const reviewsCount = String(prospectData?.reviewsCount || prospectData?.reviews || 0);
    const topReviews = prospectData?.topReviews || [];
    const address = prospectData?.address || 'San Miguel de Tucumán, Argentina';
    const mapsUrl = prospectData?.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(name + ' ' + address)}`;
    const waClean = phone.replace(/[^\d]/g, '');

    const activePool = WidgetPools.getPoolForCategory(category);
    const sp = prospectData?.semantic_photos || {};
    
    // Diversidad Visual (Sistema de Consumo y Rutas Relativas)
    const rawPhotos = [
      ...(Array.isArray(sp.showcase) ? sp.showcase : []),
      ...(Array.isArray(sp.atmosphere) ? sp.atmosphere : []),
      ...(Array.isArray(prospectData?.photos) ? prospectData.photos : [])
    ].filter(Boolean);

    let photoPool = [...new Set(rawPhotos)].map(photoVal => {
      const basename = photoVal.split('/').pop().split('?')[0] || 'fallback.jpg';
      return `/clients/${slug}/assets/${basename}`;
    });

    if (photoPool.length === 0) {
      photoPool = [
        `/clients/${slug}/assets/ambient_1.jpg`,
        `/clients/${slug}/assets/product_1.jpg`,
        `/clients/${slug}/assets/hero.jpg`
      ];
    }

    const getPhoto = () => photoPool.length > 0 ? photoPool.shift() : `/clients/${slug}/assets/hero.jpg`;

    const readWidget = (key) => {
      const p = WIDGET_FILES[key];
      if (!p) return null;
      const abs = path.join(WIDGETS_DIR, p);
      return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
    };

    const injectSlotBidirectional = (widgetName, html, fbTarget = 'footer') => {
      const slot = $(`[data-nexus-slot="${widgetName}"]`);
      if (slot.length > 0) { slot.first().html(html); return true; }

      const legacySelectors = `#nexus-${widgetName}, #slot-${widgetName}, [data-nexus-widget="${widgetName}"]${widgetName.includes('booking') ? ', #booking, section[id="booking"]' : ''}`;
      const legacySlot = $(legacySelectors);
      if (legacySlot.length > 0) { legacySlot.first().replaceWith(html); return true; }

      const textRegex = new RegExp(`\\[(?:nexus-)?${widgetName}\\]`, 'gi');
      let replacedInText = false;
      $('body *').each((i, el) => {
        if ($(el).children().length === 0 && textRegex.test($(el).text())) {
          $(el).replaceWith(html);
          replacedInText = true;
          return false;
        }
      });
      if (replacedInText) return true;

      const fb = $(fbTarget);
      if (fb.length > 0) { fb.before(`<section data-nexus-fallback="${widgetName}">${html}</section>`); return true; }
      return false;
    };

    // 1. Turnero L1 Parametrizado
    if (activePool.includes('booking_v1_turnero') || activePool.includes('booking_l1_turnero')) {
      const h = readWidget('booking_l1_turnero');
      if (h) {
        const widgetId = `l1-${slug}`;
        const hyd = h
          .replace(/\{\{WIDGET_ID\}\}/g, widgetId)
          .replace(/\{\{BUSINESS_NAME\}\}/g, name)
          .replace(/\{\{WHATSAPP_NUMBER\}\}/g, waClean || phone)
          .replace(/\{\{SCHEDULE_JSON\}\}/g, DEFAULT_SCHEDULE);
        injectSlotBidirectional('booking_v1_turnero', hyd, 'footer');
        injectSlotBidirectional('booking_l1_turnero', hyd, 'footer');
      }
    }

    // 2. Stories Grid
    if (activePool.includes('gallery_v2_stories_grid')) {
      const h = readWidget('gallery_v2_stories_grid');
      if (h) {
        const hyd = h.replace(/\{\{INSTAGRAM_HANDLE\}\}/g, prospectData?.instagram || '')
          .replace(/\{\{BUSINESS_NAME\}\}/g, name)
          .replace(/\{\{PHOTO_1\}\}/g, getPhoto()).replace(/\{\{PHOTO_2\}\}/g, getPhoto())
          .replace(/\{\{PHOTO_3\}\}/g, getPhoto()).replace(/\{\{PHOTO_4\}\}/g, getPhoto())
          .replace(/\{\{CAPTION_\d+\}\}/g, '');
        injectSlotBidirectional('gallery_v2_stories_grid', hyd, 'footer');
      }
    }

    // 3. Reviews Marquee
    if (activePool.includes('social_v2_marquee_reviews')) {
      const h = readWidget('social_v2_marquee_reviews');
      if (h) {
        const hyd = h.replace(/\{\{RATING_DISPLAY\}\}/g, `${rating} ⭐ (${reviewsCount} opiniones)`)
          .replace(/\{\{REVIEW_1_TEXT\}\}/g, topReviews[0]?.text || 'Excelente atención y calidad garantizada.')
          .replace(/\{\{REVIEW_2_TEXT\}\}/g, topReviews[1]?.text || 'La mejor experiencia y asesoramiento profesional.')
          .replace(/\{\{REVIEW_3_TEXT\}\}/g, topReviews[2]?.text || 'Servicio impecable y cumplimiento total.');
        injectSlotBidirectional('social_v2_marquee_reviews', hyd, 'footer');
      }
    }

    // 4. Trust Badge & 5. Action Dock
    if (activePool.includes('trust_v2_live_badge')) {
      const h = readWidget('trust_v2_live_badge');
      if (h) $('body').append(h.replace(/\{\{RATING\}\}/g, rating).replace(/\{\{REVIEWS_COUNT\}\}/g, reviewsCount));
    }

    if (activePool.includes('contact_v2_action_dock')) {
      const h = readWidget('contact_v2_action_dock');
      if (h) $('body').append(h.replace(/\{\{WHATSAPP_CLEAN\}\}/g, waClean).replace(/\{\{PHONE_RAW\}\}/g, phone).replace(/\{\{MAPS_URL\}\}/g, mapsUrl));
    }

    // 6. Footer Map
    if (activePool.includes('footer_v1_map')) {
      const mapHtml = `
      <section class="py-16 bg-transparent text-center" id="ubicacion">
        <div class="container mx-auto px-4 max-w-4xl">
          <h3 class="text-3xl font-extrabold text-white mb-2">Cómo Llegar a ${name}</h3>
          <p class="text-zinc-400 mb-8 text-sm">${address}</p>
          <a href="${mapsUrl}" target="_blank" class="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl transition-all shadow-xl hover:scale-105">Abrir en Google Maps 🗺️</a>
        </div>
      </section>`;
      injectSlotBidirectional('footer_v1_map', mapHtml, 'footer');
    }

    // Purga radical de placeholders
    const ALL_PLACEHOLDERS = /\[(?:nexus-)?(?:gallery_v[12]_[\w]+|contact_v2_action_dock|social_v2_marquee_reviews|trust_v2_live_badge|booking_v1_turnero|booking_l1_turnero|footer_v1_map|slot-[\w]+|[\w_]+)\]/gi;
    let bodyHtml = $('body').html();
    if (bodyHtml && ALL_PLACEHOLDERS.test(bodyHtml)) {
      $('body').html(bodyHtml.replace(ALL_PLACEHOLDERS, ''));
    }
  }
}

module.exports = WidgetInjector;
