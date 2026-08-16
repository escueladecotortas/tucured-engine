'use client';

import React from 'react';
import { Timer } from 'lucide-react';

/**
 * WIDGET: Countdown Timer (Inline)
 * Enfoque: Urgencia dentro del contenido (no barra fija).
 */

export const PowerUpV3_Timer = ({ date = "2026-12-31" }) => {
    // Simulado estático para visualización, lógica real en BarV1
    return (
        <div className="inline-flex items-center gap-4 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-lg my-6">
            <div className="flex flex-col items-center">
                <span className="text-3xl font-black font-mono">02</span>
                <span className="text-xs text-gray-400 uppercase">Días</span>
            </div>
            <span className="text-2xl opacity-50">:</span>
            <div className="flex flex-col items-center">
                <span className="text-3xl font-black font-mono">14</span>
                <span className="text-xs text-gray-400 uppercase">Hs</span>
            </div>
            <span className="text-2xl opacity-50">:</span>
            <div className="flex flex-col items-center">
                <span className="text-3xl font-black font-mono">45</span>
                <span className="text-xs text-gray-400 uppercase">Min</span>
            </div>
            <div className="ml-4 pl-4 border-l border-white/20">
                <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">Oferta Expira</p>
                <div className="flex items-center gap-1 text-sm"><Timer size={14}/> Tiempo Limitado</div>
            </div>
        </div>
    );
};
