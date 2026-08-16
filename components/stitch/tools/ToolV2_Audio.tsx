'use client';

import React from 'react';
import { Play } from 'lucide-react';

export const ToolV2_Audio = () => (
    <div className="flex items-center gap-4 bg-gray-900 text-white p-4 rounded-full shadow-lg max-w-sm mx-auto">
        <button className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center shrink-0 hover:scale-110 transition-transform">
            <Play fill="white" size={16} />
        </button>
        <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">Entrevista Radio FM</p>
            <p className="text-xs text-gray-400">Tucu Red en el aire</p>
        </div>
        <div className="text-xs font-mono text-gray-500">03:45</div>
    </div>
);
