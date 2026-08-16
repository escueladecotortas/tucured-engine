// Archivo: frontend/src/components/tabs/blueprint/blueprint-constants.js
import { 
    LayoutTemplate, MousePointerClick, CheckCircle, Layout 
} from 'lucide-react';

export const SITE_ARCHETYPES = [
    { id: 'landing_sales', label: 'High Conv. Landing', icon: MousePointerClick, desc: 'Aggressive sales focus. Hero -> Pain -> Solution -> CTA.' },
    { id: 'brand_showcase', label: 'Brand Portfolio', icon: LayoutTemplate, desc: 'Visual heavy. Gallery -> Story -> Contact.' },
    { id: 'service_booking', label: 'Service Booking', icon: CheckCircle, desc: 'Appointment focus. Services -> Team -> Calendar.' },
    { id: 'local_business', label: 'Local Store', icon: Layout, desc: 'Traffic focus. Map -> Hours -> Promo -> WhatsApp.' },
];

export const AVAILABLE_SECTIONS = [
    { id: 'hero_video', label: 'Hero Video' },
    { id: 'hero_static', label: 'Hero Static' },
    { id: 'features_grid', label: 'Features Grid' },
    { id: 'gallery_carousel', label: 'Gallery Carousel' },
    { id: 'testimonials', label: 'Social Proof' },
    { id: 'pricing_table', label: 'Pricing Table' },
    { id: 'faq_accordion', label: 'FAQ' },
    { id: 'contact_form', label: 'Contact Form' },
    { id: 'whatsapp_float', label: 'WhatsApp Button' },
];
