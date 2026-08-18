// Archivo: backend/services/injector/MapHandler.js
// Inyector de Mapas y Geolocalización

class MapHandler {
    static injectMap($, prospectData) {
        const address = prospectData?.address || 'San Miguel de Tucumán, Argentina';
        const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        $('iframe[data-type="map"]').attr('src', mapUrl);
    }
}

module.exports = MapHandler;
