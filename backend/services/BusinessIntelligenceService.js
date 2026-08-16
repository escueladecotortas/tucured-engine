const puppeteer = require('puppeteer');

class BusinessIntelligenceService {
    constructor() {
        this.browser = null;
    }

    async init() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=es-AR'] // Force Spanish
            });
        }
    }

    async analyzeLink(url) {
        await this.init();
        const page = await this.browser.newPage();

        // Mock User Agent to avoid immediate blocking
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        try {
            console.log(`🕵️ [Intel] Analyzing: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

            if (url.includes('google.com/maps') || url.includes('maps.app.goo.gl')) {
                return await this.extractGoogleMapsData(page, url);
            } else if (url.includes('instagram.com')) {
                return await this.extractInstagramData(page, url);
            } else {
                return { error: "Unsupported Platform. Only Maps & Instagram." };
            }

        } catch (error) {
            console.error("❌ [Intel] Scan failed:", error);
            return { error: error.message };
        } finally {
            await page.close();
        }
    }

    async extractGoogleMapsData(page, originalUrl) {
        // 1. Basic Info
        try {
            await page.waitForSelector('h1', { timeout: 10000 });
        } catch (e) {
            return { error: "Maps load timeout or invalid layout." };
        }

        const basicData = await page.evaluate(() => {
            const getText = (selector) => {
                const el = document.querySelector(selector);
                return el ? el.innerText.trim() : null;
            };

            return {
                name: getText('h1'),
                rating: getText('div[role="img"]'),
                address: getText('button[data-item-id="address"] div[class*="fontBodyMedium"]'),
                phone: getText('button[data-item-id^="phone"] div[class*="fontBodyMedium"]'),
                website: getText('a[data-item-id="authority"]'),
                reviewsCount: getText('button[jsaction="pane.rating.moreReviews"] span')
            };
        });

        // 2. Extract Photos (The "Real" Photos)
        let photos = [];
        try {
            // Updated Selector Strategy for 2024/2026 Maps
            // Option A: "Photos" Tab Button
            const photoButtonSelector = 'button[aria-label*="Foto"], button[aria-label*="Photos"]';

            // Should verify if we are already on the photos pane? No, usually start on overview.
            if (await page.$(photoButtonSelector)) {
                await page.click(photoButtonSelector);
                // Wait for gallery grid. Often they are div's with background images in a scrollable container.
                // We wait for a generic indicator of content update.
                await page.waitForTimeout(3000);

                photos = await page.evaluate(() => {
                    // This selector targets the photo tiles in the grid.
                    // The class names are obfuscated, so we look for 'background-image' style on divs inside the main pane.
                    const elements = Array.from(document.querySelectorAll('div[role="img"][style*="background-image"]'));
                    return elements.slice(0, 5).map(el => {
                        const style = el.style.backgroundImage;
                        return style.slice(4, -1).replace(/"/g, "");
                    });
                });
            }
        } catch (e) {
            console.log("⚠️ [Intel] Photo extraction warning:", e.message);
        }

        return {
            source: 'Google Maps',
            url: originalUrl,
            ...basicData,
            photos: photos.length > 0 ? photos : [],
            timestamp: new Date().toISOString()
        };
    }

    async extractInstagramData(page, originalUrl) {
        const meta = await page.evaluate(() => {
            const getMeta = (prop) => {
                const el = document.querySelector(`meta[property="${prop}"]`);
                return el ? el.content : null;
            };
            return {
                title: getMeta('og:title'),
                description: getMeta('og:description'),
                image: getMeta('og:image')
            };
        });

        return {
            source: 'Instagram',
            url: originalUrl,
            ...meta
        };
    }

    async close() {
        if (this.browser) await this.browser.close();
    }
}

module.exports = new BusinessIntelligenceService();
