// Archivo: frontend/src/components/leads/BatchSearchData.js
import { CATEGORY_TAXONOMY } from '../../data/categories';

export const TUCUMAN_CITIES = [
    'San Miguel de Tucumán', 'Yerba Buena', 'Banda del Río Salí', 'Tafí Viejo',
    'Las Talitas', 'Alderetes', 'Concepción', 'Aguilares', 'Monteros', 'Famaillá',
    'Lules', 'Tafí del Valle', 'Simoca', 'Juan Bautista Alberdi', 'Bella Vista',
    'Río Seco', 'Burruyacú', 'Trancas', 'El Manantial', 'San Pablo', 'La Cocha',
    'Graneros', 'Leales', 'Chicligasta'
];

export const RUBRO_OPTIONS = [];
Object.entries(CATEGORY_TAXONOMY).forEach(([catId, cat]) => {
    cat.subcategories.forEach(sub => {
        RUBRO_OPTIONS.push({
            value: sub.label,
            label: `${cat.label} → ${sub.label}`,
            categoryId: catId,
            subcategoryId: sub.id
        });
    });
});

export function calculateLeadScore(lead) {
    let score = 50;
    if (lead.rating) {
        if (lead.rating >= 4.5) score += 20;
        else if (lead.rating >= 4.0) score += 15;
        else if (lead.rating >= 3.5) score += 10;
    }
    if (lead.reviews > 100) score += 15;
    else if (lead.reviews > 50) score += 10;
    else if (lead.reviews > 10) score += 5;
    if (lead.phone) score += 5;
    if (!lead.hasWebsite) score += 10;
    else score -= 10;
    return Math.min(100, Math.max(10, score));
}
