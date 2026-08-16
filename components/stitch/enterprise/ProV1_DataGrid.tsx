'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    Download, 
    ChevronDown, 
    ChevronUp, 
    MoreHorizontal,
    Database,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';

// Datos de ejemplo para la Misión
const DEFAULT_ROWS = [
    { id: 1, name: "Arqueología Nexus", status: "Completed", value: "$4,500", date: "2026-02-10", priority: "High" },
    { id: 2, name: "Búnker Despliegue", status: "In Progress", value: "$12,200", date: "2026-02-15", priority: "Critical" },
    { id: 3, name: "Arsenal Sync", status: "Pending", value: "$1,800", date: "2026-02-20", priority: "Medium" },
    { id: 4, name: "Operación Fantasma", status: "In Progress", value: "$8,900", date: "2026-02-22", priority: "High" },
    { id: 5, name: "Protocolo Sovereign", status: "Completed", value: "$25,000", date: "2026-02-05", priority: "Critical" },
];

export const ProV1_DataGrid = ({ data = {} }: { data?: any }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({ key: 'id', direction: 'asc' });

    const rows = useMemo(() => data.rows || DEFAULT_ROWS, [data.rows]);

    const filteredRows = useMemo(() => {
        let sorted = [...rows].filter(row => 
            Object.values(row).some(val => 
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        if (sortConfig.key && sortConfig.direction) {
            sorted.sort((a: any, b: any) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sorted;
    }, [rows, searchTerm, sortConfig]);

    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'In Progress': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'Critical': return <AlertCircle size={12} className="text-red-500 animate-pulse" />;
            case 'High': return <Clock size={12} className="text-red-400" />;
            default: return <CheckCircle2 size={12} className="text-slate-400" />;
        }
    };

    return (
        <section className="py-20 bg-slate-950 relative overflow-hidden flex flex-col min-h-[600px]">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10 flex-1 flex flex-col">
                {/* Header Card */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-5 mb-4 md:mb-0">
                        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
                            <Database className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sovereign DataGrid</h2>
                            <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest opacity-80">Pro Enterprise v1.0</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input 
                                type="text"
                                placeholder="Search mission..."
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="p-3 bg-slate-800/50 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                            <Filter size={18} />
                        </button>
                        <button className="p-3 bg-slate-800/50 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* Grid UI */}
                <div className="flex-1 bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-inner flex flex-col">
                    <div className="overflow-x-auto overflow-y-auto max-h-[450px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    {['ID', 'Name', 'Status', 'Priority', 'Value', 'Date'].map((header) => (
                                        <th 
                                            key={header}
                                            className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer hover:text-red-500 transition-colors group"
                                            onClick={() => handleSort(header.toLowerCase())}
                                        >
                                            <div className="flex items-center gap-2">
                                                {header}
                                                <ArrowUpDown size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {filteredRows.map((row) => (
                                        <motion.tr 
                                            key={row.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-8 py-4 text-slate-500 font-mono text-xs">#{row.id}</td>
                                            <td className="px-8 py-4 text-white font-bold text-sm tracking-tight">{row.name}</td>
                                            <td className="px-8 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyles(row.status)}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase">
                                                    {getPriorityIcon(row.priority)}
                                                    {row.priority}
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-red-500 font-black text-sm">{row.value}</td>
                                            <td className="px-8 py-4 text-slate-400 text-xs">{row.date}</td>
                                            <td className="px-8 py-4 text-right">
                                                <button className="text-slate-600 hover:text-white transition-colors">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Placeholder */}
                    <div className="p-6 border-t border-white/5 flex items-center justify-between mt-auto">
                        <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">
                            Showing {filteredRows.length} of {rows.length} records
                        </p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-slate-800/50 border border-white/5 rounded-lg text-slate-500 text-[10px] font-bold uppercase">Prev</button>
                            <button className="px-4 py-2 bg-red-600/20 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-bold uppercase">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
