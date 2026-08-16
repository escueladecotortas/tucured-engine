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
      "",
      `- WCAG AA: Texto sobre Surface → ratio ${palette.wcag.textOnSurface.ratio}:1 ${palette.wcag.textOnSurface.passed ? "✅" : "❌ AJUSTADO"}`,
      `- WCAG AA: Accent sobre Surface → ratio ${palette.wcag.accentOnSurface.ratio}:1 ${palette.wcag.accentOnSurface.passed ? "✅" : "⚠️"}`,
    ].join("\n");
  }

  static features(features) {
    const list = features.map((f) => `• ${f}`).join(", ");
    return `═══ FEATURES SUGERIDOS ═══\n${list}`;
  }

  static rules(aesthetic, phone, igHandle, mapsLink, vibeNum) {
    vibeNum = vibeNum || aesthetic.vibration || 1;
    const waLink = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "";
    return [
      "═══ DECÁLOGO UX/UI INQUEBRANTABLE (OBLIGATORIO) ═══",
      "1. CONTRASTE Y ACCESIBILIDAD: Prohibido texto oscuro sobre fondos oscuros. Usar jerarquía estricta de Tailwind (ej: text-white para Dark Mode).",
      "2. RESPONSIVE FIRST: Es OBLIGATORIO implementar un menú hamburguesa funcional en móvil (md:hidden). La estructura debe ser FLUID (flex/grid). Prohibido alturas fijas estáticas que rompan contenedores.",
      "3. IMÁGENES BLINDADAS: Toda etiqueta <img> o div con bg-image DEBE tener object-cover y object-center para no deformarse, contenida en un div con overflow-hidden.",
      "4. RUTEO ESTRICTO (No Fake Links): NavBar y Footer DEBEN apuntar únicamente a IDs de secciones reales en el DOM (ej. #servicios, #contacto). Botón 'Reservar' -> apuntar a #nexus-booking. Prohibido links ciegos o href='#'.",
      "5. DATOS VERÍDICOS: TERMINANTEMENTE PROHIBIDO usar datos mock (fake emails/addresses). Si un dato no existe en el Contexto, se omite el bloque. NO INVENTES DIRECCIONES NI TELÉFONOS SI NO ESTÁN EN EL CONTEXTO.",
      "",
      "═══ REGLAS ADICIONALES DE EJECUCIÓN ═══",
      "- Eres libre de usar tu capacidad de IA para generar un diseño estructural, fondos abstractos, gradientes, íconos y texturas para la Landing Page.",
      "- SIN EMBARGO, está ESTRICTAMENTE PROHIBIDO que generes imágenes por IA para reemplazar fotografías reales o productos del cliente.",
      '- Es OBLIGATORIO que utilices EXCLUSIVAMENTE los tags <img data-nexus-asset="..."> listados en TUS instrucciones. NO USES imagenes de stock ni enlaces locales.',
      "- IMPORTANTE: Respeta exactamente las clases de Tailwind de los tags de imagen que te pasé (w-full, object-cover, etc).",
      '- Todos los textos en ESPAÑOL y sin usar "Lorem Ipsum".',
      "- Usar los textos REALES del negocio (captions de IG, reseñas, bio).",
      `- El TONO DE VOZ debe ser: ${aesthetic.tone}`,
      mapsLink
        ? `- EN EL FOOTER, INYECTAR exactamente el siguiente HTML de placeholder para el mapa: <div id="nexus-map-container" data-status="placeholder"></div>`
        : "",
      `- LINK WHATSAPP (Obligatorio en cada botón principal del Hero o contacto): ${waLink}`,
      `- LINK INSTAGRAM: https://instagram.com/${igHandle}`,
      "- Diseño ultra-responsive (mobile-first).",
      "- CRÍTICO: El diseño NO DEBE parecer una plantilla genérica. Debe sentirse único, boutique y artesanal. Evita tarjetas repetitivas; usa asimetría, overlays o collages suaves si es posible.",
      "- Tipografía geométrica y moderna (Inter, Outfit, Plus Jakarta Sans).",
      `- La vibra general DEBE SER: ${aesthetic.style.toLowerCase()}`,
      vibeNum === 7 || vibeNum === 9
        ? "- REGLA ZEN: Maximizar el espacio negativo (> 60% del canvas). Layout centralizado o asimetría minimalista extrema. Menos es más."
        : "",
    ]
      .filter((l) => l)
      .join("\n");
  }
}

module.exports = BaseTemplates;
