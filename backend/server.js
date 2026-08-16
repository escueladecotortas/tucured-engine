// Archivo: backend/server.js
// Tucu Red Engine — Motor Soberano de Generación Automática de Sitios Web (Nexus OS v10.0)

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware base
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS Soberano
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// Archivos estáticos del Cockpit UI
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
}

// Catálogo de Servicios Curados
const SERVICES_CATALOG = [
    { name: 'TheDirector', tier: 'Orquestación & Pipeline', desc: 'Controlador maestro del flujo de generación end-to-end' },
    { name: 'AutoSiteGenerator', tier: 'Orquestación & Pipeline', desc: 'Motor de ensamblado modular y renderizado HTML' },
    { name: 'AutoHealerService', tier: 'Resiliencia & Salud', desc: 'Autodiagnóstico y autorreparación de código y rutas' },
    { name: 'CloudDeployOrchestrator', tier: 'Despliegue & Cloud', desc: 'Orquestador de despliegue multizona a Netlify / Vercel' },
    { name: 'NetlifyDeployService', tier: 'Despliegue & Cloud', desc: 'Cliente de API de Netlify con soporte para deploy previews' },
    { name: 'ApifyService', tier: 'Scraping & Ingesta', desc: 'Ingesta automatizada de feeds y catálogos de Instagram' },
    { name: 'InstagramScraperService', tier: 'Scraping & Ingesta', desc: 'Extracción de reels, bio, fotos de perfil y posts' },
    { name: 'MapsScraperService', tier: 'Scraping & Ingesta', desc: 'Scraping de Google Maps, geolocalización, reseñas y horarios' },
    { name: 'ColorPaletteService', tier: 'Diseño & Visión', desc: 'Extracción de paletas HSL armónicas a partir de imágenes' },
    { name: 'CatalogVisionService', tier: 'Diseño & Visión', desc: 'Clasificación visual de productos mediante visión artificial' },
    { name: 'SmartCopyEngine', tier: 'Copywriting & IA', desc: 'Generación de copys persuasivos por arquetipo comercial' },
    { name: 'NumerologyEngine', tier: 'Copywriting & IA', desc: 'Calibración vibracional y resonancia numérica de marcas' },
    { name: 'PhotoOptimizer', tier: 'Optimización de Medios', desc: 'Compresión WebP y resize con Sharp sin pérdida' },
    { name: 'PhotoCuratorService', tier: 'Optimización de Medios', desc: 'Selección de fotos destacadas para hero y carruseles' },
    { name: 'StitchFactoryNext', tier: 'Stitch Engine', desc: 'Fábrica de ensamblado atómico de componentes UI' },
    { name: 'StitchPipeline', tier: 'Stitch Engine', desc: 'Pipeline de parsing y tokenización de plantillas' },
    { name: 'StitchIndexer', tier: 'Stitch Engine', desc: 'Indexador y gestor de dependencias de widgets' },
    { name: 'DJAlgorithm', tier: 'Stitch Engine', desc: 'Algoritmo de mezcla y match inteligente de widgets' },
    { name: 'WidgetManifestService', tier: 'Stitch Engine', desc: 'Registro SSOT de contratos y props de widgets' },
    { name: 'OrionValidator', tier: 'Validación & QA', desc: 'Validación de esquema y contratos antes de deploy' },
    { name: 'ArgusGateService', tier: 'Validación & QA', desc: 'Gatekeeper de calidad, enlaces y accesibilidad' },
    { name: 'PostDeployVerifier', tier: 'Validación & QA', desc: 'Comprobación de respuesta HTTP 200 tras publicación' },
    { name: 'ProjectShield', tier: 'Seguridad & Integridad', desc: 'Protección contra mutaciones destructivas y circuit breaker' },
    { name: 'SafeWriteService', tier: 'Seguridad & Integridad', desc: 'Escritura atómica con rollback preventivo' },
    { name: 'DurableSessionService', tier: 'Sesión & Memoria', desc: 'Persistencia resiliente del estado de generación' },
    { name: 'NexusMemoryService', tier: 'Sesión & Memoria', desc: 'Memoria vectorial y caché de generaciones previas' },
    { name: 'SEOService', tier: 'SEO & Performance', desc: 'Inyección de meta-tags, OpenGraph y JSON-LD' },
    { name: 'VisualBionicsService', tier: 'Diseño & Visión', desc: 'Ajuste de contraste y accesibilidad WCAG' }
];

// Ruta raíz: Sirve el Cockpit Visual en HTML
app.get('/', (req, res) => {
    const indexPath = path.join(publicDir, 'index.html');
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    res.json({ status: 'Online', app: 'tucured-engine', version: '1.0.0', port: PORT });
});

// API REST: Diagnóstico General
app.get('/api/health', (req, res) => {
    res.json({
        status: 'HEALTHY',
        engine: 'Tucu Red Generation Engine v10.0',
        port: PORT,
        uptimeSec: Math.round(process.uptime()),
        memoryUsageMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
        servicesCount: SERVICES_CATALOG.length + 23,
        timestamp: new Date().toISOString()
    });
});

// API REST: Listado de Servicios del Motor
app.get('/api/services', (req, res) => {
    res.json({
        success: true,
        total: SERVICES_CATALOG.length,
        services: SERVICES_CATALOG
    });
});

// API REST: Simulación Dry-Run de Generación
app.post('/api/dry-run', (req, res) => {
    const profile = req.body.profile || 'grazia';
    const presets = {
        grazia: { name: 'Grazia Centro de Estética', category: 'Belleza & Spa', palette: { primary: '#1c1917', accent: '#C5A059' }, widgets: ['Booking Turnero v1', 'Gallery Reel v1', 'Trust Google v1', 'Footer Map v1'] },
        nickly: { name: 'Nickly Hamburguesería', category: 'Gastronomía & Fast Food', palette: { primary: '#0f172a', accent: '#f59e0b' }, widgets: ['Hero v1', 'Catalog Grid v1', 'Cart WhatsApp v1', 'Footer Map v1'] },
        postre: { name: 'Postre Pastelería', category: 'Pastelería & Cafetería', palette: { primary: '#18181b', accent: '#ec4899' }, widgets: ['Hero v1', 'Catalog Grid v1', 'Booking v1', 'Social Reel v1'] }
    };
    const sel = presets[profile] || presets.grazia;
    res.json({
        success: true,
        generatedAt: new Date().toISOString(),
        client: sel.name,
        category: sel.category,
        palette: sel.palette,
        widgets: sel.widgets,
        pages: ['index.html', 'catalogo.html', 'turnos.html', 'contacto.html', 'terminos.html'],
        deployStatus: 'DRY_RUN_READY'
    });
});

// Carga modular de rutas disponibles
const routesDir = path.join(__dirname, 'routes');
if (fs.existsSync(routesDir)) {
    fs.readdirSync(routesDir).forEach(file => {
        if (file.endsWith('.js')) {
            const routeName = path.basename(file, '.js');
            try {
                const routeModule = require(path.join(routesDir, file));
                if (typeof routeModule === 'function' || routeModule.stack) {
                    app.use(`/api/${routeName}`, routeModule);
                }
            } catch (e) {}
        }
    });
}

const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [TUCURED-ENGINE] Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = { app, server };
