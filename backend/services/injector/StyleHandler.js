// Archivo: backend/services/injector/StyleHandler.js
// Inyector de Estilos Base y Tokens CSS

class StyleHandler {
    static injectBaseStyles($, prospectData) {
        if ($('head').length === 0) $('html').prepend('<head></head>');
        $('head').append(`<style>
            :root { --font-sans: 'Inter', sans-serif; }
            body { font-family: var(--font-sans); margin: 0; padding: 0; }
        </style>`);
    }
}

module.exports = StyleHandler;
