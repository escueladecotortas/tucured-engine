// Archivo: src/components/terminal/QuickBtn.jsx
import React from 'react';

export default function QuickBtn({ icon, label, tooltip, onClick, isDanger }) {
  return (
    <div className="relative group/btn">
      <button
        onClick={onClick}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
          isDanger 
            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30' 
            : 'bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border-white/10'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>

      <div className="absolute top-full right-0 mt-2 hidden group-hover/btn:block w-64 p-2 bg-zinc-900/95 border border-white/15 rounded-xl shadow-2xl backdrop-blur-md text-[11px] text-gray-200 z-50 pointer-events-none leading-normal">
        <div className="font-bold text-white mb-0.5 flex items-center gap-1">
          {icon} <span>{label}</span>
        </div>
        <p className="text-gray-400 text-[10px]">{tooltip}</p>
      </div>
    </div>
  );
}
