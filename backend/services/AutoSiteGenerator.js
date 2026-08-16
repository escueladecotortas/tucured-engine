// Archivo: backend/services/AutoSiteGenerator.js
// SERVICE: AutoSiteGenerator v4.0 (Modularized - Ley de 200 líneas)
// Orquestador de generación y despliegue de sitios en Tucu Red.

const fs = require('fs').promises;
const path = require('path');
const NetlifyDeployService = require("./NetlifyDeployService");
const NexusBuilder = require("../stitch/nexus_builder");
const StitchMapper = require("./StitchMapper");
const AssetManager = require("./generator/AssetManager");
const ContentHydrator = require("./generator/ContentHydrator");

class AutoSiteGenerator {
  static async generateSite(prospectData, options = {}) {
    const { name, instagram } = prospectData;
    const clientId = StitchMapper.slugify(name);
    const clientPath = path.resolve(__dirname, "../../nexus_archives/tucu-red/clients", clientId);

    try {
      await AssetManager.ensureStructure(clientPath);
      
      // Ingestión de Fotos
      let scrapedPhotos = await AssetManager.scanLocalAssets(clientPath, []);
      if (scrapedPhotos.length < 3 || options.forceRegenerate) {
        scrapedPhotos = await this._scrapeSources(name, instagram, clientPath);
      }

      // Brand Kit & Content
      const brandKit = await ContentHydrator.getOrGenerateBrandKit(clientPath, prospectData, options.forceRegenerate);
      const content = await ContentHydrator.getOrGenerateContent(clientPath, prospectData, brandKit, options.forceRegenerate);

      // Build HTML
      const html = new NexusBuilder().stitch(StitchMapper.map(brandKit, content, scrapedPhotos));
      await fs.writeFile(path.join(clientPath, "index.html"), html);
      await AssetManager.writeNetlifyConfig(clientPath);

      // Deploy
      const deploy = await NetlifyDeployService.deployToNetlify(clientPath, {
        siteName: clientId, customDomain: `${clientId}.tucured.ar`, dryRun: options.dryRun, siteId: prospectData.netlifySiteId
      });

      return { clientId, path: clientPath, deployUrl: deploy.url, deployId: deploy.deployId, siteId: deploy.siteId, brandKit };
    } catch (error) {
      console.error(`❌ [AutoSiteGenerator] Error:`, error);
      throw error;
    }
  }

  static async _scrapeSources(name, instagram, clientPath) {
    const assetsPath = path.join(clientPath, "assets");
    const InstagramScraperService = require("./InstagramScraperService");
    const MapsScraperService = require("./MapsScraperService");
    let photos = [];

    if (instagram) {
      try {
        const result = await InstagramScraperService.scrapePhotos(instagram, assetsPath, 6);
        photos = result.photos || [];
      } catch (e) { console.warn("IG Scrape failed"); }
    }
    if (photos.length === 0) {
      try {
        const maps = await MapsScraperService.scrape(name, "Tucumán", 1);
        if (maps[0]?.imageUrl) photos.push(maps[0].imageUrl);
      } catch (e) { console.warn("Maps Scrape failed"); }
    }
    return AssetManager.scanLocalAssets(clientPath, photos);
  }
}

module.exports = AutoSiteGenerator;
