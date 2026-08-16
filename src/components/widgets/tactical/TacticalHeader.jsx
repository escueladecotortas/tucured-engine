// Archivo: frontend/src/components/widgets/tactical/TacticalHeader.jsx
import React from 'react';
import { Target } from 'lucide-react';

export function TacticalHeader({ taskCount }) {
    return (
        <div className="p-5 border-b border-white/5 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Target className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Radar Táctico</h3>
                    <p className="text-[10px] text-gray-400 font-mono">ENFOQUE OPERATIVO INMEDIATO</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                 <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">
                     {taskCount} FOCOS ACTIVOS
                 </span>
            </div>
        </div>
    );
}
