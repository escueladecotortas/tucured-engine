// Archivo: backend/services/enrichment/MapsEnricher.js
// Gestor de Enriquecimiento desde Google Maps con Matriz "Acerca de" exhaustiva (Ley de 200 líneas)

const ApifyService = require("../ApifyService");
const ArgusService = require("../ArgusService");
const PhoneNormalizerService = require("../PhoneNormalizerService");
const path = require("path");

class MapsEnricher {
  static async enrich(lead, enrichedData, downloadPath) {
    if (!lead.address && !lead.city && !lead.mapsUrl) return;

    console.log(`⚙️ [PROCESS] Maps Extraction — Ingesta Profunda (Apify Actor)`);
    const query = `${lead.name} ${lead.city || "Tucumán"}`.trim();
    const mapsUrl = lead.mapsUrl || null;

    try {
      const place = await ApifyService.scrapeMaps(query, mapsUrl);
      if (!place) {
        enrichedData.enrichmentLog.push("Maps: No results");
        return;
      }

      // Datos fundamentales
      enrichedData.googlePlace = { ...place };
      enrichedData.rating = Number(place.rating) || 4.3;
      enrichedData.reviewsCount = Number(place.reviewCount || place.reviewsCount) || 0;
      enrichedData.reviews = enrichedData.reviewsCount;
      enrichedData.openingHours = place.hours || [];
      enrichedData.hours = enrichedData.openingHours;

      // Normalización Telefónica E.164 & WhatsApp
      if (place.phone) {
        const norm = PhoneNormalizerService.normalize(place.phone);
        enrichedData.phone = norm.display || place.phone;
        enrichedData.whatsapp = norm.whatsapp || place.phone;
        enrichedData.phoneNormalized = norm;
        console.log(`   📞 Teléfono normalizado: ${norm.display} (WA: ${norm.whatsapp})`);
      }

      // Coordenadas
      if (place.lat && place.lng) {
        enrichedData.lat = place.lat;
        enrichedData.lng = place.lng;
        enrichedData.coordinates = { lat: place.lat, lng: place.lng };
        console.log(`   📍 Coordenadas: ${place.lat}, ${place.lng}`);
      }

      enrichedData.category = place.category || lead.category || "";
      enrichedData.address = place.address || enrichedData.address || lead.address || "";

      // Parseo exhaustivo de additionalInfo de Google Places
      const rawAdditional = place.additionalInfo || {};
      const aboutMatrix = {};
      const allFeaturesList = [];

      Object.entries(rawAdditional).forEach(([sectionName, items]) => {
        const sectionKey = sectionName.toLowerCase().replace(/\s+/g, '_');
        const activeItems = [];

        if (Array.isArray(items)) {
          items.forEach(item => {
            if (typeof item === 'object' && item !== null) {
              Object.entries(item).forEach(([k, v]) => {
                if (v === true) {
                  activeItems.push(k);
                  allFeaturesList.push(k.toLowerCase());
                }
              });
            } else if (typeof item === 'string') {
              activeItems.push(item);
              allFeaturesList.push(item.toLowerCase());
            }
          });
        }
        if (activeItems.length > 0) {
          aboutMatrix[sectionKey] = activeItems;
        }
      });

      enrichedData.aboutMatrix = aboutMatrix;
      enrichedData.features = [...new Set(allFeaturesList)];

      // Top Reviews reales con texto
      if (place.topReviews && place.topReviews.length > 0) {
        enrichedData.topReviews = place.topReviews.slice(0, 5);
        console.log(`   💬 ${enrichedData.topReviews.length} Reviews seleccionadas`);
      }

      // Descarga de fotos desde Maps si son insuficientes
      const hasEnoughPhotos = enrichedData.photos && enrichedData.photos.length >= 3;
      if (!hasEnoughPhotos) {
        console.log(`   📉 Descargando fotos desde Google Maps...`);
        const downloadedPhotos = [];
        for (let i = 0; i < (place.photos || []).length && i < 6; i++) {
          const url = place.photos[i];
          const dest = path.join(downloadPath, `maps_photo_${i + 1}.jpg`);
          const success = await ArgusService.verifyAndSave(url, dest);
          if (success) downloadedPhotos.push(`assets/maps_photo_${i + 1}.jpg`);
        }
        enrichedData.photos = [...(enrichedData.photos || []), ...downloadedPhotos];

        if (place.imageUrl) {
          const mainDest = path.join(downloadPath, "maps_main.jpg");
          const mainSaved = await ArgusService.verifyAndSave(place.imageUrl, mainDest);
          if (mainSaved && !enrichedData.imageUrl) enrichedData.imageUrl = "assets/maps_main.jpg";
        }
      }

      console.log(`   📊 Maps: ${place.name} — ${enrichedData.rating}⭐ (${enrichedData.reviewsCount} reviews)`);
      console.log(`   🏷️  Atributos "Acerca de": ${enrichedData.features.length} features extraídos`);
      enrichedData.enrichmentLog.push(`Maps: ${place.name} — ${enrichedData.rating}⭐ (${enrichedData.reviewsCount} reviews)`);

    } catch (err) {
      console.error(`   ❌ Maps failed: ${err.message}`);
      enrichedData.enrichmentLog.push(`Maps: Failed (${err.message})`);
    }
  }
}

module.exports = MapsEnricher;
