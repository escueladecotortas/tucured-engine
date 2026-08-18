// Archivo: src/components/tabs/bionics/AuditVisor.jsx
// Visor Biónico Responsivo con Navegador Simulado (Desktop / Mobile)

import React, { useState } from 'react';
import { Monitor, Smartphone, ExternalLink, RefreshCw, Lock, AlertCircle } from 'lucide-react';

export function AuditVisor({ url = 'http://localhost:5005', screenshot }) {
    const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'
    const [iframeKey, setIframeKey] = useState(0);
    const [hasLoadError, setHasLoadError] = useState(false);

    const isHttps = url.startsWith('https://');
    const targetUrl = url.startsWith('http') ? url : `http://${url}`;

    const handleRefresh = () => {
        setIframeKey(prev => prev + 1);
        setHasLoadError(false);
    };

    return (
        <div className="bg-black/60 rounded-2xl border border-white/10 overflow-hidden shadow-2xl h-full flex flex-col font-mono">
            {/* Browser Header Bar */}
            <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center text-xs gap-3">
                <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>

                {/* Simulated URL Bar */}
                <div className="flex-1 max-w-md bg-black/60 border border-white/10 rounded-lg px-3 py-1 flex items-center gap-2 text-[11px] text-gray-300 truncate">
                    <Lock className={`w-3 h-3 shrink-0 ${isHttps ? 'text-emerald-400' : 'text-yellow-400'}`} />
                    <span className="truncate">{targetUrl}</span>
                </div>

                {/* Controls & Responsive Switcher */}
                <div className="flex items-center gap-2">
                    <div className="bg-black/40 border border-white/10 rounded-lg p-0.5 flex gap-1">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={`p-1.5 rounded-md transition-all cursor-pointer ${
                                viewMode === 'desktop' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-gray-400 hover:text-white'
                            }`}
                            title="Vista Desktop (100%)"
                        >
                            <Monitor className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={`p-1.5 rounded-md transition-all cursor-pointer ${
                                viewMode === 'mobile' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-gray-400 hover:text-white'
                            }`}
                            title="Vista Mobile (375px)"
                        >
                            <Smartphone className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        title="Recargar Vista"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <a
                        href={targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        title="Abrir en pestaña externa"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            {/* Viewport Container */}
            <div className="flex-1 bg-slate-950/80 p-3 overflow-hidden flex items-center justify-center relative">
                <div className={`h-full transition-all duration-300 flex flex-col ${
                    viewMode === 'mobile'
                        ? 'w-[375px] max-w-full rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden bg-white'
                        : 'w-full rounded-xl border border-white/10 shadow-lg overflow-hidden bg-white'
                }`}>
                    <iframe
                        key={iframeKey}
                        src={targetUrl}
                        title="Live Site Preview"
                        className="w-full h-full border-0 bg-white"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        onError={() => setHasLoadError(true)}
                    />
                </div>

                {hasLoadError && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 border border-yellow-500/40 text-yellow-300 text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xl pointer-events-none">
                        <AlertCircle className="w-3 h-3 text-yellow-400" />
                        <span>Si el sitio restringe iframes (X-Frame-Options), use el botón [↗️] para abrirlo.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
