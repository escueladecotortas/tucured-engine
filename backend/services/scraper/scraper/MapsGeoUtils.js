// Archivo: backend/services/scraper/MapsGeoUtils.js

/**
 * Utilidades de Coordenadas y Geopolítica para Google Maps.
 * Extraído para cumplimiento de la Ley de 200 líneas.
 */
class MapsGeoUtils {
  /**
   * Extrae la latitud de la URL de Maps.
   */
  static extractLat(url) {
    try {
      if (!url) return null;
      const match3d = /!3d(-?\d+\.\d+)/.exec(url);
      if (match3d) return parseFloat(match3d[1]);
      const matchAt = /@(-?\d+\.\d+),/.exec(url);
      if (matchAt) return parseFloat(matchAt[1]);
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Extrae la longitud de la URL de Maps.
   */
  static extractLng(url) {
    try {
      if (!url) return null;
      const match4d = /!4d(-?\d+\.\d+)/.exec(url);
      if (match4d) return parseFloat(match4d[1]);
      const matchAt = /@[-.\d]+,(-?\d+\.\d+)/.exec(url);
      if (matchAt) return parseFloat(matchAt[1]);
      return null;
    } catch (e) {
      return null;
    }
  }
}

module.exports = MapsGeoUtils;
