// Archivo: backend/services/scraper/MapsSelectors.js

/**
 * Selectores y Lógica de Extracción DOM para Google Maps.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class MapsSelectors {
  /**
   * Extrae múltiples resultados del feed lateral de búsqueda.
   */
  static async extractFeedResults(page, maxResults) {
    return await page.evaluate((limit) => {
      const items = [];
      const feedItems = document.querySelectorAll('div.Nv2PK');

      for (let i = 0; i < Math.min(feedItems.length, limit); i++) {
        const item = feedItems[i];
        try {
          const nameEl = item.querySelector('.qBF1Pd, .fontHeadlineSmall');
          const name = nameEl ? nameEl.textContent.trim() : null;

          const ratingEl = item.querySelector('.MW4etd, .fontBodyMedium span[aria-hidden="true"]');
          const rating = ratingEl ? parseFloat(ratingEl.textContent.replace(',', '.')) : null;

          const reviewCountEl = item.querySelector('.UY7F9, .fontBodyMedium span[aria-label*="reseñas"], .fontBodyMedium span[aria-label*="reviews"]');
          let reviewCount = 0;
          if (reviewCountEl) {
            const match = (reviewCountEl.getAttribute('aria-label') || reviewCountEl.textContent).match(/(\d+[\.,]?\d*)/);
            if (match) reviewCount = parseInt(match[1].replace(/\./g, '').replace(',', ''));
          }

          const categoryEls = item.querySelectorAll('.W4Efsd .W4Efsd span');
          const category = categoryEls.length > 0 ? categoryEls[0].textContent.trim().replace(/·/g, '').trim() : '';

          let address = '';
          let phone = null;
          const infoBlocks = item.querySelectorAll('.W4Efsd');
          infoBlocks.forEach(block => {
            const text = block.textContent || '';
            const phoneMatch = text.match(/(\+?\d[\d\s\-()]{7,})/);
            if (phoneMatch && !phone) phone = phoneMatch[1].trim();
            if (!address && text.length > 10 && !text.includes('★')) {
              const spans = block.querySelectorAll('span');
              spans.forEach(span => {
                const t = span.textContent.trim();
                if (t.length > 15 && !t.includes('★') && !t.includes('·') && t !== category) {
                  if (!address) address = t;
                }
              });
            }
          });

          const websiteLink = item.querySelector('a[data-value="Website"], a.lcr4fd');
          const website = websiteLink ? (websiteLink.href || websiteLink.getAttribute('data-value')) : null;

          const imgEl = item.querySelector('img.p0Ber');
          const imageUrl = (imgEl && imgEl.src && !imgEl.src.includes('data:')) ? imgEl.src : null;

          const linkEl = item.querySelector('a.hfpxzc');
          const mapsLink = linkEl ? linkEl.href : null;

          if (name) {
            items.push({ name, rating, reviewCount, category, address, phone, website, imageUrl, mapsLink });
          }
        } catch (e) {}
      }
      return items;
    }, maxResults);
  }

  /**
   * Extrae datos de la página de detalle cuando hay un solo resultado.
   */
  static async extractSingleDetail(page) {
    return await page.evaluate(async () => {
      try {
        const h1 = document.querySelector('h1.DUwDvf, h1.fontHeadlineLarge');
        if (!h1) return [];

        const name = h1.textContent.trim();
        const ratingEl = document.querySelector('div.F7nice span[aria-hidden="true"]');
        const rating = ratingEl ? parseFloat(ratingEl.textContent) : null;
        
        let reviewCount = 0;
        const selectors = ['span[role="img"][aria-label*="opiniones"]','span[role="img"][aria-label*="reseñas"]','span[role="img"][aria-label*="reviews"]','button.Dx2nRe span[aria-label*="opiniones"]','div.F7nice span[aria-label*="reseñas"]'];
        
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) {
            const label = el.getAttribute('aria-label') || el.textContent;
            const nums = label.replace(/\./g, '').match(/\d+/g);
            if (nums) { reviewCount = parseInt(nums[nums.length - 1]); break; }
          }
        }

        const catEl = document.querySelector('button.DkEaL');
        const category = catEl ? catEl.textContent.trim() : '';

        const buttons = document.querySelectorAll('button[data-item-id]');
        let address = '', phone = '', website = '';
        buttons.forEach(btn => {
          const id = btn.getAttribute('data-item-id');
          const text = btn.getAttribute('aria-label') || btn.textContent;
          if (id?.includes('address')) address = text.replace('Dirección: ', '').trim();
          if (id?.includes('phone')) phone = text.replace('Teléfono: ', '').trim();
          if (id?.includes('authority')) website = text.replace('Sitio web: ', '').trim();
        });

        // Simular click en fotos para cargar galería (Deep State)
        const photoTab = document.querySelector('button[aria-label*="Fotos"], button[aria-label*="Photos"]');
        if (photoTab) {
          photoTab.click();
          await new Promise(r => setTimeout(r, 2000));
        }

        const photos = [];
        const seenIds = new Set();
        document.querySelectorAll('img').forEach(img => {
          const src = img.src;
          if (src && (src.includes('googleusercontent') || src.includes('streetviewpixels'))) {
            let imgId = src;
            const pMatch = src.match(/\/p\/([^=]+)/);
            if (pMatch) imgId = pMatch[1];
            if (!seenIds.has(imgId)) {
              seenIds.add(imgId);
              let highRes = src.replace(/=w\d+-h\d+/, '=w1024-h1024').replace(/=s\d+/, '=s1024');
              if (photos.length < 15) photos.push(highRes);
            }
          }
        });

        return [{ name, rating, reviewCount, category, address, phone, website, photos, mapsLink: window.location.href }];
      } catch (e) { return []; }
    });
  }
}

module.exports = MapsSelectors;
