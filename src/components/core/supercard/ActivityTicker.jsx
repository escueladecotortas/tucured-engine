// Archivo: frontend/src/components/core/supercard/ActivityTicker.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const ActivityTicker = ({ client }) => {
    return (
        <div className="mt-auto pt-3 border-t border-white/10">
            <div className="overflow-hidden h-6 flex items-center bg-black/40 rounded px-2 border border-white/5">
                <motion.div
                    animate={{ x: [0, -200] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className={`whitespace-nowrap text-xs font-mono ${client.status === 'active' ? 'text-emerald-400' : 'text-gray-300'} flex items-center gap-8`}
                >
                    <span className="flex items-center gap-2">
                        <Terminal className="w-3 h-3" />
                        {client.lastActivity || `System Monitoring: ${client.name} Node Active`}
                    </span>
                    <span className="opacity-50 text-[10px]">///</span>
                    <span>Waiting for User Input...</span>
                    <span className="opacity-50 text-[10px]">///</span>
                </motion.div>
            </div>
        </div>
    );
};

export default ActivityTicker;
