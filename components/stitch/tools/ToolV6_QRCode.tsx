'use client';

import React from 'react';
import { QrCode, Share2 } from 'lucide-react';

/**
 * WIDGET: QR Bridge
 * Enfoque: Conexión física a digital instantánea.
 */

export const ToolV6_QRCode = ({ data = {} }: { data?: any }) => {
    const label = data.label || 'Sincronizar con WhatsApp';

    return (
        <div className="p-8 bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group inline-block text-center">
            {/* Atmosfera */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-600/10 rounded-full blur-[40px]" />
            
            <div className="relative z-10">
                <div className="bg-white p-4 rounded-3xl mb-6 shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <QrCode size={120} className="text-slate-950" />
                </div>
                
                <span className="text-[9px] font-black tracking-[0.3em] text-indigo-400 uppercase mb-2 block">Nexus QR Bridge</span>
                <p className="text-xs font-bold text-white italic mb-4">"{label}"</p>
                
                <div className="flex items-center justify-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    <Share2 size={10} className="text-indigo-500/50" />
                    Protocolo de Enlace Activo
                </div>
            </div>
        </div>
    );
};
