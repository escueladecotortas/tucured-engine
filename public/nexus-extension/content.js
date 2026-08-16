// Nexus Cyborg Content Script (V1.2 - XPath Hunter)
console.log("🤖 Nexus Cyborg activado en Google Maps");

// Inject Visual Badge
const badge = document.createElement('div');
badge.id = 'nexus-cyborg-badge';
badge.innerText = '🤖 Nexus Ready';
document.body.appendChild(badge);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrape_detail") {
        extractPlaceDetail().then(data => {
            if (data) {
                sendToNexus([data]).then(res => {
                    sendResponse({ success: true, message: `Enviado: ${data.name} (${data.photos.length} fotos)` });
                }).catch(err => {
                    sendResponse({ success: false, error: "Error de conexión con Nexus" });
                });
            } else {
                sendResponse({ success: false, error: "No se detectó ficha de negocio" });
            }
        });
        return true; // Keep channel open
    }

    if (request.action === "scrape_list") {
        extractList().then(leads => {
            if (leads.length > 0) {
                sendToNexus(leads).then(res => {
                    sendResponse({ success: true, message: `Enviados ${leads.length} leads` });
                }).catch(err => {
                    sendResponse({ success: false, error: "Error de conexión con Nexus" });
                });
            } else {
                sendResponse({ success: false, error: "No se encontraron resultados en lista" });
            }
        });
        return true;
    }
});

// Check connection on load
checkConnection();

async function checkConnection() {
    try {
        await fetch('http://127.0.0.1:3001/api/agents', { method: 'GET' });
        console.log("✅ Nexus Server is reachable!");
        const badge = document.getElementById('nexus-cyborg-badge');
        if (badge) {
            badge.style.borderColor = '#4ade80'; // Green border
            badge.title = 'Connected to Nexus';
        }
    } catch (e) {
        console.error("❌ Nexus Server unreachable:", e);
        const badge = document.getElementById('nexus-cyborg-badge');
        if (badge) {
            badge.style.borderColor = '#ef4444'; // Red border
            badge.innerText = '⚠️ Nexus Offline';
            badge.title = 'Please ensure backend is running on port 3001';
        }
    }
}

async function sendToNexus(prospects) {
    try {
        // Use 127.0.0.1 to avoid localhost DNS issues
        const res = await fetch('http://127.0.0.1:3001/api/prospects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prospects })
        });

        if (!res.ok) {
            throw new Error(`Server returned ${res.status} ${res.statusText}`);
        }

        return await res.json();
    } catch (e) {
        console.error("Nexus Connection Error:", e);
        alert(`Error conectando con Nexus: ${e.message}. \nAsegúrate de que el servidor esté corriendo en el puerto 3001.`);
        throw e;
    }
}

async function extractPlaceDetail() {
    // Check if we are in a detail view (Role=main usually contains the H1)
    const nameEl = document.querySelector('h1.DUwDvf'); // Common H1 class in Maps
    if (!nameEl) return null;

    const name = nameEl.innerText;

    // Address
    const addressBtn = document.querySelector('button[data-item-id="address"]');
    let address = addressBtn ? (addressBtn.getAttribute('aria-label') || addressBtn.innerText) : null;
    if (address) address = address.replace(/^Dirección: |^Address: /i, '').trim();

    // Phone
    const phoneBtn = document.querySelector('button[data-item-id*="phone"]');
    let phone = phoneBtn ? (phoneBtn.getAttribute('aria-label') || phoneBtn.innerText) : null;
    if (phone) phone = phone.replace(/^Teléfono: |^Phone: /i, '').trim();

    // Website
    const websiteBtn = document.querySelector('a[data-item-id="authority"]');
    const websiteUrl = websiteBtn ? websiteBtn.href : null;

    // --- PHOTO DOMINATION STRATEGY (V1.2 - XPath Hunter) ---
    console.log("📸 Starting Multi-Photo Harvest...");
    let photos = [];

    // Save the hero image immediately just in case
    let heroImageUrl = null;
    const heroImgEl = document.querySelector('button[aria-label*="foto" i] img') ||
        document.querySelector('button[aria-label*="photo" i] img') ||
        document.querySelector('div[role="img"] img');
    if (heroImgEl) {
        heroImageUrl = heroImgEl.src;
        console.log("📸 Found Hero URL:", heroImageUrl);
    }

    // CLICK STRATEGY: Try to find "Ver fotos" or "All photos" key text
    // XPath is powerful for text matching
    const entryClick = await performGalleryEntry();

    if (entryClick) {
        // Wait for gallery render
        await new Promise(r => setTimeout(r, 2500));

        // Scroll Logic: Try finding multiple potential scroll containers
        // The gallery often has aria-label="Photos" or similar
        const scrollable = document.querySelector('.m6QErb[aria-label]') ||
            document.querySelector('div[role="main"]');

        if (scrollable) {
            console.log("📸 Scrolling gallery container...", scrollable);
            for (let i = 0; i < 4; i++) {
                scrollable.scrollTop = scrollable.scrollHeight;
                await new Promise(r => setTimeout(r, 1200));
            }
        }

        // Harvest Images from Grid
        const galleryItems = Array.from(document.querySelectorAll('a[data-photo-index] div[style*="background-image"]'));
        const imgItems = Array.from(document.querySelectorAll('div[role="img"] img[src*="googleusercontent"]'));

        const rawUrls = [
            ...galleryItems.map(el => el.style.backgroundImage.slice(5, -2)),
            ...imgItems.map(el => el.src)
        ];

        photos = rawUrls.map(url => {
            if (!url) return null;
            // Clean URL to get max resolution
            return url.replace(/=w\d+-h\d+.*$/, '=w1600-h1200-k-no');
        }).filter(Boolean);

        console.log(`📸 Harvested ${photos.length} photos from gallery.`);
    }

    // Fallback: If gallery failed, ensure we at least have the hero
    photos = [...new Set(photos)].slice(0, 25);
    if (photos.length === 0 && heroImageUrl) {
        console.log("⚠️ Gallery empty. Using Hero Image.");
        photos.push(heroImageUrl.replace(/=w\d+-h\d+.*$/, '=w1024-h768-k-no'));
    }

    // Reviews
    const reviewEls = Array.from(document.querySelectorAll('div.MyEned'));
    const topReviews = reviewEls.slice(0, 3).map(el => el.innerText).filter(t => t.length > 10);

    // Rating
    const ratingEl = document.querySelector('div[role="img"][aria-label*="estrellas" i], div[role="img"][aria-label*="stars" i]');
    let rating = null;
    let reviewsCount = 0;
    if (ratingEl) {
        const label = ratingEl.getAttribute('aria-label');
        const parts = label.split(' ');
        rating = parts[0].replace(',', '.');
        const countMatch = label.match(/(\d+[\d.]*)\s(opiniones|reviews)/i);
        if (countMatch) reviewsCount = countMatch[1].replace('.', '');
    }

    // Opening Hours (Robust)
    const hoursBtn = document.querySelector('button[data-item-id="oh"]');
    let openingHours = [];
    if (hoursBtn) {
        const ariaLabel = hoursBtn.getAttribute('aria-label') || "";
        // Clean up the text (remove "Horario: " prefix)
        const cleanLabel = ariaLabel.replace(/^Horario: |^Hours: /i, '').trim();
        // Split by days if possible (often it's a single string like "Abierto ⋅ Cierra a las 23:00")
        // Ideally we want the full week, but that requires clicking. For now, let's grab the current status + summary
        openingHours.push(cleanLabel);

        // Try to get the raw text content of the div sibling which sometimes holds the table
        // (Advanced: click to expand? Let's keep it simple/fast for now, the aria-label usually has Today's info)
    }

    // Coordinates & Place ID (From URL)
    const currentUrl = window.location.href;
    const coordsMatch = currentUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const coords = coordsMatch ? { lat: parseFloat(coordsMatch[1]), lng: parseFloat(coordsMatch[2]) } : null;

    // Place ID (from URL data param !1s...)
    // Example: ...!1s0x94225c0e93b3950f:0x574b9b2cefe95e8f!...
    // Or extracting from ChIJ... if visible. 
    // Heuristic: The hex string finding is reliable.
    const cidMatch = currentUrl.match(/!1s(0x[0-9a-f]+:[0-9a-f]x[0-9a-f]+)/);
    // Alternative: sometimes data=!3m1!4b1!4m6!3m5!1s0x... 
    // Let's rely on a robust regex for "0x...:0x..."
    const hexIdMatch = currentUrl.match(/(0x[0-9a-fA-F]+:0x[0-9a-fA-F]+)/);
    const placeId = hexIdMatch ? hexIdMatch[1] : null;

    // --- V3: SHADOW STATE INJECTION ---
    // Inject a script to steal the global state directly from the page context
    const shadowState = await new Promise((resolve) => {
        const script = document.createElement('script');
        script.textContent = `
            try {
                const state = window.APP_INITIALIZATION_STATE;
                const wiz = window.WIZ_global_data;
                window.postMessage({ type: 'NEXUS_SHADOW_STATE', data: { state, wiz } }, '*');
            } catch (e) {
                console.error("Nexus Shadow Thief Failed:", e);
            }
        `;

        const listener = (event) => {
            if (event.source !== window || !event.data || event.data.type !== 'NEXUS_SHADOW_STATE') return;
            window.removeEventListener('message', listener);
            resolve(event.data.data);
        };

        window.addEventListener('message', listener);
        (document.head || document.documentElement).appendChild(script);
        script.remove();

        // Timeout fallback
        setTimeout(() => resolve(null), 2000);
    });

    console.log("📍 [Nexus Extract] Data:", { name, address, photosCount: photos.length, coords, hasShadowState: !!shadowState });

    return {
        id: placeId ? placeId.replace(':', '_') : name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now(),
        name,
        category: 'Scraped',
        address,
        phone,
        website: websiteUrl,
        photos,
        reviews: topReviews,
        reviewsCount,
        rating,
        openingHours,
        coordinates: coords,
        googlePlaceId: placeId,
        shadowState: shadowState, // <--- The Golden Key
        source: 'Extension',
        status: 'new',
        createdAt: new Date().toISOString()
    };
}

async function performGalleryEntry() {
    // Strategy 1: XPath for "Ver fotos" text (Case insensitive approximation)
    const textSnapshot = document.evaluate(
        "//button[contains(., 'Ver fotos') or contains(., 'See photos') or contains(., 'photos')]",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
    );

    if (textSnapshot.snapshotLength > 0) {
        // Try the last one found (often overlays are later in DOM)
        const btn = textSnapshot.snapshotItem(textSnapshot.snapshotLength - 1);
        console.log("📸 Strategy 1: Found text match. Clicking:", btn);
        btn.click();
        return true;
    }

    // Strategy 2: Button with specific class pattern often used for overlays
    // This is brittle but "Ver fotos" is usually in a button with aria-label
    const ariaBtn = document.querySelector('button[aria-label*="Ver fotos" i], button[aria-label*="See photos" i]');
    if (ariaBtn) {
        console.log("📸 Strategy 2: Found Aria Label. Clicking:", ariaBtn);
        ariaBtn.click();
        return true;
    }

    // Strategy 3: Click the Hero Image container directly
    // Usually the hero is wrapped in a button to open the gallery
    const heroWrapper = document.querySelector('button[aria-label*="Foto" i]') ||
        document.querySelector('div[role="img"]').closest('button');
    if (heroWrapper) {
        console.log("📸 Strategy 3: Clicking Hero Wrapper:", heroWrapper);
        heroWrapper.click();
        return true;
    }

    console.log("❌ All gallery entry strategies failed.");
    return false;
}

async function extractList() {
    // Basic List Extraction (Visible items)
    const items = Array.from(document.querySelectorAll('div[role="article"], .Nv2PK'));
    return items.map(item => {
        const ariaLabel = item.getAttribute('aria-label') || "";
        if (!ariaLabel) return null;

        const textContent = item.innerText;
        const linkEl = item.querySelector('a');
        const mapsLink = linkEl ? linkEl.href : "";

        // Basic Phone Extract
        const phoneMatch = textContent.match(/(\+\d{1,4}\s?)?(\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4})/);
        const phone = phoneMatch ? phoneMatch[0] : null;

        // Basic Photo
        const imgElement = item.querySelector('img[src*="http"]');
        let imageUrl = imgElement ? imgElement.src : null;
        if (imageUrl) imageUrl = imageUrl.replace(/=w\d+-h\d+/, '=w800-h600');

        return {
            id: ariaLabel.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now(),
            name: ariaLabel,
            category: 'List Scrape',
            source: 'Extension List',
            status: 'new',
            phone,
            photos: imageUrl ? [imageUrl] : [],
            url: mapsLink,
            createdAt: new Date().toISOString()
        };
    }).filter(Boolean);
}
