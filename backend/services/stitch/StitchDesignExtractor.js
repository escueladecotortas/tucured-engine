// Archivo: backend/services/stitch/StitchDesignExtractor.js
// RESPONSABILIDAD: Extraer el sistema de diseño de un proyecto de Stitch
// y persistirlo como DESIGN.md en la ficha del cliente (Soberanía Digital).
const fs = require("fs");
const path = require("path");
const StitchRpcHandler = require("./StitchRpcHandler");
const TerminalService = require("../TerminalService");

class StitchDesignExtractor {
  /**
   * Extrae el designTheme y designMd de un proyecto de Stitch vía MCP
   * y genera el DESIGN.md en la carpeta del cliente.
   * @param {string} projectId - ID del proyecto de Stitch.
   * @param {string} clientId - ID del cliente en Nexus Archives.
   * @param {string} destPath - Ruta de destino (carpeta del cliente).
   * @returns {object|null} Los namedColors extraídos para el pipeline.
   */
  static async extractAndPersist(projectId, clientId, destPath) {
    try {
      TerminalService.broadcast(`🎨 Extrayendo sistema de diseño de Stitch...`, "info");

      // Llamada MCP: get_project
      const res = await StitchRpcHandler.request("get_project", {
        name: `projects/${projectId}`,
      });

      const text = res.result?.content?.[0]?.text || "";
      let projectData = null;

      try {
        projectData = JSON.parse(text);
      } catch (e) {
        console.warn("[DesignExtractor] No se pudo parsear la respuesta de get_project.");
        return null;
      }

      const designTheme = projectData?.designTheme;
      if (!designTheme) {
        console.warn("[DesignExtractor] El proyecto no tiene designTheme.");
        return null;
      }

      // Generar el DESIGN.md con los tokens del proyecto
      const designMd = this._buildDesignMd(projectData, designTheme);

      // Persistir en la ficha del cliente
      const designPath = path.join(destPath, "DESIGN.md");
      fs.writeFileSync(designPath, designMd, "utf8");

      TerminalService.broadcast(
        `✅ DESIGN.md persistido en la ficha de ${clientId}`,
        "success"
      );

      // Retornar los namedColors para que el pipeline los use en el inyector
      return {
        namedColors: designTheme.namedColors || {},
        designMd: designTheme.designMd || "",
        font: designTheme.font,
        bodyFont: designTheme.bodyFont,
        roundness: designTheme.roundness,
        overridePrimaryColor: designTheme.overridePrimaryColor,
        overrideSecondaryColor: designTheme.overrideSecondaryColor,
      };
    } catch (err) {
      console.error("[DesignExtractor] Error al extraer el diseño:", err.message);
      // Fallo silencioso — no bloquea el pipeline
      return null;
    }
  }

  /**
   * Construye el contenido del DESIGN.md a partir de los datos de Stitch.
   */
  static _buildDesignMd(projectData, designTheme) {
    const colors = designTheme.namedColors || {};
    const now = new Date().toISOString().split("T")[0];

    // Tabla de tokens principales
    const colorRows = Object.entries(colors)
      .map(([key, val]) => `| \`${key}\` | \`${val}\` |`)
      .join("\n");

    return `# DESIGN.md — Ficha de Diseño del Cliente
# Proyecto Stitch: ${projectData.title || "Sin título"} (ID: ${projectData.name?.split("/")[1] || "?"})
# Fuente: Extraído automáticamente vía MCP de Google Stitch
# Última sincronización: ${now}

---

## Tokens Principales

| Token | Valor |
|---|---|
| **Font Headlines** | ${designTheme.headlineFont || designTheme.font || "Noto Serif"} |
| **Font Body / Labels** | ${designTheme.bodyFont || "Manrope"} |
| **Color Mode** | ${designTheme.colorMode || "LIGHT"} |
| **Roundness** | ${designTheme.roundness || "ROUND_FOUR"} |

### Overrides de Color de Marca

| Rol | Hex |
|---|---|
| Override Primary | \`${designTheme.overridePrimaryColor || "N/A"}\` |
| Override Secondary | \`${designTheme.overrideSecondaryColor || "N/A"}\` |
| Override Tertiary | \`${designTheme.overrideTertiaryColor || "N/A"}\` |
| Override Neutral | \`${designTheme.overrideNeutralColor || "N/A"}\` |

---

## Paleta Completa (Named Colors)

| Token | Hex |
|---|---|
${colorRows}

---

## Sistema de Diseño — Documento Completo (del Director de Arte de Stitch)

${designTheme.designMd || "_Sin documento de diseño disponible._"}
`;
  }
}

module.exports = StitchDesignExtractor;
