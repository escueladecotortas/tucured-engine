// Archivo: backend/services/WidgetManifestService.js
// SERVICE: WidgetManifestService v4.0 (Modularized - Ley de 200 líneas)
// Orquesta la generación del manifiesto de widgets basado en pools universales.

const WidgetPools = require("./injector/manifest/WidgetPools");
const WidgetValidator = require("./injector/manifest/WidgetValidator");
const WidgetConfigs = require("./injector/manifest/WidgetConfigs");
const slugify = require("../utils/slugify");

class WidgetManifestService {
  /**
   * Genera el Manifiesto de Widgets para un cliente.
   */
  static generate(prospectData) {
    const rawCat = (prospectData.category || "").toLowerCase().trim();
    const resolvedCat = this._resolveCategory(rawCat.replace(/\s+/g, "_"));
    const phone = prospectData.googlePlace?.phone || prospectData.phone || "";
    const igHandle = prospectData.instagram || prospectData.instagramData?.handle || "";
    const name = prospectData.name || "";

    console.log(`[WidgetManifest] Generando Universal Pool para: "${name}"`);

    // 1. Activar widgets del Pool Universal según disponibilidad de datos
    const selectedWidgets = [];
    for (const widgetName of WidgetPools.UNIVERSAL) {
      if (WidgetValidator.hasDataFor(widgetName, prospectData)) {
        const config = WidgetConfigs.build(widgetName, prospectData, name, phone, igHandle);
        if (config) selectedWidgets.push({ ...config, tier: 1 });
      }
    }

    // 2. Listar Widgets Premium (Tiers superiores)
    const availablePremium = WidgetPools.PREMIUM.map((pName) => ({
      name: pName,
      tier: 3,
      active: false,
      label: WidgetPools.PREMIUM_LABELS[pName] || pName,
    }));

    const manifest = {
      clientId: prospectData.clientId || slugify(name),
      category: resolvedCat,
      selectedWidgets,
      availablePremium,
      slotInstructions: selectedWidgets
        .filter((w) => !w.floating)
        .map((w) => `- Para la sección de "${w.label}", inyectá este exacto código HTML:\n  <div id="${w.slotId}" class="nexus-widget w-full min-h-[300px] rounded-2xl bg-slate-50/50 my-8" data-nexus-widget="${w.name}"></div>`),
      totalWidgets: selectedWidgets.length,
      totalPremiumAvailable: availablePremium.length,
    };

    console.log(`[WidgetManifest] ✅ ${manifest.totalWidgets} widgets activos.`);
    return manifest;
  }

  static _resolveCategory(normalized) {
    const aliases = {
      pet_supply_store: "pet_shop", tienda_de_mascotas: "pet_shop",
      veterinaria: "veterinary", clinica_veterinaria: "veterinary",
      peluqueria: "beauty", barberia: "beauty", centro_de_estetica: "beauty",
      restaurant: "gastronomy", restaurante: "gastronomy",
      hamburgueseria: "burger", pizza: "pizzeria", gym: "fitness",
      abogado: "professional", contador: "professional", consultorio: "professional",
      taller_mecanico: "automotive", inmobiliaria: "real_estate", 
      bar: "nightlife", academia: "education"
    };
    return aliases[normalized] || normalized || "general";
  }
}

module.exports = WidgetManifestService;
