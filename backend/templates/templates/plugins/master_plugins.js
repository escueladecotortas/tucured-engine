// Nexus Master Plugins Definition
// Defines the schema and default config for Industrial Widgets

const PLUGINS = [
    {
        id: 'turnero',
        name: 'Turnero WhatsApp (Standard)',
        description: 'Módulo de agenda ligero. Abre WhatsApp con el mensaje pre-formateado.',
        icon: 'Calendar',
        tier: 'standard',
        version: '2.1.0',
        specs: {
            responsive: true,
            customizable: ['Colors', 'Texts', 'Schedule'],
            limitations: 'Requiere número con WhatsApp activo'
        },
        schema: [
            {
                key: 'phoneNumber',
                label: 'Número de WhatsApp',
                type: 'tel',
                default: '',
                helper: 'Formato internacional (sin +)',
                constraints: 'Solo números. Código de país requerido.'
            },
            {
                key: 'businessName',
                label: 'Nombre del Negocio',
                type: 'text',
                default: '',
                constraints: 'Max 30 caracteres. Visible en el mensaje.'
            },
            {
                key: 'daysVisible',
                label: 'Días Disponibles',
                type: 'select-multi',
                options: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
                default: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
                constraints: 'Selección múltiple. Afecta al calendario.'
            },
            {
                key: 'primaryColor',
                label: 'Color Principal',
                type: 'color',
                default: '#25D366', // WhatsApp Green
                constraints: 'Hexadecimal. Afecta botones y selección.'
            }
        ],
        defaultProps: {
            phoneNumber: '',
            businessName: '',
            daysVisible: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
            primaryColor: '#25D366'
        }
    },
    {
        id: 'carousel',
        name: 'Auto-Carousel Loop',
        description: 'Galería infinita para portfolios. Desplazamiento automático y soporte táctil.',
        icon: 'MonitorPlay',
        tier: 'standard',
        version: '2.1.0',
        specs: {
            responsive: true,
            customizable: ['Interval', 'Autoplay', 'Images'],
            limitations: 'Formato 16:9 recomendado'
        },
        schema: [
            {
                key: 'interval',
                label: 'Velocidad (ms)',
                type: 'number',
                default: 3000,
                constraints: 'Mínimo 500ms. Unidad: Milisegundos.'
            },
            {
                key: 'autoplay',
                label: 'Reproducción Automática',
                type: 'boolean',
                default: true,
                constraints: 'On/Off. Pausa al pasar el mouse.'
            },
            {
                key: 'images',
                label: 'Imágenes',
                type: 'array-images', // Special type for Image Uploader
                default: [],
                constraints: 'JPG/PNG/WebP. Máx 10 slides recomendados.'
            }
        ],
        defaultProps: {
            interval: 3000,
            autoplay: true,
            items: []
        }
    },
    {
        id: 'popup',
        name: 'Flash Promo Popup',
        description: 'Ventana emergente para capturar atención. Ideal para ofertas limitadas.',
        icon: 'Zap',
        tier: 'standard',
        version: '1.5.0',
        version: '1.5.0',
        specs: {
            responsive: true,
            customizable: ['Texts', 'Links', 'Timing'],
            limitations: 'Una vez por sesión (cookie-based)'
        },
        schema: [
            {
                key: 'title',
                label: 'Título de la Oferta',
                type: 'text',
                default: '¡Oferta Especial!',
                constraints: 'Max 40 chars. Encabezado principal.'
            },
            {
                key: 'message',
                label: 'Mensaje Principal',
                type: 'textarea',
                default: 'Aprovecha un 20% OFF solo por hoy.',
                constraints: 'Max 120 chars. Texto del cuerpo.'
            },
            {
                key: 'delay',
                label: 'Retraso de aparición (seg)',
                type: 'number',
                default: 5,
                constraints: 'Segundos después de carga. Recomendado: 3-10s.'
            },
            {
                key: 'ctaText',
                label: 'Texto del Botón',
                type: 'text',
                default: 'LO QUIERO',
                constraints: 'Call to Action. Max 15 chars.'
            },
            {
                key: 'ctaLink',
                label: 'Enlace del Botón',
                type: 'url',
                default: '#',
                constraints: 'URL absoluta (https://...).'
            }
        ],
        defaultProps: {
            title: 'Oferta Flash',
            message: 'Descuento exclusivo para nuevos clientes.',
            delay: 3,
            ctaText: 'Ver Oferta',
            ctaLink: '#'
        }
    }
];

module.exports = PLUGINS;
