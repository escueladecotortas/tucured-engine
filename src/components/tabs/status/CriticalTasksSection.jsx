// Archivo: frontend/src/components/tabs/status/CriticalTasksSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export function CriticalTasksSection({ tasks }) {
    const criticalTasks = tasks.filter(t => t.status !== 'completed' && (t.priority === 'high' || t.priority === 'critical'));

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-5 bg-white/5 border border-white/10 rounded-xl flex flex-col"
        >
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" />
                Pending Critical
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[160px] custom-scrollbar">
                {criticalTasks.length === 0 ? (
                    <div className="text-center text-gray-500 text-xs py-4">All critical systems operational.</div>
                ) : (
                    criticalTasks
                        .slice(0, 5)
                        .map(t => (
                            <div key={t.id} className="flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                                <div className={`mt-1 w-1.5 h-1.5 rounded-full bg-${t.priority === 'critical' ? 'red' : 'orange'}-500`} />
                                <div>
                                    <div className="text-xs text-gray-200 font-medium line-clamp-1">{t.title}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">@{t.assignedTo || 'Unassigned'}</div>
                                </div>
                            </div>
                        ))
                )}
            </div>
        </motion.div>
    );
}
