// Archivo: src/hooks/useVaultBackup.js
// Hook de Respaldo Local-First de la Bóveda (Sin dependencias de Firestore Cloud)

import { useState } from 'react';

export function useVaultBackup(projectId = 'tucu-red') {
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [backupStatus, setBackupStatus] = useState(null); // 'success' | 'error'

    const handleBackup = async () => {
        setIsBackingUp(true);
        setBackupStatus(null);
        try {
            // 1. Obtener estadísticas reales del motor y base local
            let statsData = {};
            try {
                const res = await fetch('/api/tucu/stats');
                if (res.ok) statsData = await res.json();
            } catch (e) {
                console.warn('[useVaultBackup] Error leyendo stats:', e);
            }

            // 2. Construir Objeto de Respaldo Local-First
            const backupPayload = {
                meta: {
                    kernel: 'Nexus OS v11.1',
                    engine: 'Tucu Red Generation Engine v10.0',
                    projectId: projectId,
                    timestamp: new Date().toISOString(),
                    mode: 'LOCAL_FIRST_SSOT',
                    storage: 'data/db_dump.json'
                },
                system: {
                    uptimeSec: statsData.uptime || 0,
                    memory: statsData.memory || {},
                    environment: 'local'
                },
                data: {
                    stats: statsData,
                    exportedAt: new Date().toLocaleString('es-AR')
                }
            };

            // 3. Generar archivo JSON y disparar descarga en cliente
            const dataStr = JSON.stringify(backupPayload, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `nexus_backup_${projectId}_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setBackupStatus('success');
            setTimeout(() => setBackupStatus(null), 4000);
            return { success: true };
        } catch (error) {
            console.error("[useVaultBackup] Fallo en respaldo:", error);
            setBackupStatus('error');
            return { success: false, error: error.message };
        } finally {
            setIsBackingUp(false);
        }
    };

    return { isBackingUp, backupStatus, handleBackup };
}
