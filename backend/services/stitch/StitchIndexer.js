// Archivo: backend/services/stitch/StitchIndexer.js
// Gestor Ligero de Indexación y Precalentamiento de Caché para Google Stitch (Ley de 200 líneas)

class StitchIndexer {
  /**
   * Precalienta la URL remota mediante un ping HTTP ligero con timeout controlado.
   * Cero dependencias pesadas de Chromium/Puppeteer.
   * @param {string} url - URL del activo o pantalla a precalentar
   */
  static async forceIndexation(url) {
    if (!url || typeof url !== 'string') return;
    console.log(`[Stitch Indexer] 🌐 Precalentando URL vía HTTP nativo: ${url}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'TucuRed-Engine/11.1 (Stitch-Indexer-Fast)'
        }
      }).catch(async () => {
        // Fallback a GET ligero si HEAD no es aceptado
        return await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'TucuRed-Engine/11.1 (Stitch-Indexer-Fast)'
          }
        });
      });

      clearTimeout(timeoutId);

      if (response && response.ok) {
        console.log(`[Stitch Indexer] ✅ URL precalentada exitosamente (HTTP ${response.status}).`);
      } else {
        console.log(`[Stitch Indexer] ℹ️ Respuesta HTTP: ${response ? response.status : 'N/A'} (No bloqueante).`);
      }
    } catch (error) {
      console.log(`[Stitch Indexer] ℹ️ Precalentamiento completado en modo tolerante: ${error.message}`);
    }
  }
}

module.exports = StitchIndexer;
