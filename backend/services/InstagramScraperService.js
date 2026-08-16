// Archivo: backend/services/InstagramScraperService.js
// SERVICE: InstagramScraperService v4.0 (Modularized - Ley de 200 líneas)
// Extractor de fotos y metadatos de Instagram para Tucu Red.

const fs = require('fs');
const path = require('path');
const https = require('https');
const BrowserService = require('./scraper/instagram/BrowserService');
const ProfileExtractor = require('./scraper/instagram/ProfileExtractor');

class InstagramScraperService {
  async scrapePhotos(username, downloadPath, limit = 6) {
    console.log(`📸 [InstagramScraper] Target: @${username}`);
    const savedFiles = [];
    if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath, { recursive: true });

    let browser;
    try {
      browser = await BrowserService.launch();
      const page = await BrowserService.preparePage(browser);
      await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: 'networkidle2', timeout: 30000 });

      const profile = await ProfileExtractor.extract(page);
      console.log(`📋 [IG Profile] bio: "${(profile.bio || '').substring(0, 30)}..."`);

      const imageUrls = await ProfileExtractor.scrapeImageUrls(page, limit);
      for (let i = 0; i < imageUrls.length; i++) {
        const filename = `insta_${username}_${i + 1}.jpg`;
        const filePath = path.join(downloadPath, filename);
        try {
          await this.downloadImage(imageUrls[i], filePath);
          savedFiles.push(`assets/${filename}`);
        } catch (e) { console.warn(`⚠️ Download error: ${e.message}`); }
      }
      return { photos: savedFiles, profile };
    } catch (error) {
       console.error(`❌ [InstagramScraper] Error: ${error.message}`);
       return { photos: [], profile: {} };
    } finally { if (browser) await browser.close(); }
  }

  async downloadImage(url, filepath) {
    return new Promise((res, rej) => {
      const file = fs.createWriteStream(filepath);
      https.get(url, response => {
        if (response.statusCode === 200) {
          response.pipe(file); file.on('finish', () => { file.close(); res(); });
        } else { file.close(); fs.unlink(filepath, () => {}); rej(new Error(response.statusCode)); }
      }).on('error', e => { fs.unlink(filepath, () => {}); rej(e); });
    });
  }
}

module.exports = new InstagramScraperService();
