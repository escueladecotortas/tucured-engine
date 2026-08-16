// Archivo: frontend/src/components/CyborgOps.jsx
import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Sub-componentes Atómicos (Ley de 200 líneas)
import SystemGauge from './cyborg-ops/SystemGauge';
import NeuralStream from './cyborg-ops/NeuralStream';
import ControlPanel from './cyborg-ops/ControlPanel';

/**
 * CyborgOps - Centro de Operaciones del Sistema NEXUS
 * Refactorizado para cumplir con la Ley de 200 líneas.
 */
export default function CyborgOps() {
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [status, setStatus] = useState('active');

    // Poll System Status
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/nexus/sinstatus');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (e) { console.error("Status Poll Failed", e); }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    // Live Logs (Firestore)
    useEffect(() => {
        const q = query(collection(db, 'nexus_activity'), orderBy('timestamp', 'desc'), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setLogs(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            })));
        });
        return () => unsubscribe();
    }, []);

    const handleFlush = async () => {
        if (!confirm("⚠️ ¿ESTÁS SEGURO? Esto reiniciará todos los agentes y borrará cachés temporales.")) return;
        setStatus('flushing');
        try {
            const res = await fetch('/api/nexus/flush', { method: 'POST' });
            const data = await res.json();
            if (data.success) alert("✅ SISTEMA PURGADO CORRECTAMENTE");
            else alert("❌ ERROR AL PURGAR");
        } catch (e) { alert("Error de conexión"); }
        setStatus('active');
    };

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-0">
            {/* LEFT COLUMN: Vitals & Controls */}
            <div className="lg:col-span-4 space-y-6">
                {/* System Health Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-emerald-400 font-mono text-sm tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4" /> VITAL SIGNS
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-xs text-emerald-500 font-bold">ONLINE</span>
                        </div>
                    </div>

                    {stats ? (
                        <div className="flex justify-between px-2">
                            <SystemGauge label="CPU LOAD" value={(stats.activeProcesses * 10) + Math.random() * 10} color="emerald" />
                            <SystemGauge label="MEMORY" value={stats.memory.heapUsed} max={500} unit="MB" color="blue" />
                            <SystemGauge label="UPTIME" value={stats.uptime % 100} max={100} unit="Cycle" color="purple" />
                        </div>
                    ) : (
                        <div className="h-20 flex items-center justify-center text-zinc-500 text-xs animate-pulse">Establishing Uplink...</div>
                    )}
                </div>

                <ControlPanel stats={stats} status={status} onFlush={handleFlush} />
            </div>

            {/* RIGHT COLUMN: Neural Stream */}
            <NeuralStream logs={logs} />
        </div>
    );
}
