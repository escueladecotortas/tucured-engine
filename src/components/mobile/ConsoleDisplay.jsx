// Archivo: frontend/src/components/mobile/ConsoleDisplay.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export function ConsoleDisplay({ logs }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex-1 px-4 min-h-0 relative overflow-hidden flex flex-col" ref={scrollRef}>
            <div className="flex-1 bg-zinc-950 border border-green-900/30 rounded-lg p-3 overflow-y-auto custom-scrollbar">
                <div className="absolute top-4 right-6 opacity-10 pointer-events-none">
                    <Terminal size={60} />
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                    {logs.map(log => (
                        <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} key={log.id} className="flex gap-2">
                            <span className="text-zinc-700 shrink-0">[{log.time}]</span>
                            <span className={`break-words ${getTypeColor(log.type)}`}>
                                {log.type === 'system' && '> '}
                                {log.text}
                            </span>
                        </motion.div>
                    ))}
                    <div className="h-4" />
                </div>
            </div>
        </div>
    );
}

function getTypeColor(type) {
    switch (type) {
        case 'error': return 'text-red-500';
        case 'success': return 'text-green-400';
        case 'warning': return 'text-amber-500';
        case 'system': return 'text-blue-400';
        default: return 'text-zinc-400';
    }
}
