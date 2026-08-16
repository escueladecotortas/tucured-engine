'use client';

import React from 'react';
import { Gantt } from '@svar-ui/react-gantt';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Layers } from 'lucide-react';

// @ts-ignore
import svarStyles from './svar-gantt.css?inline';

// ESQUEMA ULTRA-COMPATIBLE (SVAR 2.5.2)
const MASTER_TASKS = [
    { 
        id: 1, 
        text: "Misión: Arqueología NEXUS", 
        start: new Date(2026, 1, 15), 
        duration: 3, 
        progress: 60, 
        type: "task",
        data: [], // REQUERIDO SI OPEN: TRUE
        open: true 
    },
    { 
        id: 2, 
        text: "Despliegue de Búnker", 
        start: new Date(2026, 1, 20),
        duration: 5, 
        progress: 10, 
        type: "task",
        data: [], // REQUERIDO SI OPEN: TRUE
        open: true 
    }
];

const DEFAULT_COLUMNS = [
    { id: "text", header: "Mission", width: 200 },
    { id: "start", header: "Start", width: 100 },
    { id: "duration", header: "Days", width: 80 }
];

export const ProV1_Gantt = ({ data = {} }: { data?: any }) => {
    const stableTasks = React.useMemo(() => {
        try {
            const raw = Array.isArray(data.tasks) && data.tasks.length > 0 ? data.tasks : MASTER_TASKS;
            return raw.map((t: any) => {
                const start = t.start ? new Date(t.start) : new Date(2026, 1, 15);
                const duration = t.duration || 3;
                
                return {
                    id: t.id,
                    text: t.text || "Mission Node",
                    start: start,
                    duration: duration,
                    progress: t.progress || 0,
                    type: t.type || "task",
                    data: t.data || [], // PARCHE CRÍTICO: Evita forEach en null
                    open: !!t.open
                };
            });
        } catch (e) {
            console.error('[ProV1_Gantt] Data stable map error:', e);
            return MASTER_TASKS;
        }
    }, [data.tasks]);

    const stableLinks = React.useMemo(() => [], []);
    const stableScales = React.useMemo(() => [
        { unit: "month", step: 1, format: "MMMM yyyy" },
        { unit: "day", step: 1, format: "d" }
    ], []);

    return (
        <section 
            className="py-24 bg-slate-950 relative overflow-hidden min-h-[700px] flex flex-col" 
            style={{ backgroundColor: '#020617', color: '#fff' }}
        >
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[180px] pointer-events-none" />
            
            <div className="container mx-auto px-6 max-w-7xl relative z-10 flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-red-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-red-600/20">
                            <LayoutDashboard className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Sovereign Gantt v3.9</h2>
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest opacity-80">Stability Protocol: RECURSION_FIX</p>
                        </div>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 rounded-[3rem] overflow-hidden border border-white/10 bg-slate-900/20 relative min-h-[500px]"
                >
                    <style>{`
                        ${svarStyles}
                        .svar-gantt { height: 500px !important; background: transparent !important; }
                        .svar-gantt-trial-link { display: none !important; }
                    `}</style>
                    <Gantt 
                        tasks={stableTasks} 
                        links={stableLinks} 
                        columns={DEFAULT_COLUMNS}
                        scales={stableScales}
                    />
                </motion.div>

                <div className="mt-8 flex items-center justify-between text-slate-500 px-8">
                    <div className="flex items-center gap-6">
                        <Calendar size={14} className="text-red-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest italic">NEXUS Build 2026.02.15-DEBUG_V3.9</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
