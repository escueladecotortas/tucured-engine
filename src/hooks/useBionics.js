// Archivo: frontend/src/hooks/useBionics.js
import { useState } from 'react';

export function useBionics(projectId) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [auditData, setAuditData] = useState(null);
    const [error, setError] = useState(null);
    const [logs, setLogs] = useState(["[SYSTEM] Bionic Auditor Online."]);

    const addLog = (msg) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 7)]);
    };

    const handleCapture = async () => {
        if (!url) return;
        addLog(`Initiating deep scan for ${url}...`);
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/vision/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, projectId: projectId || 'general' })
            });

            const data = await res.json();
            if (data.success) {
                addLog("Data packet retrieved. Calculating scores...");
                setAuditData({
                    screenshot: data.screenshot,
                    ...data.audit
                });
                addLog(`Audit finished. Score: ${data.audit.score}`);
            } else {
                setError(data.error);
                addLog(`ERROR: ${data.error}`);
            }
        } catch (e) {
            setError(e.message);
            addLog(`CRITICAL: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        url,
        setUrl,
        loading,
        auditData,
        error,
        logs,
        handleCapture
    };
}
