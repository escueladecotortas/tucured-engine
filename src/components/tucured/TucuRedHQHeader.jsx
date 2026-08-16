// Archivo: frontend/src/components/tucured/TucuRedHQHeader.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';

const TucuRedHQHeader = ({ title, subtitle }) => {
    return (
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/10 pb-6 gap-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => window.location.hash = '#/'}
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-[#1e293b] border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all shadow-lg shadow-black/50"
                >
                    <ChevronRight className="w-5 h-5 text-gray-200 rotate-180 group-hover:text-white transition-colors" />
                </button>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold">{subtitle}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-2xl">
                        {title}
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default TucuRedHQHeader;
