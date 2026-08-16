const fs = require('fs').promises;
const path = require('path');
const { db, admin } = require('../config/db');

/**
 * SafeWriteService.js (Tier 3: Infraestructura / Kael)
 * Protocolo de Seguridad Física para Escritura en Disco.
 * Implementa Backups preventivos, Cuarentena de 7 días y Verificación de Locks.
 */
class SafeWriteService {
    constructor() {
        this.backupDir = path.join(__dirname, '../backups');
        this.pendingCol = 'pending_changes';
        this.quarantineDays = 7;
    }

    /**
     * Verifica si el archivo está bloqueado o es inaccesible.
     */
    async _verifyFileLock(filePath) {
        try {
            // Verificamos permisos de lectura y escritura
            await fs.access(filePath, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch (e) {
            // Si el archivo no existe, no está bloqueado por permisos
            if (e.code === 'ENOENT') return true;
            console.error(`🛡️ [Kael] LOCK_DETECTADO en ${filePath}: ${e.message}`);
            return false;
        }
    }

    /**
     * Crea un backup preventivo antes de cualquier modificación.
     */
    async _createBackup(filePath) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const basename = path.basename(filePath);
        const backupPath = path.join(this.backupDir, `temp_${timestamp}_${basename}`);

        try {
            await fs.copyFile(filePath, backupPath);
            console.log(`🛡️ [Kael] Backup creado: ${backupPath}`);
            return backupPath;
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.warn(`🛡️ [Kael] Archivo nuevo (no requiere backup anterior): ${basename}`);
                return null;
            }
            throw new Error(`FALLO_BACKUP_CRÍTICO: ${e.message}`);
        }
    }

    /**
     * Script de limpieza de Cuarentena (7 días).
     * Elimina backups antiguos excepto los marcados como MILO_STONE.
     */
    async cleanupQuarantine() {
        console.log("🛡️ [Kael] Ejecutando limpieza de Cuarentena...");
        const files = await fs.readdir(this.backupDir);
        const now = Date.now();
        const maxAge = this.quarantineDays * 24 * 60 * 60 * 1000;

        for (const file of files) {
            // Ignorar archivos que contienen MILOS en su nombre (Hitos estratégicos)
            if (file.includes('MILOS')) continue;

            const filePath = path.join(this.backupDir, file);
            const stats = await fs.stat(filePath);
            
            if (now - stats.mtimeMs > maxAge) {
                await fs.unlink(filePath);
                console.log(`🗑️ [Kael] Archivo expirado eliminado: ${file}`);
            }
        }
    }

    /**
     * Prepara un cambio para revisión L0 (Safe-Write Staging).
     */
    async stageChange(filePath, newContent, metadata = {}) {
        const absolutePath = path.resolve(filePath);
        
        // 1. Verificar Locks
        const isSafe = await this._verifyFileLock(absolutePath);
        if (!isSafe) throw new Error("FILE_LOCKED_BY_OS");

        // 2. Crear Backup
        const backupPath = await this._createBackup(absolutePath);

        // 3. Registrar en Firestore (Hold Status)
        const changeDoc = {
            file_path: absolutePath,
            new_content: newContent,
            backup_path: backupPath,
            status: 'PENDING_APPROVAL',
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            agent: metadata.agent || 'UNKNOWN',
            reason: metadata.reason || 'Sugerencia de Evolución Bifröst',
            diff_preview: metadata.diff || 'No diff provided'
        };

        const res = await db.collection(this.pendingCol).add(changeDoc);
        console.log(`🛡️ [Kael] Propuesta de cambio registrada (ID: ${res.id})`);
        
        return { success: true, change_id: res.id, backup: backupPath };
    }

    /**
     * Ejecuta físicamente el cambio tras aprobación L0.
     */
    async commitChange(changeId) {
        const changeRef = db.collection(this.pendingCol).doc(changeId);
        const doc = await changeRef.get();

        if (!doc.exists || doc.data().status !== 'PENDING_APPROVAL') {
            throw new Error("CHANGE_NOT_FOUND_OR_ALREADY_PROCESSED");
        }

        const data = doc.data();
        
        try {
            // Verificación final de integridad física
            await this._verifyFileLock(data.file_path);
            
            await fs.writeFile(data.file_path, data.new_content, 'utf8');
            await changeRef.update({ 
                status: 'COMMITTED', 
                committed_at: admin.firestore.FieldValue.serverTimestamp() 
            });

            console.log(`✅ [Kael] SAFE_WRITE_COMPLETED en ${data.file_path}`);
            return { success: true };
        } catch (e) {
            console.error(`❌ [Kael] Error FATAL en Safe-Write: ${e.message}`);
            throw e;
        }
    }
}

module.exports = new SafeWriteService();
