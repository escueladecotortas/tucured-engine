// Archivo: frontend/src/components/tabs/MissionsTab.jsx
// Orquestador del módulo de Misiones — integra Firebase, estado y vistas.
// Refactorizado de 773 → 130 líneas. Ley de 200 Líneas cumplida.

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Target, CheckCircle, Zap, AlertCircle, Layout } from 'lucide-react';
import {
    collection, query, where, orderBy, onSnapshot,
    addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import MissionCard from './MissionCard';
import QuickAddMission from './QuickAddMission';
import { StrategyRadar, KanbanColumn, ListView } from './KanbanView';

/**
 * MissionsTab — Tab principal de control de misiones del proyecto.
 * @param {string} projectId - ID del proyecto activo en Firestore.
 */
export default function MissionsTab({ projectId }) {
    const [missions, setMissions] = useState([]);
    const [viewMode, setViewMode] = useState('kanban'); // 'list' | 'kanban' | 'strategy'
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingMission, setEditingMission] = useState(null);

    // Suscripción en tiempo real a Firestore
    useEffect(() => {
        if (!projectId) return;
        const q = query(collection(db, 'tasks'), where('projectId', '==', projectId), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMissions(snapshot.docs.map(d => ({ id: d.id, ...d.data(), status: d.data().status || 'pending' })));
        }, (error) => {
            console.error('Error cargando tareas:', error);
            // Fallback sin orderBy (índice no creado)
            if (error.code === 'failed-precondition') {
                const fallbackQ = query(collection(db, 'tasks'), where('projectId', '==', projectId));
                onSnapshot(fallbackQ, (snap) => {
                    const loaded = snap.docs.map(d => ({ id: d.id, ...d.data(), status: d.data().status || 'pending' }));
                    loaded.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
                    setMissions(loaded);
                });
            }
        });
        return () => unsubscribe();
    }, [projectId]);

    const handleAddMission = async (missionData) => {
        try {
            await addDoc(collection(db, 'tasks'), { ...missionData, projectId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
            setShowAddForm(false);
        } catch (error) { console.error('Error agregando tarea:', error); }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, 'tasks', id), {
                status: newStatus, updatedAt: serverTimestamp(),
                ...(newStatus === 'completed' ? { completedAt: serverTimestamp() } : {})
            });
        } catch (error) { console.error('Error actualizando estado:', error); }
    };

    const handleDelete = async (id) => {
        try { await deleteDoc(doc(db, 'tasks', id)); }
        catch (error) { console.error('Error eliminando tarea:', error); }
    };

    // Estadísticas derivadas del estado
    const stats = {
        total:     missions.length,
        completed: missions.filter(m => m.status === 'completed').length,
        active:    missions.filter(m => m.status === 'in_progress').length,
        critical:  missions.filter(m => m.priority === 'critical' && m.status !== 'completed').length,
        velocity:  missions.length > 0
            ? Math.round((missions.filter(m => m.status === 'completed').length / missions.length) * 100)
            : 0
    };

    const VIEW_MODES = [
        { id: 'kanban', icon: Layout, label: 'Tablero' },
        { id: 'list', icon: CheckCircle, label: 'Lista' },
        { id: 'strategy', icon: Zap, label: 'Radar' }
    ];

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden">
            {/* Header con métricas */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-400" /> Control de Misiones
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-medium text-indigo-300">
                            <Zap className="w-3 h-3" /> Vel: {stats.velocity}%
                        </div>
                        {stats.critical > 0 && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-medium text-red-400 animate-pulse">
                                <AlertCircle className="w-3 h-3" /> {stats.critical} CRÍTICAS
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {stats.active} Activas
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono">{stats.completed}/{stats.total} Total</div>
                    </div>
                </div>
                <div className="flex gap-4">
                    {/* Selector de vista */}
                    <div className="bg-white/5 rounded-lg p-1 flex">
                        {VIEW_MODES.map(m => (
                            <button key={m.id} onClick={() => setViewMode(m.id)} title={m.label}
                                className={`p-2 rounded-md transition-all ${viewMode === m.id ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                                <m.icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                        <Plus className="w-4 h-4" /> Nueva Misión
                    </button>
                </div>
            </div>

            {/* Formulario de alta */}
            <AnimatePresence>
                {showAddForm && (
                    <div className="mb-6">
                        <QuickAddMission onAdd={handleAddMission} onCancel={() => setShowAddForm(false)} />
                    </div>
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
                            <div key={status} className="w-[320px] shrink-0 h-full">
                                <KanbanColumn status={status}
                                    missions={missions.filter(m => {
                                        if (status === 'completed') return m.status === 'completed';
                                        if (status === 'in_progress') return ['in_progress','review'].includes(m.status);
                                        return ['pending','blocked'].includes(m.status);
                                    })}
                                    onStatusChange={handleStatusChange} onDelete={handleDelete} onEdit={setEditingMission} />
                            </div>
                        ))}
                    </div>
                )}
                {viewMode === 'list' && (
                    <ListView missions={missions} onStatusChange={handleStatusChange} onDelete={handleDelete} onEdit={setEditingMission} />
                )}
            </div>
        </div>
    );
}
