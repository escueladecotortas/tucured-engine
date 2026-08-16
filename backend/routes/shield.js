const express = require('express');
const router = express.Router();
const projectShield = require('../services/ProjectShield');
const achievementService = require('../services/AchievementService');

/**
 * GET /api/shield/snapshots/:projectId
 * Lists available snapshots for a project.
 */
router.get('/snapshots/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const snapshots = projectShield.listSnapshots(projectId);
        res.json({ success: true, snapshots });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/shield/achievements/:projectId
 */
router.get('/achievements/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const achievements = achievementService.getAchievements(projectId);
        res.json({ success: true, achievements });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /api/shield/backup
 * Manual snapshot trigger.
 */
router.post('/backup', async (req, res) => {
    try {
        const { projectId, reason } = req.body;
        if (!projectId) return res.status(400).json({ success: false, error: 'ProjectId required.' });
        
        const result = await projectShield.createSnapshot(projectId, reason || 'manual');
        
        // Force save achievements to disk so the "BBDD" (JSON) is updated
        achievementService.saveSessionAchievements(projectId);
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /api/shield/restore
 * Reverts project to a specific version.
 */
router.post('/restore', async (req, res) => {
    try {
        const { projectId, versionId } = req.body;
        if (!projectId || !versionId) return res.status(400).json({ success: false, error: 'Project and Version required.' });
        
        const result = await projectShield.restoreSnapshot(projectId, versionId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
