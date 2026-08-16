// Archivo: backend/services/OrionValidator.js
// AGENTE ORION: Validador de integridad de datos pre-Stitch
// Verifica que enrichedData tenga los campos mínimos para generar un prompt de calidad

class OrionValidator {
  /**
   * Valida la integridad del enrichedData antes de enviar a Stitch.
   * Retorna un reporte con score, warnings y blockers.
   * @param {Object} data - enrichedData del pipeline
   * @returns {Object} { score, passed, blockers, warnings, report }
   */
  static validate(data) {
    console.log("🔱 [ORION] Validación de integridad pre-Stitch...");

    const blockers = [];
    const warnings = [];
    let score = 0;
    const maxScore = 20;

    // BLOQUEANTES (sin estos, no se puede generar)
    if (!data.name) blockers.push("❌ Sin nombre del negocio");
    else score += 2;

    if (!data.vibe) blockers.push("❌ Sin vibración asignada");
    else score += 1;

    if (!data.tagline || data.tagline.length < 3) {
      // Fallback en vez de bloquear — genera tagline genérico
      data.tagline = `Bienvenido a ${data.name}`;
      warnings.push(
        "⚠️ Tagline generado por fallback (Groq no lo proporcionó)",
      );
    } else score += 1;

    // IMPORTANTES (degradan calidad pero no bloquean)
    const ig = data.instagramData || {};

    if (!ig.bio) warnings.push("⚠️ Sin bio de IG");
    else score += 1;

    const captions = ig.captions || [];
    if (captions.length === 0) {
      warnings.push(
        "⚠️ Sin captions de IG — Stitch no tendrá la voz del negocio",
      );
    } else {
      score += Math.min(captions.length, 6);
    }

    if (!ig.profile_pic) warnings.push("⚠️ Sin logo (profile pic de IG)");
    else score += 1;

    const reviews = data.topReviews || [];
    if (reviews.length === 0) {
      warnings.push(
        "⚠️ Sin reseñas — Stitch no generará sección de testimonios",
      );
    } else score += 2;

    const hours = data.hours || [];
    if (hours.length === 0) warnings.push("⚠️ Sin horarios");
    else score += 1;

    const gp = data.googlePlace || {};
    if (!gp.phone && !data.phone)
      warnings.push("⚠️ Sin teléfono — CTA de WhatsApp estará vacío");
    else score += 1;

    if (!gp.address && !data.address) warnings.push("⚠️ Sin dirección");
    else score += 1;

    const photos = data.photos || [];
    if (photos.length < 3)
      warnings.push(
        "⚠️ Pocas fotos (" + photos.length + ") — galería limitada",
      );
    else score += 1;

    const benefits = data.benefits || [];
    if (benefits.length < 3)
      warnings.push("⚠️ Menos de 3 benefits — grid incompleto");
    else score += 1;

    if (!data.description)
      warnings.push("⚠️ Sin description — subtítulo del hero vacío");
    else score += 1;

    // SCORE
    const pct = Math.round((score / maxScore) * 100);
    const passed = blockers.length === 0 && pct >= 50;

    // Reporte
    const report = [
      `🔱 [ORION] Reporte de Integridad`,
      `   Score: ${score}/${maxScore} (${pct}%)`,
      `   Estado: ${passed ? "✅ APROBADO" : "❌ BLOQUEADO"}`,
    ];

    if (blockers.length > 0) {
      report.push(`   Bloqueantes (${blockers.length}):`);
      blockers.forEach((b) => report.push(`     ${b}`));
    }

    if (warnings.length > 0) {
      report.push(`   Advertencias (${warnings.length}):`);
      warnings.forEach((w) => report.push(`     ${w}`));
    }

    const reportText = report.join("\n");
    console.log(reportText);

    return {
      score,
      maxScore,
      percentage: pct,
      passed,
      blockers,
      warnings,
      report: reportText,
    };
  }
}

module.exports = OrionValidator;
