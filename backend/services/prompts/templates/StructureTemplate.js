// Archivo: backend/services/prompts/templates/StructureTemplate.js

class StructureTemplate {
  static render(
    name, tagline, description, benefits, curatedPhotos, logoUrl,
    reviews, hours, phone, address, igHandle, mapsLink, clientId
  ) {
    const lines = [
      "═══ NEXUS UI KIT: CONTRATO DE ESTRUCTURA ATÓMICA ═══",
      "ESTÁS OBLIGADO a usar exclusivamente los Web Components del Nexus UI Kit.",
      "",
      "1. COMPONENTES DISPONIBLES:",
      "   - <nexus-navbar>: Navegación principal.",
      "   - <nexus-hero>: Sección de impacto inicial.",
      "   - <nexus-catalog>: Grilla de servicios/productos.",
      "   - <nexus-gallery>: Galería visual premium.",
      "   - <nexus-booking>: Sistema de reservas y contacto.",
      "   - <nexus-footer>: Cierre con branding y geolocalización.",
      "",
      "═══ ASIGNACIÓN DE CONTENIDO REAL ═══",
      `- Marca: ${name}`,
      `- Tagline: ${tagline || "NO DISPONIBLE"}`,
      `- Descripción: ${description || "NO DISPONIBLE"}`,
      `- Servicios: ${benefits?.length > 0 ? benefits.join(", ") : "NO DISPONIBLE"}`,
      `- Teléfono: ${phone || "NO DISPONIBLE"}`,
      `- Dirección: ${address || "NO DISPONIBLE"}`
    ];
    return lines.join("\n");
  }
}

module.exports = StructureTemplate;
