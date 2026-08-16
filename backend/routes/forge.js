const express = require('express');
const router = express.Router();

// --- SUB-ROUTERS (Atomic Compliance) ---
const builderRouter = require('./forge/builder');
const stitchRouter = require('./forge/stitch');

// --- MOUNTING ---
router.use('/', builderRouter); // Nexus Builder
router.use('/', stitchRouter);  // Stitch MCP

module.exports = router;
