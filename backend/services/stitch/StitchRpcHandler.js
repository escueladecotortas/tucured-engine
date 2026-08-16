// Archivo: backend/services/stitch/StitchRpcHandler.js
const https = require("https");

/**
 * Gestor de comunicación JSON-RPC y Descargas para Google Stitch.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class StitchRpcHandler {
  /**
   * Helper paramétrico para POST JSON-RPC a Google Stitch.
   */
  static async getAccessToken() {
    // Si ya tenemos un token y no ha expirado (usamos un margen de 5 minutos), lo devolvemos
    if (this._cachedToken && this._tokenExpiry > Date.now() + 300000) {
      return this._cachedToken;
    }

    try {
      const { GoogleAuth } = require("google-auth-library");
      const auth = new GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      });
      const client = await auth.getClient();
      const tokenResponse = await client.getAccessToken();
      
      this._cachedToken = tokenResponse.token;
      // El token de Google suele durar 1 hora (3600s)
      this._tokenExpiry = Date.now() + 3600000;
      
      return this._cachedToken;
    } catch (e) {
      console.warn("[StitchRpcHandler] google-auth-library falló, intentando gcloud CLI:", e.message);
      try {
        const { execSync } = require("child_process");
        const token = execSync("gcloud auth application-default print-access-token", { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
        this._cachedToken = token;
        this._tokenExpiry = Date.now() + 300000; // Cacheamos solo 5 min para gcloud CLI
        return token;
      } catch (err) {
        console.error("[StitchRpcHandler] Fallo crítico al obtener token:", err.message);
        return process.env.STITCH_OAUTH_TOKEN;
      }
    }
  }

  /**
   * Helper paramétrico para POST JSON-RPC a Google Stitch.
   */
  static async request(method, params = {}) {
    const accessToken = await this.getAccessToken();

    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: `tools/call`,
        params: {
          name: method,
          arguments: params,
        },
      });

      const options = {
        hostname: "stitch.googleapis.com",
        port: 443,
        path: "/mcp",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "x-goog-user-project": "nexus-v2-native",
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
              reject(new Error(`Failed to parse JSON: ${raw}`));
            }
          } else {
            reject(new Error(`Status Code ${res.statusCode}: ${raw}`));
          }
        });
      });

      req.on("error", reject);
      req.write(data);
      req.end();
    });
  }

  /**
   * Descarga el HTML desde una URL de Google Cloud Storage.
   */
  static downloadHtml(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }).on("error", reject);
    });
  }
}

module.exports = StitchRpcHandler;
