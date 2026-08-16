/**
 * SERVICE: RubroProfileService
 * Purpose: Determine UI/UX configuration based on business category.
 * PURGED: Standardized to NEXUS UI KIT (Web Components).
 */

class RubroProfileService {

    // getCategoryColors PURGED. Usar NumerologyEngine + ColorPaletteService.

    static getProfile(category) {
        const profiles = {
            // GASTRONOMY
            hamburguesa: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedir Ahora!' },
            burger: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedir Ahora!' },
            pizza: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedir Ahora!' },
            pizzeria: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedir Ahora!' },
            cafe: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: false }, ctaText: 'Visitanos' },
            heladeria: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedí tu Helado!' },
            sushi: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: 'Hacer Pedido' },
            gastronomy: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: '¡Pedir Ahora!' },
            fast_food: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { shop: true }, ctaText: 'Pedir Ahora' },

            // BEAUTY & HEALTH
            beauty: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { booking: true }, ctaText: 'Reservar Turno' },
            nail_salon: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { booking: true }, ctaText: 'Agendar Turno' },
            fitness: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { booking: true }, ctaText: 'Inscribirme' },

            // SERVICES
            professional: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { booking: true }, ctaText: 'Agendar Consulta' },
            automotive: { hero: 'nexus-hero', grid: 'nexus-catalog', features: { booking: true }, ctaText: 'Solicitar Presupuesto' },

            // RETAIL
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
