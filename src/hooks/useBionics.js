// Archivo: src/hooks/useBionics.js
// Hook de Biónica Visual con soporte de captura heurística y trace en vivo

import { useState } from 'react';

export function useBionics(projectId = 'tucu-red') {
    const [url, setUrl] = useState('http://localhost:5005');
    const [loading, setLoading] = useState(false);
    const [auditData, setAuditData] = useState(null);
    const [error, setError] = useState(null);
    const [logs, setLogs] = useState(["[SYSTEM] Bionic Auditor Online // Nexus OS v11.1"]);

    const addLog = (msg) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 8)]);
    };

    const handleCapture = async () => {
        if (!url) return;
        addLog(`Iniciando escaneo biónico para: ${url}`);
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/vision/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, projectId: projectId || 'tucu-red' })
            });

            const data = await res.json();
            if (data.success && data.audit) {
                addLog(`Auditoría finalizada. Score: ${data.audit.score}/100 [${data.audit.health}]`);
                addLog(`Latencia TTFB: ${data.audit.metrics?.ttfb}ms | Nodos DOM: ${data.audit.metrics?.domNodes}`);
                setAuditData({
                    screenshot: data.screenshot,
                    score: data.audit.score,
                    health: data.audit.health,
                    metrics: data.audit.metrics || {},
                    logs: data.audit.logs || [],
                    issues: data.audit.issues || []
                });
            } else {
                const errMsg = data.error || 'Error desconocido';
                setError(errMsg);
                addLog(`ERROR: ${errMsg}`);
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
