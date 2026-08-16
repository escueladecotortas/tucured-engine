'use client';

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
    Plus, 
    MoreVertical, 
    MessageSquare, 
    Layers,
    User,
    Calendar,
    Trello
} from 'lucide-react';

const INITIAL_COLUMNS = [
    {
        id: 'todo',
        title: 'Misión: Backlog',
        tasks: [
            { id: 't1', title: 'Refactorizar StitchFactory', priority: 'High', user: 'Codi' },
            { id: 't2', title: 'Carga de Elfsight SDK', priority: 'Medium', user: 'Argus' },
        ]
    },
    {
        id: 'inpro',
        title: 'En Operación',
        tasks: [
            { id: 't3', title: 'Certificación 36 Widgets', priority: 'Critical', user: 'Atenea' },
            { id: 't4', title: 'Despliegue BALI Beauty', priority: 'High', user: 'Nexus' },
        ]
    },
    {
        id: 'done',
        title: 'Certificados',
        tasks: [
            { id: 't5', title: 'Sovereign Embedder v3.8', priority: 'Low', user: 'Codi' },
        ]
    }
];

export const ProV2_Kanban = ({ data = {} }: { data?: any }) => {
    const [columns, setColumns] = useState(data.columns || INITIAL_COLUMNS);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'text-red-500 bg-red-500/10';
            case 'High': return 'text-orange-500 bg-orange-500/10';
            case 'Medium': return 'text-blue-500 bg-blue-500/10';
            default: return 'text-slate-500 bg-slate-500/10';
        }
    };

    return (
        <section className="py-20 bg-slate-950 min-h-[700px] flex flex-col relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/20">
                            <Trello className="text-white w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Mission Control</h2>
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest opacity-80 italic">Pro Kanban v1.0</p>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-red-600/20 active:scale-95">
                        <Plus size={16} />
                        Nueva Misión
                    </button>
                </div>

                {/* Columns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 items-start">
                    {columns.map((column: any) => (
                        <div key={column.id} className="flex flex-col h-full min-h-[500px] group">
                            <div className="flex items-center justify-between mb-6 px-4">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-red-600 group-hover:animate-ping" />
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{column.title}</h3>
                                    <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[9px] font-bold rounded-md">{column.tasks.length}</span>
                                </div>
                                <button className="text-slate-600 hover:text-white transition-colors">
                                    <MoreVertical size={16} />
                                </button>
                            </div>

                            <div className="flex-1 bg-slate-900/20 rounded-[2rem] p-4 border border-white/5 backdrop-blur-sm self-stretch">
                                <div className="space-y-4">
                                    {column.tasks.map((task: any, index: number) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all cursor-grab active:cursor-grabbing group/card shadow-xl"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                                <button className="opacity-0 group-hover/card:opacity-100 transition-opacity text-slate-600 hover:text-white">
                                                    <MoreVertical size={14} />
                                                </button>
                                            </div>

                                            <h4 className="text-white font-bold text-sm mb-6 leading-tight group-hover/card:text-red-500 transition-colors">
                                                {task.title}
                                            </h4>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex -space-x-2">
                                                        {[1].map((i) => (
                                                            <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center">
                                                                <User size={12} className="text-slate-500" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{task.user}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-slate-600">
                                                    <div className="flex items-center gap-1">
                                                        <MessageSquare size={12} />
                                                        <span className="text-[9px] font-bold">2</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        <span className="text-[9px] font-bold">Feb 15</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-slate-600 hover:text-red-500 hover:border-red-500/20 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-4">
                                        <Plus size={14} />
                                        Drop Weapon here
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
