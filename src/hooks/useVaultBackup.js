// Archivo: frontend/src/hooks/useVaultBackup.js
import { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Hook para gestionar los respaldos de la Bóveda (Vault)
 */
export function useVaultBackup(projectId) {
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [backupStatus, setBackupStatus] = useState(null); // 'success' | 'error'

    const handleBackup = async () => {
        setIsBackingUp(true);
        setBackupStatus(null);
        try {
            // 1. Obtener Datos de Misiones (Firestore)
            const tasksRef = collection(db, 'tasks');
            const q = query(tasksRef, where('projectId', '==', projectId));
            const snapshot = await getDocs(q);
            const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // 2. Construir Objeto de Respaldo
            const backupData = {
                meta: {
                    version: 'Nexus v5.4',
                    timestamp: new Date().toISOString(),
                    projectId: projectId,
                    user: 'Admin'
                },
                stats: {
                    total_tasks: tasks.length,
                    active_nodes: 1 // Placeholder dinámico
                },
                data: {
                    tasks: tasks,
                }
            };

            // 3. Generar Blob y Descargar
            const dataStr = JSON.stringify(backupData, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `nexus_backup_${projectId}_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setBackupStatus('success');
            setTimeout(() => setBackupStatus(null), 3000);
            return { success: true };
        } catch (error) {
            console.error("Error en respaldo:", error);
            setBackupStatus('error');
            return { success: false, error: error.message };
        } finally {
            setIsBackingUp(false);
        }
    };

    return {
        isBackingUp,
        backupStatus,
        handleBackup
    };
}
