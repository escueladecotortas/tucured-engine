const express = require('express');
const router = express.Router();
const { runDiagnostic } = require('../../system_core/vitalis/vitalis_doctor');

// GET /api/vitalis/scan
router.get('/scan', async (req, res) => {
    try {
        console.log("🩺 API: Solicitando escaneo VITALIS...");
        const result = await runDiagnostic();
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("❌ VITALIS API Error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Fallo en el sistema de diagnóstico",
            details: error.message 
        });
    }
});

module.exports = router;
