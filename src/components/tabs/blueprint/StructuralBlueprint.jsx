// Archivo: frontend/src/components/tabs/blueprint/StructuralBlueprint.jsx
import React from 'react';
import { LayoutTemplate, CheckCircle } from 'lucide-react';
import { AVAILABLE_SECTIONS } from './blueprint-constants';

export function StructuralBlueprint({ sections, onToggleSection }) {
    return (
        <div className="lg:col-span-7 bg-[#0A0A1A]/50 border border-white/10 rounded-xl p-0 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <LayoutTemplate className="w-3.5 h-3.5 text-emerald-400" /> Structure & Components
                </h3>
                <span className="text-[10px] font-mono text-gray-500">
                    {sections.length} Active Modules
                </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <p className="text-[10px] text-gray-500 mb-4">Select the components required for this landing page.</p>

                <div className="grid grid-cols-2 gap-3">
                    {AVAILABLE_SECTIONS.map((section) => {
                        const isActive = sections.includes(section.id);
                        return (
                            <button
                                key={section.id}
                                onClick={() => onToggleSection(section.id)}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isActive
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                                        : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-700'}`}></div>
                                    <span className="text-xs font-medium">{section.label}</span>
                                </div>
                                {isActive && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                            </button>
                        );
                    })}
                </div>

                {/* Preview of Flow */}
                <div className="mt-8">
                    <h4 className="text-[10px] text-gray-500 uppercase font-bold mb-3">Logical Flow</h4>
                    <div className="space-y-1">
                        {sections.map((secId, index) => {
                            const label = AVAILABLE_SECTIONS.find(s => s.id === secId)?.label || secId;
                            return (
                                <div key={secId} className="flex items-center gap-3 p-2 bg-black/40 rounded border border-white/5">
                                    <span className="text-[9px] font-mono text-gray-600 w-4">{index + 1}</span>
                                    <span className="text-xs text-white">{label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
