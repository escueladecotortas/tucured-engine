const express = require('express');
const router = express.Router();
const aiService = require('../../services/aiService');
const { admin, db } = require('../../firebase-admin');
const crypto = require('crypto');
const executionEngine = require('../../services/ExecutionEngine');

// Protocol 11: Intelligent Project Proposal
router.post('/propose-project', async (req, res) => {
    const { intent, category } = req.body;
    if (!intent) return res.status(400).json({ error: "Intent is required" });

    const cacheKey = crypto.createHash('md5').update(`${intent.trim().toLowerCase()}-${(category || 'general').trim().toLowerCase()}`).digest('hex');
    const cacheRef = db ? db.collection('nexus_cache').doc(cacheKey) : null;

    try {
        if (db && cacheRef) {
            const cacheDoc = await cacheRef.get();
            if (cacheDoc.exists && (Date.now() - cacheDoc.data().timestamp.toDate().getTime()) / (1000 * 60 * 60) < 24) {
                return res.json(cacheDoc.data().proposal);
            }
        }
    } catch (e) { console.warn("Cache check failed", e.message); }

    const PROPOSE_PROMPT = `
Eres NEXUS. Basándote en la Numerología del 11 (Maestría/Conexión) y el Diseño Humano 2/4 (Red Natural), propone la identidad de un nuevo proyecto.
El usuario tiene esta intención: "${intent}" en la categoría: "${category}".
DEBES DEVOLVER UN JSON ÚNICAMENTE: { "name": "...", "slogan": "...", "recommendedColor": "#hex", "justification": "...", "missions": [] }
`;
    try {
        const proposal = await aiService.generateJSON(`${PROPOSE_PROMPT}\n\nINTENCIÓN: ${intent}`);
        if (db && cacheRef) {
            await cacheRef.set({ proposal, timestamp: admin.firestore.FieldValue.serverTimestamp(), intent, category });
        }
        res.json(proposal);
    } catch (error) {
        res.status(error.status === 429 ? 429 : 500).json({ error: "Fallo en la generación de propuesta." });
    }
});

// Protocol: Approval Workflow
router.post('/approve-item', async (req, res) => {
    const { approvalId, action, projectId, actor = 'user' } = req.body;
    if (!approvalId || !action) return res.status(400).json({ error: "Missing approval ID or action" });

    if (!db) {
        return res.status(503).json({ error: "Base de datos desconectada (Modo Offline)" });
    }

    try {
        const approvalRef = db.collection('approvals').doc(approvalId);
        let newStatus = action === 'approve' ? 'approved' : (action === 'reject' ? 'rejected' : 'pending');

        await approvalRef.update({ status: newStatus, decisionAt: admin.firestore.FieldValue.serverTimestamp(), decidedBy: actor });
        const data = (await approvalRef.get()).data();

        await db.collection('nexus_activity').add({
            type: 'approval', agent: actor === 'nexus' ? 'nexus' : 'orion',
            description: `${actor === 'nexus' ? 'NEXUS' : 'Usuario'} ${action}ó: ${data.title}`,
            timestamp: admin.firestore.FieldValue.serverTimestamp(), projectId: projectId || 'general',
            status: 'success', actor
        });
        res.json({ message: `Item ${action} processed`, status: 'success' });
    } catch (error) { res.status(500).json({ error: "Fallo en la aprobación." }); }
});

router.post('/command', async (req, res) => {
    const { agentId, command, context, projectId } = req.body;
    if (!agentId || !command) return res.status(400).json({ error: "Agent ID and Command required" });

    try {
        const result = await executionEngine.executeCommand(agentId, command, context, projectId);
        res.json(result.error ? { response: `[SYSTEM ERROR]: ${result.error}`, status: 'error' } : result);
    } catch (error) { res.status(200).json({ response: `[CRITICAL FAILURE]: ${error.message}`, status: 'error' }); }
});

router.post('/ignite-mission', async (req, res) => {
    const { projectId, missionId, agentId } = req.body;
    if (!projectId || !missionId) return res.status(400).json({ error: "Missing ID" });

    if (!db) {
        return res.status(503).json({ error: "Base de datos desconectada (Modo Offline)" });
    }

    try {
        let mRef = db.collection('projects').doc(projectId).collection('missions').doc(missionId);
        let mDoc = await mRef.get();
        if (!mDoc.exists) { mRef = db.collection('tasks').doc(missionId); mDoc = await mRef.get(); }
        if (!mDoc.exists) return res.status(404).json({ error: "Misión no encontrada" });

        await mRef.update({ status: 'ignited', ignitedAt: admin.firestore.FieldValue.serverTimestamp() });
        const targetAgentId = agentId || 'nexus';
        let aRef = db.collection('projects').doc(projectId).collection('agents').doc(targetAgentId);
        if (!(await aRef.get()).exists) aRef = db.collection('agents').doc(targetAgentId);

        if ((await aRef.get()).exists) await aRef.update({ status: 'working', current_task: `Ejecutando: ${mDoc.data().title}` });

        executionEngine.igniteMission(missionId, projectId, targetAgentId).catch(console.error);
        res.json({ message: "Ignición completada.", status: 'ignited' });
    } catch (error) { res.status(500).json({ error: "Fallo en ignición." }); }
});

module.exports = router;
