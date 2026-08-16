// Archivo: backend/services/enrichment/InstagramEnricher.js
const ApifyService = require("../ApifyService");
const ArgusService = require("../ArgusService");
const path = require("path");

/**
 * Gestor de Enriquecimiento desde Instagram.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class InstagramEnricher {
  /**
   * Extrae y procesa datos de Instagram.
   */
  static async enrich(lead, enrichedData, downloadPath) {
    if (!lead.instagram) return;

    console.log(`⚙️ [PROCESS] Instagram Extraction: @${lead.instagram}`);

    try {
      const igData = await ApifyService.scrapeInstagram(lead.instagram, 12);

      // Guardar datos del perfil
      enrichedData.instagramData = {
        handle: lead.instagram,
        photoCount: igData.photoUrls.length,
        bio: igData.profile.bio || "",
        full_name: igData.profile.full_name || "",
        followers: igData.profile.followers || 0,
        following: igData.profile.following || 0,
        posts_count: igData.profile.posts_count || 0,
        profile_pic: igData.profile.profile_pic || "",
        captions: igData.captions || [],
        lastScraped: new Date(),
      };

      // Descargar fotos de IG localmente
      const igPhotos = [];
      for (let i = 0; i < igData.photoUrls.length && i < 12; i++) {
        const url = igData.photoUrls[i];
        const dest = path.join(downloadPath, `insta_${lead.instagram}_${i + 1}.jpg`);
        const success = await ArgusService.verifyAndSave(url, dest);
        if (success) {
          igPhotos.push(`assets/insta_${lead.instagram}_${i + 1}.jpg`);
        }
      }

      // Merge con fotos (prioridad IG)
      enrichedData.photos = [...(enrichedData.photos || []), ...igPhotos];

      // LOGO REAL del negocio (prioridad máxima)
      if (igData.profile.profile_pic) {
        const logoDest = path.join(downloadPath, "logo.jpg");
        const logoSaved = await ArgusService.verifyAndSave(igData.profile.profile_pic, logoDest);
        if (logoSaved) {
          enrichedData.logoUrl = "assets/logo.jpg";
          enrichedData.imageUrl = "assets/logo.jpg";
          console.log(`   ✅ Logo REAL descargado desde IG`);
        }
      }

      console.log(`   📸 IG: ${igPhotos.length} fotos, ${igData.profile.followers} followers`);
      enrichedData.enrichmentLog.push(`IG: @${lead.instagram} — ${igPhotos.length} fotos, ${igData.profile.followers} followers`);
      
    } catch (err) {
      console.error(`   ❌ IG failed: ${err.message}`);
      enrichedData.enrichmentLog.push(`IG: Failed (${err.message})`);
      enrichedData.instagramData = { handle: lead.instagram };
    }
  }
}

module.exports = InstagramEnricher;
