// Archivo: backend/services/ShieldUtils.js
const fs = require('fs');
const path = require('path');

/**
 * UTILIDADES DE SHIELD (Vanguardia 2026)
 * Lógica de bajo nivel para gestión de archivos y estadísticas.
 */
class ShieldUtils {
    /**
     * Calcula estadísticas de una carpeta saltando dependencias pesadas.
     */
    getFolderStats(dirPath) {
        let size = 0;
        let files = 0;

        const getAllFiles = (dir) => {
            const list = fs.readdirSync(dir);
            list.forEach(file => {
                const filePath = path.join(dir, file);
                if (['node_modules', '.git', 'nexus_archives', '.shield'].includes(file)) return;

                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    getAllFiles(filePath);
                } else {
                    size += stat.size;
                    files++;
                }
            });
        };

        try { getAllFiles(dirPath); } catch (e) {}

        return {
            sizeBytes: size,
            sizeMB: (size / (1024 * 1024)).toFixed(2),
            files
        };
    }

    /**
     * Mantiene solo las últimas N versiones de backups.
     */
    purgeOldBackups(backupsDir, maxBackups) {
        if (!fs.existsSync(backupsDir)) return;
        
        const backups = fs.readdirSync(backupsDir)
            .map(name => ({
                name,
                time: fs.statSync(path.join(backupsDir, name)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        if (backups.length > maxBackups) {
            backups.slice(maxBackups).forEach(b => {
                fs.rmSync(path.join(backupsDir, b.name), { recursive: true, force: true });
                console.log(`🧹 [Shield] Purged old backup: ${b.name}`);
            });
        }
    }
}

module.exports = new ShieldUtils();
