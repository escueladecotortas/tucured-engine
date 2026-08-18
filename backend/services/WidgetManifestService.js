// Archivo: backend/services/WidgetManifestService.js
// Generación Dinámica del Manifiesto de Widgets por Rubro — Ley de 200 líneas

const WidgetPools = require("./injector/manifest/WidgetPools");
const WidgetValidator = require("./injector/manifest/WidgetValidator");
const WidgetConfigs = require("./injector/manifest/WidgetConfigs");
const slugify = require("../utils/slugify");

class WidgetManifestService {
  static generate(prospectData) {
    const rawCat = (prospectData.category || "").toLowerCase().trim();
    const phone = prospectData.googlePlace?.phone || prospectData.phone || "";
    const igHandle = prospectData.instagram || prospectData.instagramData?.handle || "";
    const name = prospectData.name || "Comercio";

    console.log(`[WidgetManifest] Generando Pool Contextualizado por Rubro para: "${name}" (${rawCat})`);

    const pool = WidgetPools.getPoolForCategory(rawCat);
    const selectedWidgets = [];

    for (const widgetName of pool) {
      if (WidgetValidator.hasDataFor(widgetName, prospectData)) {
        const config = WidgetConfigs.build(widgetName, prospectData, name, phone, igHandle);
        if (config) selectedWidgets.push({ ...config, tier: 1 });
      }
    }

    const availablePremium = WidgetPools.PREMIUM.map((pName) => ({
      name: pName,
      tier: 3,
      active: false,
      label: WidgetPools.PREMIUM_LABELS[pName] || pName,
    }));

    const manifest = {
      clientId: prospectData.clientId || slugify(name),
      category: rawCat,
      selectedWidgets,
      availablePremium,
      slotInstructions: selectedWidgets
        .filter((w) => !w.floating)
        .map((w) => `- Contenedor para "${w.label}": <div id="${w.slotId}" data-nexus-widget="${w.name}"></div>`),
      totalWidgets: selectedWidgets.length,
      totalPremiumAvailable: availablePremium.length,
    };

    console.log(`[WidgetManifest] ✅ ${manifest.totalWidgets} widgets activos contextualizados.`);
    return manifest;
  }
}

module.exports = WidgetManifestService;
