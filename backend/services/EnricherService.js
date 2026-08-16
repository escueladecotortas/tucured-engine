// Archivo: backend/services/EnricherService.js
// SERVICE: EnricherService v5.0 (Modularized - Ley de 200 líneas)
// Orquesta: Instagram → Maps → AI Vibrational Analysis

const InstagramEnricher = require("./enrichment/InstagramEnricher");
const MapsEnricher = require("./enrichment/MapsEnricher");
const AiEnricher = require("./enrichment/AiEnricher");
const path = require("path");
const fs = require("fs");
const slugify = require("../utils/slugify");
const { db } = require("../firebase-admin");

class EnricherService {
  /**
   * Main Entry Point del Enriquecimiento de Leads.
   */
  async enrich(lead) {
    console.log(`\n🔍 [Enricher] Iniciando proceso para: ${lead.name}`);

    const enrichedData = { ...lead, enriched: true, enrichmentLog: [] };
    const safeName = lead.slug || slugify(lead.name);
    enrichedData.slug = safeName;

    // Directorio de assets local
    const clientRoot = path.resolve(__dirname, "../../nexus_archives/tucu-red/clients");
    const downloadPath = path.join(clientRoot, safeName, "assets");
    if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath, { recursive: true });

    try {
      // 1 y 2. Instagram y Maps en PARALELO (Resiliencia con allSettled)
      console.log(`   ⚡ [Enricher] Iniciando extracción paralela (IG + Maps)...`);
      const results = await Promise.allSettled([
        InstagramEnricher.enrich(lead, enrichedData, downloadPath),
        MapsEnricher.enrich(lead, enrichedData, downloadPath)
      ]);

      // Loguear fallos individuales si los hay
      results.forEach((res, i) => {
        if (res.status === 'rejected') {
          console.error(`   ⚠️ [Enricher] Falló extractor ${i === 0 ? 'Instagram' : 'Maps'}:`, res.reason.message);
          enrichedData.enrichmentLog.push({ 
            type: 'warning', 
            service: i === 0 ? 'instagram' : 'maps',
            message: `Fallo parcial: ${res.reason.message}` 
          });
        }
      });

      // 3. AI Analysis (Secuencial - Depende de los datos unificados)
      await AiEnricher.enrich(lead, enrichedData);

      // --- GENERATE client-assets.json ---
      // Resuelve paths locales a URLs estáticas; URLs externas se dejan intactas
      const toStaticUrl = (p) => {
        if (!p) return '';
        if (p.startsWith('http://') || p.startsWith('https://')) return p;
        // Eliminar slash inicial si existe para evitar doble slash
        const clean = p.replace(/^\//, '');
        return `/nexus_archives/tucu-red/clients/${safeName}/${clean}`;
      };

      const rawLogo = enrichedData.logoUrl || enrichedData.imageUrl || '';
      const clientAssets = {
          business_name: enrichedData.name,
          source: lead.source || "NEXUS C.Y.B.O.R.G.",
          extraction_date: new Date().toISOString(),
          phone: enrichedData.phone,
          logo_url: toStaticUrl(rawLogo),
          photos: (enrichedData.photos || []).map(p => toStaticUrl(p)),
          reviews: enrichedData.topReviews || []
      };
      fs.writeFileSync(path.join(downloadPath, "..", "client-assets.json"), JSON.stringify(clientAssets, null, 2));
      console.log(`   📄 client-assets.json generado exitosamente`);

      // Persistir en Firestore
      await this._persistLog(lead.id, enrichedData);

      console.log(`✅ [Enricher] Proceso completado. Slug: ${safeName}`);
      return enrichedData;

    } catch (error) {
      console.error(`❌ [Enricher] Error crítico:`, error.message);
      throw error;
    }
  }

  async _persistLog(leadId, enrichedData) {
    if (!leadId) return;
    try {
      await db.collection("prospects").doc(leadId).update({
        enrichmentLog: enrichedData.enrichmentLog,
        enriched: true,
        enrichedAt: new Date().toISOString(),
      });
      console.log(`   📝 enrichmentLog persistido en Firestore`);
    } catch (logErr) {
      console.warn(`   ⚠️ Error guardando log: ${logErr.message}`);
    }
  }
}

module.exports = new EnricherService();
