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

    const cdnSnippet = publicPhotos.length > 0 ? `\n[ASSETS VISUALES REALES]\n${publicPhotos.join("\n")}\nDirectiva: Utiliza estas URLs reales en backgrounds e <img> principales.` : "";

    return `Eres un Senior UX/UI Tailwind Architect. Tu misión es diseñar y codificar una Landing Page de alta conversión e inmersiva. No debes limitarte a estructuras rígidas ni wireframes genéricos; tienes total libertad creativa para usar Tailwind CSS avanzado (Grid, Flex, gradientes, glassmorphism, fuentes Outfit/Inter, paletas dinámicas y espacio negativo).

[CONTEXTO DE NEGOCIO Y ADN]
Negocio: "${name}" | Rubro: ${category} | Ubicación: ${address}
Reputación: ${rating} ⭐ (${reviewsCount} opiniones verificadas)
Concepto Core: ${archetype.coreConcept}
Beneficios y Atributos: ${features.join(", ") || "Atención premium y dedicación."}
Tono de voz y vocabulario de clientes reales:
${vocabularyList.slice(0, 5).map(v => `> ${v}`).join("\n") || `> "Un servicio inigualable."`}${cdnSnippet}

[LIBERTAD DE LAYOUT Y COMPOSICIÓN]
- Inspiración: ${archetype.compositionHint}
- Call to Action Principal: "${archetype.cta}" (Enlace WhatsApp: ${phone}).
- Prohibido hacer layouts aburridos. Diseña componentes visualmente espectaculares que atrapen al usuario.
- Todo el copy debe estar en ESPAÑOL neutro argentino, con una narrativa viva y atractiva que represente la identidad real de "${name}".

[SLOTS DE INYECCIÓN SEMÁNTICA (EL ANCLA)]
Disponemos de componentes prefabricados que se inyectarán en tu diseño en una fase posterior. Cuando el flujo de la página lo requiera (por ejemplo, para mostrar una galería, reseñas o turnos), debes diseñar una sección o contenedor padre espectacular (ej. \`<section class="py-24 bg-zinc-900 flex justify-center items-center...">\`).

A este contenedor padre debes agregarle OBLIGATORIAMENTE el atributo de datos correspondiente a su propósito:
- \`data-nexus-slot="booking_v1_turnero"\`: Para la sección de reservas o contacto interactivo.
- \`data-nexus-slot="gallery_v2_stories_grid"\`: Para el showcase fotográfico asimétrico o galería.
- \`data-nexus-slot="social_v2_marquee_reviews"\`: Para el muro de testimonios o social proof.
- \`data-nexus-slot="footer_v1_map"\`: Para el mapa de ubicación y footer.

INSTRUCCIÓN CLAVE: Asegúrate de que el contenedor del slot tenga la estructura visual, fondo y espaciado correctos, ya que el contenido interior será hidratado dinámicamente en post-producción. NO uses divs vacíos o sin estilo; debes maquetar la sección visualmente para que nuestro inyector herede ese contenedor premium.`;
  }
}

module.exports = StitchPromptBuilder;

