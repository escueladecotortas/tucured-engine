// Archivo: backend/services/AutoSiteGenerator.js
// SERVICE: AutoSiteGenerator v4.1 (Generador y Deployer de Sitios - Ley de 200 líneas)

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
    const publicClientPath = path.resolve(__dirname, "../../public/clients", clientId);

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

      // Build HTML y persistencia dual (nexus_archives + public/clients)
      const html = new NexusBuilder().stitch(StitchMapper.map(brandKit, content, scrapedPhotos));
      await fs.writeFile(path.join(clientPath, "index.html"), html);
      
      try {
        await fs.mkdir(publicClientPath, { recursive: true });
        await fs.writeFile(path.join(publicClientPath, "index.html"), html);
      } catch (pe) { console.warn("Public mirror warning:", pe.message); }

      await AssetManager.writeNetlifyConfig(clientPath);

      // Deploy a Netlify
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
