// Archivo: frontend/src/components/tabs/bionics/BionicsHeader.jsx
import React from 'react';
import { ScanEye, Globe, Zap, Loader2, Terminal } from 'lucide-react';

export function BionicsHeader({ url, onUrlChange, loading, onCapture, logs }) {
    return (
        <div className="grid grid-cols-12 gap-6 shrink-0">
            <section className="col-span-12 lg:col-span-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <ScanEye size={120} className="text-cyan-500" />
                </div>
                
                <h2 className="text-2xl font-serif font-bold text-white mb-2 flex items-center gap-3">
                    <ScanEye className="text-cyan-400" /> NEXUS <span className="text-gray-500">Vision</span>
                </h2>
                <p className="text-xs text-gray-500 font-mono mb-6 uppercase tracking-widest">Auditoría de Activos y Salud Digital</p>
                
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input 
                            type="url" 
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => onUrlChange(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-mono text-sm focus:border-cyan-500/50 outline-none transition-all"
                        />
                    </div>
                    <button 
                        type="button"
                        onClick={onCapture}
                        disabled={loading || !url}
                        className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                            loading ? 'bg-gray-800 text-gray-500 cursor-wait' : 'bg-cyan-500 text-black hover:scale-105 active:scale-95'
                        }`}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {loading ? 'AUDITANDO...' : 'INICIAR AUDITORÍA'}
                    </button>
                </div>
            </section>

            <aside className="col-span-12 lg:col-span-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-inner">
                <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Terminal size={12} /> Live Trace
                </h3>
                <div className="font-mono text-[9px] h-28 space-y-1 overflow-hidden">
                    {logs.map((log, i) => (
                        <div key={i} className={`p-1 border-l border-white/5 ${i === 0 ? 'text-white' : 'text-gray-600'}`}>
                            {log}
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}
