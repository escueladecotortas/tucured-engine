// Archivo: frontend/src/components/tabs/StatusTab.jsx
'use client';
import React from 'react';
import { Activity } from 'lucide-react';
import { useStatusData } from '../../hooks/useStatusData';
import { KpiGrid } from './status/KpiGrid';
import { WorkloadSection } from './status/WorkloadSection';
import { CriticalTasksSection } from './status/CriticalTasksSection';
import VitalisWidget from '../VitalisWidget';

export default function StatusTab({ projectId }) {
    const { 
        tasks, 
        activity, 
        loading, 
        metrics 
    } = useStatusData(projectId);

    if (loading) return (
        <div className="p-10 flex justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        Project Vitality
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Monitor de salud de construcción y despliegue
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                    <div className={`w-2 h-2 rounded-full ${activity.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`} />
                    <span className="text-[10px] font-mono text-gray-300">
                        SYSTEM: {activity.length > 0 ? 'ONLINE' : 'IDLE'}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                <div className="mb-2">
                    <VitalisWidget />
                </div>

                <KpiGrid metrics={metrics} tasks={tasks} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <WorkloadSection tasks={tasks} />
                    <CriticalTasksSection tasks={tasks} />
                </div>

                {/* Integration Status */}
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Activity className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-indigo-100">Analytics Integration</h4>
                            <p className="text-xs text-indigo-300/70">Connect Google Analytics 4 to track real visits.</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                        Connect GA4
                    </button>
                </div>
            </div>
        </div>
    );
}
