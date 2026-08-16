// Archivo: frontend/src/components/tabs/bionics/BionicsEmptyState.jsx
import React from 'react';
import { Monitor } from 'lucide-react';

export function BionicsEmptyState({ loading }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-black/20 border border-white/5 border-dashed rounded-3xl animate-pulse">
            {loading ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin" />
                    <span className="text-[10px] font-mono text-cyan-400 animate-pulse tracking-[0.5em] uppercase">Navegando el activo...</span>
                </div>
            ) : (
                <>
                  <Monitor size={64} className="text-gray-800 mb-4" />
                  <p className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">Awaiting Input to Analyze</p>
                </>
            )}
        </div>
    );
}
