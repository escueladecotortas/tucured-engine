// Archivo: frontend/src/components/leads/BatchSearchScraping.jsx
import React from 'react';
import { motion } from 'framer-motion';

const BatchSearchScraping = ({ progress, logs, isScraping }) => (
    <motion.div className="max-w-2xl mx-auto text-center space-y-8 py-10">
        <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={364} strokeDashoffset={364 - (364 * progress) / 100}
                    className="text-indigo-500 transition-all duration-300" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-white">{Math.round(progress)}%</span>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white animate-pulse">Escaneando Google Maps...</h3>
            <div className="h-40 overflow-y-auto bg-black/20 rounded-xl p-4 text-left border border-white/5 font-mono text-xs">
                {logs.map((log, i) => (
                    <div key={i} className={`mb-1 last:font-bold ${log?.startsWith?.('❌') ? 'text-red-400' : log?.startsWith?.('🎯') ? 'text-emerald-400 font-bold' : 'text-indigo-300/80 last:text-white'}`}>
                        &gt; {String(log || '')}
                    </div>
                ))}
                {isScraping && <div className="w-2 h-4 bg-indigo-500 animate-pulse inline-block align-middle ml-1" />}
            </div>
        </div>
    </motion.div>
);

export default BatchSearchScraping;
