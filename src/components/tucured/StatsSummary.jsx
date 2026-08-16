// Archivo: frontend/src/components/tucured/StatsSummary.jsx
import React from 'react';

const StatsSummary = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-lg font-bold text-white mb-2">System Status</h3>
                <div className="text-3xl font-mono text-emerald-400">{stats.status || 'NOMINAL'}</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-lg font-bold text-white mb-2">Active Projects</h3>
                <div className="text-3xl font-mono text-white">{stats.activeProjects || 0}</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-lg font-bold text-white mb-2">Pending Missions</h3>
                <div className="text-3xl font-mono text-orange-400">{stats.pendingMissions || 0}</div>
            </div>
        </div>
    );
};

export default StatsSummary;
