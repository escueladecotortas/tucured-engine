// Archivo: backend/server.js
// Tucu Red Engine — Motor Soberano de Generación Automática de Sitios Web (Nexus OS v11.1 - Ley de 200 líneas)

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 5006;

// Middleware base
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS Soberano
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// Resolución estática prioritaria y transparente de Activos Visuales
const archivesDir = path.resolve(process.cwd(), 'nexus_archives');
const clientsDir = path.resolve(process.cwd(), 'public/clients');
const publicDir = path.resolve(process.cwd(), 'public');

if (fs.existsSync(archivesDir)) app.use('/nexus_archives', express.static(archivesDir));
if (fs.existsSync(clientsDir)) app.use('/clients', express.static(clientsDir));
if (fs.existsSync(publicDir)) app.use(express.static(publicDir));

// Middleware de fallback inteligente para assets de clientes (Dual Path Resolution)
app.get(['/clients/:slug/assets/:file', '/nexus_archives/tucu-red/clients/:slug/assets/:file'], (req, res, next) => {
    const { slug, file } = req.params;
    const candidates = [
        path.join(archivesDir, 'tucu-red/clients', slug, 'assets', file),
        path.join(clientsDir, slug, 'assets', file),
        path.join(archivesDir, 'bionics', slug, 'assets', file)
    ];
    for (const target of candidates) {
        if (fs.existsSync(target) && fs.statSync(target).isFile()) {
            return res.sendFile(target);
        }
    }
    next();
});

// API REST: Diagnóstico General
app.get('/api/health', (req, res) => {
    res.json({
        status: 'HEALTHY', engine: 'Tucu Red Generation Engine v11.1',
        port: PORT, uptimeSec: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

// Carga modular de rutas disponibles en backend/routes/
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
            } catch (e) {
                console.warn(`⚠️ [Routes] Error al montar /api/${routeName}:`, e.message);
            }
        }
    });
}

// Aliases directos para compatibilidad 100% canónica
const leadsCoreRouter = require('./routes/leads/core');
const forgeStitchRouter = require('./routes/forge/stitch');
app.use('/api/prospects', leadsCoreRouter);
app.use('/api/leads', leadsCoreRouter);
app.use('/api/forge', forgeStitchRouter);
app.post('/api/forge/deploy', (req, res, next) => forgeStitchRouter(req, res, next));
app.post('/api/leads/enrich', leadsCoreRouter.enrichLeadHandler);
app.post('/api/enrich-lead', leadsCoreRouter.enrichLeadHandler);

// Fallback SPA HTML5
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/clients') || req.path.startsWith('/nexus_archives')) {
        return next();
    }
    const indexPath = path.join(publicDir, 'index.html');
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    res.json({ status: 'Online', app: 'tucured-engine', version: '11.1.0', port: PORT });
});

const server = http.createServer(app);
server.timeout = 900000;
server.keepAliveTimeout = 900000;
server.headersTimeout = 905000;

if (require.main === module) {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 [TUCURED-ENGINE BACKEND] Servidor escuchando en http://localhost:${PORT}`);
    });
}

module.exports = { app, server };
