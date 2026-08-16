// Archivo: frontend/src/components/status/InstalledWidgets.jsx
import React from 'react';
import { Sparkles } from 'lucide-react';

export function InstalledWidgets({ widgets }) {
    const installed = widgets.filter(w => w.installed);
    
    if (installed.length === 0) return null;

    return (
        <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 px-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Widgets Instalados</h3>
            </div>

            <div className="grid gap-2">
                {installed.map((widget) => (
                    <div key={widget.id} className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white uppercase tracking-tight capitalize">{widget.type?.replace(/_/g, ' ')}</div>
                                <div className="text-[10px] text-zinc-500 uppercase font-bold">{widget.tier} · ${widget.price}</div>
                            </div>
                        </div>
                        <div className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">Activo</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
