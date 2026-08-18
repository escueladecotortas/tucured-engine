// Archivo: backend/services/injector/NavigationHandler.js
// Enrutador de Navegación y Enlaces de Contacto

class NavigationHandler {
    static handle($, prospectData) {
        const phone = (prospectData?.phone || '5493816202789').replace(/\D/g, '');
        $('a[href*="whatsapp"], a[data-type="whatsapp"]').attr('href', `https://wa.me/${phone}?text=${encodeURIComponent('Hola! Vi su web')}`);
    }
}

module.exports = NavigationHandler;
