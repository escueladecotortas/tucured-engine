// Archivo: frontend/src/components/leads/modal/EngineSelector.jsx
import React from 'react';

export function EngineSelector({ prospect, onSelect }) {
    const engines = [
        { id: "nexus-native", icon: "⚡", title: "Nexus Native", desc: "Motor local. Rápido. Directo.", badge: "~30s", badgeColor: "text-emerald-400 bg-emerald-500/10" },
        { id: "stitch-mcp", icon: "✦", title: "Stitch MCP", desc: "Google Stitch. Diseño premium.", badge: "~3min", badgeColor: "text-purple-400 bg-purple-500/10" }
    ];

    return (
        <div className="py-2">
            <div className="text-center mb-8">
                <div className="text-[10px] tracking-[0.2em] text-purple-400 uppercase mb-2">⚡ Neural Factory activada</div>
                <h2 className="text-2xl font-black text-white mb-1">{prospect?.name || "Cliente"}</h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest">Seleccioná el motor de forja</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {engines.map((eng) => (
                    <button 
                        key={eng.id} 
                        onClick={() => onSelect(eng.id)} 
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left transition-all hover:bg-purple-500/10 hover:border-purple-500 group"
                    >
                        <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{eng.icon}</div>
                        <div className="font-bold text-white mb-1">{eng.title}</div>
                        <div className="text-[10px] text-gray-500 mb-4 leading-tight">{eng.desc}</div>
                        <span className={`text-[9px] font-bold px-3 py-1 rounded-full border border-white/5 ${eng.badgeColor}`}>
                            {eng.badge}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
