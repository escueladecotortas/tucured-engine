// Archivo: backend/services/CloudDeployOrchestrator.js
// Orquestador de Forja Local (Gate 2) y Despliegue Netlify (Gate 3 Aislado) — Ley de 200 líneas

const path = require('path');
const fs = require('fs');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const StitchMcpClient = require('./StitchMcpClient');
const NetlifyDeployService = require('./NetlifyDeployService');
const slugify = require('../utils/slugify');

const TerminalService = {
  broadcast: (msg) => console.log("[LOG]", msg),
  emitCompletion: (msg) => console.log("[DONE]", msg),
  emitError: (msg) => console.error("[ERR]", msg)
};

class CloudDeployOrchestrator {
  /**
   * GATE 2: Forja Local con Stitch MCP (Cero Auto-Deploy a Netlify)
   */
  static async executeCloudPipeline(prospectData, prospectId) {
    const slug = slugify(prospectId || prospectData.slug || prospectData.name);
    const localUrl = `/clients/${slug}/index.html`;

    try {
      console.log(`\n[Cloud Deploy] ⚡ Forjando localmente con Stitch MCP: ${slug}`);
      TerminalService.broadcast(`⚡ Orquestando Forja Local (Gate 2) para "${slug}"`, 'info');

      const title = prospectData.name || slug;
      const enhancedPrompt = prospectData.stitchSeedPrompt || `Landing page de alta fidelidad para ${title}`;
      
      const stitchRes = await StitchMcpClient.generate(title, enhancedPrompt, slug, prospectData);

      if (!stitchRes || !stitchRes.success) {
        const errMsg = stitchRes?.error || "Respuesta sin éxito de Stitch MCP";
        throw new Error(`Fallo en la forja vía Stitch: ${errMsg}`);
      }

      TerminalService.broadcast(`✅ Forja local finalizada con éxito. Preview listo.`, 'success');

      return {
        success: true,
        status: 'generated',
        isLocalOnly: true,
        localUrl,
        url: localUrl,
        clientId: slug,
        projectId: stitchRes.projectId,
        widgetManifest: stitchRes.widgetManifest
      };
    } catch (error) {
      console.error(`[CloudDeployOrchestrator] ❌ Error en Forja Local:`, error.message);
      TerminalService.broadcast(`❌ Error en forja: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * GATE 3: Despliegue Manual a Netlify (Invocado ÚNICAMENTE por botón [🚀 Desplegar a Netlify])
   */
  static async deployToNetlifyCloud(slug, prospectData = {}) {
    const customDomain = `${slug}.tucured.ar`;
    const tmpDir = path.join(os.tmpdir(), `nexus_deploy_${uuidv4()}`);
    const archivesPath = path.resolve(process.cwd(), `nexus_archives/tucu-red/clients/${slug}`);

    if (!fs.existsSync(archivesPath)) {
      throw new Error(`No existen artefactos forjados en disco para ${slug}`);
    }

    try {
      TerminalService.broadcast(`🚀 Iniciando Despliegue en Netlify (${customDomain})...`, 'info');
      fs.mkdirSync(tmpDir, { recursive: true });
      fs.cpSync(archivesPath, tmpDir, { recursive: true });

      const netlifyRes = await NetlifyDeployService.deployToNetlify(tmpDir, {
        siteName: slug,
        customDomain,
        siteId: prospectData.netlifySiteId
      });

      TerminalService.broadcast(`✅ Sitio en vivo: ${netlifyRes.url}`, 'success');
      return { success: true, ...netlifyRes, domain: customDomain };
    } catch (err) {
      TerminalService.broadcast(`❌ Falló el despliegue en Netlify: ${err.message}`, 'error');
      throw err;
    } finally {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
    }
  }
}

module.exports = CloudDeployOrchestrator;
