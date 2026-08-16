import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Coins, Server, RefreshCw, AlertCircle } from 'lucide-react';

const TokenObservabilityWidget = ({ vibe }) => {
    // Estado inicial simulado (para ser reemplazado por context/Store real)
    const [usage, setUsage] = useState({
        groq: { used: 0, limit: 500000, resetsIn: '12h 45m', status: 'optimal' },
        gemini: { used: 0, limit: 'Ilimitado (Tier 1)', status: 'optimal' },
        apify: { used: 0, limit: 5.00, resetsIn: '3d 12h', status: 'warning' }
    });
    
    const [loading, setLoading] = useState(false);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/nexus/metrics');
            if (res.ok) {
                const data = await res.json();
                
                setUsage(prev => ({
                    ...prev,
                    groq: {
                        ...prev.groq,
                        used: data.groq?.usedTokens || 0,
                        status: (data.groq?.usedTokens || 0) > 400000 ? 'warning' : 'optimal'
                    },
                    gemini: {
                        ...prev.gemini,
                        used: data.gemini?.usedTokens || 0,
                        status: 'optimal'
                    },
                    apify: {
                        ...prev.apify,
                        used: data.apify?.usedCost || 0,
                        status: (data.apify?.usedCost || 0) > 4.5 ? 'warning' : 'optimal'
                    }
                }));
            }
        } catch (error) {
            console.error("Failed to fetch metrics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    // Color definitions based on status
    const getStatusColor = (status) => {
        if (status === 'warning') return 'text-amber-400';
        if (status === 'critical') return 'text-red-400';
        return 'text-emerald-400';
    };

    const getStatusBg = (status) => {
        if (status === 'warning') return 'bg-amber-500/20';
        if (status === 'critical') return 'bg-red-500/20';
        return 'bg-emerald-500/20';
    };

    const handleRefresh = () => {
        fetchMetrics();
    };

    return (
        <div className="bg-[#0A0A1A]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400" />
                        Observabilidad de Consumo IA
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">SISTEMA CORTEX - MONITOREO DE TOKENS</p>
                </div>
                <button 
                    onClick={handleRefresh}
                    disabled={loading}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors border border-white/5"
                    title="Actualizar Métricas"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                
                {/* GROQ Metrics */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-orange-400" />
                            <span className="text-xs font-bold text-gray-300">GROQ (Llama 3)</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBg(usage.groq.status)} ${getStatusColor(usage.groq.status)} border-current opacity-70`}>
                            {usage.groq.status.toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="mb-2">
                        <p className="text-2xl font-mono text-white leading-none">
                            {(usage.groq.used / 1000).toFixed(1)}k <span className="text-xs text-gray-500">/ {(usage.groq.limit / 1000).toFixed(0)}k</span>
                        </p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                        <div 
                            className="h-full bg-orange-400 rounded-full" 
                            style={{ width: `${(usage.groq.used / usage.groq.limit) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-[9px] text-gray-500 font-mono text-right">Reset: {usage.groq.resetsIn}</p>
                </div>

                {/* GEMINI Metrics */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold text-gray-300">GEMINI PRO</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBg(usage.gemini.status)} ${getStatusColor(usage.gemini.status)} border-current opacity-70`}>
                            {usage.gemini.status.toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="mb-2">
                        <p className="text-2xl font-mono text-white leading-none">
                            {(usage.gemini.used / 1000).toFixed(1)}k <span className="text-xs text-gray-500">Tokens</span>
                        </p>
                    </div>
                    
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-blue-400 rounded-full w-[15%]"></div>
                    </div>
                    <p className="text-[9px] text-gray-500 font-mono text-right">Límite: {usage.gemini.limit}</p>
                </div>

                {/* APIFY Metrics */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-gray-300">APIFY SCRAPING</span>
                        </div>
                        {usage.apify.status === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                    </div>
                    
                    <div className="mb-2">
                        <p className="text-2xl font-mono text-white leading-none">
                            ${usage.apify.used.toFixed(2)} <span className="text-xs text-gray-500">/ ${usage.apify.limit.toFixed(2)}</span>
                        </p>
                    </div>
                    
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2 relative">
                         <div 
                            className="h-full bg-amber-500 rounded-full transition-all" 
                            style={{ width: `${(usage.apify.used / usage.apify.limit) * 100}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-amber-500/70">CUOTA AL LÍMITE</span>
                        <span className="text-gray-500">Reset: {usage.apify.resetsIn}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TokenObservabilityWidget;
