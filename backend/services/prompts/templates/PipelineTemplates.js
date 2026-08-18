// Archivo: backend/services/prompts/templates/PipelineTemplates.js
// Plantillas Canónicas de Stitch según el Manual Oficial de Google (Ley de 200 líneas)

class PipelineTemplates {
  static assembleSeed(data) {
    const name = data.name || "Mi Negocio";
    const category = data.category || "gastronomia_bar";
    const city = data.googlePlace?.city || data.city || "San Miguel de Tucumán";
    const tagline = data.tagline || `El mejor lugar de ${category} en ${city}`;
    const phone = data.googlePlace?.phone || data.phone || data.whatsapp || "";
    const waLink = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "";
    const rating = data.rating || 4.3;
    const reviewsCount = data.reviewsCount || data.reviews || 4288;
    const hours = (data.openingHours || data.hours || []).map(h => typeof h === 'string' ? h : `${h.day}: ${h.hours}`).join(", ") || "Lunes a Domingo: 19:00 - 04:00";
    const address = data.address || data.googlePlace?.address || "Tucumán, Argentina";
    const tone = data.toneVoice || "Nocturno, juvenil, cervecero, enérgico";

    return [
      `Idea: Landing page de alta conversión para "${name}", rubro ${category} en ${city}. Tono: ${tone}.`,
      `Theme: Estilo moderno de alta fidelidad, paleta contextual para ${category} (Dark mode con acentos vibrantes), tipografía sans-serif limpia (Montserrat/Inter) y bordes redondeados (0.75rem).`,
      `Content:`,
      `- Header / Navbar con logo "${name}", navegación a secciones y botón de contacto.`,
      `- Hero Section de impacto visual con headline persuasivo ("${tagline}"), badge de Google Reviews (${rating} ⭐ - ${reviewsCount} opiniones verificadas) y botón CTA principal a WhatsApp${waLink ? ` (${waLink})` : ""}.`,
      `- Grilla de Productos / Especialidades destacadas con nombres, descripciones y llamadas a la acción.`,
      `- Galería visual inmersiva con slots para fotos curadas (hero, productos y fotos de ambiente/local).`,
      `- Sección modular con placeholders semánticos para inyección de widgets:`,
      `  * <div id="slot-turnero"></div> (Reservas y turnos en línea)`,
      `  * <div id="slot-reviews"></div> (Muro interactivo de reseñas de Google)`,
      `  * <div id="slot-map"></div> (Ubicación y mapa interactivo)`,
      `- Footer institucional completo con horarios reales (${hours}), dirección (${address}) y créditos "Powered by Tucu Red".`,
      `Directiva estricta: Todos los textos en ESPAÑOL neutro de Argentina. Estructura HTML5 semántica y limpia con clases de Tailwind CSS.`
    ].join("\n");
  }

  static assembleDirector(data, aesthetic, palette, styleKeyword = "Editorial") {
    return [
      `Director de Arte: Aplicá un sistema visual "${styleKeyword}" de alta gama para "${data.name}".`,
      `Paleta de Color: Primary: ${palette.primary}, Secondary: ${palette.secondary}, Accent: ${palette.accent}, Surface: ${palette.surface || '#0a0a0a'}.`,
      `Tono y Vibración: ${data.toneVoice || aesthetic.tone}`,
      `Asegurá fondos oscuros profundos, contrastes legibles (WCAG AAA) y transiciones suaves con Tailwind CSS.`,
      `Todos los textos en ESPAÑOL.`
    ].join("\n");
  }

  static assembleSlotInstructions(widgetManifest) {
    if (!widgetManifest?.selectedWidgets?.length) return "";
    return `═══ SLOTS PARA INYECCIÓN DE ARSENAL STITCH ═══\n` +
      widgetManifest.selectedWidgets.map(w => `- Slot #${w.slotId || 'slot-' + w.id}: Inyectar widget [${w.name}]`).join("\n");
  }
}

module.exports = PipelineTemplates;
