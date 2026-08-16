// Archivo: backend/services/prompts/templates/StructureTemplate.js

class StructureTemplate {
  /**
   * Construye la sección de estructura del prompt para Stitch.
   * V8.0 — NEXUS UI KIT (Web Components & Shadow DOM)
   * PROHIBIDO: Uso de IDs legacy (v1-v9).
   */
  static render(
    name,
    tagline,
    description,
    benefits,
    curatedPhotos,
    logoUrl,
    reviews,
    hours,
    phone,
    address,
    igHandle,
    mapsLink,
    clientId,
  ) {
    const lines = [
      "═══ NEXUS UI KIT: CONTRATO DE ESTRUCTURA ATÓMICA ═══",
      "ESTÁS OBLIGADO a usar exclusivamente los Web Components del Nexus UI Kit.",
      "PROHIBIDO usar IDs antiguos (v1, v2... v9) o generar HTML complejo manualmente.",
      "",
      "1. DICCIONARIO DE COMPONENTES MANDATORIOS:",
      "   - <nexus-navbar>: Navegación principal. Incluye logo y menú.",
      "   - <nexus-hero>: Sección de impacto inicial.",
      "   - <nexus-catalog>: Grilla de servicios/productos (usa {{CATALOG_JSON}}).",
      "   - <nexus-gallery>: Galería visual premium (usa {{GALLERY_JSON}}).",
      "   - <nexus-booking>: Sistema de reservas y contacto.",
      "   - <nexus-instagram>: Feed social (usa {{INSTA_PHOTOS_JSON}}).",
      "   - <nexus-footer>: Cierre de página con branding.",
      "",
      "2. REGLAS DE INYECCIÓN DE DATOS (MANDATORIO: USAR PREFIJO data-*):",
      "   - NavBar: <nexus-navbar data-brand=\"{{NAME}}\" data-logo=\"{{LOGO_URL}}\" data-cta-text=\"Reservar\"></nexus-navbar>",
      "   - Hero: <nexus-hero data-title=\"{{HERO_TITLE}}\" data-subtitle=\"{{HERO_SUBTITLE}}\" data-cta=\"{{CTA_TEXT}}\" data-image=\"{{HERO_IMAGE}}\"></nexus-hero>",
      "   - Catálogo: <nexus-catalog data-title=\"{{SHOP_TITLE}}\" data-items=\"{{CATALOG_JSON}}\"></nexus-catalog>",
      "   - Galería: <nexus-gallery data-items=\"{{GALLERY_JSON}}\"></nexus-gallery>",
      "   - Reservas: <nexus-booking data-title=\"Reservar Turno\" data-description=\"{{BOOKING_TAGLINE}}\" data-whatsapp=\"{{WHATSAPP_NUMBER}}\" data-message=\"{{WHATSAPP_MESSAGE}}\"></nexus-booking>",
      "   - Instagram: <nexus-instagram data-handle=\"{{INSTA_HANDLE}}\" data-items=\"{{INSTA_PHOTOS_JSON}}\"></nexus-instagram>",
      "   - Footer: <nexus-footer data-brand=\"{{NAME}}\" data-address=\"{{ADDRESS}}\" data-phone=\"{{PHONE}}\" data-instagram=\"{{INSTA_HANDLE}}\"></nexus-footer>",
      "",
      "3. REGLA DE ORO: VERACIDAD ABSOLUTA",
      "   - Si un dato (Dirección, Teléfono, Horarios) está marcado como 'NO DISPONIBLE' o viene vacío,",
      "     ESTÁ TERMINANTEMENTE PROHIBIDO INVENTARLO. Simplemente OMITÍ la sección o el dato en el componente.",
      "   - Prohibido usar 'Calle Falsa 123', 'info@ejemplo.com' o similares.",
      "",
      "═══ ASIGNACIÓN DE CONTENIDO REAL ═══",
      `- Marca: ${name}`,
      `- Tagline: ${tagline || "NO DISPONIBLE"}`,
      `- Descripción: ${description || "NO DISPONIBLE"}`,
      `- Servicios/Beneficios: ${benefits.length > 0 ? benefits.join(", ") : "NO DISPONIBLE"}`,
      `- Teléfono/WhatsApp: ${phone || "NO DISPONIBLE"}`,
      `- Dirección Física: ${address || "NO DISPONIBLE (Omitir bloque de mapa y dirección)"}`,
      `- Instagram: ${igHandle ? `@${igHandle}` : "NO DISPONIBLE"}`,
      "",
      "GENERA EL HTML FINAL USANDO ÚNICAMENTE LOS COMPONENTES MENCIONADOS.",
      "Asegurate de que los IDs de las secciones coincidan con el NavBar: #servicios, #sobre-mi, #contacto.",
    ];

    return lines.join("\n");
  }
}

module.exports = StructureTemplate;
