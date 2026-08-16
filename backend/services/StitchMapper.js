/**
 * SERVICE: StitchMapper
 * Purpose: Map internal project data to Stitch Engine format.
 * Extracted from AutoSiteGenerator.js for Argus Compliance.
 */

const RubroProfileService = require("./RubroProfileService");
const slugify = require("../utils/slugify");

class StitchMapper {
  // Delega al slugify unificado (backend/utils/slugify.js)
  static slugify(text) {
    return slugify(text);
  }

  static map(brandKit, content, photos = []) {
    const category = (content.category || "").toLowerCase().trim();
    const profile = RubroProfileService.getProfile(category);
    const catColors = RubroProfileService.getCategoryColors(category);

    const finalColors = catColors || {
      primary: brandKit.brand?.primaryColor || "#000000",
      secondary: brandKit.brand?.secondaryColor || "#666666",
      accent: brandKit.brand?.accentColor || "#007bff",
    };

    const phone = brandKit.phone || "5493816202789";

    return {
      meta: {
        title: brandKit.projectName,
        description: content.hero?.subtitle,
      },
      style: {
        primary: finalColors.primary,
        secondary: finalColors.secondary,
        accent: finalColors.accent,
      },
      fonts: {
        headingFont: brandKit.typography?.headingFont || "Inter",
        bodyFont: brandKit.typography?.bodyFont || "Inter",
        googleFontsUrl: brandKit.typography?.googleFontsUrl,
      },
      content: {
        heroTitle: content.hero?.title,
        heroSubtitle: content.hero?.subtitle,
        ctaText: content.contact?.cta || profile.ctaText,
        galleryTitle: profile.galleryTitle,
        shopTitle: profile.shopTitle,
        bookingTitle: profile.bookingTitle,
        bookingCta: profile.ctaText,
      },
      services: (content.services || []).map((s) => ({
        name: s.name,
        description: s.description || "Consultar detalles.",
        price: s.price || "",
        image: s.image || "",
        icon: s.icon || "fas fa-check",
      })),
      hints: {
        hero: profile.hero,
        grid: profile.grid,
      },
      features: profile.features,
      images: photos,
      contact: {
        whatsapp: phone,
        whatsappUrl: `https://wa.me/${phone}?text=${encodeURIComponent("Hola! Vi su web")}`,
        address: brandKit.address || "",
      },
      numerology: brandKit.numerology || {},
    };
  }
}

module.exports = StitchMapper;
