// Archivo: backend/services/injector/manifest/WidgetPools.js
// Pools de Widgets Inteligentes por Rubro — Ley de 200 líneas

const RUBRO_POOLS = {
  gastronomia: [
    'trust_v2_live_badge',
    'gallery_v2_stories_grid',
    'booking_v1_turnero',
    'social_v2_marquee_reviews',
    'contact_v2_action_dock',
    'footer_v1_map'
  ],
  salud_optica: [
    'trust_v2_live_badge',
    'booking_v1_turnero',
    'social_v2_marquee_reviews',
    'contact_v2_action_dock',
    'footer_v1_map'
  ],
  servicios_talleres: [
    'trust_v2_live_badge',
    'booking_v1_turnero',
    'social_v2_marquee_reviews',
    'contact_v2_action_dock',
    'footer_v1_map'
  ],
  retail_comercio: [
    'trust_v2_live_badge',
    'gallery_v2_stories_grid',
    'social_v2_marquee_reviews',
    'contact_v2_action_dock',
    'footer_v1_map'
  ]
};

const UNIVERSAL = [
  'trust_v2_live_badge',
  'social_v2_marquee_reviews',
  'booking_v1_turnero',
  'gallery_v2_stories_grid',
  'contact_v2_action_dock',
  'footer_v1_map'
];

const PREMIUM = [
  'catalog_v1_grid',
  'cart_v1_whatsapp',
  'promo_popup'
];

const PREMIUM_LABELS = {
  'catalog_v1_grid': 'Catálogo Interactivo con Filtros',
  'cart_v1_whatsapp': 'Carrito de Compras WhatsApp',
  'promo_popup': 'Popup de Captura de Leads'
};

function getPoolForCategory(category = '') {
  const cat = String(category).toLowerCase();
  if (/bar|restauran|resto|comida|cafe|pizza|sirio|cerveza|gastronom/i.test(cat)) return RUBRO_POOLS.gastronomia;
  if (/optic|optometria|salud|clinica|estetica|medico|doctor|dental|psico|vision/i.test(cat)) return RUBRO_POOLS.salud_optica;
  if (/taller|mecanic|reparac|servicio|plomer|electric|abogado|contador/i.test(cat)) return RUBRO_POOLS.servicios_talleres;
  return RUBRO_POOLS.retail_comercio;
}

module.exports = { UNIVERSAL, RUBRO_POOLS, PREMIUM, PREMIUM_LABELS, getPoolForCategory };
