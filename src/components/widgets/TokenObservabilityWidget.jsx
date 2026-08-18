// Archivo: src/components/widgets/TokenObservabilityWidget.jsx
import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Server, RefreshCw } from 'lucide-react';

const GROQ_LIMIT = 500000;
const GEMINI_ESTIMATED_LIMIT = 1000000;
const APIFY_LIMIT = 5.00;

export default function TokenObservabilityWidget({ vibe }) {
    const [usage, setUsage] = useState({
        groq: { used: 0, limit: GROQ_LIMIT, status: 'optimal' },
        gemini: { used: 0, limit: GEMINI_ESTIMATED_LIMIT, status: 'optimal' },
        apify: { used: 0, limit: APIFY_LIMIT, status: 'optimal' },
        totalTokens: 0, memoryRssMb: 0
    });
    const [loading, setLoading] = useState(false);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/nexus/metrics');
            if (res.ok) {
                const d = await res.json();
                const groq = d.tokenUsage?.groq || d.groq?.usedTokens || 0;
                const gemini = d.tokenUsage?.gemini || d.gemini?.usedTokens || 0;
                const apify = d.costs?.apify || d.apify?.usedCost || 0;
                const total = d.tokenUsage?.totalTokens || (groq + gemini);

                setUsage({
                    groq: { used: groq, limit: GROQ_LIMIT, status: groq > (GROQ_LIMIT * 0.8) ? 'warning' : 'optimal' },
                    gemini: { used: gemini, limit: GEMINI_ESTIMATED_LIMIT, status: gemini > (GEMINI_ESTIMATED_LIMIT * 0.8) ? 'warning' : 'optimal' },
                    apify: { used: apify, limit: APIFY_LIMIT, status: apify > (APIFY_LIMIT * 0.8) ? 'warning' : 'optimal' },
                    totalTokens: total, memoryRssMb: d.memory?.rssMb || 0
                });
            }
        } catch (e) { console.warn("Error en telemetría de tokens", e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMetrics(); }, []);

    const getBadgeStyle = (status) => {
        if (status === 'warning') return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
        if (status === 'critical') return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    };

    const getPercent = (used, limit) => Math.min(100, Math.max(2, Math.round((used / limit) * 100)));

    return (
        <div className="bg-[#0A0A1A]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono">
                        <Cpu className="w-4 h-4 text-indigo-400" /> Telemetría de Consumo IA
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">SISTEMA CORTEX • {usage.totalTokens.toLocaleString()} TOKENS PROCESADOS</p>
                </div>
                <button onClick={fetchMetrics} disabled={loading} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5 cursor-pointer" title="Actualizar Métricas en Vivo">
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 font-mono">
                {/* GROQ */}
                <MetricCard 
                    icon={<Zap className="w-4 h-4 text-orange-400" />} title="GROQ (Llama 3)"
                    status={usage.groq.status} badgeStyle={getBadgeStyle(usage.groq.status)}
                    value={`${(usage.groq.used / 1000).toFixed(1)}k`} max={`${(usage.groq.limit / 1000).toFixed(0)}k`}
                    percent={getPercent(usage.groq.used, usage.groq.limit)} color="bg-orange-400" subtitle="Tier Free"
                />

                {/* GEMINI */}
                <MetricCard 
                    icon={<Cpu className="w-4 h-4 text-blue-400" />} title="GEMINI PRO"
                    status={usage.gemini.status} badgeStyle={getBadgeStyle(usage.gemini.status)}
                    value={`${(usage.gemini.used / 1000).toFixed(1)}k`} max="tokens"
                    percent={getPercent(usage.gemini.used, usage.gemini.limit)} color="bg-blue-400" subtitle="Tier 1 Cloud"
                />

                {/* APIFY */}
                <MetricCard 
                    icon={<Server className="w-4 h-4 text-amber-400" />} title="APIFY SCRAPING"
                    status={usage.apify.status} badgeStyle={getBadgeStyle(usage.apify.status)}
                    value={`$${usage.apify.used.toFixed(2)}`} max={`$${usage.apify.limit.toFixed(2)} USD`}
                    percent={getPercent(usage.apify.used, usage.apify.limit)} color="bg-amber-500" subtitle="Monthly Credit"
                />
            </div>
        </div>
    );
}

function MetricCard({ icon, title, status, badgeStyle, value, max, percent, color, subtitle }) {
    return (
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 hover:border-white/15 transition-all">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">{icon}<span className="text-xs font-bold text-gray-200">{title}</span></div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${badgeStyle}`}>{status.toUpperCase()}</span>
            </div>
            <div className="mb-2">
                <p className="text-xl font-bold text-white leading-none">{value} <span className="text-xs text-gray-500 font-normal">/ {max}</span></p>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-1.5">
                <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-gray-500">
                <span>{percent}% consumo</span><span>{subtitle}</span>
            </div>
        </div>
    );
}
