// Archivo: backend/services/injector/manifest/WidgetValidator.js
// Validación inteligente de widgets basada en datos + features Maps (Ley de 200 líneas)

// Reglas por widget: qué features de Maps activan/confirman su uso
const FEATURE_RULES = {
  'booking_v1_turnero':        { needsAny: ['reservations', 'accepts reservations', 'dine-in', 'takeout'] },
  'cart_v1_whatsapp':          { needsAny: ['delivery', 'curbside pickup', 'takeout', 'catering'] },
  'social_v2_marquee_reviews': { needsAny: [] }, // Activo si hay topReviews o rating
  'trust_v2_live_badge':       { needsAny: [] }, // Activo si hay rating + reviewsCount
  'contact_v2_action_dock':    { needsAny: [] }, // Activo si hay phone
  'footer_v1_map':             { needsAny: [] }, // Siempre activo
  'gallery_v1_reel':           { needsAny: [] }, // Activo si hay fotos o IG
  'gallery_v2_stories_grid':   { needsAny: [] }, // Activo si hay photos o instagram
  'catalog_v1_grid':           { needsAny: ['menu', 'serves beer', 'serves cocktails', 'serves coffee'] },
  'promo_popup':               { needsAny: [] }, // Premium, manual
};

class WidgetValidator {
  static hasDataFor(widgetName, prospectData) {
    if (!prospectData) return false;

    const features = (prospectData.features || []).map(f => f.toLowerCase());
    const rule = FEATURE_RULES[widgetName];

    // Reglas específicas por widget
    if (widgetName.includes('booking')) {
      const hasPhone = !!(prospectData.phone || prospectData.whatsapp);
      if (!hasPhone) return false;
      // Activar si hay features de reservas O simplemente tiene teléfono
      if (rule?.needsAny?.length > 0) {
        return features.some(f => rule.needsAny.some(k => f.includes(k))) || hasPhone;
      }
      return hasPhone;
    }

    if (widgetName.includes('trust_v2') || widgetName === 'trust_v2_live_badge') {
      return !!(prospectData.rating && Number(prospectData.rating) > 0 && prospectData.reviewsCount > 0);
    }

    if (widgetName.includes('stories_grid') || widgetName === 'gallery_v2_stories_grid') {
      const hasPhotos = !!(prospectData.photos?.length >= 3 || prospectData.curatedPhotos?.showcase?.length >= 1);
      const hasIG = !!(prospectData.instagram);
      return hasPhotos || hasIG;
    }

    if (widgetName.includes('gallery')) {
      return !!(prospectData.photos?.length >= 2 || prospectData.curatedPhotos?.showcase?.length || prospectData.instagram);
    }

    if (widgetName.includes('cart')) {
      if (rule?.needsAny?.length > 0) {
        return features.some(f => rule.needsAny.some(k => f.includes(k)));
      }
      return false;
    }

    if (widgetName.includes('reviews') || widgetName.includes('trust') || widgetName.includes('marquee')) {
      return !!(prospectData.topReviews?.length > 0 || (prospectData.rating && prospectData.reviewsCount > 0));
    }

    if (widgetName.includes('contact') || widgetName.includes('dock')) {
      return !!(prospectData.phone || prospectData.whatsapp);
    }

    if (widgetName.includes('catalog')) {
      if (rule?.needsAny?.length > 0) {
        return features.some(f => rule.needsAny.some(k => f.includes(k)));
      }
      return !!(prospectData.photos?.length >= 4);
    }

    if (widgetName.includes('footer') || widgetName.includes('map')) return true;

    return true;
  }
}

module.exports = WidgetValidator;
