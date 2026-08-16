// Archivo: frontend/src/components/widgets/tactical/TaskItem.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, AlertTriangle, PlayCircle, 
    CheckCircle2, Zap, RefreshCw, Cpu
} from 'lucide-react';

const getStatusIcon = (status) => {
    switch(status) {
        case 'in_progress': return <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin-slow" />;
        case 'review': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
        case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
};

const getActionLabel = (task) => {
    if (task.automationType && task.status === 'pending') return 'EJECUTAR AUTO';
    if (task.status === 'in_progress') return 'MARCAR LISTO';
    return 'INICIAR';
};

export function TaskItem({ task, executingId, onAction }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
                group/card flex items-center gap-4 p-3 pr-4 rounded-xl border transition-all duration-300
                ${task.status === 'in_progress' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-black/40 border-white/5 hover:border-white/20'}
            `}
        >
            <div className="shrink-0">
                {getStatusIcon(task.status)}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[13px] font-bold text-white truncate group-hover/card:text-indigo-300 transition-colors">
                        {task.title || task.name}
                    </h4>
                    {task.automationType && (
                        <Cpu className="w-3 h-3 text-emerald-400 shrink-0" />
                    )}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500">
                    <span className="uppercase text-indigo-400/80">@{task.assignedTo || 'Sistema'}</span>
                    {task.priority === 'critical' && <span className="text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> CRÍTICA</span>}
                    {task.priority === 'high' && <span className="text-orange-400 flex items-center gap-1"><Zap className="w-3 h-3"/> ALTA</span>}
                </div>
            </div>

            <div className="shrink-0 flex items-center justify-end">
                <button
                    onClick={() => onAction(task)}
                    disabled={executingId === task.id}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all
                        ${task.status === 'in_progress' 
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30' 
                            : task.automationType 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    {executingId === task.id ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : task.status === 'in_progress' ? (
                        <CheckCircle2 className="w-3 h-3" />
                    ) : (
                        <PlayCircle className="w-3 h-3" />
                    )}
                    {getActionLabel(task)}
                </button>
            </div>
        </motion.div>
    );
}
