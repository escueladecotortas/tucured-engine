// Archivo: backend/services/EnricherService.js
// SERVICE: EnricherService v5.3 (Integridad Física, Deep Ingest & Normalización E.164 - Ley de 200 líneas)

const InstagramEnricher = require("./enrichment/InstagramEnricher");
const MapsEnricher = require("./enrichment/MapsEnricher");
const AiEnricher = require("./enrichment/AiEnricher");
const PhotoCuratorService = require("./PhotoCuratorService");
const PhoneNormalizerService = require("./PhoneNormalizerService");
const path = require("path");
const fs = require("fs");
const slugify = require("../utils/slugify");
const { db } = require("../firebase-admin");

class EnricherService {
  async enrich(lead) {
    console.log(`\n🔍 [Enricher] Iniciando proceso profundo para: ${lead.name}`);

    const enrichedData = { ...lead, enriched: true, enrichmentLog: [] };
    const safeName = lead.slug || slugify(lead.name);
    enrichedData.slug = safeName;

    const clientRoot = path.resolve(__dirname, "../../nexus_archives/tucu-red/clients");
    const downloadPath = path.join(clientRoot, safeName, "assets");
    const publicClientDir = path.resolve(__dirname, `../../public/clients/${safeName}`);
    if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath, { recursive: true });
    if (!fs.existsSync(publicClientDir)) fs.mkdirSync(publicClientDir, { recursive: true });

    try {
      // 1 y 2. Instagram y Maps en Paralelo
      console.log(`   ⚡ [Enricher] Extracción paralela (IG + Maps)...`);
      const results = await Promise.allSettled([
        InstagramEnricher.enrich(lead, enrichedData, downloadPath),
        MapsEnricher.enrich(lead, enrichedData, downloadPath)
      ]);

      results.forEach((res, i) => {
        if (res.status === 'rejected') {
          console.error(`   ⚠️ Falló extractor ${i === 0 ? 'Instagram' : 'Maps'}:`, res.reason.message);
          enrichedData.enrichmentLog.push({ type: 'warning', message: res.reason.message });
        }
      });

      // 3. AI Analysis (Tone Voice, Rubro Real y Copy)
      await AiEnricher.enrich(lead, enrichedData);

      // 4. Curaduría Semántica e Integridad Física Estricta en Disco
      const captions = (enrichedData.instagramData?.captions || []);
      const curationResult = PhotoCuratorService.curate(enrichedData.photos || [], captions, downloadPath, safeName);
      enrichedData.curatedPhotos = curationResult.classified;

      // 5. Normalización Telefónica E.164 y Meta WhatsApp
      const rawTel = enrichedData.whatsapp || enrichedData.phone || lead.phone || lead.whatsapp || '';
      const phoneNorm = PhoneNormalizerService.normalize(rawTel);
      enrichedData.phone = phoneNorm.display || rawTel;
      enrichedData.whatsapp = phoneNorm.whatsapp || rawTel;
      enrichedData.phoneNormalized = phoneNorm;

      // 6. Generar client-assets.json con inventario 100% físico real en disco
      const toStaticUrl = (p) => {
        if (!p) return '';
        if (p.startsWith('http://') || p.startsWith('https://')) return p;
        const clean = p.replace(/^\//, '');
        return `/nexus_archives/tucu-red/clients/${safeName}/${clean}`;
      };

      // Helper para validar existencia real en downloadPath
      const fileExistsOnDisk = (filename) => {
        return fs.existsSync(path.join(downloadPath, filename));
      };

      // Construcción de semantic_photos basada estrictamente en disco físico
      const heroUrl = fileExistsOnDisk("hero.jpg") ? toStaticUrl("assets/hero.jpg") : (enrichedData.logoUrl ? toStaticUrl(enrichedData.logoUrl) : '');
      const logoUrl = fileExistsOnDisk("logo.jpg") ? toStaticUrl("assets/logo.jpg") : (enrichedData.logoUrl ? toStaticUrl(enrichedData.logoUrl) : '');

      // Showcase y Atmosphere: solo los que existen físicamente
      const showcaseFiles = ["product_1.jpg", "product_2.jpg", "product_3.jpg", "product_4.jpg"]
        .filter(f => fileExistsOnDisk(f))
        .map(f => toStaticUrl(`assets/${f}`));

      const atmosphereFiles = ["ambient_1.jpg", "ambient_2.jpg", "ambient_3.jpg", "ambient_4.jpg"]
        .filter(f => fileExistsOnDisk(f))
        .map(f => toStaticUrl(`assets/${f}`));

      // Si no hay productos pero hay maps_main.jpg o fotos adicionales reales
      const realPhotosOnDisk = fs.readdirSync(downloadPath)
        .filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
        .map(f => toStaticUrl(`assets/${f}`));

      const clientAssets = {
        business_name: enrichedData.name,
        slug: safeName,
        source: lead.source || "NEXUS C.Y.B.O.R.G. (Maps + IG)",
        extraction_date: new Date().toISOString(),
        category: enrichedData.category || "gastronomia_bar",
        toneVoice: enrichedData.toneVoice || "Profesional, cercano, moderno",
        rating: Number(enrichedData.rating) || 4.3,
        reviewsCount: Number(enrichedData.reviewsCount || enrichedData.reviews) || 0,
        coordinates: enrichedData.coordinates || (enrichedData.lat ? { lat: enrichedData.lat, lng: enrichedData.lng } : null),
        openingHours: enrichedData.openingHours || enrichedData.hours || [],
        phone: enrichedData.phone,
        whatsapp: enrichedData.whatsapp,
        phoneNormalized: phoneNorm,
        instagram: enrichedData.instagram || '',
        address: enrichedData.address || '',
        logo_url: logoUrl,
        photos: realPhotosOnDisk,
        semantic_photos: {
          hero: heroUrl,
          logo: logoUrl,
          showcase: showcaseFiles,
          atmosphere: atmosphereFiles
        },
        about: enrichedData.aboutMatrix || {},
        features: enrichedData.features || [],
        topReviews: enrichedData.topReviews || []
      };

      fs.writeFileSync(path.join(downloadPath, "..", "client-assets.json"), JSON.stringify(clientAssets, null, 2));
      fs.writeFileSync(path.join(publicClientDir, "client-assets.json"), JSON.stringify(clientAssets, null, 2));
      console.log(`   📄 client-assets.json generado exitosamente (dual: archives + public) — 0 fotos fantasma`);

      // Persistir en Firestore
      await this._persistLog(lead.id, enrichedData);

      console.log(`✅ [Enricher] Proceso completado con éxito. Slug: ${safeName}`);
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
        category: enrichedData.category,
        toneVoice: enrichedData.toneVoice,
        rating: enrichedData.rating,
        reviewsCount: enrichedData.reviewsCount,
        openingHours: enrichedData.openingHours,
        coordinates: enrichedData.coordinates,
        phone: enrichedData.phone,
        whatsapp: enrichedData.whatsapp,
        aboutMatrix: enrichedData.aboutMatrix || {},
        features: enrichedData.features || [],
        topReviews: enrichedData.topReviews || [],
        enrichedAt: new Date().toISOString(),
      });
    } catch (logErr) {
      console.warn(`   ⚠️ Error guardando log en Firestore: ${logErr.message}`);
    }
  }
}

module.exports = new EnricherService();
