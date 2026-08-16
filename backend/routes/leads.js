const express = require('express');
const router = express.Router();

// --- SUB-ROUTERS (Atomic Compliance) ---
const coreRouter = require('./leads/core');
const bulkRouter = require('./leads/bulk');
const manageRouter = require('./leads/manage');

// --- MOUNTING ---
router.use('/', coreRouter);          // Single lead, list, enrich
router.use('/', bulkRouter);          // Bulk operations
router.use('/', manageRouter);        // Admin, Scraper, Delete

module.exports = router;
