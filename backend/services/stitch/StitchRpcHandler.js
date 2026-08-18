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
      const data = JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: { name: method, arguments: params },
      });

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
              resolve(JSON.parse(raw));
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
