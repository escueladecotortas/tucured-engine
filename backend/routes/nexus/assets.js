// Archivo: backend/routes/nexus/assets.js
// Enrutador Maestro de Assets de Clientes y Bóveda Visual (Ley de 200 líneas)

const express = require('express');
const router = express.Router();

// --- SUB-ROUTERS ATÓMICOS ---
const listRouter = require('./assets/list');
const reclassifyRouter = require('./assets/reclassify');
const manifestRouter = require('./assets/manifest');

// --- MONTAJE ---
router.use('/', listRouter);
router.use('/', reclassifyRouter);
router.use('/', manifestRouter);

module.exports = router;
