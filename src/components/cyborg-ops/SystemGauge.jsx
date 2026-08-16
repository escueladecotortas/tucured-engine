// Archivo: frontend/src/components/cyborg-ops/SystemGauge.jsx
import React from 'react';

const SystemGauge = ({ label, value, max = 100, unit = '%', color = 'emerald' }) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
                    <circle
                        cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent"
                        strokeDasharray={226}
                        strokeDashoffset={226 - (226 * percentage) / 100}
                        className={`text-${color}-500 transition-all duration-500 ease-out`}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className={`text-xl font-bold text-${color}-400`}>{Math.round(value)}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">{unit}</span>
                </div>
            </div>
            <span className="text-xs font-mono text-zinc-400 tracker-wider">{label}</span>
        </div>
    );
};

export default SystemGauge;
