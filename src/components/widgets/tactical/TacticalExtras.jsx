// Archivo: frontend/src/components/widgets/tactical/TacticalExtras.jsx
import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function TacticalFooter({ projectId }) {
    return (
        <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-center">
             <button 
                 onClick={() => window.location.hash = `#/project/${projectId || 'system'}?tab=missions`}
                 className="text-[10px] text-gray-400 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
             >
                 Ver Tablero Completo <ArrowRight className="w-3 h-3" />
             </button>
        </div>
    );
}

export function EmptyState() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 opacity-50">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/50" />
            <span className="text-sm font-bold uppercase tracking-widest">SISTEMA DESPEJADO</span>
            <span className="text-[10px] font-mono text-center max-w-[200px]">
                No hay misiones críticas requieren intervención manual en este momento.
            </span>
        </div>
    );
}
