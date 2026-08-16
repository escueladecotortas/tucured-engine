import React, { useState, useEffect } from 'react';
import { Database, Download, RefreshCw, HardDrive, ShieldCheck, Activity } from 'lucide-react';

const DatabaseStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastBackup, setLastBackup] = useState(null);

    // Mock Data for Prototype (Would fetch from /api/system_stats)
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setStats({
                collections: {
                    agents: 14,
                    clients: 4,
                    nexus_activity: 25,
                    tasks: 12,
                    projects: 3,
                    knowledge_base: 45
                },
                size: "1.2 MB",
                indexes: "Optimized",
                readsToday: 1240,
                writesToday: 350
            });
            setLastBackup("2026-02-01 22:30:00");
        }, 1000);
    }, []);

    const handleBackup = () => {
        setLoading(true);
        // Call backend API to run analyzeDB.js
        setTimeout(() => {
            setLoading(false);
            setLastBackup(new Date().toLocaleString());
            alert("Backup Completo Realizado en /backups");
        }, 2000);
    };

    const handleSync = () => {
        setLoading(true);
        // Call backend API to run sync_agents.js
        setTimeout(() => {
            setLoading(false);
            alert("Agentes Sincronizados (Local -> Nube)");
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col bg-black/40 backdrop-blur-md p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-widest flex items-center gap-3">
                        <Database className="w-8 h-8 text-emerald-400" />
                        NEXUS DATABASE CORE
                    </h2>
                    <p className="text-white/40 mt-1 font-mono">Firestore v5.1 Normalized • Soberanía Digital Activa</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSync}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/50 text-blue-300 rounded-lg flex items-center gap-2 transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Sync Agentes
                    </button>
                    <button
                        onClick={handleBackup}
                        disabled={loading}
                        className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/50 text-emerald-300 rounded-lg flex items-center gap-2 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Backup Ahora
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <HardDrive className="w-5 h-5 text-purple-400" />
                        <span className="text-white/60 font-semibold uppercase text-xs tracking-wider">Storage</span>
                    </div>
                    <div className="text-3xl font-mono text-white">{stats?.size || "..."}</div>
                    <div className="text-xs text-white/30 mt-2">Último snapshot: {lastBackup || "N/A"}</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-orange-400" />
                        <span className="text-white/60 font-semibold uppercase text-xs tracking-wider">Tráfico Hoy</span>
                    </div>
                    <div className="flex gap-4 text-white font-mono">
                        <div>
                            <span className="text-2xl text-emerald-400">{stats?.readsToday || "..."}</span>
                            <span className="text-xs text-white/30 block">Reads</span>
                        </div>
                        <div>
                            <span className="text-2xl text-rose-400">{stats?.writesToday || "..."}</span>
                            <span className="text-xs text-white/30 block">Writes</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-5 h-5 text-cyan-400" />
                        <span className="text-white/60 font-semibold uppercase text-xs tracking-wider">Estado</span>
                    </div>
                    <div className="text-2xl font-bold text-white">NOMINAL</div>
                    <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Secure Mode Active
                    </div>
                </div>
            </div>

            {/* Collections Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1">
                <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4">
                    Estructura de Datos
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-white/70">
                        <thead className="text-white/40 font-mono text-xs uppercase bg-white/5">
                            <tr>
                                <th className="p-3 rounded-l-lg">Colección</th>
                                <th className="p-3">Docs (Aprox)</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3 rounded-r-lg">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats && Object.entries(stats.collections).map(([name, count]) => (
                                <tr key={name} className="hover:bg-white/5 transition-colors">
                                    <td className="p-3 font-mono text-blue-300">{name}</td>
                                    <td className="p-3">{count}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs border border-emerald-500/30">
                                            Active
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button className="text-white/40 hover:text-white transition-colors">Explorer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DatabaseStats;
