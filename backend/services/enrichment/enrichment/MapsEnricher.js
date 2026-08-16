// Archivo: backend/services/enrichment/MapsEnricher.js
const ApifyService = require("../ApifyService");
const ArgusService = require("../ArgusService");
const path = require("path");

/**
 * Gestor de Enriquecimiento desde Google Maps.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class MapsEnricher {
  /**
   * Extrae y procesa datos de Google Maps.
   */
  static async enrich(lead, enrichedData, downloadPath) {
    if (!lead.address && !lead.city && !lead.mapsUrl) return;

    console.log(`⚙️ [PROCESS] Maps Extraction (Apify Actor)`);
    const query = `${lead.name} ${lead.city || ""}`.trim();
    const mapsUrl = lead.mapsUrl || null;

    try {
      const place = await ApifyService.scrapeMaps(query, mapsUrl);

      if (!place) {
        enrichedData.enrichmentLog.push("Maps: No results");
        return;
      }

      // Guardar datos del lugar
      enrichedData.googlePlace = { ...place };
      enrichedData.rating = place.rating || null;
      enrichedData.reviews = place.reviewCount || 0;

      // Persistir lat/lng
      if (place.lat && place.lng) {
        enrichedData.lat = place.lat;
        enrichedData.lng = place.lng;
        console.log(`   📍 Coordenadas: ${place.lat}, ${place.lng}`);
      }
      enrichedData.category = place.category || lead.category || "";
      enrichedData.address = place.address || enrichedData.address || lead.address || "";

      // Determinar si ya tenemos suficientes fotos (ej: de Instagram)
      const hasEnoughPhotos = enrichedData.photos && enrichedData.photos.length >= 3;
      const downloadedPhotos = [];

      if (!hasEnoughPhotos) {
        console.log(`   📉 Escasas fotos previas. Descargando desde Maps...`);
        for (let i = 0; i < (place.photos || []).length && i < 6; i++) {
          const url = place.photos[i];
          const dest = path.join(downloadPath, `maps_photo_${i + 1}.jpg`);
          const success = await ArgusService.verifyAndSave(url, dest);
          if (success) downloadedPhotos.push(`assets/maps_photo_${i + 1}.jpg`);
        }
        enrichedData.photos = [...(enrichedData.photos || []), ...downloadedPhotos];

        // Foto principal de Maps (fachada) como Fallback
        if (place.imageUrl) {
          const mainDest = path.join(downloadPath, "maps_main.jpg");
          const mainSaved = await ArgusService.verifyAndSave(place.imageUrl, mainDest);
          if (mainSaved && !enrichedData.imageUrl) enrichedData.imageUrl = "assets/maps_main.jpg";
        }
      }

      if (place.hours && place.hours.length > 0) enrichedData.hours = place.hours;

      // Filtrar solo reviews positivas con texto (rating >= 4 y texto no vacío)
      if (place.topReviews && place.topReviews.length > 0) {
        enrichedData.topReviews = place.topReviews
          .filter(r => r.text && r.text.trim().length > 5 && (r.rating === undefined || r.rating >= 4))
          .slice(0, 5);
        console.log(`   💬 Reviews positivas filtradas: ${enrichedData.topReviews.length}/${place.topReviews.length}`);
      }

      console.log(`   📊 Maps: ${place.name} — ${enrichedData.reviews} reviews`);
      enrichedData.enrichmentLog.push(`Maps: ${place.name} — ${enrichedData.reviews} reviews, ${downloadedPhotos.length} fotos`);

    } catch (err) {
      console.error(`   ❌ Maps failed: ${err.message}`);
      enrichedData.enrichmentLog.push(`Maps: Failed (${err.message})`);
    }
  }
}

module.exports = MapsEnricher;
