// Archivo: backend/services/SEOService.js
// Genera meta tags, Open Graph, y Schema.org LocalBusiness automáticamente
// Inyecta SEO en el HTML generado por Stitch/NexusBuilder

class SEOService {
  /**
   * Genera el bloque completo de meta tags para un landing.
   * @param {Object} data - Datos enriquecidos del prospecto
   * @returns {string} HTML de meta tags para inyectar en <head>
   */
  static generateMetaTags(data) {
    const name = data.name || "Negocio Local";
    const tagline = data.tagline || `Bienvenido a ${name}`;
    const description = data.description || tagline;
    const phone = data.googlePlace?.phone || data.phone || "";
    const address = data.googlePlace?.address || data.address || "";
    const rating = data.rating || 0;
    const image = data.imageUrl || "";
    const url = data.siteUrl || "";
    const category = data.category || "retail";
    const igHandle = data.instagram || data.instagramData?.handle || "";

    const tags = [
      `<title>${name} - ${tagline}</title>`,
      `<meta name="description" content="${this._sanitize(description)}">`,
      `<meta name="author" content="${name}">`,
      `<meta name="robots" content="index, follow">`,
      // Open Graph (WhatsApp/redes)
      `<meta property="og:title" content="${this._sanitize(name)} - ${this._sanitize(tagline)}">`,
      `<meta property="og:description" content="${this._sanitize(description)}">`,
      `<meta property="og:type" content="website">`,
      image ? `<meta property="og:image" content="${image}">` : "",
      url ? `<meta property="og:url" content="${url}">` : "",
      `<meta property="og:locale" content="es_AR">`,
      // Twitter Card
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${this._sanitize(name)}">`,
      `<meta name="twitter:description" content="${this._sanitize(description)}">`,
      // Viewport + charset
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
      `<meta charset="UTF-8">`,
      // Theme color
      `<meta name="theme-color" content="#000000">`,
    ];

    return tags.filter((t) => t).join("\n    ");
  }

  /**
   * Genera Schema.org LocalBusiness JSON-LD.
   * @param {Object} data - Datos enriquecidos
   * @returns {string} Script tag con JSON-LD
   */
  static generateSchema(data) {
    const name = data.name || "";
    const address = data.googlePlace?.address || data.address || "";
    const phone = data.googlePlace?.phone || data.phone || "";
    const rating = data.rating || 0;
    const reviews = data.reviews || 0;
    const lat = data.lat || null;
    const lng = data.lng || null;
    const hours = data.hours || [];
    const url = data.siteUrl || "";
    const image = data.imageUrl || "";

    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name,
      description: data.description || data.tagline || "",
      address: address
        ? {
            "@type": "PostalAddress",
            streetAddress: address,
          }
        : undefined,
      telephone: phone || undefined,
      url: url || undefined,
      image: image || undefined,
    };

    // Coordenadas
    if (lat && lng) {
      schema.geo = {
        "@type": "GeoCoordinates",
        latitude: lat,
        longitude: lng,
      };
    }

    // Rating
    if (rating > 0 && reviews > 0) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: rating,
        reviewCount: reviews,
        bestRating: 5,
      };
    }

    // Horarios
    if (hours.length > 0) {
      schema.openingHoursSpecification = hours.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: h.open || "09:00",
        closes: h.close || "18:00",
      }));
    }

    // Limpiar campos undefined
    const clean = JSON.parse(JSON.stringify(schema));
    return `<script type="application/ld+json">${JSON.stringify(clean, null, 2)}</script>`;
  }

  /**
   * Genera atributos de lazy loading para imágenes.
   * @returns {string} Atributos HTML para <img>
   */
  static lazyImgAttrs() {
    return 'loading="lazy" decoding="async"';
  }

  /**
   * Sanitiza texto para uso en meta tags (previene XSS).
   */
  static _sanitize(text) {
    if (!text) return "";
    return text
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .substring(0, 160);
  }
}

module.exports = SEOService;
