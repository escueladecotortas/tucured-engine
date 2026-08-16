// Archivo: frontend/src/components/tabs/identity/VibrationalGrid.jsx
import React from 'react';
import { Zap } from 'lucide-react';

const VIBRATIONS = [
    { id: '1', label: '1 - Poder', desc: 'Liderazgo, Asimétrico', color: 'bg-indigo-500' },
    { id: '2', label: '2 - Luna', desc: 'Conexión, Suave', color: 'bg-blue-400' },
    { id: '3', label: '3 - Expansión', desc: 'Creatividad, Fluido', color: 'bg-pink-500' },
    { id: '4', label: '4 - Tierra', desc: 'Estabilidad, Grilla', color: 'bg-emerald-600' },
    { id: '5', label: '5 - Caos', desc: 'Libertad, Dinámico', color: 'bg-orange-500' },
    { id: '6', label: '6 - Armonía', desc: 'Hogar, Centrado', color: 'bg-teal-500' },
    { id: '7', label: '7 - Místico', desc: 'Profundidad, Lujo', color: 'bg-purple-600' },
    { id: '8', label: '8 - Éxito', desc: 'Abundancia, Gold', color: 'bg-yellow-600' },
    { id: '9', label: '9 - Sabiduría', desc: 'Maestría, Minimal', color: 'bg-slate-500' },
];

export function VibrationalGrid({ selectedVibration, onSelect }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-yellow-400" /> Vibrational Core
            </h3>

            <div className="grid grid-cols-3 gap-2">
                {VIBRATIONS.map((vib) => {
                    const isSelected = (selectedVibration || '1') === vib.id;
                    return (
                        <button
                            key={vib.id}
                            onClick={() => onSelect(vib.id)}
                            className={`relative p-2 rounded-lg border text-left transition-all ${isSelected
                                ? 'bg-white/10 border-white/20 shadow-lg'
                                : 'bg-black/20 border-transparent hover:border-white/5 opacity-60 hover:opacity-100'
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full mb-2 ${vib.color} ${isSelected ? 'animate-pulse' : ''}`} />
                            <div className="text-lg font-bold text-white leading-none mb-1">{vib.id}</div>
                            <div className="text-[9px] text-gray-400 leading-tight">{vib.desc.split(',')[0]}</div>
                            {isSelected && <div className="absolute inset-0 border-2 border-indigo-500/50 rounded-lg pointer-events-none" />}
                        </button>
                    )
                })}
            </div>
            <div className="mt-3 p-2 bg-black/20 rounded border border-white/5 text-[10px] text-gray-400 italic">
                * Defines layout engine & animation physics.
            </div>
        </div>
    );
}
