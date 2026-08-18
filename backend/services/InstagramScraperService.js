// Archivo: backend/services/InstagramScraperService.js
// SERVICE: InstagramScraperService (Resilient Apify Delegate)

const fs = require('fs');
const path = require('path');
const https = require('https');
const ApifyService = require('./ApifyService');
const ArgusService = require('./ArgusService');

class InstagramScraperService {
  async scrapePhotos(username, downloadPath, limit = 6) {
    console.log(`📸 [InstagramScraper] Target: @${username}`);
    const cleanUser = username.replace('@', '').trim();
    const savedFiles = [];
    if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath, { recursive: true });

    try {
      const igData = await ApifyService.scrapeInstagram(cleanUser, limit);
      const photoUrls = igData.photoUrls || [];

      for (let i = 0; i < photoUrls.length && i < limit; i++) {
        const filename = `insta_${cleanUser}_${i + 1}.jpg`;
        const filePath = path.join(downloadPath, filename);
        try {
          const success = await ArgusService.verifyAndSave(photoUrls[i], filePath);
          if (success) savedFiles.push(`assets/${filename}`);
        } catch (e) {
          console.warn(`⚠️ Download error: ${e.message}`);
        }
      }

      return { photos: savedFiles, profile: igData.profile || {} };
    } catch (error) {
      console.error(`❌ [InstagramScraper] Error: ${error.message}`);
      return { photos: [], profile: {} };
    }
  }

  async downloadImage(url, filepath) {
    return ArgusService.verifyAndSave(url, filepath);
  }
}

module.exports = new InstagramScraperService();
