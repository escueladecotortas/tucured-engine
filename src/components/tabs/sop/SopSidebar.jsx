// Archivo: frontend/src/components/tabs/sop/SopSidebar.jsx
import React from 'react';
import { Terminal, FileText, Shield, ChevronRight } from 'lucide-react';

const icons = { Terminal, FileText, Shield };

export function SopSidebar({ libraries, activeCategory, searchTerm, onSelectCategory }) {
    return (
        <div className="w-64 border-r border-white/5 bg-black/20 p-4 flex flex-col gap-2">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Estanterías</div>
            {libraries.map(lib => {
                const Icon = icons[lib.icon] || FileText;
                return (
                    <button
                        key={lib.id}
                        onClick={() => onSelectCategory(lib.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                            activeCategory === lib.id && searchTerm === ''
                            ? 'bg-white/10 text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Icon className={`w-4 h-4 ${lib.color}`} />
                        {lib.label}
                        {activeCategory === lib.id && searchTerm === '' && <ChevronRight className="w-3 h-3 ml-auto text-white/50" />}
                    </button>
                );
            })}
        </div>
    );
}
