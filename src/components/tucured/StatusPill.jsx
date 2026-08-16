// Archivo: frontend/src/components/tucured/StatusPill.jsx
import React from 'react';

const StatusPill = ({ status }) => {
    const config = {
        active: { color: 'bg-emerald-500', text: 'ACTIVE NODE', pulse: 'animate-pulse' },
        zen: { color: 'bg-indigo-500', text: 'ZEN MODE', pulse: 'animate-pulse-slow' },
        pilot: { color: 'bg-amber-500', text: 'PILOT', pulse: '' },
        generated: { color: 'bg-blue-500', text: 'STITCH READY', pulse: 'animate-pulse' },
    };

    const result = config[status] || config.pilot;

    return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <div className={`w-1.5 h-1.5 rounded-full ${result.color} ${result.pulse}`} />
            <span className="text-[9px] font-bold tracking-wider text-white/90">{result.text}</span>
        </div>
    );
};

export default StatusPill;
