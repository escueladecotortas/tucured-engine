// Archivo: frontend/src/hooks/useShieldData.js
import { useState, useEffect } from 'react';

/**
 * Hook para gestionar los snapshots y backups del Escudo (Shield)
 */
export function useShieldData(projectId) {
    const [snapshots, setSnapshots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restoring, setRestoring] = useState(null); // snapshot id
    const [backingUp, setBackingUp] = useState(false);

    const fetchSnapshots = async () => {
        if (!projectId) return;
        try {
            setLoading(true);
            const res = await fetch(`/api/shield/snapshots/${projectId}`);
            const data = await res.json();
            if (data.success) {
                setSnapshots(data.snapshots.reverse()); // Newest first
            }
        } catch (e) {
            console.error("Error fetching snapshots:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSnapshots();
    }, [projectId]);

    const handleBackup = async (reason = 'Manual Console Backup') => {
        setBackingUp(true);
        try {
            const res = await fetch('/api/shield/backup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, reason })
            });
            const data = await res.json();
            if (data.success) {
                await fetchSnapshots();
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (e) {
            console.error("Backup failed:", e);
            return { success: false, error: e.message };
        } finally {
            setBackingUp(false);
        }
    };

    const handleRestore = async (versionId) => {
        setRestoring(versionId);
        try {
            const res = await fetch('/api/shield/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, versionId })
            });
            const data = await res.json();
            if (data.success) {
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (e) {
            console.error("Restore failed:", e);
            return { success: false, error: e.message };
        } finally {
            setRestoring(null);
        }
    };

    return {
        snapshots,
        loading,
        restoring,
        backingUp,
        handleBackup,
        handleRestore,
        refresh: fetchSnapshots
    };
}
