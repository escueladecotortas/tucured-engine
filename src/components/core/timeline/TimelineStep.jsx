// Archivo: frontend/src/components/core/timeline/TimelineStep.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2, AlertCircle, Clock } from 'lucide-react';

/**
 * StatusIcon - Icono según estado del paso
 */
const StatusIcon = ({ status }) => {
    const iconClass = "w-4 h-4";
    switch (status) {
        case 'completed': return <CheckCircle className={`${iconClass} text-emerald-400`} />;
        case 'active':
        case 'in_progress': return <Loader2 className={`${iconClass} text-indigo-400 animate-spin`} />;
        case 'error': return <AlertCircle className={`${iconClass} text-red-400`} />;
        case 'pending':
        default: return <Circle className={`${iconClass} text-gray-600`} />;
    }
};

/**
 * TimelineStep - Paso individual de la timeline
 */
const TimelineStep = ({ step, index, isLast }) => {
    const getStatusColors = (status) => {
        switch (status) {
            case 'completed': return 'border-emerald-500/50 bg-emerald-500/10';
            case 'active':
            case 'in_progress': return 'border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/20';
            case 'error': return 'border-red-500/50 bg-red-500/10';
            default: return 'border-white/10 bg-white/5';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4"
        >
            <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full border ${getStatusColors(step.status)}`}>
                    <StatusIcon status={step.status} />
                </div>
                {!isLast && (
                    <motion.div
                        className="w-px flex-1 min-h-[40px]"
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                        style={{
                            background: step.status === 'completed'
                                ? 'linear-gradient(to bottom, rgba(52, 211, 153, 0.5), rgba(52, 211, 153, 0.1))'
                                : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent)'
                        }}
                    />
                )}
            </div>

            <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-sm font-semibold ${step.status === 'active' ? 'text-white' : step.status === 'completed' ? 'text-emerald-300' : 'text-gray-400'}`}>
                        {step.title}
                    </h4>
                    {step.agent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono uppercase">
                            @{step.agent}
                        </span>
                    )}
                </div>
                {step.description && <p className="text-xs text-gray-500 mb-2">{step.description}</p>}
                {step.timestamp && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-600">
                        <Clock className="w-3 h-3" />
                        {new Date(step.timestamp).toLocaleTimeString()}
                    </div>
                )}
                {step.status === 'active' && step.progress !== undefined && (
                    <div className="mt-2 h-1 progress-track">
                        <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${step.progress}%` }} transition={{ duration: 0.5 }} />
                    </div>
                )}
                {step.status === 'completed' && step.result && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 p-2 bg-emerald-500/5 border border-emerald-500/20 rounded text-xs text-emerald-300/80 font-mono">
                        {step.result}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default TimelineStep;
