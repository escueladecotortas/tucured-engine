// Archivo: backend/services/scraper/InstagramExtractor.js
import { instagram } from './instagram/BrowserService.js';

export class InstagramExtractor {
    async extract(url) {
        console.log(`[InstagramExtractor] 📸 Extrayendo: ${url}`);
        const page = await instagram.getPage();
        
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
            
            const profileData = await page.evaluate(() => {
                const getText = (sel) => document.querySelector(sel)?.innerText || '';
                return {
                    name: getText('header h2'),
                    bio: getText('header section > div:last-child'),
                    postsCount: getText('header li:first-child span'),
                    followers: getText('header li:nth-child(2) span'),
                    following: getText('header li:nth-child(3) span'),
                    externalUrl: document.querySelector('header section a[target="_blank"]')?.href || ''
                };
            });

            const posts = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('article img')).slice(0, 12).map(img => img.src);
            });

            return {
                type: 'instagram',
                metadata: profileData,
                images: posts,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error(`[InstagramExtractor] ❌ Error: ${error.message}`);
            throw error;
        }
    }
}
