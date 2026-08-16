// Archivo: frontend/src/components/dashboard/intelligence/TranscriptionFeed.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FileAudio, Play } from 'lucide-react';

export function TranscriptionFeed({ insights }) {
    if (insights.length === 0) {
        return <div className="text-center py-10 text-gray-500 text-xs">Esperando procesamiento de audio...</div>;
    }

    return (
        <div className="space-y-3">
            {insights.map((item, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors group"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <FileAudio className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold text-gray-300 tracking-tight">{item.title}</span>
                        </div>
                        <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <Play className="w-3 h-3 text-white" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed italic border-l-2 border-purple-500/30 pl-3">
                        "{item.content}"
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
