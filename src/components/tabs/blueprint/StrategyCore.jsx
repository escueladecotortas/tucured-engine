// Archivo: frontend/src/components/tabs/blueprint/StrategyCore.jsx
import React from 'react';
import { Layout, MessageSquare } from 'lucide-react';
import { SITE_ARCHETYPES } from './blueprint-constants';

export function StrategyCore({ blueprint, setArchetype, updateStrategy }) {
    return (
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
            {/* Archetype Selector */}
            <div className="bg-[#0A0A1A]/50 border border-white/10 rounded-xl p-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5 text-indigo-400" /> Site Archetype
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    {SITE_ARCHETYPES.map((arch) => (
                        <button
                            key={arch.id}
                            onClick={() => setArchetype(arch.id)}
                            className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${blueprint.archetype === arch.id
                                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                    : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${blueprint.archetype === arch.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                                <arch.icon className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-sm font-bold">{arch.label}</div>
                                <div className="text-[10px] opacity-70 mt-0.5">{arch.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* The Hook (Copy Strategy) */}
            <div className="bg-[#0A0A1A]/50 border border-white/10 rounded-xl p-4 flex-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-pink-400" /> The Offer (Copy Strategy)
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold block mb-2">Prime Objective</label>
                        <input
                            type="text"
                            value={blueprint.objective}
                            onChange={(e) => updateStrategy('objective', e.target.value)}
                            placeholder="e.g. Sell 50 tickets for the event..."
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500/50 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold block mb-2">Unique Value Proposition (UVP)</label>
                        <textarea
                            value={blueprint.uvp}
                            onChange={(e) => updateStrategy('uvp', e.target.value)}
                            placeholder="What makes this irresistible? (The Hook)"
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500/50 outline-none resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
