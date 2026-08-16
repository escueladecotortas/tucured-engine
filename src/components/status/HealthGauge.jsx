// Archivo: frontend/src/components/status/HealthGauge.jsx
import React from 'react';

export function HealthGauge({ healthScore }) {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - healthScore / 100);

    return (
        <div className="flex items-start justify-between mb-8">
            <div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Estado del Proyecto</h2>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Monitoreo de salud y completitud en tiempo real</p>
            </div>

            <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="none" className="text-white/5" />
                    <circle 
                        cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="none" 
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        className={`transition-all duration-1000 ease-out ${healthScore >= 80 ? 'text-emerald-500' : healthScore >= 50 ? 'text-yellow-500' : 'text-orange-500'}`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-black text-white">{healthScore}%</div>
                    <div className="text-[9px] text-zinc-500 uppercase font-bold">Health</div>
                </div>
            </div>
        </div>
    );
}
