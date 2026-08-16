// Archivo: backend/services/ProjectShield.js
const fs = require('fs');
const path = require('path');
const achievementService = require('./AchievementService');
const utils = require('./ShieldUtils');

/**
 * ProjectShield.js (v2.0) - SANEADO 2026
 * El Guardián de la Verdad de NEXUS-OS.
 * Cumple con la Ley de 200 líneas mediante delegación en ShieldUtils.
 */
class ProjectShield {
    constructor() {
        this.baseDir = path.resolve(__dirname, '../../nexus_archives');
        this.maxBackups = 10;
    }

    async createSnapshot(projectId, reason = 'auto') {
        const projectPath = path.join(this.baseDir, projectId);
        const projectBackupsDir = path.join(this.baseDir, '.shield', projectId);
        
        if (!fs.existsSync(projectPath)) throw new Error(`[Shield] Ruta no encontrada: ${projectId}`);
        if (!fs.existsSync(projectBackupsDir)) fs.mkdirSync(projectBackupsDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const snapshotDir = path.join(projectBackupsDir, `${timestamp}_${reason}`);

        try {
            fs.cpSync(projectPath, snapshotDir, { 
                recursive: true,
                filter: (src) => {
                    const rel = path.relative(projectPath, src);
                    if (!rel) return true;
                    const forbidden = ['node_modules', '.git', 'nexus_archives', '.shield', 'logs'];
                    return !rel.replace(/\\/g, '/').split('/').some(p => forbidden.includes(p));
                }
            });
            
            const stats = utils.getFolderStats(snapshotDir);
            const manifest = {
                id: timestamp, reason, timestamp: new Date().toISOString(),
                stats, title: reason.includes('manual') ? 'Snap de Seguridad Manual' : `Acción: ${reason}`,
                description: `Copia integral de ${projectId}. Resguarda ${stats.files} archivos.`
            };
            
            fs.writeFileSync(path.join(snapshotDir, 'shield-manifest.json'), JSON.stringify(manifest, null, 2));
            achievementService.addAchievement('Shield', 'BACKUP', `Snapshot: ${manifest.title}`, projectId);
            utils.purgeOldBackups(projectBackupsDir, this.maxBackups);
            
            return { success: true, versionId: timestamp, path: snapshotDir, manifest };
        } catch (err) {
            console.error(`❌ [Shield] Backup failed:`, err.message);
            throw err;
        }
    }

    async restoreSnapshot(projectId, versionId) {
        const projectPath = path.join(this.baseDir, projectId);
        const projectBackupsDir = path.join(this.baseDir, '.shield', projectId);
        const snapshotDir = fs.readdirSync(projectBackupsDir).find(dir => dir.startsWith(versionId));

        if (!snapshotDir) throw new Error(`[Shield] Versión ${versionId} no encontrada.`);
        const snapshotPath = path.join(projectBackupsDir, snapshotDir);

        try {
            await this.createSnapshot(projectId, 'pre-restore-safety');
            fs.readdirSync(projectPath).forEach(file => {
                if (file !== '.backups') fs.rmSync(path.join(projectPath, file), { recursive: true, force: true });
            });
            fs.cpSync(snapshotPath, projectPath, { recursive: true });
            achievementService.addAchievement('Shield', 'RESTORE', `Restauración a ${versionId}`, projectId);
            return { success: true };
        } catch (err) {
            console.error(`❌ [Shield] Restore failed:`, err.message);
            throw err;
        }
    }

    listSnapshots(projectId) {
        const dir = path.join(this.baseDir, '.shield', projectId);
        if (!fs.existsSync(dir)) return [];

        return fs.readdirSync(dir).map(name => {
            const manifestPath = path.join(dir, name, 'shield-manifest.json');
            let manifest = null;
            try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (e) {}
            return {
                id: name.split('_')[0], versionId: name.split('_')[0],
                reason: name.split('_')[1] || 'auto', manifest
            };
        }).sort((a, b) => b.id.localeCompare(a.id));
    }
}

module.exports = new ProjectShield();
