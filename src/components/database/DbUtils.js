// Archivo: frontend/src/components/database/DbUtils.js
// Utilidades compartidas del módulo DatabaseView

/**
 * Genera un slug determinista a partir de un nombre de negocio.
 * Versión local del módulo (sin stop-words) para uso en frontend.
 */
export const generateSlug = (text) =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 40);

/**
 * Resuelve la URL de un activo visual.
 * Si ya es URL absoluta (http) la devuelve intacta.
 * Si es path relativo, construye la ruta estática del servidor.
 */
export const resolveAssetUrl = (photo, slug) => {
  if (!photo) return "";
  if (photo.startsWith("http")) return photo;
  return `/nexus_archives/tucu-red/clients/${slug}/${photo}`;
};

/**
 * Calcula el score real de un lead desde sus datos de enriquecimiento.
 */
export const computeScore = (p) => {
  if (p.leadScore !== 10 && p.leadScore !== 50) return p.leadScore || 50;
  return Math.min(
    99,
    (p.photos?.length || 0) * 2 +
      (p.instagram || p.instagramData ? 25 : 0) +
      (p.reviews > 0 ? 30 : 0) +
      15
  );
};
