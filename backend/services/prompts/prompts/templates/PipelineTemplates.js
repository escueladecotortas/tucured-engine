// Archivo: backend/services/prompts/templates/PipelineTemplates.js

class PipelineTemplates {
  /**
   * PASO 1: LA SEMILLA. Prompt minimalista siguiendo la receta de Google Stitch.
   */
  static assembleSeed(data) {
    const name = data.name || "Mi Negocio";
    const category = data.category || "General";
    const city = data.googlePlace?.city || data.city || "San Miguel de Tucumán";
    const tagline = data.tagline || name;
    const benefits = data.benefits || [];
    const phone = data.googlePlace?.phone || data.phone || "";
    const waLink = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "";

    const servicesText = benefits.length > 0 ? benefits.slice(0, 3).join(", ") : category;

    return [
      `Idea: Una landing page espectacular, altamente estética y moderna para "${name}", un negocio de ${category} en ${city}.`,
      `Theme: Premium, luxury web design, expansivo (edge-to-edge), con efecto "wow" y estructura asimétrica o bento.`,
      `Content:`,
      `- Un Hero Section imponente de ancho completo (full-width) con el título "${tagline}" y botones de acción elegantes.`,
      `- Una sección "Sobre Nosotros" con un layout sofisticado en dos columnas.`,
      `- Una grilla moderna y atractiva de servicios: ${servicesText}.`,
      `- Una sección de contacto espaciosa con WhatsApp${waLink ? ` (${waLink})` : ""}.`,
      `- Footer minimalista con dirección y horarios.`,
      ``,
      `Todos los textos en ESPAÑOL. No usar Lorem Ipsum. Diseñar pensando en una pantalla ancha de escritorio (Desktop).`,
    ].join("\n");
  }

  /**
   * PASO 2: EL DIRECTOR DE ARTE. Prompt de edición que aplica estilo visual.
   */
  static assembleDirector(data, aesthetic, palette, styleKeyword = "Editorial") {
    const lines = [
      `Aplicá un estilo de estructura "${styleKeyword}" de lujo y alta gama (Luxury Web Pattern).`,
      `Queremos una sensación de ${aesthetic.keywords.toLowerCase()} que deslumbre al usuario ("Wow factor").`,
      styleKeyword === "Santuario" || styleKeyword === "Etéreo"
        ? `REGLA DE ORO: El diseño debe ser un "${styleKeyword}" visual. Minimalismo extremo, elegancia absoluta y uso soberbio del espacio negativo.`
        : `El diseño debe verse ancho (full-width, edge-to-edge), NO como una aplicación móvil centrada.`,
      `Evita los contenedores cuadrados aburridos; usa asimetría, superposiciones suaves y gran espacio negativo (whitespace).`,
      ``,
      `Paleta de colores:`,
      `- Primary: ${palette.primary}`,
      `- Secondary: ${palette.secondary}`,
      `- Accent: ${palette.accent}`,
      ``,
      `Tipografía: Usa fuentes premium, de mucho contraste y elegantes (${aesthetic.shapes}).`,
    ];

    const curatedPhotos = data.curatedPhotos || {};
    if (curatedPhotos.hero || curatedPhotos.products?.length > 0) {
      lines.push("");
      lines.push("Instrucciones de imágenes:");
      if (curatedPhotos.hero) lines.push("- Para el Hero principal, usá una foto amplia y cinematográfica del negocio.");
      if (curatedPhotos.products?.length > 0) lines.push("- Para la sección de servicios, usá fotos distintas que muestren cada servicio.");
      lines.push("- Cada imagen debe ser única y contextual. No repetir la misma foto.");
    }

    lines.push("");
    lines.push(`El tono de voz debe ser: ${aesthetic.tone}`);
    lines.push("Mantené todos los textos en ESPAÑOL.");

    return lines.join("\n");
  }

  /**
   * PASO 2.5: INSTRUCCIONES DE SLOTS PARA WIDGETS.
   */
  static assembleSlotInstructions(widgetManifest) {
    if (!widgetManifest?.selectedWidgets?.length) return "";
    const inlineWidgets = widgetManifest.selectedWidgets.filter((w) => !w.floating);
    if (inlineWidgets.length === 0) return "";

    const lines = [
      "═══ REGLA DE INYECCIÓN DE WIDGETS (CERO TOLERANCIA A ERRORES) ═══",
      "Donde el diseño requiera el widget de \"${widget.label}\", DEBES imprimir ÚNICAMENTE esta línea HTML, sin alteraciones:",
      "",
      "CRÍTICO: ",
      "1. PROHIBIDO poner texto, imágenes o íconos dentro de este div. DEBE ESTAR 100% VACÍO.",
      "2. PROHIBIDO alterar atributos (id, class, data-nexus-widget).",
      "3. PROHIBIDO ocultar con CSS.",
      "",
    ];
    
    for (const widget of inlineWidgets) {
      lines.push(`- Para el widget "${widget.label}", inyectá exactamente este código:`);
      lines.push(`  <div id="${widget.slotId}" class="nexus-widget w-full min-h-[300px] rounded-2xl bg-transparent my-8" data-nexus-widget="${widget.name}"></div>`);
      lines.push("");
    }
    
    return lines.join("\n");
  }
}

module.exports = PipelineTemplates;
