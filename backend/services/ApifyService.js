// Archivo: backend/services/ApifyService.js
// Servicio unificado de extracción via Apify Actors
// Reemplaza: MapsScraperService.js + InstagramScraperService.js (Puppeteer)

const { ApifyClient } = require('apify-client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

class ApifyService {
    constructor() {
        this.client = new ApifyClient({ token: process.env.APIFY_TOKEN });
        console.log('🔌 [ApifyService] Initialized with token:', process.env.APIFY_TOKEN ? '✅' : '❌ MISSING');
    }

    // ═══════════════════════════════════════
    // INSTAGRAM: Profile + Captions + Photos
    // ═══════════════════════════════════════
    async scrapeInstagram(handle, maxPosts = 12) {
        console.log(`📸 [Apify/IG] Scraping @${handle} (max ${maxPosts} posts)...`);

        try {
            // Actor: apify/instagram-profile-scraper (perfil completo)
            const profileRun = await this.client.actor('apify/instagram-profile-scraper').call({
                usernames: [handle],
            }, { timeout: 60 });

            const profileItems = await this.client.dataset(profileRun.defaultDatasetId).listItems();
            const profile = profileItems.items?.[0] || {};

            console.log(`   ✅ [IG Profile] ${profile.fullName || handle} — ${profile.followersCount || '?'} followers`);

            // Actor: apify/instagram-post-scraper (posts con captions)
            const postsRun = await this.client.actor('apify/instagram-post-scraper').call({
                username: [handle],
                resultsLimit: maxPosts,
            }, { timeout: 90 });

            const postsItems = await this.client.dataset(postsRun.defaultDatasetId).listItems();
            const posts = postsItems.items || [];

            // Extraer captions y URLs de fotos
            const captions = posts
                .map(p => p.caption || '')
                .filter(c => c.length > 10)
                .slice(0, 12);

            const photoUrls = posts
                .map(p => p.displayUrl || p.url || '')
                .filter(u => u.startsWith('http'))
                .slice(0, maxPosts);

            console.log(`   ✅ [IG Posts] ${posts.length} posts, ${captions.length} captions`);

            return {
                profile: {
                    full_name: profile.fullName || '',
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
        } catch (err) {
            console.error(`   ❌ [Apify/IG] Failed: ${err.message}`);

            // Fallback ligero: solo perfil via scraper simple
            try {
                return await this._igFallback(handle);
            } catch (e2) {
                console.error(`   ❌ [Apify/IG] Fallback also failed: ${e2.message}`);
                return { profile: {}, captions: [], photoUrls: [] };
            }
        }
    }

    // Fallback: scraper más simple si los oficiales fallan
    async _igFallback(handle) {
        console.log(`   🔄 [IG Fallback] Trying shu8hvrXbJbY3Eb9W...`);
        const run = await this.client.actor('shu8hvrXbJbY3Eb9W').call({
            directUrls: [`https://www.instagram.com/${handle}/`],
            resultsType: 'details',
            resultsLimit: 12,
        }, { timeout: 90 });

        const items = await this.client.dataset(run.defaultDatasetId).listItems();
        const data = items.items || [];

        if (data.length === 0) return { profile: {}, captions: [], photoUrls: [] };

        const first = data[0];
        return {
            profile: {
                full_name: first.fullName || '',
                bio: first.biography || '',
                followers: first.followersCount || 0,
                following: first.followsCount || 0,
                posts_count: first.postsCount || 0,
                profile_pic: first.profilePicUrlHD || first.profilePicUrl || '',
            },
            captions: (first.latestPosts || []).map(p => p.caption || '').filter(c => c.length > 10).slice(0, 12),
            photoUrls: (first.latestPosts || []).map(p => p.displayUrl || '').filter(u => u).slice(0, 12),
        };
    }

    // ═══════════════════════════════════════
    // GOOGLE MAPS: Reviews + Hours + Photos
    // ═══════════════════════════════════════
    async scrapeMaps(query, mapsUrl = null) {
        console.log(`🗺️ [Apify/Maps] Scraping: "${query}" ${mapsUrl ? `(URL: ${mapsUrl})` : ''}...`);

        try {
            // Actor: compass/crawler-google-places
            const input = mapsUrl
                ? { startUrls: [{ url: mapsUrl }], maxCrawledPlacesPerSearch: 1 }
                : { searchStringsArray: [query], maxCrawledPlacesPerSearch: 1, language: 'es' };

            // Incluir reviews completas
            input.maxReviews = 5;
            input.scrapeReviewerName = true;
            input.scrapeReviewerUrl = false;

            const run = await this.client.actor('compass/crawler-google-places').call(input, {
                timeout: 120,
            });

            const items = await this.client.dataset(run.defaultDatasetId).listItems();
            const place = items.items?.[0];

            if (!place) {
                console.log('   ⚠️ [Maps] No results found.');
                return null;
            }

            console.log(`   ✅ [Maps] ${place.title} — ${place.totalScore}⭐ (${place.reviewsCount} reviews)`);

            // Extraer textos de reseñas
            const topReviews = (place.reviews || []).slice(0, 5).map(r => ({
                author: r.name || 'Anónimo',
                rating: r.stars || 0,
                text: r.text || '',
                date: r.publishedAtDate || '',
            }));

            // Extraer fotos
            const photos = (place.imageUrls || []).slice(0, 10);

            // Horarios de apertura
            const hours = place.openingHours || [];

            return {
                name: place.title || '',
                address: place.address || '',
                phone: place.phone || '',
                category: place.categoryName || '',
                rating: place.totalScore || 0,
                reviewCount: place.reviewsCount || 0,
                topReviews,
                photos,
                hours,
                website: place.website || null,
                hasWebsite: !!place.website,
                mapsLink: place.url || '',
                lat: place.location?.lat || null,
                lng: place.location?.lng || null,
                // Logo: ícono del negocio si existe
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
