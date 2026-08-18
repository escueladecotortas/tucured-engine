// Archivo: backend/services/injector/AssetHandler.js
// Procesador y Sustituto de Assets de Medios

class AssetHandler {
    static processAssets($, assetsDir, realFiles, prospectData) {
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            if (!src || src.includes('placeholder')) {
                if (realFiles && realFiles.length > 0) {
                    $(el).attr('src', `./assets/${realFiles[i % realFiles.length]}`);
                }
            }
        });
    }
}

module.exports = AssetHandler;
