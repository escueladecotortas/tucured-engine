// Archivo: frontend/src/components/leads/modal/GenerationResult.jsx
import React from 'react';
import { Globe } from 'lucide-react';
import { MatrixConsole } from './MatrixConsole';

export function GenerationResult({ isSuccess, finalUrl, logs, onClose }) {
    return (
        <div className="text-center py-4 space-y-6">
            {isSuccess ? (
                <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="text-5xl">🎉</div>
                    <h3 className="text-xl font-black text-emerald-400 uppercase tracking-tighter">¡SITIO FORJADO!</h3>
                    {finalUrl && (
                        <a 
                            href={finalUrl.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold text-xs shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform uppercase tracking-widest"
                        >
                            <Globe size={14} /> {finalUrl.label}
                        </a>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="text-5xl">⚠️</div>
                    <h3 className="text-lg font-black text-red-400 uppercase tracking-tighter">Pipeline Interrumpido</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Revisá la consola para más detalles técnicos.</p>
                </div>
            )}
            
            <MatrixConsole logs={logs} />
            
            <button 
                onClick={onClose} 
                className="px-8 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
            >
                Cerrar Protocolo
            </button>
        </div>
    );
}
