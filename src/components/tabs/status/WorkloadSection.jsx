// Archivo: frontend/src/components/tabs/status/WorkloadSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const AgentWorkload = ({ tasks }) => {
    const distribution = tasks.reduce((acc, task) => {
        const agent = task.assignedTo || 'unassigned';
        acc[agent] = (acc[agent] || 0) + 1;
        return acc;
    }, {});

    const total = tasks.length || 1;
    const agents = Object.keys(distribution).map(key => ({
        id: key,
        name: key === 'unassigned' ? 'Sin Asignar' : key,
        count: distribution[key],
        color: key === 'codi' ? 'cyan' : key === 'atenea' ? 'purple' : 'gray'
    })).sort((a, b) => b.count - a.count);

    return (
        <div className="space-y-4">
            {agents.map((agent, i) => (
                <div key={agent.id} className="relative">
                    <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-300 font-bold capitalize">@{agent.name}</span>
                        <span className="text-gray-500">{Math.round((agent.count / total) * 100)}% ({agent.count})</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(agent.count / total) * 100}%` }}
                            transition={{ delay: i * 0.1 }}
                            className={`h-full bg-${agent.color}-500 rounded-full`}
                        />
                    </div>
                </div>
            ))}
            {tasks.length === 0 && <div className="text-xs text-gray-600 italic">No active missions to analyze.</div>}
        </div>
    );
};

export function WorkloadSection({ tasks }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-5 bg-white/5 border border-white/10 rounded-xl"
        >
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Workload Distribution
            </h3>
            <AgentWorkload tasks={tasks} />
        </motion.div>
    );
}
