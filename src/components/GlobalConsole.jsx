import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GlobalConsole({ projectId, externalLogs = [], sidebarExpanded = true }) {
    const { t } = useLanguage();
    const [expanded, setExpanded] = useState(false);

    // Use passed logs or empty
    const logs = externalLogs;

    return (
        <motion.div
            initial={{ height: 48 }}
            animate={{
                height: expanded ? 300 : 48,
                left: sidebarExpanded ? 280 : 64, // Dynamic Left Adjustment
                width: `calc(100 % - ${sidebarExpanded ? 280 : 64}px)` // Ensure width is correct
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom - 0 right - 0 z - 40 flex flex - col border - t border - white / 10 bg - [#0A0A1A] / 95 backdrop - blur - xl shadow - [0_ - 10px_40px_rgba(0, 0, 0, 0.5)]`}
            style={{ left: sidebarExpanded ? 280 : 64 }}
        >
            {/* Header / Minimized View */}
            <div
                className="h-12 flex items-center px-6 justify-between cursor-pointer hover:bg-white/5 transition-colors group"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Status Indicator */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-emerald-400 tracking-wider">SYSTEM ONLINE</span>
                    </div>
                </div>

                {/* Latest Log Ticker (Visible when collapsed) */}
                {!expanded && logs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={logs[0].id}
                        className="flex-1 mx-8 font-mono text-[10px] text-gray-400 truncate flex items-center gap-2"
                    >
                        <span className="text-indigo-400">_ {logs[0].agent || 'SYS'}</span>
                        <span>{logs[0].description}</span>
                    </motion.div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-3 text-gray-500 group-hover:text-white transition-colors">
                    <span className="text-[9px] uppercase tracking-wider hidden md:block">Nexus Console v2.6 [LOG STREAM]</span>
                    {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
            </div>

            {/* Expanded Content - ACTION LOG DRAWER */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 overflow-hidden relative bg-black/50 flex"
                    >
                        {/* Left Column: Metrics (Optional placeholder for future graphs) */}
                        <div className="w-64 border-r border-white/10 p-4 hidden md:block">
                            <h4 className="text-[10px] uppercase text-gray-500 font-bold mb-4">System Metrics</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[9px] text-gray-400 mb-1"><span>CPU LOAD</span><span>42%</span></div>
                                    <div className="w-full bg-gray-800 h-1 rounded-full"><div className="bg-indigo-500 h-full rounded-full" style={{ width: '42%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[9px] text-gray-400 mb-1"><span>MEMORY</span><span>68%</span></div>
                                    <div className="w-full bg-gray-800 h-1 rounded-full"><div className="bg-emerald-500 h-full rounded-full" style={{ width: '68%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[9px] text-gray-400 mb-1"><span>NETWORK</span><span>1.2 GB/s</span></div>
                                    <div className="w-full bg-gray-800 h-1 rounded-full"><div className="bg-cyan-500 h-full rounded-full" style={{ width: '25%' }}></div></div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Log Stream */}
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono">
                            <h4 className="text-[10px] uppercase text-gray-500 font-bold mb-4 flex items-center gap-2">
                                <Terminal className="w-3 h-3" /> Live Action Feed
                            </h4>
                            <div className="space-y-1">
                                {logs.map(log => (
                                    <div key={log.id} className="flex gap-4 p-2 border-b border-white/5 hover:bg-white/5 transition-colors text-[11px] items-baseline group">
                                        <span className="text-gray-600 w-20 shrink-0">
                                            {log.timestamp ? log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                                        </span>
                                        <span className={`font - bold w - 24 shrink - 0 uppercase truncate ${log.agent === 'nexus' ? 'text-indigo-400' : 'text-emerald-400'} `}>
                                            [{log.agent || 'SYS'}]
                                        </span>
                                        <span className="text-gray-300 group-hover:text-white transition-colors">
                                            {log.description}
                                        </span>
                                    </div>
                                ))}
                                {logs.length === 0 && (
                                    <div className="text-gray-600 italic mt-10 text-center">No system activity recorded in this session.</div>
                                )}
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
