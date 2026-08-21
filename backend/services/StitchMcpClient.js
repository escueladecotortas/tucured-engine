// Archivo: backend/services/StitchMcpClient.js
// Cliente Maestro de Google Stitch MCP con Extracción Resiliente y Trazabilidad Extrema (Ley de 200 líneas)

const StitchRpcHandler = require("./stitch/StitchRpcHandler");
const StitchPipeline = require("./stitch/StitchPipeline");

class StitchMcpClient {
  static async generate(title, prompt, clientId, prospectData) {
    return await StitchPipeline.generate(title, prompt, clientId, prospectData, this);
  }

  static async _createProject(title) {
    const sanitizedTitle = (typeof title === "string" ? title : title?.title || title?.name || "Tucu Red Project").trim().slice(0, 100) || "Tucu Red Project";
    console.log(`[StitchMcpClient] 🏗️ Creando proyecto Stitch: "${sanitizedTitle}"...`);

    // 1. Intento con SDK Oficial @google/stitch-sdk
    try {
      const { stitch } = await import("@google/stitch-sdk");
      if (stitch && typeof stitch.createProject === "function") {
        const project = await stitch.createProject(sanitizedTitle);
        const pId = project?.id || project?.projectId || (project?.name ? project.name.replace(/^projects\//, "") : null);
        if (pId) {
          console.log(`   ✅ [StitchMcpClient] Project ID obtenido vía SDK: ${pId}`);
          return String(pId);
        }
      }
    } catch (sdkErr) {}

    // 2. Invocación JSON-RPC Oficial con Trazabilidad Extrema
    const args = { title: sanitizedTitle };
    console.log(`[StitchMcpClient] 📤 Payload de creación de proyecto (JSON):`, JSON.stringify(args));

    const res = await StitchRpcHandler.request("create_project", args);

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
    const cleanProjectId = String(projectId).replace(/^projects\//, "").trim();
    const args = {
      projectId: cleanProjectId,
      prompt: String(prompt || ""),
      deviceType: "DESKTOP",
      modelId: "GEMINI_3_1_PRO",
    };
    console.log(`[StitchMcpClient] 📤 Generando pantalla para Project ID ${cleanProjectId} | Args:`, JSON.stringify(args));
    const res = await StitchRpcHandler.request("generate_screen_from_text", args);
    return res?.result?.content?.[0]?.text || JSON.stringify(res?.result?.structuredContent || res?.result || res);
  }

  static async _editScreen(projectId, screenId, prompt) {
    let rawProject = typeof projectId === 'object' ? (projectId.id || projectId.projectId || '') : String(projectId || '');
    let rawScreen = typeof screenId === 'object' ? (screenId.id || screenId.screenId || '') : String(screenId || '');

    const cleanProjectId = rawProject.replace(/^projects\//, "").replace(/[\s\n\0]/g, "").trim();
    const cleanScreenId = rawScreen.replace(/^screens\//, "").replace(/[\s\n\0]/g, "").trim();
    
    const args = {
      projectId: cleanProjectId,
      selectedScreenIds: [cleanScreenId],
      prompt: String(prompt || ""),
      deviceType: "DESKTOP",
      modelId: "GEMINI_3_1_PRO",
    };
    
    console.log(`[StitchMcpClient] 📤 Editando pantalla ${cleanScreenId} en Project ID ${cleanProjectId} | Args:`, JSON.stringify(args));
    console.log("[Stitch RAW Edit Payload]", JSON.stringify(args));
    
    const res = await StitchRpcHandler.request("edit_screens", args);
    return res?.result?.content?.[0]?.text || JSON.stringify(res?.result?.structuredContent || res?.result || res);
  }

  static async _getScreen(projectId, screenId) {
    const cleanProjectId = String(projectId).replace(/^projects\//, "").trim();
    const cleanScreenId = String(screenId).replace(/^screens\//, "").trim();
    const args = {
      name: `projects/${cleanProjectId}/screens/${cleanScreenId}`,
      projectId: cleanProjectId,
      screenId: cleanScreenId,
    };
    console.log(`[StitchMcpClient] 📤 Obteniendo pantalla ${cleanScreenId} en Project ID ${cleanProjectId}...`);
    const res = await StitchRpcHandler.request("get_screen", args);
    return res?.result?.content?.[0]?.text || JSON.stringify(res?.result?.structuredContent || res?.result || res);
  }

  static async call(method, params = {}) {
    return await StitchRpcHandler.request(method, params);
  }
}

module.exports = StitchMcpClient;
