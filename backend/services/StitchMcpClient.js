// Archivo: backend/services/StitchMcpClient.js
// SERVICE: StitchMcpClient v5.0 (Modularized - Ley de 200 líneas)
// Orquesta: Semilla → Director de Arte → Inyección de Widgets

const StitchRpcHandler = require("./stitch/StitchRpcHandler");
const StitchParser = require("./stitch/StitchParser");
const StitchPipeline = require("./stitch/StitchPipeline");

class StitchMcpClient {
  /**
   * Genera un sitio completo usando el Pipeline Iterativo de 3 Tiempos.
   */
  static async generate(title, prompt, clientId, prospectData) {
    return await StitchPipeline.generate(title, prompt, clientId, prospectData, this);
  }

  // ═══════════════════════════════════════
  // MÉTODOS RPC ATÓMICOS
  // ═══════════════════════════════════════

  static async _createProject(title) {
    const res = await StitchRpcHandler.request("create_project", { title });
    const text = res.result?.content?.[0]?.text || "";
    try {
      const parsed = JSON.parse(text);
      const match = (parsed.name || text).match(/projects\/(\d+)/);
      if (match) return match[1];
    } catch (e) {}
    const match = text.match(/projects\/(\d+)/) || text.match(/\b(\d{15,20})\b/);
    if (match) return match[1];
    throw new Error("No se pudo obtener el Project ID de Stitch.");
  }

  static async _generateScreen(projectId, prompt) {
    const res = await StitchRpcHandler.request("generate_screen_from_text", {
      projectId,
      prompt,
      deviceType: "DESKTOP",
      modelId: "GEMINI_3_PRO",
    });
    return res.result?.content?.[0]?.text || "";
  }

  static async _editScreen(projectId, screenId, prompt) {
    const res = await StitchRpcHandler.request("edit_screens", {
      projectId,
      selectedScreenIds: [screenId],
      prompt,
      deviceType: "DESKTOP",
      modelId: "GEMINI_3_PRO",
    });
    return res.result?.content?.[0]?.text || "";
  }

  static async _getScreen(projectId, screenId) {
    const res = await StitchRpcHandler.request("get_screen", {
      name: `projects/${projectId}/screens/${screenId}`,
      projectId,
      screenId,
    });
    return res.result?.content?.[0]?.text || "";
  }

  /**
   * Helper paramétrico opcional para llamadas directas
   */
  static async call(method, params = {}) {
    return await StitchRpcHandler.request(method, params);
  }
}

module.exports = StitchMcpClient;
