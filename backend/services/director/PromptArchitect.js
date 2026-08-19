// Archivo: backend/services/director/PromptArchitect.js
// Submódulo Atómico: Ensamblado de Prompts y Misión MAS (Ley de 200 líneas)

const VIBES = require('../prompts/vibeDefinitions');

class PromptArchitect {
  /**
   * Construye el payload estructurado MissionIgniter para inyección de contexto
   */
  static buildMissionIgniter(fullData) {
    const missionIgniter = {
      factual_core: {
        name: fullData.name,
        category: fullData.category,
        address: fullData.address,
        hours: fullData.hours || "Consultar",
        services: fullData.services || [],
        top_reviews: (fullData.topReviews || []).slice(0, 3).map(r => r.text)
      },
      instagram_dna: {
        handle: fullData.instagram || "N/A",
        bio: fullData.instagramData?.bio || "",
        stylometry: (fullData.instagramData?.captions || []).slice(0, 5)
      },
      vibe: fullData.vibeNum || 7
    };

    const sourceData = `
<MISSION_IGNITER>
  <FACTUAL_CORE>
    Name: ${missionIgniter.factual_core.name}
    Category: ${missionIgniter.factual_core.category}
    Services: ${missionIgniter.factual_core.services.join(", ")}
    Hours: ${JSON.stringify(missionIgniter.factual_core.hours)}
    Top Reviews: ${missionIgniter.factual_core.top_reviews.join(" | ")}
  </FACTUAL_CORE>
  <INSTAGRAM_DNA>
    Handle: ${missionIgniter.instagram_dna.handle}
    Bio: ${missionIgniter.instagram_dna.bio}
    Stylometry: ${missionIgniter.instagram_dna.stylometry.join(" || ")}
  </INSTAGRAM_DNA>
  <VIBE_CONTEXT>
    VibeNumber: ${missionIgniter.vibe}
    Style: ${VIBES[missionIgniter.vibe]?.style || "Premium"}
    Keywords: ${VIBES[missionIgniter.vibe]?.keywords || "Quality, Professional"}
    Directive: ${VIBES[missionIgniter.vibe]?.tone || "Maintain a professional and upscale tone."}
  </VIBE_CONTEXT>
</MISSION_IGNITER>`;

    return { missionIgniter, sourceData };
  }

  /**
   * Ensambla el prompt para Lorem (Redacción Narrativa)
   */
  static buildLoremPrompt(name, sourceData, feedback = "") {
    return `
[MISSION]: Redactar la narrativa comercial de alta gama para "${name}".
${sourceData}

[CONSTRAINTS]:
1. TRUTH DOCUMENTED: No inventar servicios, platos o beneficios que no estén en <FACTUAL_CORE>.
2. PURGA SEMÁNTICA: Prohibido usar "Santuario", "Mágico", "Laboratorio", "Inolvidable", "Sueño".
3. ADAPTACIÓN: Usar la estilometría de <INSTAGRAM_DNA> para el tono, pero priorizar la claridad de <FACTUAL_CORE>.
4. ESTRUCTURA: Hero (H1 persuasivo + Subtext), Servicios (3 puntos clave), Historia (Corta y auténtica).

${feedback ? `\n[FEEDBACK_ARGUS]: ${feedback}\n¡CORRIGE LOS ERRORES MENCIONADOS!` : ""}
`;
  }

  /**
   * Ensambla el prompt para Argus (Auditoría de Veracidad)
   */
  static buildArgusPrompt(currentNarrative, sourceData) {
    return `
[AUDIT_MISSION]: Validar la veracidad y calidad de la narrativa contra los datos fuente.

[NARRATIVE_TO_AUDIT]:
${currentNarrative}

[SOURCE_DATA]:
${sourceData}

[CRITERIA]:
1. ¿Hay alucinaciones? (Datos no presentes en FACTUAL_CORE).
2. ¿Hay palabras prohibidas? (Santuario, Mágico, etc).
3. ¿Coinciden los horarios y servicios?

[OUTPUT_RULES]:
- Si cumple todo: "APPROVED"
- Si falla: "REJECTED: [Motivo específico y qué cambiar]"
`;
  }
}

module.exports = PromptArchitect;
