// Archivo: backend/services/prompts/templates/BaseTemplates.js

class BaseTemplates {
  static identity(category, tagline, description, igBio, aesthetic) {
    const lines = [
      "═══ IDENTIDAD ═══",
      `- Rubro: ${category}`,
      `- Tagline: "${tagline}"`,
    ];
    if (description) lines.push(`- Descripción: "${description}"`);
    if (igBio) lines.push(`- Bio del negocio: "${igBio}"`);
    lines.push(`- Estilo visual: ${aesthetic.style}`);
    lines.push(`- Palabras clave estéticas: ${aesthetic.keywords}`);
    lines.push(`- Formas: ${aesthetic.shapes}`);
    return lines.join("\n");
  }

  static tone(aesthetic, vibeNum) {
    vibeNum = vibeNum || 1;
    return [
      "═══ TONO DE VOZ (OBLIGATORIO) ═══",
      `- Tono: ${aesthetic.tone}`,
      `- Vibración: ${vibeNum}`,
      "- REGLA: Todos los textos generados (títulos, subtítulos, CTAs, descripciones)",
      '  DEBEN respetar este tono. Si el tono es "cálido y cercano",',
      '  NO escribir frases corporativas frías. Si es "autoritario",',
      "  NO usar diminutivos ni emojis.",
    ].join("\n");
  }

  static captions(captions, handle, followers) {
    const header = `═══ VOZ DEL NEGOCIO (de su Instagram @${handle}, ${followers.toLocaleString()} seguidores) ═══`;
    const posts = captions
      .slice(0, 6)
      .map((c, i) => `Post ${i + 1}: "${c.substring(0, 250)}"`)
      .join("\n");
    return `${header}\n${posts}`;
  }

  static reviews(reviews, rating, count) {
    const header = `═══ SOCIAL PROOF (${rating}⭐, ${count} reseñas en Google) ═══`;
    const texts = reviews
      .slice(0, 5)
      .map((r) => `• ${r.author}: "${r.text}"`)
      .join("\n");
    return `${header}\n${texts}`;
  }

  static hours(hours) {
    const formatted = hours.map((h) => `${h.day}: ${h.hours}`).join(" | ");
    return `═══ HORARIOS ═══\n${formatted}`;
  }

  static palette(palette) {
    return [
      "═══ PALETA DE 6 COLORES (OBLIGATORIA — Generada por Rueda Cromática + WCAG) ═══",
      `- Primary:   ${palette.primary}  (color principal de marca)`,
      `- Secondary: ${palette.secondary}  (fondo, áreas amplias)`,
      `- Accent:    ${palette.accent}  (CTAs, botones, links — complementario)`,
      `- Surface:   ${palette.surface}  (fondo de tarjetas y cards)`,
      `- Text:      ${palette.text}  (texto principal)`,
      `- Muted:     ${palette.muted}  (texto secundario, bordes, placeholders)`,
    ].join("\n");
  }

  static features(features) {
    const list = features.map((f) => `• ${f}`).join(", ");
    return `═══ FEATURES SUGERIDOS ═══\n${list}`;
  }

  static rules(aesthetic, phone, igHandle, mapsLink, vibeNum) {
    const waLink = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "";
    return [
      "═══ DECÁLOGO UX/UI INQUEBRANTABLE (OBLIGATORIO) ═══",
      "1. CONTRASTE Y ACCESIBILIDAD: Prohibido texto oscuro sobre fondos oscuros.",
      "2. RESPONSIVE FIRST: Estructura fluida con menú móvil funcional.",
      "3. IMÁGENES BLINDADAS: Object-cover y overflow-hidden en contenedores.",
      "4. RUTEO ESTRICTO: Enlaces ancla funcionales a secciones reales.",
      "5. DATOS VERÍDICOS: Cero placeholders o datos inventados.",
      `- LINK WHATSAPP: ${waLink}`,
      `- LINK INSTAGRAM: https://instagram.com/${igHandle}`
    ].join("\n");
  }
}

module.exports = BaseTemplates;
