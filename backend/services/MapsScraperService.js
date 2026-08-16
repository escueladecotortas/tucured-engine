// Archivo: backend/services/MapsScraperService.js
// SERVICE: MapsScraperService v5.0 (Modularized - Ley de 200 líneas)
// Scraper de Google Maps para extracción masiva y detallada de Leads.

const puppeteer = require('puppeteer');
const MapsSelectors = require('./scraper/MapsSelectors');
const MapsNavigation = require('./scraper/MapsNavigation');
const MapsGeoUtils = require('./scraper/MapsGeoUtils');

class MapsScraperService {
  constructor() {
    this.browser = null;
  }

  /**
   * Scrape Google Maps: extrae MÚLTIPLES resultados de búsqueda.
   */
  async scrape(keyword, city, limit = 10) {
    console.log(`🗺️ [MapsScraper] Buscando: "${keyword}" en "${city}" (límite: ${limit})`);
    const leads = [];

    try {
      this.browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--disable-blink-features=AutomationControlled']
      });

      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });

      const urlMatch = keyword.match(/(https?:\/\/[^\s]+)/);
      const url = urlMatch ? urlMatch[1] : `https://www.google.com/maps/search/${encodeURIComponent(`${keyword} ${city}`)}`;
      
      console.log(`🔗 Navegando a: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      await MapsNavigation.handleConsent(page);
      await MapsNavigation.waitForFeed(page);
      await MapsNavigation.scrollFeed(page, limit);

      let results = await MapsSelectors.extractFeedResults(page, limit);

      if (results.length === 0) {
        console.log("⚠️ Feed vacío. Verificando vista de resultado único...");
        results = await MapsSelectors.extractSingleDetail(page);
      }

      for (const raw of results) {
        const lead = this._normalizeLead(raw, city, keyword, url);
        leads.push(lead);
      }

      console.log(`✅ [MapsScraper] Total: ${leads.length} resultados (${leads.filter(l => !l.hasWebsite).length} sin web)`);

    } catch (error) {
      console.error("❌ [MapsScraper] Error:", error.message);
    } finally {
      if (this.browser) await this.browser.close().catch(() => {});
    }

    return leads;
  }

  _normalizeLead(raw, city, keyword, searchUrl) {
    const isSocialLink = raw.website && (
      raw.website.includes('instagram.com') || raw.website.includes('facebook.com') || 
      raw.website.includes('wa.me') || raw.website.includes('linktr.ee') || raw.website.includes('beacons.ai')
    );

    const lead = {
      name: raw.name,
      address: raw.address || `${city}, Tucumán`,
      phone: raw.phone || null,
      imageUrl: raw.imageUrl || (raw.photos?.length > 0 ? raw.photos[0] : null),
      photos: raw.photos || (raw.imageUrl ? [raw.imageUrl] : []),
      reviews: raw.reviewCount || 0,
       topReviews: [],
      rating: raw.rating || null,
      mapsLink: raw.mapsLink || searchUrl,
      website: raw.website || null,
      hasWebsite: !!raw.website && !isSocialLink,
      category: raw.category || keyword,
      platform: 'Google Maps',
      lat: MapsGeoUtils.extractLat(raw.mapsLink || searchUrl),
      lng: MapsGeoUtils.extractLng(raw.mapsLink || searchUrl)
    };
    return lead;
  }
}

module.exports = new MapsScraperService();
