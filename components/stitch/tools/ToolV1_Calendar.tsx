'use client';

import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

/**
 * WIDGET: Events & Deadlines
 * Enfoque: Organización y Agenda sofisticada.
 */

export const ToolV1_Calendar = ({ data = {} }: { data?: any }) => {
    const events = data.events || [
        { title: 'Lanzamiento Nexus V2', date: '2026-03-01', location: 'Zoom Global', time: '18:00' },
        { title: 'Workshop Soberanía', date: '2026-03-15', location: 'Metropol', time: '10:00' }
    ];

    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

    return (
        <div className="max-w-md mx-auto p-8 bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            {/* Atmosfera */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
                        <Calendar size={20} className="text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Event Horizon</h4>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Agenda Estratégica</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {events.map((event: any, i: number) => {
                        const d = new Date(event.date);
                        const day = isNaN(d.getTime()) ? '01' : d.getDate();
                        const month = isNaN(d.getTime()) ? 'MAR' : months[d.getMonth()];

                        return (
                            <div key={i} className="flex gap-6 items-center group/item cursor-pointer">
                                <div className="bg-slate-950 border border-white/5 px-4 py-3 rounded-2xl text-center min-w-[70px] group-hover/item:border-indigo-500/40 transition-colors shadow-lg">
                                    <span className="block text-[10px] font-black text-indigo-400 tracking-widest uppercase">{month}</span>
                                    <span className="block text-2xl font-black text-white tracking-tighter">{day}</span>
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-sm font-bold text-slate-200 mb-2 group-hover/item:text-white transition-colors uppercase tracking-tight italic">{event.title}</h5>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            <Clock size={10} className="text-indigo-500/50" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            <MapPin size={10} className="text-red-500/50" />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="w-full mt-8 py-4 bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                    Sincronizar Agenda
                </button>
            </div>
        </div>
    );
};
