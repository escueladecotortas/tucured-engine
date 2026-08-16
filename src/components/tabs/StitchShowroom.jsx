import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Zap } from 'lucide-react';

export default function StitchShowroom() {
    const [isLoading, setIsLoading] = useState(true);
    const SHOWROOM_URL = 'http://localhost:3000/stitch-library';

    const handleReload = () => {
        setIsLoading(true);
        const iframe = document.getElementById('stitch-showroom-frame');
        if (iframe) iframe.src = SHOWROOM_URL;
    };

    return (
        <div className="flex flex-col h-full bg-[#0F172A] relative overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            
            {/* Header / StatusBar */}
            <div className="h-12 bg-slate-900 border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-400">FACTORY_LINK_ACTIVE</span>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-indigo-400" />
                        Renderizando desde <strong>Tucu-Red Core</strong>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleReload}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Recargar Arsenal"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <a 
                        href={SHOWROOM_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Abrir en pestaña nueva"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Iframe Content */}
            <div className="flex-1 relative bg-black">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-0">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                            <p className="text-xs text-indigo-400 font-mono tracking-widest animate-pulse">ESTABLECIENDO ENLACE NEURAL...</p>
                        </div>
                    </div>
                )}
                
                <iframe
                    id="stitch-showroom-frame"
                    src={SHOWROOM_URL}
                    className="w-full h-full border-0 relative z-10"
                    onLoad={() => setIsLoading(false)}
                    allow="clipboard-write"
                />
            </div>
        </div>
    );
}
