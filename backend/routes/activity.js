const express = require("express");
const router = express.Router();
const { admin, db } = require('../firebase-admin');

// POST /api/activity/log - Registrar actividad
router.post("/log", async (req, res) => {
    try {
        const { type, message, details, agent, metadata } = req.body;

        if (!type || !message) {
            return res.status(400).json({ error: "type and message are required" });
        }

        if (!db) {
            return res.status(503).json({ error: "Base de datos desconectada (Modo Offline)" });
        }

        const activityRef = await db.collection("activity").add({
            type, // project_created, mission_approved, chat_message, etc
            message,
            details: details || null,
            agent: agent || 'system',
            metadata: metadata || {},
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({
            success: true,
            activityId: activityRef.id,
            message: "Activity logged successfully"
        });
    } catch (error) {
        console.error("Activity Log Error:", error);
        res.status(500).json({ error: "Failed to log activity" });
    }
});

// GET /api/activity/recent - Obtener actividad reciente
router.get("/recent", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;

        if (!db) {
            return res.status(503).json({ error: "Base de datos desconectada (Modo Offline)" });
        }

        const snapshot = await db.collection("activity")
            .orderBy("timestamp", "desc")
            .limit(limit)
            .get();

        const activities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json({ activities });
    } catch (error) {
        console.error("Get Activities Error:", error);
        res.status(500).json({ error: "Failed to fetch activities" });
    }
});

module.exports = router;
