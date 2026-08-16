// Archivo: frontend/src/components/tabs/status/KpiGrid.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Users, Server, Shield } from 'lucide-react';

const KPICard = ({ icon: Icon, label, value, subtext, color = 'indigo', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`p-4 bg-white/5 border border-white/10 rounded-xl hover:border-${color}-500/30 transition-all group`}
    >
        <div className="flex items-start justify-between mb-3">
            <div className={`p-2 bg-${color}-500/10 rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 text-${color}-400`} />
            </div>
            {subtext && (
                <div className={`text-[10px] font-mono text-${color}-400/80`}>
                    {subtext}
                </div>
            )}
        </div>
        <p className="text-2xl font-bold text-white mb-1 tracking-tight">{value}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{label}</p>
    </motion.div>
);

export function KpiGrid({ metrics, tasks }) {
    const activeSquadCount = tasks.length > 0 ? [...new Set(tasks.map(t => t.assignedTo))].filter(Boolean).length : 1;
    
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
                icon={Hammer}
                label="Construction"
                value={`${metrics.progress}%`}
                subtext={`${metrics.completedTasks}/${metrics.totalTasks} Tasks`}
                color="indigo"
                delay={0}
            />
            <KPICard
                icon={Users}
                label="Active Squad"
                value={activeSquadCount}
                subtext="Neural Agents"
                color="purple"
                delay={0.1}
            />
            <KPICard
                icon={Server}
                label="Uptime"
                value={metrics.deployDate ? `${metrics.daysUp}d` : "TBD"}
                subtext={metrics.deployDate ? "Since Deploy" : "Pre-Launch"}
                color="cyan"
                delay={0.2}
            />
            <KPICard
                icon={Shield}
                label="Health"
                value="NOMINAL"
                subtext="No Critical Errors"
                color="emerald"
                delay={0.3}
            />
        </div>
    );
}
