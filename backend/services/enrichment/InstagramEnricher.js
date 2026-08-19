// Archivo: backend/services/enrichment/InstagramEnricher.js
// Gestor de Enriquecimiento desde Instagram con Extracción de Logo Real — Ley de 200 líneas

const ApifyService = require("../ApifyService");
const ArgusService = require("../ArgusService");
const path = require("path");

class InstagramEnricher {
  /**
   * Extrae y procesa datos de Instagram con extracción de Logo Real del perfil.
   */
  static async enrich(lead, enrichedData, downloadPath) {
    if (!lead.instagram) return;

    console.log(`⚙️ [PROCESS] Instagram Extraction: @${lead.instagram}`);

    try {
      const igData = await ApifyService.scrapeInstagram(lead.instagram, 12);

      const profilePicUrl = igData.profile?.profile_pic || 
                            igData.profile?.profilePicUrlHD || 
                            igData.profile?.profilePicUrl || "";

      // Guardar datos del perfil
      enrichedData.instagramData = {
        handle: lead.instagram,
        photoCount: (igData.photoUrls || []).length,
        bio: igData.profile?.bio || "",
        full_name: igData.profile?.full_name || "",
        followers: igData.profile?.followers || 0,
        following: igData.profile?.following || 0,
        posts_count: igData.profile?.posts_count || 0,
        profile_pic: profilePicUrl,
        captions: igData.captions || [],
        lastScraped: new Date(),
      };

      // 1. LOGO REAL del perfil (prioridad máxima - nunca una foto del feed)
      if (profilePicUrl) {
        const logoDest = path.join(downloadPath, "logo.jpg");
        const logoSaved = await ArgusService.verifyAndSave(profilePicUrl, logoDest);
        if (logoSaved) {
          enrichedData.logoUrl = "assets/logo.jpg";
          enrichedData.imageUrl = "assets/logo.jpg";
          console.log(`   ✅ Logo REAL descargado desde IG Profile Pic: assets/logo.jpg`);
        }
      }

      // 2. Descargar fotos del feed de IG localmente (excluyendo la foto de perfil)
      const igPhotos = [];
      const cleanFeedUrls = (igData.photoUrls || []).filter(u => u !== profilePicUrl);

      for (let i = 0; i < cleanFeedUrls.length && i < 12; i++) {
        const url = cleanFeedUrls[i];
        const dest = path.join(downloadPath, `insta_${lead.instagram}_${i + 1}.jpg`);
        const success = await ArgusService.verifyAndSave(url, dest);
        if (success) {
          igPhotos.push(`assets/insta_${lead.instagram}_${i + 1}.jpg`);
        }
      }

      // Merge con fotos
      enrichedData.photos = [...(enrichedData.photos || []), ...igPhotos];

      console.log(`   📸 IG: ${igPhotos.length} fotos de feed + 1 logo real, ${igData.profile?.followers || 0} followers`);
      enrichedData.enrichmentLog.push(`IG: @${lead.instagram} — ${igPhotos.length} fotos, ${igData.profile?.followers || 0} followers`);
      
    } catch (err) {
      console.error(`   ❌ IG failed: ${err.message}`);
      enrichedData.enrichmentLog.push(`IG: Failed (${err.message})`);
      enrichedData.instagramData = { handle: lead.instagram };
    }
  }
}

module.exports = InstagramEnricher;
