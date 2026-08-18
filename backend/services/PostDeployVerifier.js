// Archivo: backend/services/PostDeployVerifier.js
// SERVICE: PostDeployVerifier v4.0 (Modularized - Ley de 200 líneas)
// QA automático post-deploy para sitios en producción.

const TerminalService = { broadcast: (msg) => console.log("[LOG]", msg), emitCompletion: (msg) => console.log("[DONE]", msg), emitError: (msg) => console.error("[ERR]", msg) };
const ProductionAuditor = require("./verify/ProductionAuditor");

class PostDeployVerifier {
  static async verify(siteUrl, prospectData) {
    const result = { passed: true, warnings: [], errors: [], checks: [] };
    console.log(`\n[PostDeployVerifier] 🔬 Auditando: ${siteUrl}`);
    TerminalService.broadcast(`🔬 Auditando ${siteUrl}...`, "info");

    await new Promise(r => setTimeout(r, 10000)); // Propagación Netlify

    try {
      const res = await fetch(siteUrl);
      result.checks.push(`✅ HTTP ${res.status} OK`);
      if (res.status !== 200) result.errors.push(`❌ HTTP ${res.status}`);

      const html = await res.text();
      const audit = await ProductionAuditor.runChecks(html, siteUrl, prospectData);
      
      result.checks.push(...audit.checks);
      result.warnings.push(...audit.warnings);
      result.errors.push(...audit.errors);
    } catch (e) { result.errors.push(`❌ Error: ${e.message}`); }

    result.passed = result.errors.length === 0;
    return this._buildReport(result, siteUrl);
  }

  static async validateNetlifyToken(token) {
    if (!token) return false;
    try {
      const res = await fetch("https://api.netlify.com/api/v1/sites?per_page=1", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.status === 200;
    } catch { return false; }
  }

  static _buildReport(result, siteUrl) {
    const statusIcon = result.passed ? "✅" : "❌";
    result.report = [
      `═══ REPORT — ${siteUrl} ═══`,
      `Estado: ${statusIcon} ${result.passed ? "APROBADO" : "FALLÓ"}`,
      "", "Checks:", ...result.checks.map(c => `  ${c}`),
      "", "Warnings:", ...result.warnings.map(w => `  ${w}`),
      "", "Errores:", ...result.errors.map(e => `  ${e}`)
    ].join("\n");
    console.log("\n" + result.report + "\n");
    TerminalService.broadcast(result.passed ? "✅ QA APROBADO" : "❌ QA FALLÓ", result.passed ? "success" : "error");
    return result;
  }
}

module.exports = PostDeployVerifier;
