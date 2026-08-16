'use client';

import React from 'react';
import { Settings, Play, Info, Tag } from 'lucide-react';

interface WidgetCardProps {
    id: string;
    label: string;
    description: string;
    tier: string;
    tags: string[];
    configProps: string[];
    onPreview: (id: string) => void;
}

export const WidgetCard = ({ id, label, description, tier, tags, configProps, onPreview }: WidgetCardProps) => {
    return (
        <div className="bg-slate-800/40 border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all group flex flex-col md:flex-row h-full min-h-[280px]">
            {/* Left: Info & Meta */}
            <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            tier === 'visual' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            tier === 'conversion' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                            {tier}
                        </span>
                        <code className="text-[10px] text-slate-500 font-mono">{id}</code>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{label}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2 italic">"{description}"</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                                <Tag size={10} className="text-slate-600" /> {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => onPreview(id)}
                        className="flex-1 bg-white text-black hover:bg-indigo-500 hover:text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-sm shadow-xl shadow-white/5 active:scale-95"
                    >
                        <Play size={18} fill="currentColor" />
                        PROBAR WIDGET
                    </button>
                </div>
            </div>

            {/* Right: Spec Box */}
            <div className="w-full md:w-72 bg-slate-950/40 p-8 border-l border-white/5 flex flex-col justify-center">
                <div className="mb-6">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                        <Settings size={12} /> Características
                    </h4>
                    <ul className="space-y-3">
                        {configProps.map(prop => (
                            <li key={prop} className="text-xs text-slate-400 flex items-center gap-2">
                                <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                                {prop}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="mt-auto pt-6 border-t border-white/5">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">
                        <Info size={12} /> Estado
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold">READY PARA PRODUCCIÓN</p>
                </div>
            </div>
        </div>
    );
};
