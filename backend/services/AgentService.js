// Archivo: backend/services/AgentService.js
// Servicio de Orquestación y Runtimes de Agentes Inteligentes

const fs = require('fs');
const path = require('path');
const achievementService = require('./AchievementService');

class FallbackAgentRuntime {
    constructor(profile = {}) {
        this.id = profile.id || 'nexus';
        this.profile = profile;
        this.state = 'idle';
        this.tools = {};
        this.shortTermMemory = [];
    }

    async interact(message) {
        const text = `[${this.id.toUpperCase()}]: Procesado mensaje "${message?.substring(0, 30)}..."`;
        return {
            text,
            content: text,
            status: 'success'
        };
    }
}

class AgentService {
    constructor() {
        this.activeAgents = {};
        this.agentsConfig = {
            nexus: { id: 'nexus', name: 'Nexus Hub', role: 'Orquestador L1' },
            atenea: { id: 'atenea', name: 'Atenea', role: 'Arquitecta Visual' },
            codi: { id: 'codi', name: 'Codi', role: 'Ingeniero Constructor' },
            elara: { id: 'elara', name: 'Elara', role: 'Bibliotecaria Bóveda' },
            vitalis: { id: 'vitalis', name: 'Vitalis', role: 'Médico del Kernel' },
            argus: { id: 'argus', name: 'Argus', role: 'Gatekeeper QA' },
            kael: { id: 'kael', name: 'Kael', role: 'DevOps & Shell' },
            icaro: { id: 'icaro', name: 'Icaro', role: 'Estratega de Conversión' },
            lorem: { id: 'lorem', name: 'Lorem', role: 'Brand Voice' }
        };
        this.init();
    }

    init() {
        Object.values(this.agentsConfig).forEach(profile => {
            this.activeAgents[profile.id] = new FallbackAgentRuntime(profile);
        });
    }

    setSocket(io) {
        this.io = io;
    }

    async interact(agentId, message, history, projectId) {
        let runtime = this.activeAgents[agentId] || new FallbackAgentRuntime({ id: agentId });
        const result = await runtime.interact(message);
        if (projectId) {
            achievementService.addAchievement(agentId, 'MILESTONE', `Task: ${message.substring(0, 30)}`, projectId);
        }
        return {
            text: result.text || result.content || '',
            content: result.content || result.text || '',
            status: result.status || 'success'
        };
    }
}

module.exports = new AgentService();