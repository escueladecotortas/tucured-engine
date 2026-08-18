// Archivo: backend/services/injector/BrandingHandler.js
// Inyector de Identidad de Marca y Títulos

class BrandingHandler {
    static injectBranding($, prospectData) {
        if (prospectData?.name) {
            $('title').text(prospectData.name);
            $('[data-brand-name]').text(prospectData.name);
        }
    }
}

module.exports = BrandingHandler;
