// Archivo: frontend/src/components/cyborg-ops/ControlPanel.jsx
import React from 'react';
import { Server, Database, Brain, Globe, Shield, Trash2, RefreshCw } from 'lucide-react';

const ControlPanel = ({ stats, status, onFlush }) => {
    return (
        <div className="space-y-6">
            {/* Infrastructure Status */}
            <div className="bg-black/40 border border-zinc-800 rounded-xl p-6">
                <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4 flex items-center gap-2">
                    <Server className="w-3 h-3" /> Infrastructure
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <Database className="w-4 h-4 text-orange-400" />
                            <span>Firestore DB</span>
                        </div>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${stats?.services.database === 'connected' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                            {stats?.services.database.toUpperCase() || 'WAITING'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span>Scraper Node</span>
                        </div>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <Brain className="w-4 h-4 text-purple-400" />
                            <span>Neuromorphic Core</span>
                        </div>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-500">v2.1</span>
                    </div>
                </div>
            </div>

            {/* Emergency Controls */}
            <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-6">
                <h4 className="text-xs font-bold text-red-400 uppercase mb-4 flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Danger Zone
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onFlush}
                        disabled={status !== 'active'}
                        className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        <Trash2 className="w-5 h-5" />
                        FLUSH SYSTEM
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg text-xs font-bold flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                        <RefreshCw className="w-5 h-5" />
                        HARD REBOOT
                    </button>
                </div>
                <div className="mt-3 text-[10px] text-red-500/60 text-center leading-tight">
                    Authorized personnel only. Use in case of agent loop or memory leak.
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
