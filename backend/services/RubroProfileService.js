// Archivo: backend/services/RubroProfileService.js
// SERVICE: RubroProfileService (Determinación de perfil y paleta por rubro)

class RubroProfileService {
    static getCategoryColors(category) {
        const colorMap = {
            cafe: { primary: '#3e2723', secondary: '#5d4037', accent: '#d7ccc8' },
            burger: { primary: '#d32f2f', secondary: '#ff9800', accent: '#fbc02d' },
            pizza: { primary: '#c62828', secondary: '#ef6c00', accent: '#ffd54f' },
            beauty: { primary: '#880e4f', secondary: '#ad1457', accent: '#f48fb1' },
            nail_salon: { primary: '#4a148c', secondary: '#7b1fa2', accent: '#ce93d8' },
            gastronomy: { primary: '#bf360c', secondary: '#e64a19', accent: '#ff8a65' }
        };
        return colorMap[category] || null;
    }

    static getProfile(category) {
        const profiles = {
            hamburguesa: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedir Ahora!' },
            burger: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedir Ahora!' },
            pizza: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedir Ahora!' },
            pizzeria: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedir Ahora!' },
            cafe: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: false }, ctaText: 'Visitanos' },
            heladeria: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedí tu Helado!' },
            sushi: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: 'Hacer Pedido' },
            gastronomy: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedir Ahora!' },
            fast_food: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: 'Pedir Ahora' },
            beauty: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { booking: true }, ctaText: 'Reservar Turno' },
            nail_salon: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { booking: true }, ctaText: 'Agendar Turno' },
            fitness: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { booking: true }, ctaText: 'Inscribirme' },
            professional: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { booking: true }, ctaText: 'Agendar Consulta' },
            automotive: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { booking: true }, ctaText: 'Solicitar Presupuesto' },
            retail: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: 'Hacer Pedido' },
            pet_shop: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: 'Ver Productos' },
            pet_supply_store: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: 'Comprar Ahora' },
            veterinary: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { booking: true }, ctaText: 'Pedir Turno' }
        };

        return profiles[category] || {
            hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: false }, ctaText: 'Contactanos'
        };
    }
}

module.exports = RubroProfileService;
