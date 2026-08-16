const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const aiService = require('../../services/aiService');
const agentsDir = path.join(__dirname, '../../../system_core/agents');

// List all agents
router.get('/list', (req, res) => {
    try {
        if (!fs.existsSync(agentsDir)) return res.status(404).json({ error: "Agents directory not found" });
        const agents = fs.readdirSync(agentsDir)
            .filter(file => file.endsWith('.json'))
            .map(file => {
                try { return JSON.parse(fs.readFileSync(path.join(agentsDir, file), 'utf8')); }
                catch (e) { console.error(`Error parsing ${file}`, e); return null; }
            }).filter(Boolean);
        res.json(agents);
    } catch (error) { res.status(500).json({ error: "Failed to list agents" }); }
});

// Save Agent
router.post('/save', (req, res) => {
    const { agent } = req.body;
    if (!agent || !agent.id) return res.status(400).json({ error: "Invalid agent data" });
    try {
        if (!fs.existsSync(agentsDir)) fs.mkdirSync(agentsDir, { recursive: true });
        fs.writeFileSync(path.join(agentsDir, `${agent.id}.json`), JSON.stringify(agent, null, 2));
        res.json({ success: true, message: `Agent ${agent.id} saved` });
    } catch (error) { res.status(500).json({ error: "Failed to save agent" }); }
});

// Protocol 11: Intelligent Genesis (Agent Proposal)
router.post('/propose', async (req, res) => {
    const { intention, agentType, vibe } = req.body;
    if (!intention) return res.status(400).json({ error: "Intention is required." });

    let userProfile = {};
    const profilePath = path.join(__dirname, '../../../system_core/user_profile.json');
    if (fs.existsSync(profilePath)) {
        try { userProfile = JSON.parse(fs.readFileSync(profilePath, 'utf8')); }
        catch (e) { console.error("Failed to load user profile", e); }
    }

    const uDesign = userProfile.user?.human_design || {};
    const OBSERVER_PROMPT = `
Eres NEXUS, Maestro de Diseño Humano. Diseña un AGENTE que esté EN SINTONÍA KÁRMICA con el usuario.
USUARIO: ${userProfile.user?.name || 'Creador'} | DISEÑO: ${uDesign.type} (${uDesign.profile}).
INTENCIÓN: "${intention}" | TIPO: ${agentType || 'General'} | VIBRA: ${vibe || 'Auto'}.

DEBES DEVOLVER UN JSON ÚNICAMENTE:
{ "id": "...", "name": "...", "role": "...", "icon": "...", "color": "...", "bg": "...", "border": "...", "system_prompt": "...", "justification": "..." }
`;
    try {
        const proposal = await aiService.generateJSON(OBSERVER_PROMPT);
        res.json(proposal);
    } catch (error) { res.status(500).json({ error: "Fallo en la Matriz de Creación." }); }
});

module.exports = router;
