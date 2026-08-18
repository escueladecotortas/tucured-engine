// Archivo: backend/services/stitch/StitchPromptBuilder.js
// Generador Narrativo por ADN de Negocio y Composición Libre en Stitch — Ley de 200 líneas

const ARQUETIPOS = {
  gastronomia: {
    name: "Experiencia Gastronómica & Vibe Nocturno",
    coreConcept: "Platos insignia, coctelería de autor, cena show y reserva de mesas.",
    compositionHint: "Diseño inmersivo de alta gastronomía (Bento Grid asimétrico o Split-Screen oscuro), fotografía de platos en primer plano, tipografía elegante y atmósfera envolvente.",
    cta: "Reservar Mesa / Pedir por WhatsApp"
  },
  salud_optica: {
    name: "Salud Visual, Óptica & Confianza Clínica",
    coreConcept: "Salud ocular, tecnología de graduación computarizada, armazones de diseño y turnos de atención especializada.",
    compositionHint: "Diseño editorial limpio y luminoso, espacio negativo generoso, tipografía geométrica (Inter/Outfit), sellos de garantía médica y turnero en línea accesible.",
    cta: "Solicitar Turno / Consulta Especializada"
  },
  servicios_talleres: {
    name: "Servicios Técnicos & Soluciones Profesionales",
    coreConcept: "Velocidad de respuesta, diagnósticos transparentes y garantía escrita.",
    compositionHint: "Diseño estructurado de alto contraste, tarjetas de servicio directo y botón de urgencias visible.",
    cta: "Consultar Presupuesto Inmediato"
  },
  retail_comercio: {
    name: "Retail, Moda & Experiencia de Compra",
    coreConcept: "Colecciones exclusivas, marcas seleccionadas y facilidades de pago.",
    compositionHint: "Diseño estilo catálogo moderno o showcase interactivo con micro-interacciones de compra.",
    cta: "Ver Catálogo / Comprar por WhatsApp"
  }
};

class StitchPromptBuilder {
  static detectArchetype(category = "") {
    const cat = String(category).toLowerCase();
    if (/bar|restauran|resto|comida|cafe|pizza|sirio|cerveza|gastronom/i.test(cat)) return ARQUETIPOS.gastronomia;
    if (/optic|optometria|salud|clinica|estetica|medico|doctor|dental|psico|vision/i.test(cat)) return ARQUETIPOS.salud_optica;
    if (/taller|mecanic|reparac|servicio|plomer|electric|abogado|contador/i.test(cat)) return ARQUETIPOS.servicios_talleres;
    return ARQUETIPOS.retail_comercio;
  }

  static buildPrompt(prospectData) {
    const name = prospectData.name || "Comercio Local";
    const category = prospectData.category || "general";
    const archetype = this.detectArchetype(category);
    const rating = prospectData.rating || 4.5;
    const reviewsCount = prospectData.reviewsCount || prospectData.reviews || 20;
    const address = prospectData.address || "San Miguel de Tucumán";
    const phone = prospectData.phone || prospectData.whatsapp || "";
    const reviews = prospectData.topReviews || [];
    const features = prospectData.features || [];
    const ig = prospectData.instagramData || {};
    const gp = prospectData.googlePlace || {};

    // 1. Extracción de Vocabulario Real y ADN Narrativo
    const vocabularyList = [];
    reviews.forEach(r => { if (r.text) vocabularyList.push(`"${r.text}"`); });
    (ig.captions || []).slice(0, 4).forEach(c => { if (c && c.length > 15) vocabularyList.push(c.slice(0, 120)); });
    if (prospectData.description) vocabularyList.push(prospectData.description);
    if (prospectData.approvedNarrative) vocabularyList.push(prospectData.approvedNarrative);

    // 2. Extracción de URLs CDN Públicas
    const publicPhotos = [];
    if (gp.imageUrl) publicPhotos.push(`Hero Background: ${gp.imageUrl}`);
    (gp.photos || []).slice(0, 3).forEach((u, i) => publicPhotos.push(`Showcase ${i + 1}: ${u}`));
    (ig.posts || []).slice(0, 3).forEach((p, i) => {
      const u = p.imageUrl || p.displayUrl;
      if (u) publicPhotos.push(`Atmosphere ${i + 1}: ${u}`);
    });

    const cdnSnippet = publicPhotos.length > 0 ? `═══ FOTOGRAFÍA REAL DEL NEGOCIO (CDN PÚBLICO) ═══\n${publicPhotos.join("\n")}\nDirectiva: Utilizá estas URLs reales en backgrounds e <img> principales.\n` : "";

    return `BRIEF CREATIVO & NARRATIVO PARA STITCH (HIGH FIDELITY LANDING PAGE)
Negocio: "${name}" | Rubro: ${category} | Ubicación: ${address}
Reputación: ${rating} ⭐ (${reviewsCount} opiniones verificadas en Google)

═══ ADN DE MARCA & PROPUESTA DE VALOR REAL ═══
- Concepto Clave: ${archetype.coreConcept}
- Atributos y Servicios Reales: ${features.join(", ") || "Atención personalizada, Calidad de servicio"}
- Historia y Vocabulario Auténtico de Clientes:
${vocabularyList.slice(0, 5).map(v => `  * ${v}`).join("\n") || `  * "Excelente atención y productos de calidad superior."`}

${cdnSnippet}═══ DIRECTIVAS DE COMPOSICIÓN VISUAL (LIBERTAD DE DISEÑO) ═══
- Inspiración y Layout: ${archetype.compositionHint}
- Estilo: Dark Mode nativo con Tailwind CSS, acentos vibrantes, tipografía moderna (Inter/Montserrat/Outfit) y espaciado generoso.
- Call to Action Principal: "${archetype.cta}" (Enlace WhatsApp: ${phone}).

═══ INTEGRACIÓN DE WIDGETS INTERACTIVOS (SLOTS LIMPIOS) ═══
Integrá de forma armónica dentro del flujo visual los siguientes contenedores HTML vacíos (SIN texto plano tipo "[widget]"):
- <div id="nexus-booking_v1_turnero"></div> (Módulo de reservas o turnos)
- <div id="nexus-social_v2_marquee_reviews"></div> (Muro cinético de opiniones)
- <div id="nexus-gallery_v2_stories_grid"></div> (Showcase visual interactivo)
- <div id="nexus-footer_v1_map"></div> (Acceso y mapa del local)

Todo el copy debe estar en ESPAÑOL neutro argentino, con una narrativa viva y atractiva que represente la identidad real de "${name}".`;
  }
}

module.exports = StitchPromptBuilder;
