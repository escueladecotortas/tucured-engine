import { Layout, MonitorPlay, ShoppingCart, Database } from 'lucide-react';

export const MOCK_IMAGES = {
    hero_fashion: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
    hero_food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200',
    hero_minimal: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200',
    food_1: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500',
    food_2: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500',
    social_1: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=500',
    social_2: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=500',
    social_3: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=500',
    dental_before: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    dental_after: 'https://images.unsplash.com/photo-1606811841689-23dfdd7a2500?auto=format&fit=crop&q=80&w=800',
    service_1: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=500',
    service_2: 'https://images.unsplash.com/photo-1576091160550-217359f49f4c?auto=format&fit=crop&q=80&w=500',
};

export const WIDGET_DATA = [
    { 
        id: 'HeroV2_Split', 
        tier: 'visual', 
        label: 'Hero Split Modern', 
        description: 'Sección de cabecera con diseño asimétrico. Ideal para marcas que buscan confianza y profesionalismo.',
        tags: ['servicios', 'corporativo', 'top'], 
        configProps: ['Imagen Curva', 'Título Doble', 'Location Badge', 'Trust Avatars'],
        data: { 
            titleLine1: 'Tu Visión,', 
            titleLine2: 'Nuestra Misión', 
            subtitle: 'Transformamos ideas en realidades digitales.', 
            heroImage: MOCK_IMAGES.hero_fashion,
            trustText: '+500 Clientes Felices'
        } 
    },
    { 
        id: 'HeroV3_Minimal', 
        tier: 'visual', 
        label: 'Hero Minimalist', 
        description: 'Impacto visual puro mediante tipografía y espacios negativos. Estética boutique.',
        tags: ['estetica', 'moda', 'lujo'], 
        configProps: ['Imagen Central', 'Mensaje Esencial', 'Contraste Alto'],
        data: { 
            title: 'Esencia Pura', 
            subtitle: 'Menos es más.', 
            heroImage: MOCK_IMAGES.hero_minimal 
        } 
    },
    { 
        id: 'HeroV4_Slider', 
        tier: 'visual', 
        label: 'Dynamic Story Slider', 
        description: 'Carrusel de imágenes a pantalla completa con transiciones suaves. Perfecto para catálogos.',
        tags: ['retail', 'hoteleria', 'producto'], 
        configProps: ['N Slides Ilimitados', 'Auto-advance', 'Controles Táctiles'],
        data: { 
            slides: [
                { id: '1', image: MOCK_IMAGES.hero_fashion, title: 'Colección 2024', description: 'Descubrí lo nuevo.' },
                { id: '2', image: MOCK_IMAGES.hero_food, title: 'Sabor Auténtico', description: 'Ingredientes de origen.' }
            ] 
        } 
    },
    { 
        id: 'HeroV5_Form', 
        tier: 'visual', 
        label: 'Hero Lead Magnet', 
        description: 'Cabecera optimizada para captura de leads inmediata.',
        tags: ['campañas', 'marketing'], 
        configProps: ['Formulario Integrado', 'Fondo Imponente', 'CTA Directo'],
        data: { backgroundImage: MOCK_IMAGES.hero_fashion } 
    },
    { 
        id: 'HeroV5_Video', 
        tier: 'visual', 
        label: 'Inmersive Video', 
        description: 'Fondo de video cinemático. Crea una atmósfera inmersiva instantánea.',
        tags: ['gastronomia', 'eventos', 'premium'], 
        configProps: ['Video Loop MP4/YouTube', 'Overlay de Contraste', 'Texto Flotante'],
        data: { videoUrl: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4', title: 'Experiencia Visual' } 
    }, 
    { 
        id: 'GridV1_Bento', 
        tier: 'visual', 
        label: 'Bento Experience', 
        description: 'Grilla asimétrica inspirada en Apple. Ordena el caos visual con elegancia.',
        tags: ['resumen', 'personal', 'vanguardia'], 
        configProps: ['Stats Dinámicos', 'Quotes de Autor', 'Múltiples Formatos de Imagen'],
        data: { 
            items: [
                { image: MOCK_IMAGES.food_1, title: 'Plato del Día' },
                { title: 'Frescura', description: 'Del huerto a tu mesa.', icon: null },
                { stat: '4.9', label: 'Estrellas' },
                { image: MOCK_IMAGES.food_2, title: 'Reservar' },
                { image: MOCK_IMAGES.hero_food },
                { quote: 'La cocina es amor.' }
            ] 
        } 
    },
    { 
        id: 'GridV2_Cards', 
        tier: 'visual', 
        label: 'Service Cards', 
        description: 'Grilla de tarjetas clásica para servicios. Claridad y estructura.',
        tags: ['servicios', 'clinicas', 'info'], 
        configProps: ['Iconos Lucide', 'Hover Effects', 'Descripciones Detalladas'],
        data: { 
            items: [
                { title: 'Diagnóstico Digital', description: 'Análisis profundo de tu presencia actual.', image: MOCK_IMAGES.service_1 },
                { title: 'Tratamiento Táctico', description: 'Plan personalizado de alto impacto.', image: MOCK_IMAGES.service_2 },
                { title: 'Seguimiento Pro', description: 'Acompañamiento continuo y optimización.', image: MOCK_IMAGES.hero_minimal }
            ] 
        } 
    },
    { 
        id: 'GridV3_ZigZag', 
        tier: 'visual', 
        label: 'ZigZag Storytelling', 
        description: 'Alternancia de imagen y texto para guiar la lectura secuencial.',
        tags: ['marca', 'coach', 'historia'], 
        configProps: ['Layout Alterno', 'Botones de Acción', 'Responsive Check'],
        data: { 
            items: [
                { title: 'Nuestra Historia', description: 'Nacimos para romper el molde.', image: MOCK_IMAGES.hero_fashion },
                { title: 'El Método', description: 'Precisión técnica en cada paso.', image: MOCK_IMAGES.hero_food }
            ]
        } 
    },
    { 
        id: 'GridV4_List', 
        tier: 'visual', 
        label: 'Price List Menu', 
        description: 'Lista de ítems con precios e imágenes. Ideal para cartas o catálogos simples.',
        tags: ['gastronomia', 'servicios', 'lista'], 
        configProps: ['Categorización', 'Badge de Precio', 'Thumbnails'],
        data: { 
            categories: [
                { 
                    name: 'Principales', 
                    items: [
                        { name: 'Membresía Premium', price: '$20', image: MOCK_IMAGES.food_1 },
                        { name: 'Acceso Platino', price: '$50', image: MOCK_IMAGES.food_2 }
                    ]
                }
            ]
        } 
    },
    { 
        id: 'GalleryV1_Reel', 
        tier: 'visual', 
        label: 'Brand Reel', 
        description: 'Carrusel infinito de logos o miniaturas. Genera autoridad instantánea.',
        tags: ['social-proof', 'partners', 'autoridad'], 
        configProps: ['Velocidad de Scroll', 'Grayscale Mode', 'Linkable Logos'],
        data: { images: [MOCK_IMAGES.social_1, MOCK_IMAGES.social_2, MOCK_IMAGES.social_3, MOCK_IMAGES.hero_minimal] } 
    },
    { 
        id: 'CartV1_WhatsApp', 
        tier: 'conversion', 
        label: 'WhatsApp Cart System', 
        description: 'Transforma tu landing en una tienda sin transacciones complejas. El pedido llega por WhatsApp.',
        tags: ['ecommerce', 'gastronomia', 'fast-sales'], 
        configProps: ['Cálculo de Total Sugerido', 'Formulario de Envío', 'Checkout Inmediato'],
        data: { 
            products: [
                { id: '1', name: 'Tratamiento Dental V1', price: 150, image: MOCK_IMAGES.dental_after },
                { id: '2', name: 'Consulta Especializada', price: 45, image: MOCK_IMAGES.service_1 }
            ]
        } 
    },
    { 
        id: 'BarV1_Countdown', 
        tier: 'conversion', 
        label: 'FOMO Urgency Bar', 
        description: 'Barra superior persistente con contador regresivo. Aclara promociones y genera urgencia.',
        tags: ['ofertas', 'lanzamientos', 'conversion'], 
        configProps: ['Target Date', 'Texto de Oferta', 'Sticky/Fixed Mode'],
        data: { deadline: '2026-12-31', text: 'OFERTA DE LANZAMIENTO NEXUS' } 
    },
    { 
        id: 'CalcV1_Simple', 
        tier: 'conversion', 
        label: 'Smart Quote Calculator', 
        description: 'Permite al usuario estimar costos en tiempo real. Reduce la fricción de venta.',
        tags: ['servicios', 'construccion', 'consultoria'], 
        configProps: ['Campos Numéricos', 'Fórmula de Cálculo', 'Envío de Resultado'],
        data: { title: 'Presupuesto Instantáneo', basePrice: 100 } 
    },
    { 
        id: 'PowerUpV2_Notification', 
        tier: 'conversion', 
        label: 'FOMO Notifications', 
        description: 'Alertas "pop-up" que simulan actividad real en el sitio.',
        tags: ['ventas', 'social-proof', 'urgencia'], 
        configProps: ['Fake Activity Data', 'Intervalos de Tiempo', 'Posición Ajustable'],
        data: { notifications: [{ name: 'Leo', city: 'Tu Ciudad', action: 'acaba de activar el Arsenal' }] } 
    },
    { 
        id: 'PowerUpV3_Timer', 
        tier: 'conversion', 
        label: 'Inline Offer Timer', 
        description: 'Contador de tiempo integrado en secciones específicas.',
        tags: ['ofertas', 'conversion', 'retail'], 
        configProps: ['Estilo Compacto', 'Auto-hide post-expiración'],
        data: { deadline: '2026-12-31' } 
    },
    { 
        id: 'FormV2_Builder', 
        tier: 'conversion', 
        label: 'Dynamic Form Builder', 
        description: 'Formularios altamente personalizables para cualquier necesidad.',
        tags: ['leads', 'contacto', 'data'], 
        configProps: ['Validación de Campos', 'Step-by-Step UI', 'Email routing'],
        data: { title: 'Dinos qué necesitas', fields: [{label: 'Nombre', type: 'text'}, {label: 'Email', type: 'email'}] } 
    },
    { 
        id: 'FormV3_Survey', 
        tier: 'conversion', 
        label: 'Emoji Feedback System', 
        description: 'Micro-encuesta de satisfacción mediante emojis. Rápida, visual y efectiva.',
        tags: ['feedback', 'customer-care', 'micro-interacciones'], 
        configProps: ['Pregunta Personalizable', 'Redirección Post-Voto', 'Firebase Ready'],
        data: { question: '¿Cómo calificarías tu experiencia nexus?' } 
    },
    { 
        id: 'BookingV1', 
        tier: 'systems', 
        label: 'Smart Booking Terminal', 
        description: 'Agenda inteligente. Permite seleccionar fecha/hora y envía la reserva formateada.',
        tags: ['salud', 'turnero', 'profesionales'], 
        configProps: ['Días Habilitados', 'Rango de Horas', 'Validación WhatsApp'],
        data: { businessName: 'Nexus Dental Center' } 
    },
    { 
        id: 'SocialV2_InstaFeed', 
        tier: 'systems', 
        label: 'Live Instagram Wall', 
        description: 'Trae la vida de tu marca al sitio automáticamente mediante API.',
        tags: ['social-proof', 'branding', 'api'], 
        configProps: ['N Posts', 'Likes Counter', 'Username Link'],
        data: { 
            posts: [
                { id: '1', image: MOCK_IMAGES.social_1, likes: 124, link: '#' },
                { id: '2', image: MOCK_IMAGES.social_2, likes: 89, link: '#' },
                { id: '3', image: MOCK_IMAGES.social_3, likes: 210, link: '#' },
                { id: '4', image: MOCK_IMAGES.hero_minimal, likes: 45, link: '#' }
            ] 
        } 
    },
    { 
        id: 'SocialV3_TikTok', 
        tier: 'systems', 
        label: 'TikTok Video Feed', 
        description: 'Reproductor de videos TikTok directamente en el sitio para máxima viralidad.',
        tags: ['video', 'viral', 'joven'], 
        configProps: ['Auto-play', 'Mute Toggle', 'Overlay de Usuario'],
        data: { videoId: '7470649719543139590', username: 'nexus_digital' } 
    },
    { 
        id: 'SocialV4_Icons', 
        tier: 'systems', 
        label: 'Mega Social Bar', 
        description: 'Barra de acceso rápido a todos los canales sociales.',
        tags: ['contacto', 'redes', 'branding'], 
        configProps: ['Iconos Lucide', 'Hover Glow', 'Multi-canal'],
        data: { 
            links: [
                { platform: 'instagram', url: '#' },
                { platform: 'whatsapp', url: '#' },
                { platform: 'facebook', url: '#' }
            ] 
        } 
    },
    { 
        id: 'SocialV5_Pinterest', 
        tier: 'systems', 
        label: 'Pinterest Masonry Grid', 
        description: 'Diseño de mosaico fluido para galerías de inspiración.',
        tags: ['diseño', 'galeria', 'inspiracion'], 
        configProps: ['Columnas Dinámicas', 'Lazy Loading', 'Zoom Effect'],
        data: { images: [MOCK_IMAGES.hero_fashion, MOCK_IMAGES.hero_food, MOCK_IMAGES.hero_minimal, MOCK_IMAGES.food_1, MOCK_IMAGES.food_2] } 
    },
    { 
        id: 'TrustV1_Google', 
        tier: 'systems', 
        label: 'G-Maps Business Reviews', 
        description: 'Inyecta la reputación de tu negocio físico directamente en la web.',
        tags: ['reputacion', 'local', 'google'], 
        configProps: ['Estrellas Reales', 'Filtro de Rating', 'Link a Perfil'],
        data: { businessName: 'Nexus Pro Studio', rating: 4.9, count: 128 } 
    },
    { 
        id: 'TrustV2_Reviews', 
        tier: 'systems', 
        label: 'Expert Testimonials', 
        description: 'Muestra lo que otros dicen de ti de forma profesional.',
        tags: ['autoridad', 'review', 'social-proof'], 
        configProps: ['Avatares de Testigo', 'Cargo/Empresa', 'Rating Selector'],
        data: { testimonials: [{ name: 'Leo', text: 'El Arsenal Stitch cambió mi forma de trabajar.', avatar: MOCK_IMAGES.social_2 }] } 
    },
    { 
        id: 'ToolV1_Calendar', 
        tier: 'systems', 
        label: 'Events & Deadlines', 
        description: 'Listado de eventos futuros con diseño minimalista.',
        tags: ['organizacion', 'eventos', 'agenda'], 
        configProps: ['Date Formatting', 'Location link', 'Add-to-Calendar UI'],
        data: { events: [{ title: 'Lanzamiento V2', date: '2026-03-01' }] } 
    },
    { 
        id: 'ToolV2_Audio', 
        tier: 'systems', 
        label: 'Audio/Podcast Player', 
        description: 'Reproductor para notas de voz, música o podcasts.',
        tags: ['audio', 'multimedia', 'podcast'], 
        configProps: ['Waveform Visualizer', 'Play/Pause Sync', 'Volume Control'],
        data: { trackTitle: 'Nexus Identity Prompt', duration: '2:45' } 
    },
    { 
        id: 'ToolV3_VideoGallery', 
        tier: 'systems', 
        label: 'YouTube Masters Grid', 
        description: 'Canal de video integrado sin salir de la página.',
        tags: ['video', 'youtube', 'educacion'], 
        configProps: ['Video ID List', 'Modal Player', 'Autoplay option'],
        data: { videos: [{ id: 'dQw4w9WgXcQ' }, { id: 'ysz5S6PUM-U' }] } 
    },
    { 
        id: 'ToolV4_PDFViewer', 
        tier: 'systems', 
        label: 'Sovereign PDF Reader', 
        description: 'Visualizador de documentos PDF integrado. Ideal para menús o cartas.',
        tags: ['menu', 'corporativo', 'docs'], 
        configProps: ['Embed/Download Mode', 'Full-screen toggle'],
        data: { pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' } 
    },
    { 
        id: 'ToolV5_AgeGate', 
        tier: 'systems', 
        label: 'Age Gate Guard', 
        description: 'Bloqueo legal para sitios de contenido restringido. Elegante y obligatorio.',
        tags: ['legal', 'seguridad', 'compliance'], 
        configProps: ['Título de Alerta', 'Texto de Advertencia', 'Modo startHidden (Demo)'],
        data: { startHidden: false } 
    },
    { 
        id: 'ToolV6_QRCode', 
        tier: 'systems', 
        label: 'QR Bridge WhatsApp', 
        description: 'Generador de QR dinámico para iniciar chats instantáneos.',
        tags: ['offline-to-online', 'ventas', 'contacto'], 
        configProps: ['Custom Message', 'QR Styling', 'Logo Embed'],
        data: { phone: '12345678', message: 'Hola Nexus!' } 
    },
    { 
        id: 'ToolV7_FileDownload', 
        tier: 'systems', 
        label: 'Secure Asset Asset', 
        description: 'Botón de descarga de archivos con metadata.',
        tags: ['docs', 'utilidad', 'recursos'], 
        configProps: ['File Type Badge', 'Size info', 'Tracking hooks'],
        data: { fileName: 'Kit-Soberania-2026.zip', size: '15MB' } 
    },
    { 
        id: 'ToolV8_BeforeAfter', 
        tier: 'systems', 
        label: 'Before/After Slider', 
        description: 'Demuestra resultados reales mediante comparación interactiva deslizable.',
        tags: ['reformas', 'estetica', 'resultados'], 
        configProps: ['Handle Vertical/Horizontal', 'Etiquetas Personalizables', 'Imágenes HD'],
        data: { beforeImage: MOCK_IMAGES.dental_before, afterImage: MOCK_IMAGES.dental_after } 
    },
    { 
        id: 'GridV6_Pricing', 
        tier: 'conversion', 
        label: 'Strategic Pricing Table', 
        description: 'Tabla de precios persuasiva con resaltado del plan más popular.',
        tags: ['ventas', 'ecommerce', 'saas'], 
        configProps: ['Tiers de Precio', 'Feature list', 'CTA button per tier'],
        data: { 
            tiers: [
                { name: 'Standard', price: '99', features: ['Feature 1', 'Feature 2'] },
                { name: 'Pro', price: '299', features: ['All Standard', 'Priority Support'], highlighted: true }
            ] 
        } 
    },
    { 
        id: 'ProV1_DataGrid', 
        tier: 'systems', 
        label: 'Sovereign DataGrid', 
        description: 'Tabla maestra de alto rendimiento con filtrado y ordenamiento dinámico. Estética Pro.',
        tags: ['enterprise', 'data', 'gestión'], 
        configProps: ['Filtrado Real-time', 'Sorting Avanzado', 'Exportación CSV'],
        data: {} 
    },
    { 
        id: 'ProV2_Kanban', 
        tier: 'systems', 
        label: 'Mission Kanban Control', 
        description: 'Gestión visual de flujos de trabajo inspirada en MUI Minimal. Arrastre y seguimiento.',
        tags: ['misiones', 'kanban', 'proyectos'], 
        configProps: ['N Columnas', 'Task Priority Badge', 'User Assignment'],
        data: {} 
    },
    { 
        id: 'ProV3_Analytics', 
        tier: 'systems', 
        label: 'Nexus Quantum Analytics', 
        description: 'Dashboard de métricas con gráficos vectoriales y KPIs de salud sistémica.',
        tags: ['métricas', 'dashboard', 'inteligencia'], 
        configProps: ['SVG Charts', 'Sovereignty Meter', 'Live Stats'],
        data: {} 
    },
];

export const TIERS = [
    { id: 'all', label: 'Arsenal Completo', icon: Layout },
    { id: 'visual', label: 'Visual (Standard)', icon: MonitorPlay },
    { id: 'conversion', label: 'Conversion (Power)', icon: ShoppingCart },
    { id: 'systems', label: 'Sistemas (Pro)', icon: Database },
];

export const VIBE_STYLES: Record<string, { primary: string, accent: string }> = {
    '1': { primary: '#FF2A2A', accent: 'text-yellow-400' }, // Poder (Rojo)
    '2': { primary: '#10B981', accent: 'text-emerald-300' }, // Vínculo (Verde)
    '3': { primary: '#D946EF', accent: 'text-fuchsia-400' }, // Disrupción (Magenta)
    '4': { primary: '#3B82F6', accent: 'text-blue-300' }, // Estructura (Azul)
    '5': { primary: '#F59E0B', accent: 'text-yellow-300' }, // Aventura (Naranja)
    '6': { primary: '#EC4899', accent: 'text-pink-300' }, // Armonía (Rosa)
    '7': { primary: '#8B5CF6', accent: 'text-violet-300' }, // Mística (Violeta)
    '8': { primary: '#111827', accent: 'text-gray-300' }, // Éxito (Negro)
    '9': { primary: '#D4AF37', accent: 'text-yellow-200' }, // Lujo (Dorado)
};
