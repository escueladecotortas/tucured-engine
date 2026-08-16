const fs = require('fs');
const path = require('path');
const AgentRuntime = require('../../system_core/AgentRuntime');
const aiService = require('./aiService'); 
const projectShield = require('./ProjectShield');
const achievementService = require('./AchievementService');

// 🔌 [NEXUS CORE FIX] Importación de herramientas físicas
const FileSystemTools = require('./tools/FileSystemTools'); 

class AgentService {
    constructor() {
        this.activeAgents = {};
        this.agentsConfig = {};
        this.agentsDir = path.join(__dirname, '../../system_core/agents');
        
        // Instancia única de herramientas para compartir entre agentes
        this.fsTools = new FileSystemTools(); 
        
        this.init();
    }

    init() {
        this.loadAgents();
    }

    setSocket(io) {
        this.io = io;
        console.log("🔌 [AgentService] Socket.io linked for Live State.");
        Object.values(this.activeAgents).forEach(runtime => {
            runtime.onStateChange = (state) => {
                this.io.emit('agent:state', { id: runtime.id, state: state });
            };
        });
    }

    /**
     * Vincula físicamente las herramientas al runtime del agente.
     */
    _linkTools(runtime) {
        if (runtime && !runtime.tools.fileSystem) {
            runtime.tools = {
                fileSystem: this.fsTools
            };
            console.log(`🛠️ [AgentService] Herramientas vinculadas a: ${runtime.id}`);
        }
    }

    loadAgents() {
        try {
            if (!fs.existsSync(this.agentsDir)) {
                console.error("❌ Agents directory not found:", this.agentsDir);
                return;
            }

            const getAllFiles = (dirPath, arrayOfFiles) => {
                const files = fs.readdirSync(dirPath);
                arrayOfFiles = arrayOfFiles || [];
                files.forEach((file) => {
                    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
                    } else if (file.endsWith('.json')) {
                        arrayOfFiles.push(path.join(dirPath, "/", file));
                    }
                });
                return arrayOfFiles;
            };

            const jsonFiles = getAllFiles(this.agentsDir);
            jsonFiles.forEach(filePath => {
                const content = fs.readFileSync(filePath, 'utf8');
                const profile = JSON.parse(content);
                const runtime = new AgentRuntime(profile);
                
                // Inyectamos herramientas al cargar
                this._linkTools(runtime);
                
                this.activeAgents[profile.id] = runtime;
                this.agentsConfig[profile.id] = profile;
                console.log(`🤖 [PRO PLUS] Agent Loaded: ${profile.id}`);
            });

            console.log(`✅ [Orchestrator] System Ready. ${Object.keys(this.activeAgents).length} agents loaded.`);
        } catch (error) {
            console.error("❌ Error loading agents:", error);
        }
    }

    async interact(agentId, message, history, projectId) {
        let runtime = this.activeAgents[agentId];
        
        if (!runtime) {
            const profile = this.agentsConfig[agentId];
            if (profile) {
                runtime = new AgentRuntime(profile);
                this.activeAgents[agentId] = runtime;
            } else {
                throw new Error(`Agent ${agentId} not active.`);
            }
        }

        // Asegurar vinculación antes de cada interacción (Safe-check)
        this._linkTools(runtime);

        // Context Injection
        let contextMessage = message;
        if (projectId) {
            const managers = ['tucu-red', 'atlas', 'deco-tortas', 'licitia'];
            const activeManager = managers.find(m => projectId.includes(m)) || 'Nexus Hub';
            contextMessage = `[CONTEXT]: Proj: ${projectId} | Manager: ${activeManager} | Role: ${agentId}. Dir: "${message}"`;
        }

        const result = await runtime.interact(contextMessage, projectId);

        if (result && !result.error && projectId) {
            achievementService.addAchievement(agentId, 'MILESTONE', `Task: ${message.substring(0, 30)}`, projectId);
            achievementService.saveSessionAchievements(projectId);
        }

        return result;
    }

    getAgentsList() {
        return Object.values(this.agentsConfig).map(a => ({ id: a.id, name: a.name || a.id, role: a.role }));
    }

    getAgentState(agentId) {
        const runtime = this.activeAgents[agentId];
        if (!runtime) return null;
        return { id: runtime.id, state: runtime.state, memory: runtime.shortTermMemory, profile: runtime.profile };
    }
}

module.exports = new AgentService();