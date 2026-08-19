// Archivo: backend/services/stitch/StitchRpcHandler.js
// Gestor de comunicación JSON-RPC y Descargas Resilientes para Google Stitch (Ley de 200 líneas)

const https = require("https");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
require("dotenv").config();

class StitchRpcHandler {
  static getApiKey() {
    return (process.env.STITCH_API_KEY || process.env.GOOGLE_STITCH_API_KEY || "").replace(/["']/g, "").trim();
  }

  /**
   * Helper paramétrico para POST JSON-RPC oficial a Google Stitch MCP con X-Goog-Api-Key.
   */
  static async request(method, params = {}) {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("STITCH_API_KEY / GOOGLE_STITCH_API_KEY no configurada.");

    return new Promise((resolve, reject) => {
      const payloadObj = {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: { name: method, arguments: params },
      };
      const data = JSON.stringify(payloadObj);

      console.log(`[StitchRpcHandler] 📤 Invocando MCP tool: "${method}" | Payload:`, data);

      const options = {
        hostname: "stitch.googleapis.com",
        port: 443,
        path: "/mcp",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Goog-Api-Key": apiKey,
          "Content-Length": Buffer.byteLength(data),
        },
      };

      const req = https.request(options, (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(raw);
              if (parsed?.result?.isError === true) {
                const errorText = parsed.result.content?.map(c => c.text).filter(Boolean).join(" ") || "Error desconocido devuelto por Stitch MCP";
                console.error(`[StitchRpcHandler] ❌ Error en tool "${method}":`, errorText, "| Raw:", raw);
                reject(new Error(`[Stitch MCP ${method}] ${errorText}`));
                return;
              }
              if (parsed?.error) {
                console.error(`[StitchRpcHandler] ❌ Error RPC en tool "${method}":`, parsed.error);
                reject(new Error(`[Stitch MCP RPC Error] ${parsed.error.message || JSON.stringify(parsed.error)}`));
                return;
              }
              resolve(parsed);
            } catch (e) {
              reject(new Error(`Fallo al parsear respuesta JSON de Stitch: ${raw.slice(0, 200)}`));
            }
          } else {
            reject(new Error(`Stitch MCP HTTP ${res.statusCode}: ${raw.slice(0, 300)}`));
          }
        });
      });

      req.on("error", (err) => reject(new Error(`Error de red con Stitch MCP: ${err.message}`)));
      req.write(data);
      req.end();
    });
  }

  /**
   * Descarga resiliente del HTML siguiendo redirecciones (HTTP 301/302/307).
   */
  static async downloadHtml(url) {
    if (!url) throw new Error("URL de descarga vacía.");
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status} al descargar HTML (${res.statusText})`);
      const html = await res.text();
      if (!html || html.length < 500) {
        throw new Error(`HTML descargado incompleto o corrupto (${html ? html.length : 0} bytes)`);
      }
      return html;
    } catch (err) {
      throw new Error(`Fallo en descarga de artefacto HTML: ${err.message}`);
    }
  }
}

module.exports = StitchRpcHandler;
