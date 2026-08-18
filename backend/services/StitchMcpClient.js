// Archivo: backend/services/StitchMcpClient.js
// Cliente Maestro de Google Stitch MCP con Extracción Resiliente de IDs (Ley de 200 líneas)

const StitchRpcHandler = require("./stitch/StitchRpcHandler");
const StitchPipeline = require("./stitch/StitchPipeline");

class StitchMcpClient {
  static async generate(title, prompt, clientId, prospectData) {
    return await StitchPipeline.generate(title, prompt, clientId, prospectData, this);
  }

  static async _createProject(title) {
    console.log(`[StitchMcpClient] 🏗️ Creando proyecto Stitch: "${title}"...`);

    // 1. Intento con SDK Oficial @google/stitch-sdk
    try {
      const { stitch } = await import("@google/stitch-sdk");
      if (stitch && typeof stitch.createProject === "function") {
        const project = await stitch.createProject(title);
        const pId = project?.id || project?.projectId || (project?.name ? project.name.replace(/^projects\//, "") : null);
        if (pId) {
          console.log(`   ✅ [StitchMcpClient] Project ID obtenido vía SDK: ${pId}`);
          return String(pId);
        }
      }
    } catch (sdkErr) {}

    // 2. Intento con JSON-RPC Oficial (X-Goog-Api-Key)
    const res = await StitchRpcHandler.request("create_project", { title });

    // 2.a: structuredContent.name
    const structuredName = res?.result?.structuredContent?.name;
    if (structuredName) {
      const match = structuredName.match(/projects\/(\d+)/) || structuredName.match(/\b(\d{15,22})\b/);
      if (match) return match[1];
      return structuredName.replace(/^projects\//, "");
    }

    // 2.b: content[0].text
    const text = res?.result?.content?.[0]?.text || "";
    if (text) {
      try {
        const parsed = JSON.parse(text);
        const name = parsed?.name || parsed?.id || parsed?.projectId;
        if (name) {
          const match = String(name).match(/projects\/(\d+)/) || String(name).match(/\b(\d{15,22})\b/);
          if (match) return match[1];
          return String(name).replace(/^projects\//, "");
        }
      } catch (e) {}

      const match = text.match(/projects\/(\d+)/) || text.match(/\b(\d{15,22})\b/);
      if (match) return match[1];
    }

    // 2.c: Regex global sobre payload serializado
    const rawString = JSON.stringify(res || {});
    const globalMatch = rawString.match(/projects\/(\d+)/) || rawString.match(/"(?:projectId|id|name)":\s*"?(?:projects\/)?(\d{15,22})"?/);
    if (globalMatch) return globalMatch[1];

    console.error("[Stitch MCP Raw Response]", rawString);
    throw new Error(`No se pudo obtener el Project ID de Stitch. Payload: ${rawString.slice(0, 250)}`);
  }

  static async _generateScreen(projectId, prompt) {
    const res = await StitchRpcHandler.request("generate_screen_from_text", {
      projectId,
      prompt,
      deviceType: "DESKTOP",
      modelId: "GEMINI_3_1_PRO",
    });
    return res?.result?.content?.[0]?.text || JSON.stringify(res?.result?.structuredContent || res?.result || res);
  }

  static async _editScreen(projectId, screenId, prompt) {
    const res = await StitchRpcHandler.request("edit_screens", {
      projectId,
      selectedScreenIds: [screenId],
      prompt,
      deviceType: "DESKTOP",
      modelId: "GEMINI_3_1_PRO",
    });
    return res?.result?.content?.[0]?.text || JSON.stringify(res?.result?.structuredContent || res?.result || res);
  }

  static async _getScreen(projectId, screenId) {
    const res = await StitchRpcHandler.request("get_screen", {
      name: `projects/${projectId}/screens/${screenId}`,
      projectId,
      screenId,
    });
    return res?.result?.content?.[0]?.text || JSON.stringify(res?.result?.structuredContent || res?.result || res);
  }

  static async call(method, params = {}) {
    return await StitchRpcHandler.request(method, params);
  }
}

module.exports = StitchMcpClient;
