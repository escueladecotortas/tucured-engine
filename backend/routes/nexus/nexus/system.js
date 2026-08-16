const express = require('express');
const router = express.Router();
const { admin, db } = require('../../firebase-admin');

// System Health Endpoint
router.get('/sinstatus', (req, res) => {
    const memUsage = process.memoryUsage();
    res.json({
        online: true,
        uptime: process.uptime(),
        memory: {
            rss: Math.round(memUsage.rss / 1024 / 1024),
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024)
        },
        services: { database: db ? 'connected' : 'disconnected', scraper: 'active', orchestrator: 'idle' },
        activeProcesses: Math.floor(Math.random() * 5) + 1
    });
});

// Emergency Flush
router.post('/flush', async (req, res) => {
    if (!db) {
        return res.status(503).json({ error: "Base de datos desconectada (Modo Offline)" });
    }
    try {
        const snapshot = await db.collection('agents').where('status', '==', 'working').get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.update(doc.ref, { status: 'idle', current_task: null }));
        await batch.commit();

        await db.collection('nexus_activity').add({
            type: 'system_flush', agent: 'cyborg_admin',
            description: `EMERGENCY FLUSH: Reset ${snapshot.size} agents.`,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        res.json({ success: true, message: "Systems Flushed." });
    } catch (error) { res.status(500).json({ error: "Flush protocol failed" }); }
});

module.exports = router;
