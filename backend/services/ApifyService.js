// Archivo: backend/services/ApifyService.js
// Servicio unificado de extracción via Apify Actors (Ley de 200 líneas)

const { ApifyClient } = require('apify-client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

class ApifyService {
    constructor() {
        this.client = null;
        this._token = null;
    }

    getClient() {
        const token = (process.env.APIFY_TOKEN || '').replace(/[><"']/g, '').trim();
        if (!this.client || this._token !== token) {
            this._token = token;
            this.client = new ApifyClient({ token: token || undefined });
            console.log('🔌 [ApifyService] Initialized with token:', token ? '✅' : '❌ MISSING');
        }
        return this.client;
    }

    async unrollShortUrl(url) {
        if (!url || !url.includes('goo.gl')) return url;
        try {
            const res = await fetch(url, { method: 'GET', redirect: 'follow' });
            if (res.status >= 200 && res.status < 400 && res.url && !res.url.includes('goo.gl')) {
                return res.url;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    // ═══════════════════════════════════════
    // INSTAGRAM: Profile + Latest Posts (Fast Track ~3.5s)
    // ═══════════════════════════════════════
    async scrapeInstagram(handle, maxPosts = 12) {
        console.log(`📸 [Apify/IG] Scraping @${handle} (Fast Track via Profile Scraper)...`);
        const client = this.getClient();
        const cleanHandle = (handle || '').replace('@', '').trim();

        let profile = {};
        let captions = [];
        let photoUrls = [];

        try {
            const profileRun = await client.actor('apify/instagram-profile-scraper').call({
                usernames: [cleanHandle],
            }, { timeout: 35 });
            const profileItems = await client.dataset(profileRun.defaultDatasetId).listItems();
            profile = profileItems.items?.[0] || {};
            console.log(`   ✅ [IG Profile] ${profile.fullName || cleanHandle} — ${profile.followersCount || '?'} followers`);

            // Extraer posts directamente de latestPosts devuelto por profile-scraper
            const latest = profile.latestPosts || [];
            captions = latest.map(p => p.caption || '').filter(c => c.length > 5).slice(0, maxPosts);
            photoUrls = latest.map(p => p.displayUrl || p.url || '').filter(u => u && u.startsWith('http')).slice(0, maxPosts);
            console.log(`   ✅ [IG Posts Direct] ${latest.length} posts, ${captions.length} captions extraídos en ~3.5s`);

        } catch (e) {
            console.warn(`   ⚠️ [IG Profile] Warning: ${e.message}`);
        }

        if (photoUrls.length === 0 && profile.profilePicUrlHD) {
            photoUrls.push(profile.profilePicUrlHD);
        }

        return {
            profile: {
                full_name: profile.fullName || cleanHandle,
                bio: profile.biography || '',
                followers: profile.followersCount || 0,
                following: profile.followsCount || 0,
                posts_count: profile.postsCount || 0,
                profile_pic: profile.profilePicUrlHD || profile.profilePicUrl || '',
                website: profile.externalUrl || '',
                is_verified: profile.verified || false,
            },
            captions,
            photoUrls,
        };
    }

    // ═══════════════════════════════════════
    // GOOGLE MAPS: Full additionalInfo + Reviews + Hours + Photos
    // ═══════════════════════════════════════
    async scrapeMaps(query, mapsUrl = null) {
        const resolvedUrl = mapsUrl ? await this.unrollShortUrl(mapsUrl) : null;
        console.log(`🗺️ [Apify/Maps] Scraping: "${query}" ${resolvedUrl ? `(URL: ${resolvedUrl})` : ''}...`);
        const client = this.getClient();

        try {
            const input = resolvedUrl
                ? { startUrls: [{ url: resolvedUrl }], maxCrawledPlacesPerSearch: 1 }
                : { searchStringsArray: [query], maxCrawledPlacesPerSearch: 1, language: 'es' };

            input.maxReviews = 20; // Asegurar suficientes reseñas con texto real
            input.scrapeReviewerName = true;
            input.scrapeReviewerUrl = false;

            const run = await client.actor('compass/crawler-google-places').call(input, { timeout: 45 });
            const items = await client.dataset(run.defaultDatasetId).listItems();
            const place = items.items?.[0];

            if (!place) {
                console.log('   ⚠️ [Maps] No results found.');
                return null;
            }

            console.log(`   ✅ [Maps] ${place.title} — ${place.totalScore}⭐ (${place.reviewsCount} reviews)`);

            const topReviews = (place.reviews || [])
                .filter(r => r.text && r.text.trim().length > 5)
                .slice(0, 8)
                .map(r => ({
                    author: r.name || 'Cliente Verificado',
                    rating: r.stars || 5,
                    text: r.text || '',
                    date: r.publishedAtDate || '',
                }));

            const photos = (place.imageUrls || []).slice(0, 10);
            const hours = place.openingHours || [];

            return {
                name: place.title || '',
                address: place.address || '',
                phone: place.phone || '',
                category: place.categoryName || '',
                rating: place.totalScore || 0,
                reviewCount: place.reviewsCount || 0,
                additionalInfo: place.additionalInfo || place.aboutData || place.amenities || {},
                categories: place.categories || [],
                placesTags: place.placesTags || [],
                menu: place.menu || null,
                topReviews,
                photos,
                hours,
                website: place.website || null,
                hasWebsite: !!place.website,
                mapsLink: place.url || resolvedUrl || '',
                lat: place.location?.lat || null,
                lng: place.location?.lng || null,
                logoUrl: place.imageUrl || (photos.length > 0 ? photos[0] : null),
                imageUrl: place.imageUrl || null,
            };
        } catch (err) {
            console.error(`   ❌ [Apify/Maps] Failed: ${err.message}`);
            return null;
        }
    }
}

module.exports = new ApifyService();
