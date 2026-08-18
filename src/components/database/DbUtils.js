// Archivo: src/components/database/DbUtils.js
// Utilidades compartidas del módulo DatabaseView — Ley de 200 líneas

/**
 * Genera un slug determinista a partir de un nombre de negocio.
 */
export const generateSlug = (text) =>
  String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 40);

/**
 * Resuelve la URL de un activo visual.
 * Evita doble-prefijo y resuelve rutas públicas /nexus_archives y /clients.
 */
export const resolveAssetUrl = (photo, slug) => {
  if (!photo) return "";
  if (typeof photo !== "string") return "";
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("/nexus_archives") || photo.startsWith("/clients") || photo.startsWith("/assets")) {
    return photo;
  }
  const clean = photo.replace(/^\/+/, "");
  if (clean.startsWith("assets/")) {
    return `/nexus_archives/tucu-red/clients/${slug}/${clean}`;
  }
  return `/nexus_archives/tucu-red/clients/${slug}/assets/${clean}`;
};

/**
 * Calcula el score real de un lead desde sus datos de enriquecimiento.
 */
export const computeScore = (p) => {
  if (!p) return 50;
  if (p.leadScore && p.leadScore !== 10 && p.leadScore !== 50) return p.leadScore;
  const photoBonus = Math.min(30, (p.photos?.length || 0) * 3);
  const igBonus = p.instagram || p.instagramData ? 25 : 0;
  const reviewsBonus = p.reviewsCount > 0 || p.reviews > 0 ? 30 : 0;
  return Math.min(99, 15 + photoBonus + igBonus + reviewsBonus);
};
