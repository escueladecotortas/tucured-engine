// Archivo: frontend/src/components/tabs/StatBar.jsx
import React from 'react';

const StatBar = ({ label, value, color, suffix = '%' }) => (
    <div>
        <div className="flex justify-between text-[10px] mb-1">
            <span className="text-gray-400">{label}</span>
            <span className="font-mono text-white">{value}{suffix}</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
            ></div>
        </div>
    </div>
);

export default StatBar;
