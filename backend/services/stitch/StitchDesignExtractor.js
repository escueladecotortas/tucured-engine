// Archivo: backend/services/stitch/StitchDesignExtractor.js
// RESPONSABILIDAD: Extraer el sistema de diseño de un proyecto de Stitch
// y persistirlo como DESIGN.md y stitch-manifest.json (Ley de 200 líneas).
const fs = require("fs");
const path = require("path");
const StitchRpcHandler = require("./StitchRpcHandler");
const TerminalService = { broadcast: (msg) => console.log("[LOG]", msg), emitCompletion: (msg) => console.log("[DONE]", msg), emitError: (msg) => console.error("[ERR]", msg) };

class StitchDesignExtractor {
  static async extractAndPersist(projectId, clientId, destPath, promptContext = "") {
    try {
      TerminalService.broadcast(`🎨 Extrayendo sistema de diseño de Stitch...`, "info");

      const res = await StitchRpcHandler.request("get_project", {
        name: `projects/${projectId}`,
      });

      const text = res.result?.content?.[0]?.text || "";
      let projectData = null;
      try { projectData = JSON.parse(text); } catch (e) { return null; }

      const designTheme = projectData?.designTheme;
      if (!designTheme) return null;

      // 1. Generar y persistir DESIGN.md
      const designMd = this._buildDesignMd(projectData, designTheme);
      fs.writeFileSync(path.join(destPath, "DESIGN.md"), designMd, "utf8");

      // 2. Generar y persistir stitch-manifest.json (Trazabilidad E2E)
      const stitchManifest = {
        prompt: promptContext || `Landing page de alta conversión para "${clientId}" (Fórmula Idea + Theme + Content)`,
        designTokens: {
          namedColors: designTheme.namedColors || {},
          font: designTheme.font || "Inter",
          bodyFont: designTheme.bodyFont || "Inter",
          roundness: designTheme.roundness || "MEDIUM",
          primary: designTheme.namedColors?.primary || "#10b981",
          secondary: designTheme.namedColors?.secondary || "#3b82f6",
          surface: designTheme.namedColors?.surface || "#0a0a0a"
        },
        metadata: {
          projectId,
          modelId: "GEMINI_3_1_PRO",
          engine: "stitch-mcp-v5",
          timestamp: new Date().toISOString()
        }
      };

      fs.writeFileSync(path.join(destPath, "stitch-manifest.json"), JSON.stringify(stitchManifest, null, 2), "utf8");
      
      const publicDest = path.resolve(__dirname, `../../../public/clients/${clientId}`);
      if (fs.existsSync(publicDest)) {
        fs.writeFileSync(path.join(publicDest, "stitch-manifest.json"), JSON.stringify(stitchManifest, null, 2), "utf8");
      }

      TerminalService.broadcast(`✅ DESIGN.md y stitch-manifest.json persistidos para ${clientId}`, "success");

      return {
        namedColors: designTheme.namedColors || {},
        designMd: designTheme.designMd || "",
        font: designTheme.font,
        bodyFont: designTheme.bodyFont,
        roundness: designTheme.roundness,
        overridePrimaryColor: designTheme.overridePrimaryColor,
        overrideSecondaryColor: designTheme.overrideSecondaryColor,
        stitchManifest
      };
    } catch (err) {
      console.error("[DesignExtractor] Error al extraer diseño:", err.message);
      return null;
    }
  }

  static _buildDesignMd(projectData, designTheme) {
    const colors = designTheme.namedColors || {};
    const now = new Date().toISOString().split("T")[0];
    const colorRows = Object.entries(colors)
      .map(([name, hex]) => `| \`${name}\` | \`${hex}\` | <span style="background-color:${hex};color:${hex};padding:2px 8px;border-radius:4px;border:1px solid #333">■■</span> |`)
      .join("\n");

    return `---
title: "Sistema de Diseño — ${projectData.title || "Cliente"}"
date: "${now}"
engine: "Google Stitch MCP"
version: "1.0.0"
projectId: "${projectData.id || projectData.projectId || ""}"
---

# 🎨 Sistema de Diseño Extraído de Stitch

> **Fuente Única de Verdad (SSOT)**: Tokens generados automáticamente por Google Stitch para el proyecto \`${projectData.title || "Cliente"}\`.

---

## 🌈 Paleta de Colores

| Token | Valor Hex | Muestra |
|---|---|---|
${colorRows || "| `primary` | `#6ee591` | ■■ |"}

---

## 🔤 Tipografía y Geometría
- **Fuente de Títulos**: \`${designTheme.font || "Inter"}\`
- **Fuente de Cuerpo**: \`${designTheme.bodyFont || "Inter"}\`
- **Radio de Bordes**: \`${designTheme.roundness || "MEDIUM"}\`
`;
  }
}

module.exports = StitchDesignExtractor;
