// Archivo: src/components/tabs/MissionsTab.jsx
// Visor Reactivo Local-First de Misiones (Sincronizado con .agent/workflows/kanban.md)

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Target, CheckCircle, Zap, AlertCircle, Layout, RefreshCw } from 'lucide-react';
import MissionCard from './MissionCard';
import QuickAddMission from './QuickAddMission';
import { StrategyRadar, KanbanColumn, ListView } from './KanbanView';

export default function MissionsTab({ projectId }) {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list' | 'strategy'
    const [showAddForm, setShowAddForm] = useState(false);

    // Carga de tareas desde el endpoint Local-First
    const loadTasks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/kanban/tasks');
            const data = await res.json();
            if (data.success && Array.isArray(data.tasks)) {
                setMissions(data.tasks);
            }
        } catch (e) {
            console.error('Error cargando kanban local:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks, projectId]);

    const handleAddMission = async (missionData) => {
        try {
            await fetch('/api/kanban/tasks/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(missionData)
            });
            setShowAddForm(false);
            await loadTasks();
        } catch (error) { 
            console.error('Error agregando tarea:', error); 
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setMissions(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    };

    const handleDelete = (id) => {
        setMissions(prev => prev.filter(m => m.id !== id));
    };

    const stats = {
        total: missions.length,
        completed: missions.filter(m => m.status === 'completed').length,
        active: missions.filter(m => m.status === 'in_progress').length,
        critical: missions.filter(m => m.priority === 'critical' && m.status !== 'completed').length,
        velocity: missions.length > 0
            ? Math.round((missions.filter(m => m.status === 'completed').length / missions.length) * 100)
            : 0
    };

    const VIEW_MODES = [
        { id: 'kanban', icon: Layout, label: 'Tablero' },
        { id: 'list', icon: CheckCircle, label: 'Lista' },
        { id: 'strategy', icon: Zap, label: 'Radar' }
    ];

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden font-mono">
            {/* Header con métricas y controles */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-400" /> Control de Misiones (SSOT Local)
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-medium text-indigo-300">
                            <Zap className="w-3 h-3" /> Progreso: {stats.velocity}%
                        </div>
                        {stats.critical > 0 && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-medium text-red-400 animate-pulse">
                                <AlertCircle className="w-3 h-3" /> {stats.critical} CRÍTICAS
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {stats.active} En Progreso
                        </div>
                        <div className="text-[10px] text-gray-500">{stats.completed}/{stats.total} Completadas</div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={loadTasks} title="Recargar Kanban" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="bg-white/5 rounded-lg p-1 flex">
                        {VIEW_MODES.map(m => (
                            <button key={m.id} onClick={() => setViewMode(m.id)} title={m.label}
                                className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === m.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                                <m.icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer">
                        <Plus className="w-4 h-4" /> Nueva Misión
                    </button>
                </div>
            </div>

            {/* Formulario de alta con plantillas */}
            <AnimatePresence>
                {showAddForm && (
                    <QuickAddMission onAdd={handleAddMission} onCancel={() => setShowAddForm(false)} />
                )}
            </AnimatePresence>

            {/* Vistas */}
            <div className="flex-1 min-h-0 overflow-hidden relative">
                {viewMode === 'strategy' && (
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <StrategyRadar missions={missions} />
                    </div>
                )}
                {viewMode === 'kanban' && (
                    <div className="h-full flex gap-4 overflow-x-auto custom-scrollbar pb-2">
                        {['pending', 'in_progress', 'completed'].map(status => (
                            <div key={status} className="w-[340px] shrink-0 h-full">
                                <KanbanColumn status={status}
                                    missions={missions.filter(m => {
                                        if (status === 'completed') return m.status === 'completed';
                                        if (status === 'in_progress') return m.status === 'in_progress';
                                        return m.status === 'pending' || !m.status;
                                    })}
                                    onStatusChange={handleStatusChange} onDelete={handleDelete} onEdit={() => {}} />
                            </div>
                        ))}
                    </div>
                )}
                {viewMode === 'list' && (
                    <ListView missions={missions} onStatusChange={handleStatusChange} onDelete={handleDelete} onEdit={() => {}} />
                )}
            </div>
        </div>
    );
}
