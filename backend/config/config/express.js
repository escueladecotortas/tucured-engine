const express = require('express');
const cors = require('cors');
const path = require('path');

function configureExpress(app) {
    app.use(cors());
    app.use(express.json({ limit: '50mb' }));

    const archivePath = path.join(__dirname, '../../nexus_archives');
    const clientsPath = path.join(__dirname, '../../nexus_archives/tucu-red/clients');

    app.use('/nexus_archives', express.static(archivePath, {
        setHeaders: (res) => {
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');
        }
    }));
    app.use('/clients', express.static(clientsPath));

    app.use((req, res, next) => {
        console.log(`📨 [${req.method}] ${req.url}`);
        next();
    });

    return app;
}

module.exports = configureExpress;
