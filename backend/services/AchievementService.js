const fs = require('fs');
const path = require('path');

/**
 * AchievementService.js (v1.0)
 * Rastreador de progresos "Pro Plus" para la Intranet de Leo.
 */
class AchievementService {
    constructor() {
        this.currentSessionAchievements = [];
    }

    addAchievement(agentId, type, description, projectId) {
        const achievement = {
            timestamp: new Date().toISOString(),
            agentId,
            type, // 'BACKUP', 'EDIT', 'STRATEGY', 'MILESTONE'
            description,
            projectId
        };
        this.currentSessionAchievements.push(achievement);
        console.log(`🏆 [Achievement] ${type}: ${description} (${agentId})`);
    }

    getSummary() {
        if (this.currentSessionAchievements.length === 0) return "No se registraron hitos específicos en esta micro-sesión.";
        
        return this.currentSessionAchievements.map(a => 
            `- [${a.type}] ${a.agentId}: ${a.description} en [${a.projectId}]`
        ).join('\n');
    }

    getAchievements(projectId) {
        const dir = path.join(__dirname, `../../nexus_archives/${projectId}/logs`);
        if (!fs.existsSync(dir)) return [];

        const files = fs.readdirSync(dir).filter(f => f.startsWith('achievements_') && f.endsWith('.json'));
        let allAchievements = [];

        files.forEach(file => {
            try {
                const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
                allAchievements = [...allAchievements, ...data];
            } catch (e) {
                console.error(`Error reading achievement file ${file}:`, e.message);
            }
        });

        // Sort by timestamp descending
        return allAchievements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    saveSessionAchievements(projectId) {
        const dir = path.join(__dirname, `../../nexus_archives/${projectId}/logs`);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const filePath = path.join(dir, `achievements_${new Date().toISOString().split('T')[0]}.json`);
        
        let existing = [];
        if (fs.existsSync(filePath)) {
            existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        const updated = [...existing, ...this.currentSessionAchievements];
        fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
        
        // Reset local for next session context if needed
        this.currentSessionAchievements = [];
    }
}

module.exports = new AchievementService();
